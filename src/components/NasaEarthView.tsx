import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Satellite, 
  Droplets, 
  Thermometer, 
  CloudRain, 
  Leaf, 
  Wind, 
  Gauge, 
  Sun, 
  CloudSun, 
  Sparkles,
  Layers,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Language } from '../types';
import { RiskPredictorCard } from './RiskPredictorCard';

interface NasaEarthViewProps {
  language: Language;
  onBack: () => void;
  selectedDistrict?: string;
  onOpenChatWithTopic?: (topic: string) => void;
  onNavigateToCropGuide?: (cropId: string) => void;
}

export const NasaEarthView: React.FC<NasaEarthViewProps> = ({
  language,
  onBack,
  selectedDistrict = 'Dhaka',
  onOpenChatWithTopic,
  onNavigateToCropGuide,
}) => {
  const isBn = language === 'bn';
  const [activeTab, setActiveTab] = useState<'risk' | 'land' | 'weather' | 'soil'>('risk');

  // 7-day forecast mock data matching Screenshot 6
  const forecastDays = [
    { day: isBn ? 'রবি' : 'SUN', temp: '+25°C', icon: <Sun className="w-5 h-5 text-amber-400" /> },
    { day: isBn ? 'সোম' : 'MON', temp: '+29°C', icon: <CloudSun className="w-5 h-5 text-amber-300" /> },
    { day: isBn ? 'মঙ্গল' : 'TUE', temp: '+28°C', icon: <CloudRain className="w-5 h-5 text-blue-400" /> },
    { day: isBn ? 'বুধ' : 'WED', temp: '+26°C', icon: <CloudRain className="w-5 h-5 text-blue-500" /> },
    { day: isBn ? 'বৃহঃ' : 'THU', temp: '+27°C', icon: <CloudSun className="w-5 h-5 text-amber-300" /> },
    { day: isBn ? 'শুক্র' : 'FRI', temp: '+29°C', icon: <Sun className="w-5 h-5 text-amber-400" /> },
    { day: isBn ? 'শনি' : 'SAT', temp: '+30°C', icon: <Sun className="w-5 h-5 text-amber-400" /> },
  ];

  return (
    <div className="bg-[#F5F7F8] min-h-screen pb-24">
      {/* Top Green Curved Header (Matching Screenshot 5) */}
      <div className="bg-[#1E5128] text-white pt-3 sm:pt-4 pb-7 sm:pb-8 px-3.5 sm:px-4 rounded-b-[28px] sm:rounded-b-[32px] shadow-lg pt-safe">
        <div className="max-w-md mx-auto">
          {/* Back & Title */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 mb-3.5 sm:mb-4">
            <button
              id="nasa-back-btn"
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center flex-shrink-0">
              <img
                src="/images/nasa_logo.svg"
                alt="NASA Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-black flex items-center gap-1.5 truncate">
                <span>NASA Earth Data</span>
                <span className="text-[10px] bg-white/20 text-[#D8E9A8] px-1.5 py-0.5 rounded-full font-bold uppercase flex-shrink-0">
                  POWER API
                </span>
              </h1>
              <p className="text-xs text-green-200 truncate">
                {isBn ? 'স্যাটেলাইটের মাধ্যমে আপনার জমির তথ্য' : 'Your land information from satellite telemetry'}
              </p>
            </div>
          </div>

          {/* Segmented Filter Control: Risk & Suitability | Land Condition | Weather | Soil */}
          <div className="bg-white/15 p-1 rounded-2xl grid grid-cols-4 gap-1 backdrop-blur-sm border border-white/20">
            <button
              type="button"
              onClick={() => setActiveTab('risk')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all text-center leading-tight truncate ${
                activeTab === 'risk'
                  ? 'bg-white text-[#1E5128] shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {isBn ? 'ঝুঁকি ও ফসল' : 'Risk & Crops'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('land')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all text-center leading-tight truncate ${
                activeTab === 'land'
                  ? 'bg-white text-[#1E5128] shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {isBn ? 'জমির অবস্থা' : 'Land Condition'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('weather')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all text-center leading-tight truncate ${
                activeTab === 'weather'
                  ? 'bg-white text-[#1E5128] shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {isBn ? 'আবহাওয়া' : 'Weather'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('soil')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all text-center leading-tight truncate ${
                activeTab === 'soil'
                  ? 'bg-white text-[#1E5128] shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {isBn ? 'মাটি ও আর্দ্রতা' : 'Soil & Moisture'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-md mx-auto px-4 -mt-4 space-y-4">
        
        {/* Banner: NASA Earth Observation (Screenshot 5) */}
        <div className="relative rounded-2xl overflow-hidden shadow-md h-36 bg-gradient-to-r from-blue-900 to-indigo-900 border border-white/20">
          <img
            src="/images/satellite_earth.jpg"
            alt="NASA Earth Observation"
            className="w-full h-full object-cover opacity-75"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
              {isBn ? 'নাসা আর্থ অবজারভেশন ও ক্লাইমেট' : 'NASA Earth Observation & Climatology'}
            </span>
            <h3 className="text-base font-black">
              {isBn ? 'প্রকৃত স্যাটেলাইট ডেটা, সঠিক প্রভাব' : 'Real data, Real agricultural impact'}
            </h3>
            <p className="text-[11px] text-gray-200">
              MODIS NDVI, GLDAS Soil Moisture & NASA POWER Climatology
            </p>
          </div>
        </div>

        {/* Tab 0: Agriculture Risk & Crop Suitability Predictor */}
        {activeTab === 'risk' && (
          <div>
            <RiskPredictorCard
              language={language}
              userDistrict={selectedDistrict}
              onNavigateToCropGuide={onNavigateToCropGuide}
              onOpenChatWithTopic={onOpenChatWithTopic}
            />
          </div>
        )}

        {/* Tab 1: Land Condition (Matching Screenshot 5) */}
        {activeTab === 'land' && (
          <div className="space-y-4">
            {/* Satellite Map Preview Card */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 h-44 border border-gray-200 shadow-sm">
              <img
                src="/images/aerial_field.jpg"
                alt="Satellite Field NDVI"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-mono flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{selectedDistrict}, Bangladesh</span>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold border border-emerald-400/40">
                NDVI: 0.72 (Healthy Vegetation)
              </div>
            </div>

            {/* 4 Metric Cards (Matching Screenshot 5 exactly) */}
            <div className="grid grid-cols-2 gap-3">
              {/* NDVI */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase block">NDVI</span>
                  <span className="text-base font-black text-gray-900">0.72</span>
                  <span className="text-[10px] font-bold text-emerald-600 block">
                    {isBn ? 'চমৎকার (Good)' : 'Good Health'}
                  </span>
                </div>
              </div>

              {/* Soil Moisture */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase block">
                    {isBn ? 'মাটির আর্দ্রতা' : 'Soil Moisture'}
                  </span>
                  <span className="text-base font-black text-gray-900">32%</span>
                  <span className="text-[10px] font-bold text-amber-600 block">
                    {isBn ? 'মাঝারি (Medium)' : 'Medium'}
                  </span>
                </div>
              </div>

              {/* Temperature */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase block">
                    {isBn ? 'তাপমাত্রা' : 'Temperature'}
                  </span>
                  <span className="text-base font-black text-gray-900">29.4 °C</span>
                  <span className="text-[10px] font-bold text-emerald-600 block">
                    {isBn ? 'স্বাভাবিক (Normal)' : 'Normal'}
                  </span>
                </div>
              </div>

              {/* Rainfall */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
                  <CloudRain className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase block">
                    {isBn ? 'বৃষ্টিপাত' : 'Rain Fall'}
                  </span>
                  <span className="text-base font-black text-gray-900">12 mm</span>
                  <span className="text-[10px] text-gray-500 block">
                    ({isBn ? 'গত ৭ দিন' : 'last 7 days'})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Weather & Forecast (Matching Screenshot 6) */}
        {activeTab === 'weather' && (
          <div className="space-y-4">
            {/* Weather Card with Blue Atmosphere Gradient */}
            <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-[#1E5128] via-[#245D31] to-[#12361B] shadow-md relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1 text-xs text-green-200 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedDistrict}, Bangladesh</span>
                  </div>
                  <h3 className="text-4xl font-black mt-2 tracking-tight">+29 °C</h3>
                  <p className="text-xs text-green-100 font-semibold mt-0.5">
                    {isBn ? 'সোমবার, আংশিক মেঘলা' : 'Monday, Partly Sunny'}
                  </p>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <CloudSun className="w-10 h-10 text-yellow-300 animate-pulse" />
                </div>
              </div>

              {/* Atmospheric Sub-stats */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/15 text-center text-xs">
                <div>
                  <span className="text-[10px] text-green-200 block">{isBn ? 'বাতাসের আর্দ্রতা' : 'Humidity'}</span>
                  <span className="font-bold">65%</span>
                </div>
                <div>
                  <span className="text-[10px] text-green-200 block">{isBn ? 'বাতাসের বেগ' : 'Wind Speed'}</span>
                  <span className="font-bold">14 km/h</span>
                </div>
                <div>
                  <span className="text-[10px] text-green-200 block">{isBn ? 'চাপ' : 'Pressure'}</span>
                  <span className="font-bold">1012 hPa</span>
                </div>
              </div>

              {/* 7-Day Forecast Strip (Screenshot 6) */}
              <div className="mt-4 pt-3 border-t border-white/15">
                <span className="text-[10px] font-bold text-green-200 uppercase tracking-wider block mb-2">
                  {isBn ? '৭ দিনের পূর্বাভাস' : '7-Day Forecast'}
                </span>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {forecastDays.map((item, i) => (
                    <div key={i} className="bg-white/10 rounded-lg p-1.5 flex flex-col items-center">
                      <span className="text-[9px] font-bold text-green-100">{item.day}</span>
                      <div className="my-1">{item.icon}</div>
                      <span className="text-[9px] font-bold">{item.temp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Important Information for Farming Card (Screenshot 6) */}
            <div className="bg-[#E7F7ED] border border-[#BDE8CB] rounded-2xl p-4 text-gray-900 shadow-sm">
              <h4 className="text-xs font-bold text-[#1E5128] uppercase tracking-wider mb-3">
                {isBn ? 'চাষের জন্য গুরুত্বপূর্ণ পূর্বাভাস ও তথ্য' : 'Important Information for Farming'}
              </h4>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 pb-2 border-b border-green-200/60">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-bold block text-gray-900">
                      {isBn ? 'মাঝারি বৃষ্টির সম্ভাবনা (Moderate Chance of Rain)' : 'Moderate Chance of Rain'}
                    </span>
                    <span className="text-[11px] text-gray-600">
                      {isBn ? 'জমির নিচু অংশে অতিরিক্ত পানি জমতে দেবেন না।' : 'Avoid fertilizer application right before sudden showers.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pb-2 border-b border-green-200/60">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-bold block text-gray-900">
                      {isBn ? 'মাটিতে পর্যাপ্ত আর্দ্রতা (Sufficient Soil Moisture)' : 'Sufficient Soil Moisture'}
                    </span>
                    <span className="text-[11px] text-gray-600">
                      {isBn ? 'আপাতত অতিরিক্ত সেচ পরিহার করুন।' : 'Irrigation can be paused for next 48 hours.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-bold block text-gray-900">
                      {isBn ? 'ফসলের জন্য উপযুক্ত তাপমাত্রা' : 'Temperature is Suitable for Crops'}
                    </span>
                    <span className="text-[11px] text-gray-600">
                      {isBn ? 'ধানের ফুল ও দানা গঠনের জন্য আদর্শ তাপমাত্রা।' : 'Favorable thermal conditions for grain filling & flowering.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Soil & Moisture */}
        {activeTab === 'soil' && (
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                <img
                  src="/images/soil_sample.jpg"
                  alt="Soil Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">
                  {isBn ? 'মাটির স্বাস্থ্য প্রোফাইল' : 'Topsoil Agro-Ecological Health'}
                </h4>
                <p className="text-xs text-gray-500">
                  {isBn ? 'দোআঁশ ও এঁটেল দোআঁশ মাটি' : 'Sandy Clay Loam Texture'}
                </p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800">
                  pH 6.4 (Optimal / আদর্শ)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="p-2 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-[10px] font-medium text-gray-500 block">Nitrogen (N)</span>
                <span className="font-bold text-xs text-amber-700">{isBn ? 'মাঝারি' : 'Medium'}</span>
              </div>
              <div className="p-2 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-[10px] font-medium text-gray-500 block">Phosphorus (P)</span>
                <span className="font-bold text-xs text-emerald-700">{isBn ? 'পর্যাপ্ত' : 'Adequate'}</span>
              </div>
              <div className="p-2 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-[10px] font-medium text-gray-500 block">Potassium (K)</span>
                <span className="font-bold text-xs text-emerald-700">{isBn ? 'উচ্চ' : 'High'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenChatWithTopic?.('What organic manure and fertilizer doses should I add for Sandy Clay Loam soil in Bangladesh?')}
              className="w-full py-2.5 bg-[#1E5128] hover:bg-[#163e1e] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{isBn ? 'মাটি অনুযায়ী সারের মাত্রা জানুন' : 'Get Soil Fertilizer Plan from AI'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
