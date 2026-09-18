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
  Settings
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
      id: 'disease',
      nameEn: 'Disease Detection',
      nameBn: 'রোগ শনাক্তকরণ',
      descEn: 'Instant AI leaf pathology diagnosis',
      descBn: 'ক্যামেরা দিয়ে পাতার রোগ শনাক্ত ও প্রতিকার',
      icon: <DynamicIconPic name="disease" alt="Disease" className="w-full h-full object-cover" />,
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
      color: 'bg-teal-50 border-teal-200',
    },
    {
      id: 'supplies',
      nameEn: 'Supplies & Profit/Loss Calculator',
      nameBn: 'উপকরণ খরচ ও লাভ-ক্ষতি ক্যালকুলেটর',
      descEn: 'Fertilizer, seed, pesticide expenses & crop profit/loss',
      descBn: 'সার, কীটনাশক, বীজ ক্রয় ও ফসল বিক্রির লাভ-ক্ষতির হিসাব',
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
            ? 'ক্ষুদ্র কৃষকদের জন্য আধুনিক স্যাটেলাইট ও এআই প্রযুক্তি সেবা'
            : 'Access modern agro-intelligence, diagnostic tools, and advisory services.'}
        </p>
      </div>

      {/* Grid of 8 Core Agricultural Services */}
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
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#1E5128] transition-colors truncate">
                  {isBn ? item.nameBn : item.nameEn}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug truncate">
                  {isBn ? item.descBn : item.descEn}
                </p>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1E5128] group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
          </div>
        ))}
      </div>

      {/* Settings & Language Option Placed at the Very Bottom (Sober Niche) */}
      <div
        id="bottom-settings-language-card"
        onClick={() => setIsSettingsOpen(true)}
        className="p-4 rounded-2xl border-2 border-emerald-300/80 bg-white hover:bg-emerald-50/40 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
      >
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#1E5128] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Settings className="w-6 h-6 text-[#D8E9A8]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-[#1E5128] transition-colors truncate">
              {isBn ? 'সেটিংস ও ভাষা পরিবর্তন' : 'Settings & Language'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 leading-snug truncate">
              {isBn
                ? 'বাংলা অথবা ইংরেজি ভাষা ও অ্যাপের পছন্দসমূহ পরিবর্তন করুন'
                : 'Switch English/Bangla & app preferences'}
            </p>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1E5128] group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
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
