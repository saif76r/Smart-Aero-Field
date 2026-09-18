import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Calculator, 
  Plus, 
  Trash2, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  ReceiptText, 
  Coins, 
  Sprout, 
  Bug, 
  ShieldAlert, 
  Wheat, 
  Droplets, 
  Tractor, 
  Users, 
  Package, 
  AlertTriangle, 
  Copy, 
  Check, 
  RotateCcw,
  Cloud
} from 'lucide-react';
import { Language, SupplyCategoryType, SupplyExpenseItem, CropSaleRecord } from '../types';
import { 
  syncExpenseToFirestore, 
  removeExpenseFromFirestore, 
  syncCropSaleToFirestore, 
  subscribeToUserExpenses, 
  subscribeToUserCropSale,
  syncCalculatorSummaryToFirestore,
  clearAllExpensesFromFirestore,
  getActiveFarmerId,
  normalizePhone
} from '../lib/firestoreService';
import { auth } from '../lib/firebase';

interface SuppliesCalculatorProps {
  language: Language;
  onBack: () => void;
  onOpenChatWithTopic?: (topic: string) => void;
  currentUser?: { name: string; phone: string; district: string; landSize: string } | null;
}

interface CategoryConfig {
  id: SupplyCategoryType;
  nameBn: string;
  nameEn: string;
  icon: React.ReactNode;
  bgLight: string;
  textColor: string;
  defaultUnit: string;
  suggestionsBn: string[];
  suggestionsEn: string[];
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'fertilizer',
    nameBn: 'সার',
    nameEn: 'Fertilizer',
    icon: <Sprout className="w-4 h-4" />,
    bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    textColor: 'text-emerald-700',
    defaultUnit: 'কেজি',
    suggestionsBn: ['ইউরিয়া সার', 'টিএসপি (TSP)', 'ডিএপি (DAP)', 'এমওপি (পটাশ)', 'জিপসাম', 'জিংক সালফেট', 'বোরন'],
    suggestionsEn: ['Urea', 'TSP', 'DAP', 'MoP (Potash)', 'Gypsum', 'Zinc Sulphate', 'Boron'],
  },
  {
    id: 'pesticide',
    nameBn: 'কীটনাশক',
    nameEn: 'Insecticide',
    icon: <Bug className="w-4 h-4" />,
    bgLight: 'bg-amber-50 text-amber-700 border-amber-200',
    textColor: 'text-amber-700',
    defaultUnit: 'প্যাকেট',
    suggestionsBn: ['দানাদার কীটনাশক (কার্বোফুরান)', 'ভিরতাকো', 'ক্যারাটে ৫ ইসি', 'ইমিডাক্লোপ্রিড', 'মার্শাল ২০ ইসি'],
    suggestionsEn: ['Carbofuran Granules', 'Virtako', 'Karate 5 EC', 'Imidacloprid', 'Marshal 20 EC'],
  },
  {
    id: 'fungicide',
    nameBn: 'ছত্রাকনাশক',
    nameEn: 'Fungicide',
    icon: <ShieldAlert className="w-4 h-4" />,
    bgLight: 'bg-purple-50 text-purple-700 border-purple-200',
    textColor: 'text-purple-700',
    defaultUnit: 'প্যাকেট',
    suggestionsBn: ['ম্যানকোজেব ৮০% ডব্লিউপি', 'নাটিভো (Nativo)', 'কার্বেনডাজিম ৫০%', 'এমিস্টার টপ', 'ট্রাইসাইক্লাজোল (ব্লাস্ট)'],
    suggestionsEn: ['Mancozeb 80% WP', 'Nativo 75 WG', 'Carbendazim 50%', 'Amistar Top', 'Tricyclazole 75% WP'],
  },
  {
    id: 'seed',
    nameBn: 'বীজ ও চারা',
    nameEn: 'Seeds & Seedlings',
    icon: <Wheat className="w-4 h-4" />,
    bgLight: 'bg-green-50 text-green-700 border-green-200',
    textColor: 'text-green-700',
    defaultUnit: 'কেজি',
    suggestionsBn: ['উন্নত ধান বীজ (ব্রি-২৮/৮৯)', 'উন্নত আলু বীজ (ডায়মন্ড)', 'হাইব্রিড ভুট্টা বীজ', 'সবজির চারা'],
    suggestionsEn: ['Rice Seed (BRRI)', 'Potato Seed (Diamant)', 'Hybrid Maize', 'Vegetable Seedlings'],
  },
  {
    id: 'irrigation',
    nameBn: 'সেচ ও জ্বালানি',
    nameEn: 'Irrigation & Fuel',
    icon: <Droplets className="w-4 h-4" />,
    bgLight: 'bg-blue-50 text-blue-700 border-blue-200',
    textColor: 'text-blue-700',
    defaultUnit: 'টাকা',
    suggestionsBn: ['টিউবওয়েল সেচ খরচ', 'পাম্পের ডিজেল জ্বালানি', 'মোটর বিদ্যুৎ বিল', 'ড্রেনেজ নালা তৈরি'],
    suggestionsEn: ['Tubewell Irrigation', 'Pump Diesel', 'Electricity Bill', 'Canal Maintenance'],
  },
  {
    id: 'tillage',
    nameBn: 'জমি চাষ ও প্রস্তুতি',
    nameEn: 'Tillage & Prep',
    icon: <Tractor className="w-4 h-4" />,
    bgLight: 'bg-orange-50 text-orange-700 border-orange-200',
    textColor: 'text-orange-700',
    defaultUnit: 'ঘণ্টা',
    suggestionsBn: ['পাওয়ার টিলার চাষ ভাড়া', 'ট্রাক্টর গভীর চাষ', 'মই দিয়ে জমি সমান করা', 'আইল মেরামত'],
    suggestionsEn: ['Power Tiller Rent', 'Tractor Tillage', 'Land Leveling', 'Field Border Repair'],
  },
  {
    id: 'labor',
    nameBn: 'শ্রমিক খরচ',
    nameEn: 'Labor Cost',
    icon: <Users className="w-4 h-4" />,
    bgLight: 'bg-rose-50 text-rose-700 border-rose-200',
    textColor: 'text-rose-700',
    defaultUnit: 'জন',
    suggestionsBn: ['চারা রোপণ শ্রমিক', 'আগাছা নিড়ানি শ্রমিক', 'ওষুধ স্প্রে শ্রমিক', 'ফসল কাটা ও মাড়াই'],
    suggestionsEn: ['Planting Labor', 'Weeding Labor', 'Spray Labor', 'Harvesting Labor'],
  },
  {
    id: 'transport_other',
    nameBn: 'পরিবহন ও অন্যান্য',
    nameEn: 'Transport & Other',
    icon: <Package className="w-4 h-4" />,
    bgLight: 'bg-slate-50 text-slate-700 border-slate-200',
    textColor: 'text-slate-700',
    defaultUnit: 'বস্তা',
    suggestionsBn: ['খালি বস্তা ক্রয়', 'হাটে ভ্যান পরিবহন ভাড়া', 'লোডিং ও আনলোডিং', 'পলিথিন ও দড়ি'],
    suggestionsEn: ['Sacks / Bags', 'Transport Van', 'Loading/Unloading', 'Rope & Cover'],
  },
];

const UNIT_OPTIONS_BN = ['কেজি', 'বস্তা', 'প্যাকেট', 'লিটার', 'মিলি', 'গ্রাম', 'মণ', 'জন', 'ঘণ্টা', 'দিন', 'টি'];
const UNIT_OPTIONS_EN = ['Kg', 'Bag', 'Packet', 'Liter', 'ml', 'Gram', 'Mon (40kg)', 'Person', 'Hours', 'Days', 'Pcs'];

const STORAGE_KEY = 'krishi_user_supplies_data';

export const SuppliesCalculator: React.FC<SuppliesCalculatorProps> = ({
  language,
  onBack,
  onOpenChatWithTopic,
  currentUser,
}) => {
  const isBn = language === 'bn';

  // Compute effective farmer UID or normalized phone for cloud storage
  const effectiveFarmerId = currentUser?.phone 
    ? normalizePhone(currentUser.phone) 
    : getActiveFarmerId();

  // State: Expense items (Clean start: no demo items)
  const [expenseItems, setExpenseItems] = useState<SupplyExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.items && Array.isArray(parsed.items)) {
          // Filter out any legacy demo preset items
          return parsed.items.filter((it: SupplyExpenseItem) => !it.id?.startsWith('preset-') && !it.id?.startsWith('init-'));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // State: Crop Sale / Revenue Info (Clean start: no demo numbers)
  const [cropSale, setCropSale] = useState<CropSaleRecord>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.cropSale && typeof parsed.cropSale.totalSaleAmount === 'number') {
          return parsed.cropSale;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return {
      cropName: '',
      totalSaleAmount: 0,
    };
  });

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'expenses' | 'revenue'>('expenses');

  // Expense form inputs
  const [selectedCategory, setSelectedCategory] = useState<SupplyCategoryType>('fertilizer');
  const [itemName, setItemName] = useState<string>('');
  const [itemAmount, setItemAmount] = useState<string>('');
  const [itemUnit, setItemUnit] = useState<string>(isBn ? 'কেজি' : 'Kg');
  const [itemCost, setItemCost] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Sale form inputs
  const [saleMode, setSaleMode] = useState<'direct' | 'calculate'>('direct');
  const [saleCropName, setSaleCropName] = useState<string>(cropSale.cropName || '');
  const [saleTotalInput, setSaleTotalInput] = useState<string>(cropSale.totalSaleAmount > 0 ? String(cropSale.totalSaleAmount) : '');
  const [saleQtyInput, setSaleQtyInput] = useState<string>(cropSale.quantity ? String(cropSale.quantity) : '');
  const [saleUnitInput, setSaleUnitInput] = useState<string>(cropSale.unit || (isBn ? 'মণ' : 'Mon'));
  const [saleRateInput, setSaleRateInput] = useState<string>(cropSale.pricePerUnit ? String(cropSale.pricePerUnit) : '');
  const [saleSavedNotice, setSaleSavedNotice] = useState<boolean>(false);

  // Copied alert
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          items: expenseItems,
          cropSale,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [expenseItems, cropSale]);

  // Live sync with Firestore
  useEffect(() => {
    if (!effectiveFarmerId || effectiveFarmerId === 'default_farmer') return;

    const unsubExpenses = subscribeToUserExpenses(effectiveFarmerId, (remoteItems) => {
      if (remoteItems) {
        setExpenseItems(remoteItems);
      }
    });

    const unsubSale = subscribeToUserCropSale(effectiveFarmerId, (remoteSale) => {
      if (remoteSale) {
        setCropSale(remoteSale);
        if (remoteSale.totalSaleAmount) {
          setSaleTotalInput(String(remoteSale.totalSaleAmount));
        }
        if (remoteSale.cropName) {
          setSaleCropName(remoteSale.cropName);
        }
      }
    });

    return () => {
      unsubExpenses();
      unsubSale();
    };
  }, [effectiveFarmerId]);

  // Current selected category config
  const currentCategoryConfig = useMemo(() => {
    return CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];
  }, [selectedCategory]);

  const handleSelectCategory = (catId: SupplyCategoryType) => {
    setSelectedCategory(catId);
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (cat) {
      setItemUnit(isBn ? cat.defaultUnit : (cat.defaultUnit === 'কেজি' ? 'Kg' : cat.defaultUnit === 'প্যাকেট' ? 'Packet' : 'Pcs'));
    }
    setFormError(null);
  };

  // Add Item to Expense list
  const handleAddExpense = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = itemName.trim();
    const parsedCost = parseFloat(itemCost);
    const parsedAmount = parseFloat(itemAmount) || 1;

    if (!cleanName) {
      setFormError(isBn ? 'অনুগ্রহ করে উপকরণের নাম লিখুন বা সাজেশন থেকে বেছে নিন।' : 'Please enter or pick an item name.');
      return;
    }
    if (isNaN(parsedCost) || parsedCost <= 0) {
      setFormError(isBn ? 'অনুগ্রহ করে সঠিক খরচের টাকা (৳) লিখুন।' : 'Please enter a valid cost in Tk.');
      return;
    }

    const newItem: SupplyExpenseItem = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category: selectedCategory,
      name: cleanName,
      amount: parsedAmount,
      unit: itemUnit,
      cost: parsedCost,
      dateAdded: new Date().toLocaleDateString(),
    };

    setExpenseItems((prev) => [newItem, ...prev]);
    setItemName('');
    setItemAmount('');
    setItemCost('');
    setFormError(null);

    // Sync to Firestore cloud
    syncExpenseToFirestore(newItem, effectiveFarmerId).catch((err) => console.warn('Firestore sync note:', err));
  };

  const handleRemoveExpense = (id: string) => {
    setExpenseItems((prev) => prev.filter((item) => item.id !== id));
    // Remove from Firestore cloud
    removeExpenseFromFirestore(id, effectiveFarmerId).catch((err) => console.warn('Firestore remove note:', err));
  };

  const handleClearAll = () => {
    const confirmMsg = isBn ? 'আপনি কি সব হিসাব মুছে নতুন করে শুরু করতে চান?' : 'Are you sure you want to clear all calculations?';
    if (window.confirm(confirmMsg)) {
      setExpenseItems([]);
      setCropSale({ cropName: '', totalSaleAmount: 0 });
      setSaleCropName('');
      setSaleTotalInput('');
      setSaleQtyInput('');
      setSaleRateInput('');
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error(e);
      }
      // Clear in Firebase Firestore
      clearAllExpensesFromFirestore(effectiveFarmerId).catch((err) =>
        console.warn('Firestore clear error:', err)
      );
    }
  };

  // Update Sale Amount
  const handleUpdateCropSale = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let finalAmount = 0;
    let qty: number | undefined = undefined;
    let rate: number | undefined = undefined;

    if (saleMode === 'calculate') {
      const q = parseFloat(saleQtyInput) || 0;
      const r = parseFloat(saleRateInput) || 0;
      finalAmount = Math.round(q * r);
      qty = q;
      rate = r;
      setSaleTotalInput(String(finalAmount));
    } else {
      finalAmount = parseFloat(saleTotalInput) || 0;
    }

    const updatedSale: CropSaleRecord = {
      cropName: saleCropName.trim(),
      quantity: qty,
      unit: saleUnitInput,
      pricePerUnit: rate,
      totalSaleAmount: finalAmount,
    };

    setCropSale(updatedSale);
    // Sync to Firestore
    syncCropSaleToFirestore(updatedSale, effectiveFarmerId).catch((err) => console.warn('Firestore sale sync note:', err));

    setSaleSavedNotice(true);
    setTimeout(() => setSaleSavedNotice(false), 2000);
  };

  // Calculations
  const totalCost = useMemo(() => {
    return expenseItems.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
  }, [expenseItems]);

  const totalRevenue = useMemo(() => {
    return Number(cropSale.totalSaleAmount) || 0;
  }, [cropSale]);

  const netResult = useMemo(() => {
    return totalRevenue - totalCost;
  }, [totalRevenue, totalCost]);

  const isProfit = netResult > 0;
  const isLoss = netResult < 0;

  const profitMarginPercent = useMemo(() => {
    if (totalCost === 0) return 0;
    return Math.round((Math.abs(netResult) / totalCost) * 100);
  }, [netResult, totalCost]);

  // Auto-sync calculated summary (total cost, revenue, profit/loss) to Firestore
  useEffect(() => {
    if (!effectiveFarmerId || effectiveFarmerId === 'default_farmer') return;

    syncCalculatorSummaryToFirestore(
      {
        userId: effectiveFarmerId,
        totalCost,
        totalRevenue,
        netProfitLoss: netResult,
        status: isProfit ? 'profit' : isLoss ? 'loss' : 'breakeven',
        expensesCount: expenseItems.length,
        cropName: cropSale.cropName || '',
        updatedAt: new Date().toISOString(),
      },
      effectiveFarmerId
    ).catch((err) => console.warn('Firestore summary sync error:', err));
  }, [totalCost, totalRevenue, netResult, isProfit, isLoss, expenseItems.length, cropSale.cropName, effectiveFarmerId]);

  // Grouped by Category
  const categorySummary = useMemo(() => {
    const map: Record<SupplyCategoryType, number> = {
      fertilizer: 0,
      pesticide: 0,
      fungicide: 0,
      seed: 0,
      irrigation: 0,
      labor: 0,
      tillage: 0,
      transport_other: 0,
    };
    expenseItems.forEach((item) => {
      if (map[item.category] !== undefined) {
        map[item.category] += item.cost;
      }
    });
    return map;
  }, [expenseItems]);

  const toBnDigits = (val: number | string) =>
    String(val).replace(/\d/g, (ch) => '০১২৩৪৫৬৭৮৯'[parseInt(ch, 10)]);

  const formatMoney = (val: number) => {
    const formatted = Math.abs(val).toLocaleString('en-IN');
    return isBn ? toBnDigits(formatted) : formatted;
  };

  // Copy statement to clipboard
  const handleCopySummary = () => {
    const statement = `
══════════════════════════════
🌱 স্মার্ট এ্যারো ফিল্ড - কৃষি ইনপুট ও লাভ-ক্ষতির হিসাব
══════════════════════════════
${cropSale.cropName ? `ফসল: ${cropSale.cropName}\n` : ''}তারিখ: ${new Date().toLocaleDateString()}

【মোট উপকরণ খরচ】: ৳ ${formatMoney(totalCost)}
${expenseItems.map((item, i) => `${i + 1}. ${item.name} (${item.amount} ${item.unit}): ৳ ${formatMoney(item.cost)}`).join('\n')}

【ফসল বিক্রির আয়】: ৳ ${formatMoney(totalRevenue)}
${cropSale.quantity ? `পরিমাণ: ${cropSale.quantity} ${cropSale.unit} × ৳${cropSale.pricePerUnit}` : ''}
------------------------------
【ফলাফল】: ${isProfit ? `🎉 নিট লাভ: +৳ ${formatMoney(netResult)} (${profitMarginPercent}%)` : isLoss ? `⚠️ নিট ক্ষতি: -৳ ${formatMoney(netResult)} (${profitMarginPercent}%)` : 'সমান সমান (ব্রেক-ইভেন)'}
══════════════════════════════
    `.trim();

    navigator.clipboard?.writeText(statement);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  return (
    <div className="space-y-4 pb-24 max-w-4xl mx-auto">
      {/* Clean Header */}
      <div className="flex items-center justify-between bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center space-x-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 transition-all flex-shrink-0 cursor-pointer"
            title={isBn ? 'ফিরে যান' : 'Go back'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-black text-gray-900 tracking-tight truncate">
              {isBn ? 'উপকরণ খরচ ও লাভ-ক্ষতি ক্যালকুলেটর' : 'Supplies & Profit/Loss Calculator'}
            </h2>
            <p className="text-[11px] text-gray-500 truncate">
              {isBn ? 'সার, কীটনাশক ও বীজের হিসাব এবং ফসল বিক্রির লাভ-ক্ষতি' : 'Input expenses & crop sales net profit/loss'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Cloud sync indicator */}
          <div 
            className="flex items-center space-x-1 bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-lg"
            title="Firebase Firestore Cloud Connected"
          >
            <Cloud className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden xs:inline">{isBn ? 'ক্লাউড সিঙ্কড' : 'Cloud Synced'}</span>
          </div>

          {(expenseItems.length > 0 || totalRevenue > 0) && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex-shrink-0 px-2.5 py-1.5 rounded-xl border border-gray-200 hover:border-rose-300 bg-white hover:bg-rose-50 text-gray-600 hover:text-rose-600 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
              title={isBn ? 'নতুন হিসাব শুরু করুন' : 'Clear all'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBn ? 'নতুন হিসাব' : 'Reset'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Clean 3-Metric Summary Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-2xs">
        <div className="grid grid-cols-3 divide-x divide-gray-100 text-center">
          <div className="px-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              {isBn ? 'মোট খরচ' : 'Total Cost'}
            </span>
            <span className="text-base sm:text-lg font-black text-rose-600 block mt-0.5">
              ৳ {formatMoney(totalCost)}
            </span>
            <span className="text-[10px] text-gray-400">
              {expenseItems.length} {isBn ? 'টি উপকরণ' : 'items'}
            </span>
          </div>

          <div className="px-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              {isBn ? 'ফসল বিক্রি' : 'Crop Sales'}
            </span>
            <span className="text-base sm:text-lg font-black text-blue-600 block mt-0.5">
              ৳ {formatMoney(totalRevenue)}
            </span>
            <span className="text-[10px] text-gray-400 truncate block">
              {cropSale.cropName || (isBn ? 'বিক্রির আয়' : 'Revenue')}
            </span>
          </div>

          <div className="px-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              {isBn ? 'নিট লাভ / ক্ষতি' : 'Net Result'}
            </span>
            <span className={`text-base sm:text-lg font-black block mt-0.5 ${
              isProfit ? 'text-emerald-600' : isLoss ? 'text-rose-600' : 'text-gray-700'
            }`}>
              {isProfit && '+'}
              {isLoss && '-'}
              ৳ {formatMoney(netResult)}
            </span>
            <span className="text-[10px] font-bold">
              {isProfit ? (
                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                  {isBn ? `লাভ +${profitMarginPercent}%` : `Profit +${profitMarginPercent}%`}
                </span>
              ) : isLoss ? (
                <span className="text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded">
                  {isBn ? `ক্ষতি -${profitMarginPercent}%` : `Loss -${profitMarginPercent}%`}
                </span>
              ) : (
                <span className="text-gray-400">{isBn ? 'ব্যালেন্স' : 'Balance'}</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Clean 2-Tab Navigation */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100/90 rounded-2xl border border-gray-200/60">
        <button
          type="button"
          onClick={() => setActiveTab('expenses')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            activeTab === 'expenses'
              ? 'bg-white text-[#1E5128] shadow-2xs border border-gray-200/60'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calculator className="w-4 h-4 text-[#1E5128]" />
          <span>{isBn ? '১. উপকরণ খরচ যোগ' : '1. Input Expenses'}</span>
          {expenseItems.length > 0 && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-100 text-[#1E5128]">
              {expenseItems.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('revenue')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            activeTab === 'revenue'
              ? 'bg-white text-[#1E5128] shadow-2xs border border-gray-200/60'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Coins className="w-4 h-4 text-blue-600" />
          <span>{isBn ? '২. ফসল বিক্রি ও লাভ-ক্ষতি' : '2. Sales & Net Profit'}</span>
          {totalRevenue > 0 && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800">
              ৳
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: INPUT EXPENSES */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          {/* Add Expense Form Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block mb-2">
                {isBn ? 'উপকরণের ধরন নির্বাচন করুন:' : 'Select Category:'}
              </label>

              {/* Clean Category Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center space-x-2 cursor-pointer ${
                        isSelected
                          ? 'bg-[#1E5128] text-white border-[#1E5128] shadow-2xs'
                          : 'bg-[#F9FAFB] border-gray-200 text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-white text-gray-700 border border-gray-200'
                      }`}>
                        {cat.icon}
                      </div>
                      <span className="text-xs font-bold truncate">
                        {isBn ? cat.nameBn : cat.nameEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Suggestions based on selected category */}
            <div className="pt-2 border-t border-gray-100">
              <span className="text-[11px] font-semibold text-gray-500 block mb-1.5">
                {isBn ? `দ্রুত সাজেশন (${currentCategoryConfig.nameBn}):` : `Suggestions:`}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(isBn ? currentCategoryConfig.suggestionsBn : currentCategoryConfig.suggestionsEn).map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setItemName(sug);
                      setFormError(null);
                    }}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      itemName === sug
                        ? 'bg-[#1E5128] text-white border-[#1E5128]'
                        : 'bg-[#F9FAFB] text-gray-700 border-gray-200 hover:bg-emerald-50 hover:border-emerald-200'
                    }`}
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Input fields */}
            <form onSubmit={handleAddExpense} className="pt-2 border-t border-gray-100 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isBn ? 'উপকরণের নাম' : 'Item Name'}
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => {
                    setItemName(e.target.value);
                    setFormError(null);
                  }}
                  placeholder={isBn ? 'যেমন: ইউরিয়া সার, নাটিভো, আলু বীজ, সেচ ডিজেল...' : 'e.g. Urea, Seedlings, Spray...'}
                  className="w-full bg-[#F9FAFB] border border-gray-300 focus:border-[#1E5128] focus:bg-white rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? 'পরিমাণ' : 'Quantity'}
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    value={itemAmount}
                    onChange={(e) => setItemAmount(e.target.value)}
                    placeholder="যেমন: ৫০"
                    className="w-full bg-[#F9FAFB] border border-gray-300 focus:border-[#1E5128] focus:bg-white rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? 'একক' : 'Unit'}
                  </label>
                  <select
                    value={itemUnit}
                    onChange={(e) => setItemUnit(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-gray-300 focus:border-[#1E5128] focus:bg-white rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-gray-900 outline-none transition-all"
                  >
                    {(isBn ? UNIT_OPTIONS_BN : UNIT_OPTIONS_EN).map((u, i) => (
                      <option key={i} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? 'খরচ (টাকা ৳)' : 'Cost (Tk)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">৳</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={itemCost}
                      onChange={(e) => {
                        setItemCost(e.target.value);
                        setFormError(null);
                      }}
                      placeholder="যেমন: ১৩৫০"
                      className="w-full bg-[#F9FAFB] border border-gray-300 focus:border-[#1E5128] focus:bg-white rounded-xl pl-7 pr-3 py-2 text-xs sm:text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1E5128] hover:bg-[#163e1e] active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>{isBn ? 'তালিকায় খরচ যোগ করুন' : 'Add Expense'}</span>
              </button>
            </form>
          </div>

          {/* Expense Entries List */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                {isBn ? 'খরচের তালিকা' : 'Recorded Expenses'}
              </span>
              <span className="text-xs font-black text-rose-600">
                {isBn ? 'মোট: ৳ ' : 'Total: ৳ '}{formatMoney(totalCost)}
              </span>
            </div>

            {expenseItems.length === 0 ? (
              <div className="text-center py-8 px-4 bg-gray-50/70 rounded-xl border border-dashed border-gray-200">
                <ReceiptText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-600">
                  {isBn ? 'এখনো কোনো খরচ যোগ করা হয়নি' : 'No expenses added yet'}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5 max-w-sm mx-auto">
                  {isBn 
                    ? 'উপরের ফরম থেকে আপনার কেনা সার, বীজ, কীটনাশক বা সেচ খরচের নাম ও টাকা লিখে যোগ করুন।' 
                    : 'Fill in the form above to add your purchased supplies and farm expenses.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {expenseItems.map((item) => {
                  const cat = CATEGORIES.find((c) => c.id === item.category) || CATEGORIES[0];
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[#F9FAFB] border border-gray-200 hover:border-gray-300 transition-all flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${cat.bgLight} border`}>
                          {cat.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-gray-500 px-1.5 py-0.2 rounded bg-gray-200/80">
                              {isBn ? cat.nameBn : cat.nameEn}
                            </span>
                          </div>
                          {item.amount > 0 && (
                            <span className="text-[11px] text-gray-500 font-medium block">
                              {item.amount} {item.unit}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="font-bold text-xs sm:text-sm text-gray-900">
                          ৳ {formatMoney(item.cost)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExpense(item.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all cursor-pointer"
                          title={isBn ? 'মুছুন' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setActiveTab('revenue')}
                  className="w-full mt-2 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#1E5128] border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>{isBn ? 'পরের ধাপ: ফসল বিক্রি ও লাভ-ক্ষতি দেখুন →' : 'Next: Crop Sales & Net Profit →'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CROP SALES & NET PROFIT/LOSS */}
      {activeTab === 'revenue' && (
        <div className="space-y-4">
          {/* Sale Input Form */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider">
                  {isBn ? 'ফসল বিক্রির আয় (Crop Sales)' : 'Crop Sales Revenue'}
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {isBn ? 'ফসল বিক্রি করে আপনি মোট কত টাকা পেয়েছেন?' : 'Enter the total income from selling your harvest'}
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateCropSale} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isBn ? 'ফসলের নাম (ঐচ্ছিক)' : 'Crop Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={saleCropName}
                  onChange={(e) => setSaleCropName(e.target.value)}
                  placeholder={isBn ? 'যেমন: আমন ধান, গোল আলু, ভুট্টা...' : 'e.g. Rice, Potato, Maize...'}
                  className="w-full bg-[#F9FAFB] border border-gray-300 focus:border-[#1E5128] focus:bg-white rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Mode Toggle */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSaleMode('direct')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    saleMode === 'direct' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600'
                  }`}
                >
                  {isBn ? 'সরাসরি মোট বিক্রির টাকা' : 'Direct Total Sales (Tk)'}
                </button>
                <button
                  type="button"
                  onClick={() => setSaleMode('calculate')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    saleMode === 'calculate' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600'
                  }`}
                >
                  {isBn ? 'পরিমাণ × দর হিসাব' : 'Qty × Rate Calculation'}
                </button>
              </div>

              {saleMode === 'direct' ? (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? 'মোট বিক্রির টাকা (৳)' : 'Total Sale Amount (Tk)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">৳</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={saleTotalInput}
                      onChange={(e) => setSaleTotalInput(e.target.value)}
                      placeholder={isBn ? 'যেমন: ৪৫০৫০' : 'e.g. 45000'}
                      className="w-full bg-[#F9FAFB] border border-gray-300 focus:border-[#1E5128] focus:bg-white rounded-xl pl-8 pr-3 py-2 text-sm font-bold text-gray-900 outline-none transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isBn ? 'উৎপাদন পরিমাণ' : 'Yield Quantity'}
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="any"
                      value={saleQtyInput}
                      onChange={(e) => setSaleQtyInput(e.target.value)}
                      placeholder="যেমন: ৩৫"
                      className="w-full bg-[#F9FAFB] border border-gray-300 focus:border-[#1E5128] focus:bg-white rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-gray-900 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isBn ? 'একক' : 'Unit'}
                    </label>
                    <select
                      value={saleUnitInput}
                      onChange={(e) => setSaleUnitInput(e.target.value)}
                      className="w-full bg-[#F9FAFB] border border-gray-300 focus:border-[#1E5128] focus:bg-white rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-gray-900 outline-none transition-all"
                    >
                      <option value={isBn ? 'মণ' : 'Mon'}>{isBn ? 'মণ (৪০ কেজি)' : 'Mon (40kg)'}</option>
                      <option value={isBn ? 'কেজি' : 'Kg'}>{isBn ? 'কেজি (Kg)' : 'Kg'}</option>
                      <option value={isBn ? 'বস্তা' : 'Bag'}>{isBn ? 'বস্তা (Bag)' : 'Bag'}</option>
                      <option value={isBn ? 'টন' : 'Ton'}>{isBn ? 'টন (Ton)' : 'Ton'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isBn ? 'প্রতি এককের দর (৳)' : 'Rate per unit (Tk)'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">৳</span>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        value={saleRateInput}
                        onChange={(e) => setSaleRateInput(e.target.value)}
                        placeholder="যেমন: ১২০০"
                        className="w-full bg-[#F9FAFB] border border-gray-300 focus:border-[#1E5128] focus:bg-white rounded-xl pl-7 pr-3 py-2 text-xs sm:text-sm font-bold text-gray-900 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {saleMode === 'calculate' && (
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-900">
                    {isBn ? 'হিসাবকৃত মোট বিক্রি:' : 'Calculated Total:'}
                  </span>
                  <span className="font-bold text-blue-700">
                    ৳ {formatMoney((parseFloat(saleQtyInput) || 0) * (parseFloat(saleRateInput) || 0))}
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1E5128] hover:bg-[#163e1e] active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
              >
                <Check className="w-4 h-4" />
                <span>{saleSavedNotice ? (isBn ? 'সংরক্ষণ সম্পন্ন!' : 'Saved!') : (isBn ? 'বিক্রির তথ্য সংরক্ষণ করুন' : 'Save Sales Amount')}</span>
              </button>
            </form>
          </div>

          {/* Clean Net Profit / Loss Card */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isProfit
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : isLoss
              ? 'bg-rose-50/70 border-rose-200 text-rose-950'
              : 'bg-gray-50 border-gray-200 text-gray-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/70 border border-gray-200">
                {cropSale.cropName || (isBn ? 'ফসল চাষ' : 'Farm Batch')}
              </span>
              <span className="text-xs font-semibold text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-xs font-semibold text-gray-600 block">
                  {isProfit
                    ? (isBn ? 'নিট লাভ (Net Profit):' : 'Net Profit:')
                    : isLoss
                    ? (isBn ? 'নিট ক্ষতি (Net Loss):' : 'Net Loss:')
                    : (isBn ? 'সমান সমান (ব্রেক-ইভেন):' : 'Break-Even Balance:')}
                </span>
                <span className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  isProfit ? 'text-emerald-700' : isLoss ? 'text-rose-700' : 'text-gray-800'
                }`}>
                  {isProfit && '+'}
                  {isLoss && '-'}
                  ৳ {formatMoney(netResult)}
                </span>
              </div>

              {totalCost > 0 && (
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 font-medium block">
                    {isBn ? 'শতকরা মার্জিন' : 'Margin'}
                  </span>
                  <span className={`text-base font-bold ${
                    isProfit ? 'text-emerald-700' : isLoss ? 'text-rose-700' : 'text-gray-700'
                  }`}>
                    {isProfit ? '+' : isLoss ? '-' : ''}{profitMarginPercent}%
                  </span>
                </div>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-200/80 text-xs">
              <div className="bg-white/80 p-2 rounded-xl border border-gray-200/60">
                <span className="text-[10px] text-gray-500 block">{isBn ? 'মোট বিক্রি' : 'Total Sales'}</span>
                <span className="font-bold text-blue-700">৳ {formatMoney(totalRevenue)}</span>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-gray-200/60">
                <span className="text-[10px] text-gray-500 block">{isBn ? 'মোট খরচ' : 'Total Cost'}</span>
                <span className="font-bold text-rose-600">৳ {formatMoney(totalCost)}</span>
              </div>
            </div>
          </div>

          {/* Statement & Action Sheet */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center space-x-1.5">
                <ReceiptText className="w-4 h-4 text-[#1E5128]" />
                <span>{isBn ? 'হিসাব বিবরণী' : 'Summary Statement'}</span>
              </span>
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer"
              >
                {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopied ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'রসিদ কপি' : 'Copy')}</span>
              </button>
            </div>

            {/* Category breakdown if expenses exist */}
            {totalCost > 0 && (
              <div className="space-y-1.5 py-1">
                <span className="text-[11px] font-bold text-gray-500 block">
                  {isBn ? 'খাতভিত্তিক খরচের অনুপাত:' : 'Category breakdown:'}
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {CATEGORIES.map((cat) => {
                    const amt = categorySummary[cat.id];
                    if (amt <= 0) return null;
                    const pct = Math.round((amt / totalCost) * 100);
                    return (
                      <div key={cat.id} className="p-2 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <span className="text-gray-600 font-medium truncate">{isBn ? cat.nameBn : cat.nameEn} ({pct}%)</span>
                        <span className="font-bold text-gray-900 ml-1">৳{formatMoney(amt)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Agronomist Advisory Button */}
            {(totalCost > 0 || totalRevenue > 0) && (
              <button
                type="button"
                onClick={() => {
                  const prompt = `আমার ${cropSale.cropName || 'ফসল'} চাষে মোট উপকরণ খরচ হয়েছে ৳${totalCost} এবং বিক্রি করেছি ৳${totalRevenue} টাকায়। নিট ফলাফল: ${isProfit ? `লাভ ৳${netResult}` : `ক্ষতি ৳${Math.abs(netResult)}`}। সামনের মৌসুমে সার ও কীটনাশকের অপ্রয়োজনীয় খরচ কমিয়ে লাভ আরও বাড়ানোর উপায় কী?`;
                  onOpenChatWithTopic?.(prompt);
                }}
                className="w-full mt-2 py-2.5 bg-[#1E5128] hover:bg-[#163e1e] active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>
                  {isBn 
                    ? 'খরচ কমাতে এআই কৃষিবিদের পরামর্শ নিন' 
                    : 'Ask Gemini Agronomist to Analyze Costs'}
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
