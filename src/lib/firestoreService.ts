import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  limit,
  writeBatch,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType, ensureAuthenticatedUser } from './firebase';
import { SupplyExpenseItem, CropSaleRecord, FarmerProfile, RegisteredFarmer, ChatMessage, CalculatorSummaryRecord } from '../types';

export const REGISTRY_STORAGE_KEY = 'krishi_registered_farmers_registry';

export function normalizePhone(raw: string): string {
  // Remove all non-digits (e.g. spaces, hyphens, parentheses)
  const cleaned = raw.replace(/\D/g, '');
  // If starts with 880 (Bangladesh country code), strip 88 to normalize to 01...
  if (cleaned.startsWith('880')) {
    return cleaned.slice(2);
  }
  return cleaned;
}

// Convert phone number to a valid Firebase Authentication email identifier
export function getFarmerAuthEmail(cleanPhone: string): string {
  return `${cleanPhone}@aerofield.app`;
}

// Format PIN/password to at least 6 characters for Firebase Auth standards
export function getFarmerAuthPassword(pin: string): string {
  const trimmed = pin.trim();
  if (trimmed.length >= 6) return trimmed;
  // Pad with trailing digits to satisfy Firebase Auth 6-character minimum
  return `${trimmed}000000`.slice(0, 6);
}

// Local cache helpers
export function getRegisteredFarmersLocal(): Record<string, RegisteredFarmer> {
  try {
    const saved = localStorage.getItem(REGISTRY_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function saveRegisteredFarmerLocal(farmer: RegisteredFarmer) {
  try {
    const map = getRegisteredFarmersLocal();
    const phoneKey = normalizePhone(farmer.phone);
    map[phoneKey] = farmer;
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.warn('Local save failed:', e);
  }
}

// Active farmer identity helper
export function getActiveFarmerId(): string {
  if (auth.currentUser?.uid) {
    return auth.currentUser.uid;
  }
  try {
    const saved = localStorage.getItem('krishi_farmer_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.phone) {
        return normalizePhone(parsed.phone);
      }
    }
  } catch {
    // ignore
  }
  return 'default_farmer';
}

// Register a new farmer account
export async function registerFarmerAccount(data: {
  name: string;
  phone: string;
  pin: string;
  district: string;
  landSize: string;
  crop?: string;
}): Promise<{ success: boolean; error?: string; user?: { name: string; phone: string; district: string; landSize: string } }> {
  const cleanPhone = normalizePhone(data.phone);
  if (!cleanPhone || cleanPhone.length < 10) {
    return { success: false, error: 'সঠিক মোবাইল নম্বর লিখুন (১১ ডিজিট)' };
  }
  if (!data.name.trim()) {
    return { success: false, error: 'কৃষকের নাম লিখুন' };
  }
  if (!data.pin.trim() || data.pin.trim().length < 4) {
    return { success: false, error: 'কমপক্ষে ৪ ডিজিটের পিন বা পাসওয়ার্ড দিন' };
  }

  // Ensure Firebase Auth session if possible
  await ensureAuthenticatedUser();

  // Check if already registered in Firestore
  const path = `registered_farmers/${cleanPhone}`;
  try {
    const docRef = doc(db, 'registered_farmers', cleanPhone);
    const existingSnap = await getDoc(docRef);
    if (existingSnap.exists()) {
      return { 
        success: false, 
        error: 'এই মোবাইল নম্বরটি ইতিমধ্যে নিবন্ধিত! অনুগ্রহ করে লগইন করুন।' 
      };
    }
  } catch (err) {
    console.warn('Firestore check note, checking local registry:', err);
    const localMap = getRegisteredFarmersLocal();
    if (localMap[cleanPhone]) {
      return { 
        success: false, 
        error: 'এই মোবাইল নম্বরটি ইতিমধ্যে নিবন্ধিত! অনুগ্রহ করে লগইন করুন।' 
      };
    }
  }

  // 1. Create or sync user in Firebase Authentication
  let authUid = cleanPhone;
  const authEmail = getFarmerAuthEmail(cleanPhone);
  const authPassword = getFarmerAuthPassword(data.pin);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
    authUid = userCredential.user.uid;
    await updateProfile(userCredential.user, { displayName: data.name.trim() });
    console.log('User created in Firebase Authentication:', authEmail, 'UID:', authUid);
  } catch (authErr: any) {
    if (authErr?.code === 'auth/email-already-in-use') {
      try {
        const signinRes = await signInWithEmailAndPassword(auth, authEmail, authPassword);
        authUid = signinRes.user.uid;
        if (signinRes.user) {
          await updateProfile(signinRes.user, { displayName: data.name.trim() });
        }
      } catch (e) {
        console.warn('Auth signin note on registration:', e);
      }
    } else {
      console.warn('Firebase Auth creation note:', authErr);
    }
  }

  const registeredFarmer: RegisteredFarmer = {
    name: data.name.trim(),
    phone: data.phone.trim(),
    pin: data.pin.trim(),
    district: data.district || 'ঢাকা',
    landSize: data.landSize || '১',
    crop: data.crop || 'ধান',
    authUid: auth.currentUser?.uid || authUid,
    registeredAt: new Date().toISOString(),
  };

  // Direct Save to Firestore registered_farmers collection
  try {
    const docRef = doc(db, 'registered_farmers', cleanPhone);
    await setDoc(docRef, {
      ...registeredFarmer,
      cleanPhone,
    }, { merge: true });
    console.log('Saved to Firestore registered_farmers:', cleanPhone);
  } catch (err) {
    console.error('Firestore save failed:', err);
    return {
      success: false,
      error: 'ডেটাবেসে সংরক্ষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
    };
  }

  // Also save to farmer profile in Firestore
  try {
    const profileRef = doc(db, 'farmers', cleanPhone);
    await setDoc(profileRef, {
      userId: cleanPhone,
      name: registeredFarmer.name,
      phone: registeredFarmer.phone,
      district: registeredFarmer.district,
      farmSizeAcres: parseFloat(registeredFarmer.landSize) || 0,
      primaryCrops: registeredFarmer.crop ? [registeredFarmer.crop] : [],
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (e) {
    console.warn('Farmer profile save note:', e);
  }

  // Also save locally for instant offline cache
  saveRegisteredFarmerLocal(registeredFarmer);

  return {
    success: true,
    user: {
      name: registeredFarmer.name,
      phone: registeredFarmer.phone,
      district: registeredFarmer.district,
      landSize: registeredFarmer.landSize,
    },
  };
}

// Verify farmer login credentials
export async function verifyFarmerLogin(
  rawPhone: string,
  rawPin: string
): Promise<{ 
  success: boolean; 
  error?: string; 
  errorType?: 'NOT_REGISTERED' | 'INVALID_PIN' | 'EMPTY_INPUT';
  user?: { name: string; phone: string; district: string; landSize: string } 
}> {
  const cleanPhone = normalizePhone(rawPhone);
  if (!cleanPhone) {
    return { success: false, errorType: 'EMPTY_INPUT', error: 'মোবাইল নম্বর লিখুন' };
  }
  if (!rawPin) {
    return { success: false, errorType: 'EMPTY_INPUT', error: 'পাসওয়ার্ড বা পিন লিখুন' };
  }

  await ensureAuthenticatedUser();

  let registeredData: RegisteredFarmer | null = null;

  // 1. Fetch from Firestore registered_farmers
  try {
    const docRef = doc(db, 'registered_farmers', cleanPhone);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      registeredData = snap.data() as RegisteredFarmer;
    }
  } catch (e) {
    console.warn('Firestore lookup note:', e);
  }

  // 2. Fallback to local registry if Firestore lookup failed or offline
  if (!registeredData) {
    const localMap = getRegisteredFarmersLocal();
    if (localMap[cleanPhone]) {
      registeredData = localMap[cleanPhone];
    }
  }

  // User is NOT registered
  if (!registeredData) {
    return {
      success: false,
      errorType: 'NOT_REGISTERED',
      error: 'এই মোবাইল নম্বরটি নিবন্ধিত নয়! অ্যাপ ব্যবহার করতে অনুগ্রহ করে প্রথমে "নতুন নিবন্ধন" সম্পন্ন করুন।',
    };
  }

  // Check PIN if registered with a PIN
  if (registeredData.pin && registeredData.pin.trim() !== rawPin.trim()) {
    return {
      success: false,
      errorType: 'INVALID_PIN',
      error: 'ভুল পিন বা পাসওয়ার্ড! অনুগ্রহ করে সঠিক পিন দিয়ে চেষ্টা করুন।',
    };
  }

  // Ensure user is signed in to Firebase Authentication
  try {
    const authEmail = getFarmerAuthEmail(cleanPhone);
    const authPassword = getFarmerAuthPassword(rawPin);
    await signInWithEmailAndPassword(auth, authEmail, authPassword);
  } catch (authErr: any) {
    // If not yet in Firebase Auth, create the user in Firebase Auth now
    if (authErr?.code === 'auth/user-not-found' || authErr?.code === 'auth/invalid-credential') {
      try {
        const authEmail = getFarmerAuthEmail(cleanPhone);
        const authPassword = getFarmerAuthPassword(rawPin);
        const cred = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        if (registeredData.name) {
          await updateProfile(cred.user, { displayName: registeredData.name });
        }
      } catch (createErr) {
        console.warn('Sync to Firebase Auth note:', createErr);
      }
    }
  }

  return {
    success: true,
    user: {
      name: registeredData.name,
      phone: registeredData.phone,
      district: registeredData.district,
      landSize: registeredData.landSize,
    },
  };
}

// Farmer Profile Firestore operations
export async function saveFarmerProfileToFirestore(profile: FarmerProfile): Promise<void> {
  const farmerId = getActiveFarmerId();
  const path = `farmers/${farmerId}`;
  try {
    const docRef = doc(db, 'farmers', farmerId);
    await setDoc(docRef, {
      userId: farmerId,
      name: profile.name || 'কৃষক ভাই',
      phone: profile.phone || '',
      division: profile.division || '',
      district: profile.district || 'ঢাকা',
      upazila: profile.upazila || '',
      farmSizeAcres: profile.farmSizeAcres || 0,
      soilType: profile.soilType || '',
      primaryCrops: profile.primaryCrops || [],
      experienceYears: profile.experienceYears || 0,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchFarmerProfileFromFirestore(userId?: string): Promise<FarmerProfile | null> {
  const farmerId = userId || getActiveFarmerId();
  const path = `farmers/${farmerId}`;
  try {
    const docRef = doc(db, 'farmers', farmerId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as FarmerProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

// Supplies Expenses Firestore operations
export async function syncExpenseToFirestore(
  expense: SupplyExpenseItem,
  customFarmerId?: string
): Promise<void> {
  const farmerId = customFarmerId || getActiveFarmerId();
  const path = `farmers/${farmerId}/expenses/${expense.id}`;
  try {
    const docRef = doc(db, 'farmers', farmerId, 'expenses', expense.id);
    await setDoc(docRef, {
      userId: farmerId,
      category: expense.category,
      name: expense.name,
      amount: Number(expense.amount) || 1,
      unit: expense.unit || 'কেজি',
      cost: Number(expense.cost) || 0,
      dateAdded: expense.dateAdded || new Date().toLocaleDateString(),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function removeExpenseFromFirestore(
  expenseId: string,
  customFarmerId?: string
): Promise<void> {
  const farmerId = customFarmerId || getActiveFarmerId();
  const path = `farmers/${farmerId}/expenses/${expenseId}`;
  try {
    const docRef = doc(db, 'farmers', farmerId, 'expenses', expenseId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function syncCropSaleToFirestore(
  cropSale: CropSaleRecord,
  customFarmerId?: string
): Promise<void> {
  const farmerId = customFarmerId || getActiveFarmerId();
  const path = `farmers/${farmerId}/crop_sales/current_sale`;
  try {
    const docRef = doc(db, 'farmers', farmerId, 'crop_sales', 'current_sale');
    await setDoc(docRef, {
      userId: farmerId,
      cropName: cropSale.cropName || '',
      quantity: cropSale.quantity || 0,
      unit: cropSale.unit || 'মণ',
      pricePerUnit: cropSale.pricePerUnit || 0,
      totalSaleAmount: Number(cropSale.totalSaleAmount) || 0,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Live listener for user's expenses
export function subscribeToUserExpenses(
  userId: string,
  onUpdate: (items: SupplyExpenseItem[]) => void
): () => void {
  const farmerId = userId || getActiveFarmerId();
  const path = `farmers/${farmerId}/expenses`;
  try {
    const colRef = collection(db, 'farmers', farmerId, 'expenses');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: SupplyExpenseItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            category: data.category,
            name: data.name,
            amount: data.amount,
            unit: data.unit,
            cost: data.cost,
            dateAdded: data.dateAdded,
          });
        });
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

// Live listener for user's crop sale
export function subscribeToUserCropSale(
  userId: string,
  onUpdate: (sale: CropSaleRecord | null) => void
): () => void {
  const farmerId = userId || getActiveFarmerId();
  const path = `farmers/${farmerId}/crop_sales/current_sale`;
  try {
    const docRef = doc(db, 'farmers', farmerId, 'crop_sales', 'current_sale');
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data() as CropSaleRecord);
        } else {
          onUpdate(null);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}

// -------------------------------------------------------------
// SUPPLIES & PROFIT/LOSS CALCULATOR SUMMARY CLOUD SYNC
// -------------------------------------------------------------
export async function syncCalculatorSummaryToFirestore(
  summary: CalculatorSummaryRecord,
  customFarmerId?: string
): Promise<void> {
  const farmerId = customFarmerId || getActiveFarmerId();
  const path = `farmers/${farmerId}/calculator_summary/current`;
  try {
    const docRef = doc(db, 'farmers', farmerId, 'calculator_summary', 'current');
    await setDoc(
      docRef,
      {
        userId: farmerId,
        totalCost: Number(summary.totalCost) || 0,
        totalRevenue: Number(summary.totalRevenue) || 0,
        netProfitLoss: Number(summary.netProfitLoss) || 0,
        status: summary.status || 'breakeven',
        expensesCount: Number(summary.expensesCount) || 0,
        cropName: summary.cropName || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function clearAllExpensesFromFirestore(customFarmerId?: string): Promise<void> {
  const farmerId = customFarmerId || getActiveFarmerId();
  const path = `farmers/${farmerId}/expenses`;
  try {
    const colRef = collection(db, 'farmers', farmerId, 'expenses');
    const snap = await getDocs(colRef);
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.forEach((d) => {
      batch.delete(d.ref);
    });
    await batch.commit();

    // Reset crop sale as well
    const saleDocRef = doc(db, 'farmers', farmerId, 'crop_sales', 'current_sale');
    await setDoc(saleDocRef, {
      userId: farmerId,
      cropName: '',
      quantity: 0,
      totalSaleAmount: 0,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// -------------------------------------------------------------
// AI AGRONOMIST CHAT HISTORY FIRESTORE PERSISTENCE
// -------------------------------------------------------------
export async function saveChatMessageToFirestore(
  message: ChatMessage,
  customFarmerId?: string,
  chatLanguage?: string
): Promise<void> {
  const farmerId = customFarmerId || getActiveFarmerId();
  const path = `farmers/${farmerId}/chat_messages/${message.id}`;
  try {
    const docRef = doc(db, 'farmers', farmerId, 'chat_messages', message.id);
    await setDoc(docRef, {
      id: message.id,
      userId: farmerId,
      sender: message.sender,
      text: message.text,
      timestamp: message.timestamp,
      createdAt: message.createdAt || new Date().toISOString(),
      language: chatLanguage || message.language || 'bn',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeToChatHistory(
  onUpdate: (messages: ChatMessage[]) => void,
  customFarmerId?: string
): () => void {
  const farmerId = customFarmerId || getActiveFarmerId();
  const path = `farmers/${farmerId}/chat_messages`;
  try {
    const colRef = collection(db, 'farmers', farmerId, 'chat_messages');
    const q = query(colRef, orderBy('createdAt', 'asc'), limit(150));
    return onSnapshot(
      q,
      (snapshot) => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          msgs.push({
            id: docSnap.id,
            sender: data.sender as 'user' | 'bot',
            text: data.text || '',
            timestamp: data.timestamp || '',
            createdAt: data.createdAt || '',
            language: data.language,
            userId: data.userId,
          });
        });
        onUpdate(msgs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

export async function fetchChatHistoryFromFirestore(
  customFarmerId?: string,
  limitCount = 100
): Promise<ChatMessage[]> {
  const farmerId = customFarmerId || getActiveFarmerId();
  const path = `farmers/${farmerId}/chat_messages`;
  try {
    const colRef = collection(db, 'farmers', farmerId, 'chat_messages');
    const q = query(colRef, orderBy('createdAt', 'asc'), limit(limitCount));
    const snap = await getDocs(q);
    const msgs: ChatMessage[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      msgs.push({
        id: docSnap.id,
        sender: data.sender as 'user' | 'bot',
        text: data.text || '',
        timestamp: data.timestamp || '',
        createdAt: data.createdAt || '',
        language: data.language,
        userId: data.userId,
      });
    });
    return msgs;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function deleteChatMessageFromFirestore(
  messageId: string,
  customFarmerId?: string
): Promise<void> {
  const farmerId = customFarmerId || getActiveFarmerId();
  const path = `farmers/${farmerId}/chat_messages/${messageId}`;
  try {
    const docRef = doc(db, 'farmers', farmerId, 'chat_messages', messageId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function clearChatHistoryInFirestore(customFarmerId?: string): Promise<void> {
  const farmerId = customFarmerId || getActiveFarmerId();
  const path = `farmers/${farmerId}/chat_messages`;
  try {
    const colRef = collection(db, 'farmers', farmerId, 'chat_messages');
    const snap = await getDocs(colRef);
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.forEach((d) => {
      batch.delete(d.ref);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
