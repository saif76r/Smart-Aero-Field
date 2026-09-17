import React, { useState } from 'react';
import { 
  Scan, 
  BookOpen, 
  FlaskRound as Flask, 
  CloudSun, 
  ShoppingBag, 
  TrendingUp, 
  Calculator, 
  Headphones, 
  Sparkles,
  ChevronRight,
  Settings,
  Globe,
  Check
} from 'lucide-react';
import { Language } from '../types';
import { DynamicIconPic } from './DynamicIconPic';
import { SettingsModal } from './SettingsModal';

interface HubViewProps {
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  onSelectService: (serviceId: string) => void;
  onOpenChat: () => void;
  currentDistrict?: string;
  onChangeDistrict?: (district: string) => void;
}

export const HubView: React.FC<HubViewProps> = ({
  language,
  onChangeLanguage,
  onSelectService,
  onOpenChat,
  currentDistrict = 'Rajshahi',
  onChangeDistrict,
}) => {
  const isBn = language === 'bn';
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const services = [
    {
      id: 'settings',
      nameEn: 'Settings & Language',
      nameBn: 'সেটিংস ও ভাষা পরিবর্তন',
      descEn: 'Switch English/Bangla & app preferences',
      descBn: 'বাংলা অথবা ইংরেজি ভাষা নির্বাচন করুন',
      icon: (
        <div className="w-full h-full bg-[#1E5128] flex items-center justify-center text-white">
          <Settings className="w-6 h-6 text-[#D8E9A8]" />
        </div>
      ),
      badge: language === 'bn' ? '🇧🇩 বাংলা' : '🌐 English',
      color: 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-200',
      action: () => setIsSettingsOpen(true),
    },
    {
      id: 'disease',
      nameEn: 'Disease Detection',
      nameBn: 'রোগ শনাক্তকরণ',
      descEn: 'Instant AI leaf pathology diagnosis',
      descBn: 'ক্যামেরা দিয়ে পাতার রোগ শনাক্ত ও প্রতিকার',
      icon: <DynamicIconPic name="disease" alt="Disease" className="w-full h-full object-cover" />,
      badge: 'AI Vision',
      color: 'bg-emerald-50 border-emerald-200',
    },
    {
      id: 'crops',
      nameEn: 'Crop Information',
      nameBn: 'ফসলের তথ্য ভাণ্ডার',
      descEn: 'Guides for Rice, Wheat, Maize, Potato',
      descBn: 'ধান, গম, ভুট্টা, আলু চাষের পূর্ণাঙ্গ গাইডলাইন',
      icon: (
        <img
          src="/images/crop_rice.jpg"
          alt="Crop Information"
          className="w-full h-full object-cover"
        />
      ),
      color: 'bg-green-50 border-green-200',
    },
    {
      id: 'soil',
      nameEn: 'Soil Test & Health',
      nameBn: 'মাটি পরীক্ষা ও স্বাস্থ্য',
      descEn: 'Texture, pH, NPK balance analysis',
      descBn: 'মাটির ধরন ও সারের সঠিক অনুপাত যাচাই',
      icon: <DynamicIconPic name="soil" alt="Soil" className="w-full h-full object-cover" />,
      color: 'bg-amber-50 border-amber-200',
    },
    {
      id: 'weather',
      nameEn: 'NASA Satellite Weather',
      nameBn: 'নাসা স্যাটেলাইট আবহাওয়া',
      descEn: 'POWER agro-climatology & 7-day forecast',
      descBn: 'বৃষ্টিপাত, তাপমাত্রা ও মাটির আর্দ্রতা রিপোর্ট',
      icon: (
        <div className="w-full h-full bg-[#0b3d91] flex items-center justify-center">
          <img
            src="/images/nasa_logo.svg"
            alt="NASA Logo"
            className="w-full h-full object-cover scale-[1.08]"
          />
        </div>
      ),
      badge: 'Live NASA',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      id: 'market',
      nameEn: 'Daily Market Prices',
      nameBn: 'দৈনিক বাজার দর',
      descEn: 'District wholesale rates in BDT',
      descBn: 'ধান, আলু, সবজি ও ফলের জেলাভিত্তিক বাজার দর',
      icon: <DynamicIconPic name="market" alt="Market" className="w-full h-full object-cover" />,
      color: 'bg-purple-50 border-purple-200',
    },
    {
      id: 'yield',
      nameEn: 'Yield Max Wizard',
      nameBn: 'ফলন বৃদ্ধি ক্যালকুলেটর',
      descEn: '5-step crop harvest optimizer',
      descBn: 'সর্বোচ্চ ফলন নিশ্চিতকরণ ও ঝুঁকি হ্রাস',
      icon: <DynamicIconPic name="yield" alt="Yield" className="w-full h-full object-cover" />,
      badge: 'Top Yield',
      color: 'bg-teal-50 border-teal-200',
    },
    {
      id: 'supplies',
      nameEn: 'Input Supplies Calculator',
      nameBn: 'সার ও বীজ ক্যালকুলেটর',
      descEn: 'Estimate fertilizer and seed costs',
      descBn: 'জমির মাপ অনুযায়ী প্রয়োজনীয় সার ও বীজের খরচ',
      icon: (
        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white">
          <Calculator className="w-6 h-6 text-white stroke-[2.2]" />
        </div>
      ),
      color: 'bg-indigo-50 border-indigo-200',
    },
    {
      id: 'chat',
      nameEn: 'Gemini AI Agronomist',
      nameBn: 'এআই কৃষি বিশেষজ্ঞ',
      descEn: '24/7 dedicated agronomy consultation',
      descBn: 'ফসলের রোগ ও সারের বিষয়ে সরাসরি প্রশ্নোত্তর',
      icon: <DynamicIconPic name="bot" alt="AI Agronomist" className="w-full h-full object-cover" />,
      badge: 'Gemini 3.8',
      color: 'bg-yellow-50 border-yellow-200',
      action: onOpenChat,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-[#1E5128] text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#4E9F3D]/25 rounded-full blur-xl pointer-events-none" />
        <h2 className="text-xl font-black relative z-10">
          {isBn ? 'সার্ভিস ও ফিচারসমূহ' : 'Farmer Tools & Services Hub'}
        </h2>
        <p className="text-xs text-green-100 mt-1 relative z-10">
          {isBn
            ? 'ক্ষুদ্র কৃষকদের জন্য আধুনিক স্যাটেলাইট, এআই প্রযুক্তি ও ভাষা সেটিংস'
            : 'Access modern agro-intelligence, diagnostic tools, and language preferences.'}
        </p>
      </div>

      {/* Quick Language Selector Bar directly in Services */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#1E5128]/10 text-[#1E5128] flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5 text-[#1E5128]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                {isBn ? 'ভাষা নির্বাচন / Language' : 'App Language / ভাষা'}
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                {language === 'bn' ? 'বাংলা' : 'English'}
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              {isBn ? 'বাংলা অথবা ইংরেজিতে পুরো সাইট দেখতে সিলেক্ট করুন' : 'Select English or Bangla to switch the whole site'}
            </p>
          </div>
        </div>

        <div className="flex items-center bg-gray-100/80 p-1 rounded-xl gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onChangeLanguage('bn')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              language === 'bn'
                ? 'bg-[#1E5128] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>🇧🇩 বাংলা</span>
            {language === 'bn' && <Check className="w-3 h-3 text-[#D8E9A8]" />}
          </button>

          <button
            type="button"
            onClick={() => onChangeLanguage('en')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              language === 'en'
                ? 'bg-[#1E5128] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>🌐 English</span>
            {language === 'en' && <Check className="w-3 h-3 text-[#D8E9A8]" />}
          </button>
        </div>
      </div>

      {/* Grid of Services (Including Settings & Language) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {services.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (item.action) {
                item.action();
              } else {
                onSelectService(item.id);
              }
            }}
            className={`p-4 rounded-2xl border ${item.color} shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group bg-white`}
          >
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform border border-gray-200 overflow-hidden">
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#1E5128] transition-colors truncate">
                    {isBn ? item.nameBn : item.nameEn}
                  </h3>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#1E5128] text-[#D8E9A8] flex-shrink-0 whitespace-nowrap">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug truncate">
                  {isBn ? item.descBn : item.descEn}
                </p>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1E5128] group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
          </div>
        ))}
      </div>

      {/* Full Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        onChangeLanguage={onChangeLanguage}
        currentDistrict={currentDistrict}
        onChangeDistrict={onChangeDistrict}
      />
    </div>
  );
};
