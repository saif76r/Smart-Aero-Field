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
  Sprout,
  PackageCheck,
  Wheat
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
    selectedCropId ? BANGLADESH_CROPS.find((c) => c.id === selectedCropId) || null : null
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { id: 'All', labelEn: 'All Crops', labelBn: 'সকল ফসল' },
    { id: 'Cereals', labelEn: 'Cereals', labelBn: 'দানাশস্য' },
    { id: 'Vegetables', labelEn: 'Vegetables', labelBn: 'শাকসবজি' },
    { id: 'Cash Crops', labelEn: 'Cash Crops', labelBn: 'অর্থকরী' },
    { id: 'Oilseeds', labelEn: 'Oilseeds', labelBn: 'তেলবীজ' },
    { id: 'Fruits', labelEn: 'Fruits', labelBn: 'ফলমূল' },
    { id: 'Spices', labelEn: 'Spices', labelBn: 'মসলা' },
  ];

  const filteredCrops = BANGLADESH_CROPS.filter((crop) => {
    const matchSearch =
      crop.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.nameBn.includes(searchTerm) ||
      crop.bestSeason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCategory = selectedCategory === 'All' || crop.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // If a crop is selected, show comprehensive detailed guide
  if (activeCrop) {
    return (
      <div className="space-y-4 pb-24">
        {/* Top Header */}
        <div className="flex items-center space-x-3 bg-[#1E5128] text-white p-4 rounded-2xl shadow-sm">
          <button
            type="button"
            onClick={() => setActiveCrop(null)}
            className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black truncate">{isBn ? activeCrop.nameBn : activeCrop.nameEn}</h2>
              {activeCrop.category && (
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  {isBn ? (activeCrop.categoryBn || activeCrop.category) : activeCrop.category}
                </span>
              )}
            </div>
            <p className="text-xs text-green-200">{isBn ? 'পূর্ণাঙ্গ আধুনিক চাষ নির্দেশিকা ও রোগবালাই দমন' : 'Complete Cultivation & Pest Management Guide'}</p>
          </div>
        </div>

        {/* Hero Crop Photo */}
        <div className="relative rounded-2xl overflow-hidden h-52 sm:h-64 bg-gray-900 border border-gray-200 shadow-sm">
          <img
            src={activeCrop.image}
            alt={activeCrop.nameEn}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#4E9F3D] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                {isBn ? 'উপযুক্ত মৌসুম: ' : 'Best Season: '} {activeCrop.bestSeason}
              </span>
              <span className="bg-black/60 backdrop-blur-xs text-green-200 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20">
                {isBn ? 'BARI/BRRI নির্দেশিত' : 'BARI / BRRI Standard'}
              </span>
            </div>
          </div>
        </div>

        {/* Cultivation Time Calendar */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#1E5128]" />
            <span>{isBn ? 'চাষের সঠিক সময় (Cultivation Calendar)' : 'Optimal Cultivation Calendar'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {activeCrop.cultivationTime.aus && (
              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                <span className="text-xs font-bold text-[#1E5128] block">{isBn ? 'আউশ / গ্রীষ্মকাল' : 'Aus / Summer'}</span>
                <span className="text-xs font-medium text-gray-700">{activeCrop.cultivationTime.aus}</span>
              </div>
            )}
            {activeCrop.cultivationTime.aman && (
              <div className="bg-green-50/70 p-3 rounded-xl border border-green-100">
                <span className="text-xs font-bold text-[#1E5128] block">{isBn ? 'রোপা আমন / বর্ষাকাল' : 'Aman / Monsoon'}</span>
                <span className="text-xs font-medium text-gray-700">{activeCrop.cultivationTime.aman}</span>
              </div>
            )}
            {activeCrop.cultivationTime.boro && (
              <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-100">
                <span className="text-xs font-bold text-[#1E5128] block">{isBn ? 'বোরো ও রবি মৌসুম' : 'Boro & Rabi Season'}</span>
                <span className="text-xs font-medium text-gray-700">{activeCrop.cultivationTime.boro}</span>
              </div>
            )}
            {activeCrop.cultivationTime.rabi && !activeCrop.cultivationTime.boro && (
              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100">
                <span className="text-xs font-bold text-amber-900 block">{isBn ? 'রবি (শীতকাল)' : 'Rabi Season'}</span>
                <span className="text-xs font-medium text-gray-700">{activeCrop.cultivationTime.rabi}</span>
              </div>
            )}
            {activeCrop.cultivationTime.kharif && (
              <div className="bg-lime-50/70 p-3 rounded-xl border border-lime-100">
                <span className="text-xs font-bold text-lime-900 block">{isBn ? 'খরিপ মৌসুম' : 'Kharif Season'}</span>
                <span className="text-xs font-medium text-gray-700">{activeCrop.cultivationTime.kharif}</span>
              </div>
            )}
          </div>
        </div>

        {/* Soil & Seed Preparation */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-[#1E5128]" />
            <span>{isBn ? 'মাটি ও বীজ প্রস্তুতি (Soil & Seed)' : 'Soil & Seed Preparation'}</span>
          </h3>
          <div className="space-y-2.5 text-xs sm:text-sm text-gray-800 leading-relaxed">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <strong className="text-gray-900 block mb-0.5">{isBn ? 'মাটির ধরন ও জমি তৈরি: ' : 'Soil Type & Preparation: '}</strong>
              <p className="text-gray-700">{activeCrop.soil}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <strong className="text-gray-900 block mb-0.5">{isBn ? 'উন্নত জাত ও বীজ শোধন: ' : 'High-Yield Varieties & Seed Treatment: '}</strong>
              <p className="text-gray-700">{activeCrop.seed}</p>
            </div>
          </div>
        </div>

        {/* Fertilizer & Water Management */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-[#1E5128]" />
            <span>{isBn ? 'সারের মাত্রা ও সেচ ব্যবস্থাপনা' : 'Fertilizer & Irrigation Protocol'}</span>
          </h3>
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs sm:text-sm text-gray-900">
            <strong className="block text-amber-950 mb-1">{isBn ? 'সারের সুপারিশ (বিঘা/একর প্রতি): ' : 'Fertilizer Doses (per Acre): '}</strong>
            <p className="text-gray-800">{activeCrop.fertilizer}</p>
          </div>
          <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs sm:text-sm text-gray-900">
            <strong className="block text-blue-950 mb-1">{isBn ? 'সেচ ও পানি নিষ্কাশন নিয়ম: ' : 'Irrigation & Drainage: '}</strong>
            <p className="text-gray-800">{activeCrop.waterManagement}</p>
          </div>
        </div>

        {/* Pests & Diseases */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>{isBn ? 'প্রধান ক্ষতিকর পোকা ও রোগসমূহ' : 'Major Pests & Diseases'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200">
              <span className="font-bold text-red-900 block mb-1.5">{isBn ? 'প্রধান ক্ষতিকর পোকা' : 'Harmful Pests'}</span>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {activeCrop.pests.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200">
              <span className="font-bold text-orange-900 block mb-1.5">{isBn ? 'প্রধান রোগ ও ছত্রাক' : 'Common Diseases'}</span>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {activeCrop.diseases.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Integrated Prevention Tips */}
          {activeCrop.prevention && activeCrop.prevention.length > 0 && (
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 mt-2">
              <span className="font-bold text-emerald-950 block mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'সমন্বিত রোগ ও পোকা দমন টিপস (IPM):' : 'Integrated Pest Management (IPM) Tips:'}</span>
              </span>
              <ul className="list-disc list-inside text-gray-800 text-xs sm:text-sm space-y-1">
                {activeCrop.prevention.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Ask AI Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onOpenChatWithTopic?.(`Tell me how to protect my ${activeCrop.nameEn} crops from pests and diseases with exact organic and chemical solutions in Bangladesh.`)}
              className="w-full py-3 bg-[#1E5128] hover:bg-[#163e1e] active:scale-[0.99] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{isBn ? `${activeCrop.nameBn} সুরক্ষায় এআই কৃষিবিদের সাথে কথা বলুন` : `Ask AI Agronomist for ${activeCrop.nameEn} Protection`}</span>
            </button>
          </div>
        </div>

        {/* Harvesting & Storage */}
        {(activeCrop.harvesting || activeCrop.storage) && (
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-[#1E5128]" />
              <span>{isBn ? 'ফসল কর্তন ও সংরক্ষণ (Harvesting & Storage)' : 'Harvesting & Storage Protocol'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100">
                <strong className="block text-amber-950 mb-1">{isBn ? 'ফসল তোলার সঠিক সময়:' : 'Optimal Harvest Time:'}</strong>
                <p className="text-gray-700 leading-relaxed">{activeCrop.harvesting}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100">
                <strong className="block text-teal-950 mb-1">{isBn ? 'সংরক্ষণ ও গুদামজাতকরণ:' : 'Storage & Processing:'}</strong>
                <p className="text-gray-700 leading-relaxed">{activeCrop.storage}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Crop Encyclopedia Main List View
  return (
    <div className="space-y-4 pb-24">
      {/* Header Banner */}
      <div className="flex items-center space-x-3 bg-[#1E5128] text-white p-4 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-black">{isBn ? 'ফসলের তথ্য ভাণ্ডার' : 'Crop Cultivation Guides'}</h2>
          <p className="text-xs text-green-200">
            {isBn ? 'বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট (BARI) ও ব্রি (BRRI) ভিত্তিক ১২টি প্রধান ফসলের গাইড' : 'Standardized agricultural guidelines for Bangladesh major crops'}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={isBn ? 'ফসল খুঁজুন (যেমন ধান, গম, আলু, ভুট্টা, পাট, সরিষা)...' : 'Search crop (e.g. Rice, Wheat, Potato, Maize, Jute, Mustard)...'}
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1E5128] shadow-2xs"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-[#1E5128] text-white shadow-sm' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {isBn ? cat.labelBn : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* Crop Count Counter */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>{isBn ? `মোট ফসল: ${filteredCrops.length} টি` : `Showing ${filteredCrops.length} crops`}</span>
        {searchTerm && (
          <button 
            type="button" 
            onClick={() => setSearchTerm('')} 
            className="text-[#1E5128] font-bold hover:underline cursor-pointer"
          >
            {isBn ? 'সার্চ ক্লিয়ার করুন' : 'Clear Search'}
          </button>
        )}
      </div>

      {/* Crops Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredCrops.map((crop) => (
          <div
            key={crop.id}
            onClick={() => setActiveCrop(crop)}
            className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex items-center space-x-3.5 group"
          >
            {/* Authentic Crop Photo Thumbnail */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-inner relative">
              <img
                src={crop.image}
                alt={crop.nameEn}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
              {crop.category && (
                <span className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs text-[9px] text-white font-bold px-1.5 py-0.2 rounded">
                  {isBn ? (crop.categoryBn || crop.category) : crop.category}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#1E5128] transition-colors truncate">
                {isBn ? crop.nameBn : crop.nameEn}
                <span className="text-xs font-normal text-gray-500 ml-1.5">
                  ({isBn ? crop.nameEn : crop.nameBn})
                </span>
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                <span className="font-medium text-gray-700">{isBn ? 'মৌসুম: ' : 'Season: '}</span>
                {crop.bestSeason}
              </p>
              <div className="mt-2 flex items-center text-[11px] font-bold text-[#1E5128]">
                <span>{isBn ? 'পূর্ণাঙ্গ গাইড দেখুন' : 'View Full Guide'}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
          <p className="text-gray-500 text-sm">{isBn ? 'কোনো ফসল খুঁজে পাওয়া যায়নি।' : 'No crops found matching your search.'}</p>
          <button
            type="button"
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
            className="mt-3 text-xs font-bold text-[#1E5128] hover:underline cursor-pointer"
          >
            {isBn ? 'সব ফসল দেখুন' : 'View all crops'}
          </button>
        </div>
      )}
    </div>
  );
};
