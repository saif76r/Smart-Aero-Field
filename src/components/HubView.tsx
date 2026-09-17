import React from 'react';
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
  ChevronRight
} from 'lucide-react';
import { Language } from '../types';
import { DynamicIconPic } from './DynamicIconPic';

interface HubViewProps {
  language: Language;
  onSelectService: (serviceId: string) => void;
  onOpenChat: () => void;
}

export const HubView: React.FC<HubViewProps> = ({
  language,
  onSelectService,
  onOpenChat,
}) => {
  const isBn = language === 'bn';

  const services = [
    {
      id: 'disease',
      nameEn: 'Disease Detection',
      nameBn: 'রোগ শনাক্তকরণ',
      descEn: 'Instant AI leaf pathology diagnosis',
      descBn: 'ক্যামেরা দিয়ে পাতার রোগ শনাক্ত ও প্রতিকার',
      icon: <DynamicIconPic name="disease" alt="Disease" className="w-6 h-6 object-cover rounded-lg" />,
      badge: 'AI Vision',
      color: 'bg-emerald-50 border-emerald-200',
    },
    {
      id: 'crops',
      nameEn: 'Crop Information',
      nameBn: 'ফসলের তথ্য ভাণ্ডার',
      descEn: 'Guides for Rice, Wheat, Maize, Potato',
      descBn: 'ধান, গম, ভুট্টা, আলু চাষের পূর্ণাঙ্গ গাইডলাইন',
      icon: <BookOpen className="w-6 h-6 text-green-700" />,
      color: 'bg-green-50 border-green-200',
    },
    {
      id: 'soil',
      nameEn: 'Soil Test & Health',
      nameBn: 'মাটি পরীক্ষা ও স্বাস্থ্য',
      descEn: 'Texture, pH, NPK balance analysis',
      descBn: 'মাটির ধরন ও সারের সঠিক অনুপাত যাচাই',
      icon: <DynamicIconPic name="soil" alt="Soil" className="w-6 h-6 object-cover rounded-lg" />,
      color: 'bg-amber-50 border-amber-200',
    },
    {
      id: 'weather',
      nameEn: 'NASA Satellite Weather',
      nameBn: 'নাসা স্যাটেলাইট আবহাওয়া',
      descEn: 'POWER agro-climatology & 7-day forecast',
      descBn: 'বৃষ্টিপাত, তাপমাত্রা ও মাটির আর্দ্রতা রিপোর্ট',
      icon: (
        <div className="w-7 h-7 rounded-full bg-white p-0.5 shadow-2xs flex items-center justify-center">
          <img src="/images/nasa_logo.svg" alt="NASA" className="w-full h-full object-contain" />
        </div>
      ),
      badge: 'Live NASA',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      id: 'market',
      nameEn: 'Market Price (বাজার দর)',
      nameBn: 'দৈনিক বাজার দর',
      descEn: 'District wholesale rates in BDT',
      descBn: 'ধান, আলু, সবজি ও ফলের জেলাভিত্তিক বাজার দর',
      icon: <DynamicIconPic name="market" alt="Market" className="w-6 h-6 object-cover rounded-lg" />,
      color: 'bg-purple-50 border-purple-200',
    },
    {
      id: 'yield',
      nameEn: 'Yield Max Wizard',
      nameBn: 'ফলন বৃদ্ধি ক্যালকুলেটর',
      descEn: '5-step crop harvest optimizer',
      descBn: 'সর্বোচ্চ ফলন নিশ্চিতকরণ ও ঝুঁকি হ্রাস',
      icon: <DynamicIconPic name="yield" alt="Yield" className="w-6 h-6 object-cover rounded-lg" />,
      badge: 'Top Yield',
      color: 'bg-teal-50 border-teal-200',
    },
    {
      id: 'supplies',
      nameEn: 'Input Supplies Calculator',
      nameBn: 'সার ও বীজ ক্যালকুলেটর',
      descEn: 'Estimate fertilizer and seed costs',
      descBn: 'জমির মাপ অনুযায়ী প্রয়োজনীয় সার ও বীজের খরচ',
      icon: <Calculator className="w-6 h-6 text-indigo-700" />,
      color: 'bg-indigo-50 border-indigo-200',
    },
    {
      id: 'chat',
      nameEn: 'Gemini AI Agronomist',
      nameBn: 'এআই কৃষি বিশেষজ্ঞ',
      descEn: '24/7 dedicated agronomy consultation',
      descBn: 'ফসলের রোগ ও সারের বিষয়ে সরাসরি প্রশ্নোত্তর',
      icon: <DynamicIconPic name="bot" alt="AI Agronomist" className="w-6 h-6 object-cover rounded-full" />,
      badge: 'Gemini 3.8',
      color: 'bg-yellow-50 border-yellow-200',
      action: onOpenChat,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-[#1E5128] text-white p-5 rounded-2xl shadow-sm">
        <h2 className="text-xl font-black">
          {isBn ? 'সার্ভিস ও ফিচারসমূহ' : 'Farmer Tools & Agricultural Hub'}
        </h2>
        <p className="text-xs text-green-100 mt-1">
          {isBn
            ? 'ক্ষুদ্র কৃষকদের জন্য আধুনিক স্যাটেলাইট ও এআই প্রযুক্তির সকল সুবিধা'
            : 'Access modern agro-intelligence, market rates, diagnostic tools, and advisory services.'}
        </p>
      </div>

      {/* Grid of 8 Services (Matching Screenshot 10) */}
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
            className={`p-4 rounded-2xl border ${item.color} shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group bg-white`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform border border-gray-100">
                {item.icon}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#1E5128] transition-colors">
                    {isBn ? item.nameBn : item.nameEn}
                  </h3>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#1E5128] text-[#D8E9A8]">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                  {isBn ? item.descBn : item.descEn}
                </p>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1E5128] group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
