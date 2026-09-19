import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Settings, 
  LogOut,
  Camera,
  Edit3,
  Activity,
  Leaf,
  Droplets,
  TrendingUp,
  Coins,
  Phone,
  ShieldCheck,
  ChevronRight,
  Calculator,
  Plus
} from 'lucide-react';
import { Language, FarmerUser } from '../types';
import { ProfileEditModal } from './ProfileEditModal';

interface FarmerProfileViewProps {
  language: Language;
  user?: FarmerUser | null;
  onUpdateUser?: (updated: FarmerUser) => Promise<void> | void;
  onOpenChatWithTopic?: (topic: string) => void;
  onOpenSettings?: () => void;
  onLogout?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const FarmerProfileView: React.FC<FarmerProfileViewProps> = ({
  language,
  user,
  onUpdateUser,
  onOpenChatWithTopic,
  onOpenSettings,
  onLogout,
  onNavigateToTab,
}) => {
  const isBn = language === 'bn';
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const displayName = user?.name || 'Md. Nasirul Islam';
  const displayDistrict = user?.district || 'Rajshahi';
  const displayLand = user?.landSize || '3.5';
  const displayExperience = user?.experienceYears || '12';
  const displayPhoto = user?.photoUrl || '';
  const displayBio = user?.bio || (isBn ? 'আধুনিক প্রযুক্তি ও সুষম সার ব্যবহারে সমৃদ্ধ পরিবেশবান্ধব খামার।' : 'Progressive farmer practicing modern climate-resilient agriculture.');

  // Format crops list display
  const primaryCropsList = user?.primaryCrops && user.primaryCrops.length > 0
    ? user.primaryCrops.map(c => {
        if (c === 'rice') return isBn ? 'আমন ধান' : 'Aman Rice';
        if (c === 'potato') return isBn ? 'আলু' : 'Potato';
        if (c === 'wheat') return isBn ? 'গম' : 'Wheat';
        if (c === 'maize') return isBn ? 'ভুট্টা' : 'Maize';
        if (c === 'jute') return isBn ? 'পাট' : 'Jute';
        if (c === 'mustard') return isBn ? 'সরিষা' : 'Mustard';
        if (c === 'chili') return isBn ? 'মরিচ' : 'Chili';
        if (c === 'tomato') return isBn ? 'টমেটো' : 'Tomato';
        if (c === 'eggplant') return isBn ? 'বেগুন' : 'Eggplant';
        if (c === 'mango') return isBn ? 'আম' : 'Mango';
        return c;
      }).join(', ')
    : (isBn ? 'আমন ধান ও আলু' : 'Aman Rice & Potato');

  const handleSaveProfile = async (updated: FarmerUser) => {
    if (onUpdateUser) {
      await onUpdateUser(updated);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Profile Card Header with Picture Upload & Edit Option */}
      <div className="bg-[#1E5128] text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
        {/* Background decorative leaf shimmer */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            {/* Avatar with Camera badge */}
            <div className="relative group flex-shrink-0">
              <div 
                onClick={() => setIsEditModalOpen(true)}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white/20 border-2 border-[#D8E9A8] p-0.5 flex items-center justify-center overflow-hidden text-white shadow-md cursor-pointer hover:border-white transition-all"
                title={isBn ? 'ছবি পরিবর্তন করতে ক্লিক করুন' : 'Click to change photo'}
              >
                {displayPhoto ? (
                  <img
                    src={displayPhoto}
                    alt={displayName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="w-9 h-9 text-[#D8E9A8]" />
                )}
              </div>

              {/* Quick Camera Overlay Button */}
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="absolute -bottom-1 -right-1 p-1.5 bg-[#D8E9A8] hover:bg-white text-[#1E5128] rounded-full shadow-md border-2 border-[#1E5128] transition-transform active:scale-90 cursor-pointer"
                title={isBn ? 'ছবি ও প্রোফাইল এডিট' : 'Edit Photo & Profile'}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Name & Farmer Details */}
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-white leading-tight">{displayName}</h2>
                <span className="bg-[#4E9F3D] text-[10px] font-bold px-2 py-0.5 rounded-full text-white flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-[#D8E9A8]" />
                  <span>{isBn ? 'প্রগতিশীল কৃষক' : 'Verified Farmer'}</span>
                </span>
              </div>
              <p className="text-xs text-green-200 flex items-center mt-0.5">
                <MapPin className="w-3.5 h-3.5 mr-1 text-[#D8E9A8] flex-shrink-0" />
                <span>{displayDistrict}, Bangladesh</span>
              </p>
              <p className="text-[11px] text-green-100 mt-1 leading-snug">
                {isBn 
                  ? `মোট আবাদি জমি: ${displayLand} একর | চলতি ফসল: ${primaryCropsList}` 
                  : `Total Land: ${displayLand} Acres | Crops: ${primaryCropsList}`}
              </p>
            </div>
          </div>

          {/* Edit Profile Action Button */}
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="self-start sm:self-center px-3.5 py-1.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white border border-[#D8E9A8]/40 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#D8E9A8]" />
            <span>{isBn ? 'প্রোফাইল এডিট করুন' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Farmer Bio / Farm Motto */}
        {displayBio && (
          <p className="text-xs text-green-100/90 italic bg-black/15 px-3 py-1.5 rounded-lg mt-3 border border-white/10">
            "{displayBio}"
          </p>
        )}

        {/* Quick Badges */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/20 text-center text-xs">
          <div>
            <span className="text-[10px] text-green-200 block">{isBn ? 'আবাদি জমি' : 'Land Size'}</span>
            <span className="font-bold text-sm text-white">{displayLand} {isBn ? 'একর' : 'Acres'}</span>
          </div>
          <div>
            <span className="text-[10px] text-green-200 block">{isBn ? 'খামার স্কোর' : 'Agri Score'}</span>
            <span className="font-bold text-sm text-[#D8E9A8]">{isBn ? '৯৪ / ১০০' : '94 / 100'}</span>
          </div>
          <div>
            <span className="text-[10px] text-green-200 block">{isBn ? 'কৃষি অভিজ্ঞতা' : 'Experience'}</span>
            <span className="font-bold text-sm text-white">{displayExperience} {isBn ? 'বছর' : 'Yrs'}</span>
          </div>
        </div>
      </div>

      {/* REPLACEMENT SECTION: Smart Farm Health & Advisory Passbook
          (Replaces the previous static 3-item daily task routine card) */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-gray-900 flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-[#1E5128]" />
              <span>{isBn ? 'খামার স্বাস্থ্য ও ডিজিটাল পাসবুক' : 'Farm Health & Agro Passbook'}</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {isBn 
                ? `${displayDistrict} অঞ্চলের উপগ্রহ তথ্য ও মৃত্তিকা বিশ্লেষণ ভিত্তিক` 
                : `Based on satellite telemetry & soil parameters for ${displayDistrict}`}
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{isBn ? 'সক্রিয় পর্যবেক্ষণ' : 'Live Monitored'}</span>
          </span>
        </div>

        {/* 1. Satellite & Soil Vigor Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-medium mb-1">
              <span className="flex items-center">
                <Leaf className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                {isBn ? 'গাছের সতেজতা (NDVI)' : 'Canopy Vigor'}
              </span>
              <span className="font-bold">০.৭৮</span>
            </div>
            <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#1E5128] h-full rounded-full w-[78%]"></div>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-1.5">
              {isBn ? '✓ বলিষ্ঠ সবুজ বৃদ্ধি' : '✓ Robust vegetative growth'}
            </span>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between text-xs text-blue-800 font-medium mb-1">
              <span className="flex items-center">
                <Droplets className="w-3.5 h-3.5 mr-1 text-blue-700" />
                {isBn ? 'মাটির আর্দ্রতা স্তর' : 'Soil Moisture'}
              </span>
              <span className="font-bold">২৩%</span>
            </div>
            <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full w-[65%]"></div>
            </div>
            <span className="text-[10px] text-blue-700 font-semibold block mt-1.5">
              {isBn ? '✓ সন্তোষজনক আর্দ্রতা' : '✓ Adequate soil moisture'}
            </span>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
            <div className="flex items-center justify-between text-xs text-amber-800 font-medium mb-1">
              <span className="flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1 text-amber-700" />
                {isBn ? 'সার পুষ্টি ভারসাম্য' : 'NPK Nutrient Balance'}
              </span>
              <span className="font-bold">{isBn ? 'উত্তম' : 'Optimal'}</span>
            </div>
            <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-600 h-full rounded-full w-[85%]"></div>
            </div>
            <span className="text-[10px] text-amber-700 font-semibold block mt-1.5">
              {isBn ? '✓ নাইট্রোজেন ও পটাশ ব্যালান্সড' : '✓ Nitrogen & Potash in check'}
            </span>
          </div>
        </div>

        {/* 2. Seasonal Advisory Box */}
        <div className="p-3 bg-[#F8FAF9] rounded-xl border border-gray-200 flex items-start space-x-3">
          <div className="p-2 bg-[#1E5128] text-white rounded-lg flex-shrink-0 mt-0.5">
            <Leaf className="w-4 h-4 text-[#D8E9A8]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">
              {isBn ? 'চলতি মৌসুমের অগ্রাধিকার পরামর্শ' : 'Current Seasonal Priority Advice'}
            </h4>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
              {isBn
                ? `আপনার ${displayDistrict} অঞ্চলের আবহাওয়া অনুযায়ী আগামী ৩ দিন শুষ্ক রোদ থাকবে। আমন ধান ও শাকসবজির জমিতে আগাছা পরিষ্কার করুন এবং অতিরিক্ত ইউরিয়া সার ব্যবহার পরিহার করে অনুমোদিত বালাই ব্যবস্থাপনা বজায় রাখুন।`
                : `Weather for ${displayDistrict} indicates 3 consecutive dry sunny days. Ideal window for weeding, checking light traps, and maintaining balanced top-dressing without excess nitrogen.`}
            </p>
          </div>
        </div>

        {/* 3. Farm Financial & Yield Projection Summary */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-900 flex items-center">
              <Coins className="w-3.5 h-3.5 mr-1 text-emerald-700" />
              {isBn ? 'খামার আর্থিক সারসংক্ষেপ (চলতি ফসল)' : 'Seasonal Farm Financial Snapshot'}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
              {isBn ? 'প্রাক্কলন' : 'Estimate'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
              <span className="text-[10px] text-gray-500 block">{isBn ? 'বিনিয়োগ খরচ' : 'Input Cost'}</span>
              <span className="font-bold text-gray-800 text-xs sm:text-sm">৳ ১২,৫০০</span>
              <span className="text-[9px] text-gray-400 block">{isBn ? 'প্রতি একর' : '/ Acre'}</span>
            </div>
            <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
              <span className="text-[10px] text-gray-500 block">{isBn ? 'সম্ভাব্য বিক্রয়' : 'Est. Revenue'}</span>
              <span className="font-bold text-[#1E5128] text-xs sm:text-sm">৳ ২৮,৪০০</span>
              <span className="text-[9px] text-gray-400 block">{isBn ? 'প্রতি একর' : '/ Acre'}</span>
            </div>
            <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
              <span className="text-[10px] text-gray-500 block">{isBn ? 'প্রত্যাশিত লাভ' : 'Net Margin'}</span>
              <span className="font-bold text-emerald-700 text-xs sm:text-sm">+৳ ১৫,৯০০</span>
              <span className="text-[9px] text-emerald-600 block">{isBn ? '১২৭% মার্জিন' : '+127%'}</span>
            </div>
          </div>

          {/* Quick Tool Navigation Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-emerald-200/60">
            <button
              type="button"
              onClick={() => onNavigateToTab?.('supplies')}
              className="py-1.5 px-2.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Calculator className="w-3 h-3 text-emerald-700" />
              <span>{isBn ? 'সার ও খরচ হিসাব' : 'Supplies Calculator'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab?.('market')}
              className="py-1.5 px-2.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <TrendingUp className="w-3 h-3 text-emerald-700" />
              <span>{isBn ? 'লাইভ বাজারদর দেখুন' : 'Live Market Price'}</span>
            </button>
          </div>
        </div>

        {/* 4. Official Agri Hotline 16123 & Extension */}
        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-900 block leading-tight">
                {isBn ? 'সরকারি কৃষি কল সেন্টার ১৬১২৩' : 'Govt. Agri Hotline 16123'}
              </span>
              <span className="text-[10px] text-amber-800 leading-tight">
                {isBn ? 'সরাসরি সরকারি কৃষি কর্মকর্তার সাথে কথা বলুন (টোল ফ্রি)' : 'Direct assistance from govt. agronomists'}
              </span>
            </div>
          </div>
          <a
            href="tel:16123"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-2xs"
          >
            {isBn ? 'কল করুন' : 'Call'}
          </a>
        </div>
      </div>

      {/* Farm Land Records (Plots) */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-gray-900 flex items-center justify-between">
          <span>{isBn ? 'আমার নিবন্ধিত ফসলি জমি' : 'My Registered Plots & Lands'}</span>
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs text-[#1E5128] font-bold hover:underline cursor-pointer flex items-center space-x-0.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isBn ? 'জমি সম্পাদনা' : 'Manage Land'}</span>
          </button>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-[#F5F7F8] rounded-xl border border-gray-200 flex justify-between items-center">
            <div>
              <span className="font-bold text-gray-900 block">
                {isBn ? 'প্লট ক: প্রধান মাঠ' : 'Plot A: Main Field'}
              </span>
              <span className="text-gray-500">
                {displayLand} {isBn ? 'একর' : 'Acres'} — {primaryCropsList} | {displayDistrict}
              </span>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              {isBn ? 'কুশি পর্যায়' : 'Tillering'}
            </span>
          </div>

          <div className="p-3 bg-[#F5F7F8] rounded-xl border border-gray-200 flex justify-between items-center">
            <div>
              <span className="font-bold text-gray-900 block">
                {isBn ? 'প্লট খ: প্রদর্শনী প্লট ও সবজি' : 'Plot B: Demo & Vegetables'}
              </span>
              <span className="text-gray-500">
                ০.৫ {isBn ? 'একর — গোল আলু ও সরিষা' : 'Acres — Potato & Mustard'} | {isBn ? 'রবি প্রস্তুতি' : 'Rabi Prep'}
              </span>
            </div>
            <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              {isBn ? 'জমি তৈরি' : 'Land Prep'}
            </span>
          </div>
        </div>
      </div>

      {/* AI Advisory Call to Action */}
      <button
        type="button"
        onClick={() => onOpenChatWithTopic?.(`Analyze my ${displayLand}-acre farm in ${displayDistrict} and suggest a seasonal crop plan for maximum net profit`)}
        className="w-full py-3 bg-[#1E5128] hover:bg-[#163e1e] active:scale-98 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow cursor-pointer"
      >
        <span>{isBn ? 'আমার খামারের জন্য এআই পরামর্শ নিন' : 'Request Personalized Agronomy Plan'}</span>
      </button>

      {/* Settings & Language */}
      {onOpenSettings && (
        <button
          type="button"
          onClick={onOpenSettings}
          className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 active:scale-98 text-gray-800 border border-gray-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Settings className="w-4 h-4 text-[#1E5128]" />
          <span>{isBn ? 'অ্যাপ সেটিংস ও ভাষা (Settings & Language)' : 'Settings & Language'}</span>
        </button>
      )}

      {/* Logout */}
      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          className="w-full py-2.5 bg-red-50 hover:bg-red-100 active:scale-98 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{isBn ? 'লগআউট করুন' : 'Log Out'}</span>
        </button>
      )}

      {/* Profile Edit Modal Dialog */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        language={language}
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
};
