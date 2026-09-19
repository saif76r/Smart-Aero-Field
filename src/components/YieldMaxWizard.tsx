import React, { useState } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  CheckCircle2, 
  Loader2, 
  Award, 
  DollarSign, 
  Sprout, 
  ChevronRight,
  Droplets,
  Calendar
} from 'lucide-react';
import { Language } from '../types';

interface YieldMaxWizardProps {
  language: Language;
  onBack: () => void;
  onOpenChatWithTopic?: (topic: string) => void;
}

export const YieldMaxWizard: React.FC<YieldMaxWizardProps> = ({
  language,
  onBack,
  onOpenChatWithTopic,
}) => {
  const isBn = language === 'bn';

  // Wizard state: 1, 2, 3, 4 (calculating), 5 (result)
  const [step, setStep] = useState<number>(1);
  const [crop, setCrop] = useState<string>('rice');
  const [variety, setVariety] = useState<string>('BRRI dhan49');
  const [season, setSeason] = useState<string>('aman');
  const [landArea, setLandArea] = useState<string>('2');
  const [landUnit, setLandUnit] = useState<string>('acre');
  const [soilType, setSoilType] = useState<string>('loam');
  const [sowingTime, setSowingTime] = useState<string>('July 20');
  const [seedQuantity, setSeedQuantity] = useState<string>('5');
  const [irrigationMode, setIrrigationMode] = useState<string>('regular');

  const handleRunAnalysis = () => {
    setStep(4);
    setTimeout(() => {
      setStep(5);
    }, 1800);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-3 bg-[#1E5128] text-white p-4 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={step > 1 ? () => setStep(step - 1) : onBack}
          className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-black">{isBn ? 'ফলন বৃদ্ধি উইজার্ড (Yield Max)' : 'Yield Max Crop Optimizer'}</h2>
          <p className="text-xs text-green-200">
            {isBn ? '৫-ধাপের এগ্রো-ক্যালকুলেটর দিয়ে সর্বোচ্চ ফলন নিশ্চিতকরণ' : 'Step-by-step smart agronomy yield estimation'}
          </p>
        </div>
      </div>

      {/* Step Indicators */}
      {step <= 3 && (
        <div className="flex items-center justify-between px-2 bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center space-x-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === num
                    ? 'bg-[#1E5128] text-white shadow'
                    : step > num
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {step > num ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : num}
              </div>
              <span className="text-[11px] font-semibold text-gray-700 hidden sm:inline">
                {num === 1 ? (isBn ? 'ফসলের তথ্য' : 'Crop Info') : num === 2 ? (isBn ? 'জমির বিবরণ' : 'Land Info') : (isBn ? 'উপকরণ বিবরণ' : 'Input Info')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Crop Information (Screenshot 15) */}
      {step === 1 && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-2">
            <h3 className="font-bold text-sm text-gray-900">
              {isBn ? 'ধাপ ১: ফসলের তথ্য নির্বাচন' : 'Step 1: Crop Selection'}
            </h3>
            <p className="text-xs text-gray-500">
              {isBn ? 'আপনার প্রস্তাবিত ফসল, মৌসুম ও জাত নির্বাচন করুন' : 'Select target crop, variety and seasonal cycle.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {isBn ? 'ফসলের নাম' : 'Crop'}
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-[#F5F7F8] border border-gray-200 rounded-xl p-3 text-xs sm:text-sm font-semibold text-gray-900"
            >
              <option value="rice">{isBn ? 'ধান' : 'Rice (Paddy)'}</option>
              <option value="wheat">{isBn ? 'গম' : 'Wheat'}</option>
              <option value="maize">{isBn ? 'ভুট্টা' : 'Maize / Corn'}</option>
              <option value="potato">{isBn ? 'আলু' : 'Potato'}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {isBn ? 'উন্নত জাত' : 'Variety'}
            </label>
            <input
              type="text"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              className="w-full bg-[#F5F7F8] border border-gray-200 rounded-xl p-3 text-xs sm:text-sm font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {isBn ? 'মৌসুম' : 'Season'}
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full bg-[#F5F7F8] border border-gray-200 rounded-xl p-3 text-xs sm:text-sm font-semibold text-gray-900"
            >
              <option value="aman">{isBn ? 'রোপা আমন মৌসুম' : 'Aman Season'}</option>
              <option value="boro">{isBn ? 'বোরো মৌসুম' : 'Boro Season'}</option>
              <option value="aus">{isBn ? 'আউশ মৌসুম' : 'Aus Season'}</option>
              <option value="rabi">{isBn ? 'রবি মৌসুম' : 'Rabi / Winter'}</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full py-3 bg-[#1E5128] hover:bg-[#163e1e] text-white font-bold rounded-xl shadow transition-all flex items-center justify-center space-x-1.5 text-sm"
          >
            <span>{isBn ? 'পরবর্তী ধাপ (জমির বিবরণ)' : 'Next Step: Land Info'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Land Info (Screenshot 16) */}
      {step === 2 && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-2">
            <h3 className="font-bold text-sm text-gray-900">
              {isBn ? 'ধাপ ২: জমির আয়তন ও মাটির তথ্য' : 'Step 2: Land & Soil Parameters'}
            </h3>
            <p className="text-xs text-gray-500">
              {isBn ? 'জমির সঠিক পরিমাপ ও মাটির গঠন প্রদান করুন' : 'Provide land size and topsoil classification.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {isBn ? 'জমির আয়তন' : 'Land Area'}
              </label>
              <input
                type="number"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                className="w-full bg-[#F5F7F8] border border-gray-200 rounded-xl p-3 text-xs sm:text-sm font-semibold text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {isBn ? 'একক' : 'Unit'}
              </label>
              <select
                value={landUnit}
                onChange={(e) => setLandUnit(e.target.value)}
                className="w-full bg-[#F5F7F8] border border-gray-200 rounded-xl p-3 text-xs sm:text-sm font-semibold text-gray-900"
              >
                <option value="acre">{isBn ? 'একর' : 'Acre'}</option>
                <option value="bigha">{isBn ? 'বিঘা (৩৩ শতক)' : 'Bigha (33 Decimals)'}</option>
                <option value="decimal">{isBn ? 'শতক' : 'Decimal'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {isBn ? 'মাটির ধরন' : 'Soil Type'}
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full bg-[#F5F7F8] border border-gray-200 rounded-xl p-3 text-xs sm:text-sm font-semibold text-gray-900"
            >
              <option value="loam">{isBn ? 'দোআঁশ মাটি' : 'Loamy Soil'}</option>
              <option value="clay_loam">{isBn ? 'এঁটেল দোআঁশ' : 'Clay Loam'}</option>
              <option value="sandy_loam">{isBn ? 'বেলে দোআঁশ' : 'Sandy Loam'}</option>
              <option value="clay">{isBn ? 'ভারী এঁটেল মাটি' : 'Heavy Clay Soil'}</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm"
            >
              {isBn ? 'পূর্ববর্তী' : 'Back'}
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 py-3 bg-[#1E5128] hover:bg-[#163e1e] text-white font-bold rounded-xl shadow transition-all flex items-center justify-center space-x-1.5 text-sm"
            >
              <span>{isBn ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Input Info (Screenshot 17) */}
      {step === 3 && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-2">
            <h3 className="font-bold text-sm text-gray-900">
              {isBn ? 'ধাপ ৩: বীজ ও সেচ পদ্ধতি' : 'Step 3: Sowing & Inputs'}
            </h3>
            <p className="text-xs text-gray-500">
              {isBn ? 'বীজের পরিমাণ ও সেচ পরিকল্পনা যোগ করুন' : 'Specify sowing date, seed weight and water schedule.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {isBn ? 'চারা রোপণের আনুমানিক সময়' : 'Transplanting / Sowing Date'}
            </label>
            <input
              type="text"
              value={sowingTime}
              onChange={(e) => setSowingTime(e.target.value)}
              className="w-full bg-[#F5F7F8] border border-gray-200 rounded-xl p-3 text-xs sm:text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {isBn ? 'বীজ বা চারা ব্যবহার (কেজি/একর)' : 'Seed Quantity (Kg/Acre)'}
            </label>
            <input
              type="number"
              value={seedQuantity}
              onChange={(e) => setSeedQuantity(e.target.value)}
              className="w-full bg-[#F5F7F8] border border-gray-200 rounded-xl p-3 text-xs sm:text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {isBn ? 'সেচ ব্যবস্থাপনা' : 'Irrigation Regimen'}
            </label>
            <select
              value={irrigationMode}
              onChange={(e) => setIrrigationMode(e.target.value)}
              className="w-full bg-[#F5F7F8] border border-gray-200 rounded-xl p-3 text-xs sm:text-sm font-semibold text-gray-900"
            >
              <option value="regular">{isBn ? 'সুনিশ্চিত নিয়মিত সেচ' : 'Regular Controlled Irrigation'}</option>
              <option value="rainfed">{isBn ? 'বৃষ্টির পানি নির্ভর' : 'Rainfed / Dependent'}</option>
              <option value="drip">{isBn ? 'ড্রিপ / আধুনিক স্প্রিঙ্কলার' : 'Drip / Sprinkler'}</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleRunAnalysis}
            className="w-full py-3.5 bg-[#1E5128] hover:bg-[#163e1e] text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <span>{isBn ? 'ফলন বৃদ্ধি বিশ্লেষণ তৈরি করুন' : 'Generate Yield Max Strategy'}</span>
          </button>
        </div>
      )}

      {/* Step 4: Loading progress animation */}
      {step === 4 && (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#1E5128] flex items-center justify-center mx-auto shadow-inner">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            {isBn ? 'এআই এগ্রোনমি ইঞ্জিন বিশ্লেষণ করছে...' : 'Computing Yield Potential & Profit Index...'}
          </h3>
          <div className="space-y-2 max-w-xs mx-auto text-left text-xs text-gray-600">
            <div className="flex items-center space-x-2 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isBn ? 'মাটি ও পুষ্টি উপাদান যাচাই সম্পন্ন' : 'Soil Nutrient Balance Verified'}</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isBn ? 'নাসা আবহাওয়া থার্মাল ক্যালকুলেশন' : 'NASA Climatology Index Calculated'}</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isBn ? 'সারের সঠিক সময়সূচি প্রস্তুত' : 'Nutrient Timing Optimized'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Result Card (Screenshot 18) */}
      {step === 5 && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          {/* Top Score Gauge */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 p-5 rounded-2xl border border-emerald-200 text-center relative overflow-hidden">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-md border-4 border-[#1E5128] mb-2">
              <div className="text-center">
                <span className="text-3xl font-black text-[#1E5128]">84</span>
                <span className="text-[10px] block font-bold text-gray-500">/ 100</span>
              </div>
            </div>

            <h3 className="text-lg font-black text-gray-900">
              {isBn ? 'ফলন স্কোর: অত্যন্ত আশাব্যঞ্জক' : 'Yield Potential Score: Very High'}
            </h3>
            <p className="text-xs text-gray-600 max-w-sm mx-auto mt-1">
              {isBn
                ? `${landArea} ${landUnit === 'acre' ? 'একর' : landUnit === 'bigha' ? 'বিঘা' : 'শতক'} জমিতে আধুনিক পদ্ধতি মানলে ফলন প্রায় ২০-২৫% বৃদ্ধি পাবে।`
                : `Following this precision protocol on your ${landArea} ${landUnit} plot will boost yield by 22%.`}
            </p>
          </div>

          {/* Stat Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                {isBn ? 'সম্ভাব্য মোট উৎপাদন' : 'Est. Total Production'}
              </span>
              <span className="text-lg font-black text-gray-900">
                8.6 <span className="text-xs font-normal">Tons ({isBn ? '২৮৫ মণ' : '285 Maunds'})</span>
              </span>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[11px] font-bold text-amber-800 uppercase block">
                {isBn ? 'সম্ভাব্য বাড়তি মুনাফা' : 'Potential Added Profit'}
              </span>
              <span className="text-lg font-black text-gray-900">
                +1,20,000 <span className="text-xs font-normal">Tk</span>
              </span>
            </div>
          </div>

          {/* Actionable Recommendations (Screenshot 18) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              {isBn ? 'সর্বোচ্চ ফলনের ৩টি প্রধান পরামর্শ:' : 'Top 3 Yield Maximization Actions:'}
            </h4>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-800 space-y-1.5">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>
                  {isBn
                    ? 'চারা রোপণের ২০ দিন পর নিম খৈল মিশ্রিত প্রথম কিস্তি ইউরিয়া সার উপরিপ্রয়োগ করুন।'
                    : 'Apply 1st top-dress Urea mixed with neem cake 20 days after seedling transplantation.'}
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>
                  {isBn
                    ? 'কুশি বৃদ্ধির সময় (Tillering stage) জমি থেকে ৪৮ ঘণ্টার জন্য পানি নিষ্কাশন করে শিকড়ে বাতাস দিন।'
                    : 'Mid-tillering phase: Drain field standing water for 48 hours to aerate root rhizosphere.'}
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>
                  {isBn
                    ? 'শীষ বের হওয়ার আগে আগাম প্রতিরোধ হিসেবে প্রতি লিটারে ১ গ্রাম ট্রাইসাইক্লাজোল স্প্রে করুন।'
                    : 'Prophylactic spray of Tricyclazole 75% WP @ 0.75g/L right before panicle emergence.'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
            >
              {isBn ? 'নতুন হিসাব করুন' : 'Recalculate'}
            </button>
            <button
              type="button"
              onClick={() => onOpenChatWithTopic?.(`Give me day-by-day task checklist to achieve 84+ score on my ${variety} rice field`)}
              className="flex-1 py-3 bg-[#1E5128] hover:bg-[#163e1e] text-white font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center space-x-1"
            >
              <span>{isBn ? 'দৈনিক কাজের তালিকা নিন' : 'Get Daily Checklist'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
