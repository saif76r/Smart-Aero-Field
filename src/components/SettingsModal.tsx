import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Check, 
  Settings, 
  MapPin, 
  Bell, 
  Smartphone, 
  CheckCircle2, 
  Info
} from 'lucide-react';
import { Language } from '../types';
import { BANGLADESH_DISTRICTS, getDistrictNameBn } from '../data/bangladeshAgriData';
import { requestBrowserPushPermission } from '../utils/agronomicEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  currentDistrict?: string;
  onChangeDistrict?: (district: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onChangeLanguage,
  currentDistrict = 'Rajshahi',
  onChangeDistrict,
}) => {
  if (!isOpen) return null;

  const isBn = language === 'bn';
  const [selectedDistrict, setSelectedDistrict] = useState(currentDistrict);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [offlineCache, setOfflineCache] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    if (onChangeDistrict && selectedDistrict !== currentDistrict) {
      onChangeDistrict(selectedDistrict);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 pt-safe pb-safe">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1E5128] text-white p-4 sm:p-5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#4E9F3D]/25 rounded-full blur-lg pointer-events-none" />
          
          <div className="flex items-center space-x-2.5 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center backdrop-blur-sm">
              <Settings className="w-5 h-5 text-[#D8E9A8]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {isBn ? 'অ্যাপ সেটিংস ও ভাষা' : 'App Settings & Language'}
              </h2>
              <p className="text-[11px] text-green-100">
                {isBn ? 'আপনার পছন্দ অনুযায়ী অ্যাপটি পরিচালনা করুন' : 'Customize language and farming preferences'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer relative z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 space-y-5 overflow-y-auto">
          
          {/* SECTION 1: LANGUAGE SELECTION (CORE REQUIREMENT) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 flex items-center space-x-1.5 uppercase tracking-wide">
                <Globe className="w-4 h-4 text-[#1E5128]" />
                <span>{isBn ? 'অ্যাপের ভাষা পরিবর্তন (Language)' : 'App Language (ভাষা)'}</span>
              </label>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {language === 'bn' ? 'বাংলা সক্রিয়' : 'English Active'}
              </span>
            </div>

            <p className="text-[11px] text-gray-500 leading-snug">
              {isBn 
                ? 'ভাষা নির্বাচন করুন। নির্বাচন করার সাথে সাথে পুরো সাইটের সকল লেখা পরিবর্তিত হবে।'
                : 'Select your preferred language. Switching changes the entire site instantly.'}
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* Bangla Option */}
              <button
                type="button"
                onClick={() => onChangeLanguage('bn')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-start text-left relative cursor-pointer ${
                  language === 'bn'
                    ? 'border-[#1E5128] bg-emerald-50/70 shadow-sm ring-2 ring-[#1E5128]/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {language === 'bn' && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#1E5128] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <span className="text-xl mb-1">🇧🇩</span>
                <span className="text-sm font-black text-gray-900">বাংলা (Bangla)</span>
                <span className="text-[11px] text-gray-500 mt-0.5">
                  পুরো অ্যাপটি বাংলায় দেখুন
                </span>
              </button>

              {/* English Option */}
              <button
                type="button"
                onClick={() => onChangeLanguage('en')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-start text-left relative cursor-pointer ${
                  language === 'en'
                    ? 'border-[#1E5128] bg-emerald-50/70 shadow-sm ring-2 ring-[#1E5128]/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {language === 'en' && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#1E5128] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <span className="text-xl mb-1">🌐</span>
                <span className="text-sm font-black text-gray-900">English</span>
                <span className="text-[11px] text-gray-500 mt-0.5">
                  View entire app in English
                </span>
              </button>
            </div>
          </div>

          {/* SECTION 2: FARMER DISTRICT PREFERENCE */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-800 flex items-center space-x-1.5 uppercase tracking-wide">
              <MapPin className="w-4 h-4 text-[#1E5128]" />
              <span>{isBn ? 'আপনার জেলা (Location / District)' : 'Default District & Region'}</span>
            </label>
            <p className="text-[11px] text-gray-500">
              {isBn
                ? 'নির্বাচিত জেলার ভিত্তিতে নাসা স্যাটেলাইট আবহাওয়া ও বাজারদর স্বয়ংক্রিয়ভাবে আপডেট হবে।'
                : 'NASA satellite feeds and wholesale market prices sync automatically to this district.'}
            </p>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-[#F5F7F8] border border-gray-200 text-gray-900 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E5128] transition-all cursor-pointer"
            >
              {BANGLADESH_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {isBn ? `${getDistrictNameBn(d)} (${d})` : d}
                </option>
              ))}
            </select>
          </div>

          {/* SECTION 3: QUICK PREFERENCES */}
          <div className="space-y-2.5 pt-2 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-800 flex items-center space-x-1.5 uppercase tracking-wide">
              <Settings className="w-4 h-4 text-[#1E5128]" />
              <span>{isBn ? 'স্মার্ট নোটিফিকেশন ও ডেটা' : 'Preferences & Data Sync'}</span>
            </label>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                <div className="flex items-center space-x-2.5">
                  <Bell className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">
                      {isBn ? 'ঝড় ও অতিবৃষ্টি সতর্কবার্তা' : 'Severe Weather & Storm Alerts'}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {isBn ? 'আবহাওয়ার আকস্মিক পরিবর্তনের অ্যালার্ট' : 'Instant alerts for critical weather shifts'}
                    </span>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={weatherAlerts}
                  onChange={async (e) => {
                    const checked = e.target.checked;
                    setWeatherAlerts(checked);
                    if (checked) {
                      await requestBrowserPushPermission();
                    }
                  }}
                  className="rounded text-[#1E5128] focus:ring-[#1E5128] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                <div className="flex items-center space-x-2.5">
                  <Smartphone className="w-4 h-4 text-blue-700" />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">
                      {isBn ? 'অফলাইন স্যাটেলাইট ডেটা ক্যাশ' : 'Offline Satellite Caching'}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {isBn ? 'দুর্বল ইন্টারনেটেও গুরুত্বপূর্ণ তথ্য দেখুন' : 'Quick access even on slow field connections'}
                    </span>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={offlineCache}
                  onChange={(e) => setOfflineCache(e.target.checked)}
                  className="rounded text-[#1E5128] focus:ring-[#1E5128] w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start space-x-2 text-[11px] text-amber-800">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              {isBn 
                ? '💡 ভাষা পরিবর্তন করলে হোমপেজ, পূর্বাভাস, বাজারদর ও এআই সহায়িকা তাৎক্ষণিকভাবে বাংলায় রূপান্তরিত হবে।'
                : '💡 Changing language will immediately translate the homepage, forecasts, market rates, and AI advisory.'}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 rounded-xl transition-colors cursor-pointer"
          >
            {isBn ? 'বাতিল' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#1E5128] hover:bg-[#163e1e] active:scale-95 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#D8E9A8]" />
                <span>{isBn ? 'সংরক্ষিত হয়েছে!' : 'Saved!'}</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-[#D8E9A8]" />
                <span>{isBn ? 'প্রয়োগ করুন' : 'Apply & Save'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
