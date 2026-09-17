import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Calendar, 
  Droplet, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  ShieldAlert,
  Sprout
} from 'lucide-react';
import { Language, CropGuide } from '../types';
import { BANGLADESH_CROPS } from '../data/bangladeshAgriData';

interface CropInfoViewProps {
  language: Language;
  onBack: () => void;
  selectedCropId?: string;
  onOpenChatWithTopic?: (topic: string) => void;
}

export const CropInfoView: React.FC<CropInfoViewProps> = ({
  language,
  onBack,
  selectedCropId,
  onOpenChatWithTopic,
}) => {
  const isBn = language === 'bn';
  const [activeCrop, setActiveCrop] = useState<CropGuide | null>(
    selectedCropId ? BANGLADESH_CROPS.find((c) => c.id === selectedCropId) || BANGLADESH_CROPS[0] : null
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredCrops = BANGLADESH_CROPS.filter((crop) => {
    const matchSearch =
      crop.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.nameBn.includes(searchTerm);
    return matchSearch;
  });

  // If a crop is selected, show detailed guide (Screenshot 12)
  if (activeCrop) {
    return (
      <div className="space-y-4 pb-20">
        {/* Top Header */}
        <div className="flex items-center space-x-3 bg-[#1E5128] text-white p-4 rounded-2xl shadow-sm">
          <button
            type="button"
            onClick={() => setActiveCrop(null)}
            className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-black">{isBn ? activeCrop.nameBn : activeCrop.nameEn}</h2>
            <p className="text-xs text-green-200">{isBn ? 'পূর্ণাঙ্গ আধুনিক চাষ নির্দেশিকা' : 'Complete Cultivation & Pest Guide'}</p>
          </div>
        </div>

        {/* Hero Crop Photo */}
        <div className="relative rounded-2xl overflow-hidden h-48 sm:h-56 bg-gray-900 border border-gray-200 shadow-sm">
          <img
            src={activeCrop.image}
            alt={activeCrop.nameEn}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
            <span className="bg-[#4E9F3D] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              {isBn ? 'উপযুক্ত মৌসুম: ' : 'Best Season: '} {activeCrop.bestSeason}
            </span>
          </div>
        </div>

        {/* Cultivation Time Section (Matching Screenshot 12) */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#1E5128]" />
            <span>{isBn ? 'চাষের সঠিক সময় (Cultivation Time)' : 'Optimal Cultivation Calendar'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {activeCrop.cultivationTime.aus && (
              <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                <span className="text-xs font-bold text-[#1E5128] block">{isBn ? 'আউশ মৌসুম' : 'Aus Season'}</span>
                <span className="text-xs font-medium text-gray-700">{activeCrop.cultivationTime.aus}</span>
              </div>
            )}
            {activeCrop.cultivationTime.aman && (
              <div className="bg-green-50/60 p-3 rounded-xl border border-green-100">
                <span className="text-xs font-bold text-[#1E5128] block">{isBn ? 'রোপা আমন মৌসুম' : 'Aman Season'}</span>
                <span className="text-xs font-medium text-gray-700">{activeCrop.cultivationTime.aman}</span>
              </div>
            )}
            {activeCrop.cultivationTime.boro && (
              <div className="bg-teal-50/60 p-3 rounded-xl border border-teal-100">
                <span className="text-xs font-bold text-[#1E5128] block">{isBn ? 'বোরো ও রবি মৌসুম' : 'Boro & Rabi Season'}</span>
                <span className="text-xs font-medium text-gray-700">{activeCrop.cultivationTime.boro}</span>
              </div>
            )}
          </div>
        </div>

        {/* Soil & Seed Requirements */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-[#1E5128]" />
            <span>{isBn ? 'মাটি ও বীজ প্রস্তুতি (Soil & Seed)' : 'Soil & Seed Preparation'}</span>
          </h3>
          <div className="space-y-2 text-xs sm:text-sm text-gray-800 leading-relaxed">
            <p><strong className="text-gray-900">{isBn ? 'মাটির ধরন: ' : 'Soil Type: '}</strong>{activeCrop.soil}</p>
            <p><strong className="text-gray-900">{isBn ? 'উন্নত জাত ও বীজ: ' : 'Certified Seed: '}</strong>{activeCrop.seed}</p>
          </div>
        </div>

        {/* Fertilizer & Water Management (Screenshot 12) */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-[#1E5128]" />
            <span>{isBn ? 'সারের মাত্রা ও সেচ ব্যবস্থাপনা' : 'Fertilizer & Irrigation Protocol'}</span>
          </h3>
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs sm:text-sm text-gray-900">
            <strong>{isBn ? 'সারের সুপারিশ (বিঘা/একর প্রতি): ' : 'Fertilizer Doses: '}</strong>
            {activeCrop.fertilizer}
          </div>
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs sm:text-sm text-gray-900">
            <strong>{isBn ? 'সেচ নিয়ম: ' : 'Irrigation: '}</strong>
            {activeCrop.waterManagement}
          </div>
        </div>

        {/* Pests & Diseases */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>{isBn ? 'প্রধান ক্ষতিকর পোকা ও রোগসমূহ' : 'Major Pests & Diseases'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3 rounded-xl bg-red-50/60 border border-red-100">
              <span className="font-bold text-red-900 block mb-1">{isBn ? 'ক্ষতিকর পোকা' : 'Pests'}</span>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {activeCrop.pests.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100">
              <span className="font-bold text-orange-900 block mb-1">{isBn ? 'ছত্রাক ও রোগ' : 'Diseases'}</span>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {activeCrop.diseases.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onOpenChatWithTopic?.(`Tell me how to protect my ${activeCrop.nameEn} crops from ${activeCrop.pests[0]} and ${activeCrop.diseases[0]}`)}
              className="w-full py-2.5 bg-[#1E5128] hover:bg-[#163e1e] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{isBn ? 'এই ফসলের জন্য এআই কৃষিবিদের পরামর্শ নিন' : 'Ask AI Agronomist for this crop'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Crop Encyclopedia List (Screenshot 11)
  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-3 bg-[#1E5128] text-white p-4 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-black">{isBn ? 'ফসলের তথ্য ভাণ্ডার' : 'Crop Cultivation Guides'}</h2>
          <p className="text-xs text-green-200">
            {isBn ? 'বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট ও ব্রি ভিত্তিক তথ্য' : 'Standardized agricultural guidelines for Bangladesh'}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={isBn ? 'ফসল খুঁজুন (যেমন ধান, গম, ভুট্টা, আলু)...' : 'Search crop (e.g. Rice, Wheat, Corn)...'}
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1E5128]"
        />
      </div>

      {/* Crops Cards List (Matching Screenshot 11) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredCrops.map((crop) => (
          <div
            key={crop.id}
            onClick={() => setActiveCrop(crop)}
            className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center space-x-3.5 group"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-inner">
              <img
                src={crop.image}
                alt={crop.nameEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#1E5128] transition-colors">
                {isBn ? crop.nameBn : crop.nameEn}
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {isBn ? 'মৌসুম: ' : 'Season: '} {crop.bestSeason}
              </p>
              <div className="mt-1.5 flex items-center text-[11px] font-bold text-[#1E5128]">
                <span>{isBn ? 'গাইড দেখুন' : 'View Guide'}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
