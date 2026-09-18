export type Language = 'en' | 'bn';

export interface PredictionResult {
  risk: 'High Risk' | 'Moderate' | 'Low Risk' | string;
  best_crop: string;
  precip_7d: number;
  temp_7d_avg: number;
  precipitation?: number;
  temperature?: number;
  risk_confidence?: number;
  dataSource?: string;
  baselineMethod?: string;
  nasaObservationDate?: string;
  isFallback?: boolean;
}

export interface AiEngineInfo {
  mode: 'dual' | 'gemini' | 'huggingface';
  huggingFace?: {
    model: string;
    label: string;
    confidence: number;
    status: string;
    topCandidates?: Array<{ label: string; score: number }>;
  };
  gemini?: {
    model: string;
    confidence: number;
    status: string;
  };
  ensembleConfidence?: number;
}

export interface DiseaseDiagnostic {
  isCropSpecimen?: boolean;
  diseaseName: string;
  diseaseNameBn: string;
  severity: 'High' | 'Moderate' | 'Low' | 'None';
  cropDetected?: string;
  cropDetectedBn?: string;
  plantPartDetected?: 'Leaf' | 'Fruit' | 'Stem' | 'Flower' | 'Whole Plant' | string;
  plantPartDetectedBn?: string;
  aiEngines?: AiEngineInfo;
  description: string;
  descriptionBn?: string;
  symptoms: string[];
  symptomsBn?: string[];
  solutions: {
    organic: string[];
    chemical: string[];
    prevention: string[];
  };
  solutionsBn?: {
    organic: string[];
    chemical: string[];
    prevention: string[];
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  createdAt?: string;
  language?: string;
  userId?: string;
}

export interface CalculatorSummaryRecord {
  userId: string;
  totalCost: number;
  totalRevenue: number;
  netProfitLoss: number;
  status: 'profit' | 'loss' | 'breakeven';
  expensesCount: number;
  cropName: string;
  updatedAt: string;
}

export interface MarketItem {
  id: string;
  nameEn: string;
  nameBn: string;
  category: 'Rice' | 'Wheat' | 'Veg' | 'Fruit' | 'Spices';
  price: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  image: string;
}

export interface CropGuide {
  id: string;
  nameEn: string;
  nameBn: string;
  category?: string;
  categoryBn?: string;
  image: string;
  bestSeason: string;
  cultivationTime: {
    aus?: string;
    aman?: string;
    boro?: string;
    rabi?: string;
    kharif?: string;
    sowing?: string;
  };
  soil: string;
  seed: string;
  fertilizer: string;
  waterManagement: string;
  pests: string[];
  diseases: string[];
  prevention: string[];
  harvesting: string;
  storage: string;
}

export interface NotificationItem {
  id: string;
  titleEn: string;
  titleBn: string;
  category: 'weather' | 'irrigation' | 'fertilizer' | 'pest' | 'market';
  date: string;
  read: boolean;
}

export type SupplyCategoryType = 
  | 'fertilizer' 
  | 'pesticide' 
  | 'fungicide' 
  | 'seed' 
  | 'irrigation' 
  | 'labor' 
  | 'tillage' 
  | 'transport_other';

export interface SupplyExpenseItem {
  id: string;
  category: SupplyCategoryType;
  name: string;
  amount: number;
  unit: string;
  cost: number;
  dateAdded?: string;
  note?: string;
}

export interface CropSaleRecord {
  cropName: string;
  quantity?: number;
  unit?: string;
  pricePerUnit?: number;
  totalSaleAmount: number;
  note?: string;
}

export interface FarmerProfile {
  name: string;
  phone?: string;
  division?: string;
  district?: string;
  upazila?: string;
  farmSizeAcres?: number;
  soilType?: string;
  primaryCrops?: string[];
  experienceYears?: number;
  photoUrl?: string;
  bio?: string;
  updatedAt?: string;
}

export interface RegisteredFarmer {
  name: string;
  phone: string;
  pin?: string;
  district: string;
  landSize: string;
  crop?: string;
  photoUrl?: string;
  bio?: string;
  authUid?: string;
  registeredAt: string;
}

export interface FarmerUser {
  name: string;
  phone: string;
  district: string;
  landSize: string;
  photoUrl?: string;
  bio?: string;
  experienceYears?: string;
  primaryCrops?: string[];
}

