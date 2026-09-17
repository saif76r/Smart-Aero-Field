export type Language = 'en' | 'bn';

export interface PredictionResult {
  risk: 'High Risk' | 'Moderate' | 'Low Risk' | string;
  best_crop: string;
  precip_7d: number;
  temp_7d_avg: number;
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
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
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
  image: string;
  bestSeason: string;
  cultivationTime: {
    aus?: string;
    aman?: string;
    boro?: string;
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
