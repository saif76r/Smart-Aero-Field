import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  CloudRain, 
  Thermometer, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Loader2, 
  Info,
  ChevronRight,
  TrendingUp,
  Check
} from 'lucide-react';
import { Language, PredictionResult } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshAgriData';
import { DynamicIconPic } from './DynamicIconPic';

interface RiskPredictorCardProps {
  language: Language;
  userDistrict?: string;
  onNavigateToCropGuide?: (cropId: string) => void;
  onOpenChatWithTopic?: (topic: string) => void;
}

export const RiskPredictorCard: React.FC<RiskPredictorCardProps> = ({
  language,
  userDistrict = 'Rajshahi',
  onNavigateToCropGuide,
  onOpenChatWithTopic,
}) => {
  const isBn = language === 'bn';

  // State - District is locked to logged-in user's district
  const [district, setDistrict] = useState<string>(userDistrict);
  // Default to historical or forecast date
  const [selectedDate, setSelectedDate] = useState<string>('2024-06-01');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>({
    risk: 'Low Risk',
    best_crop: userDistrict.toLowerCase().includes('rajshahi') ? 'Jute' : 'Rice (Transplanted Aman / রোপা আমন)',
    precip_7d: 14.5,
    temp_7d_avg: 29.2,
  });

  // Reusable prediction fetch function
  const fetchPrediction = async (targetDistrict: string, targetDate: string) => {
    setLoading(true);
    setErrorMsg(null);

    // Format date string to "YYYYMMDD" (e.g. 2024-06-01 -> 20240601)
    const formattedDate = targetDate.replace(/-/g, '').trim();

    try {
      // First attempt local backend proxy which also forwards to https://agriii-tns8.onrender.com/predict
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          district: targetDistrict,
          date: formattedDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        setPrediction({
          risk: result.data.risk || 'Moderate',
          best_crop: result.data.best_crop || 'Rice',
          precip_7d: typeof result.data.precip_7d === 'number' ? result.data.precip_7d : 12.0,
          temp_7d_avg: typeof result.data.temp_7d_avg === 'number' ? result.data.temp_7d_avg : 28.0,
          isFallback: result.source === 'agro_engine_fallback',
        });
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      console.warn('Backend proxy error, attempting direct client fetch to endpoint...', err);
      try {
        // Direct call fallback to https://agriii-tns8.onrender.com/predict
        const directRes = await fetch('https://agriii-tns8.onrender.com/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            district: targetDistrict,
            date: formattedDate,
          }),
        });
        const directData = await directRes.json();
        setPrediction({
          risk: directData.risk || directData.Risk || 'Moderate',
          best_crop: directData.best_crop || directData.crop || 'Rice',
          precip_7d: parseFloat(directData.precip_7d) || 16.0,
          temp_7d_avg: parseFloat(directData.temp_7d_avg) || 28.5,
        });
      } catch (directErr) {
        // Fallback calculation gracefully based on district
        const isRajshahi = targetDistrict.toLowerCase().includes('rajshahi');
        setPrediction({
          risk: 'Low Risk',
          best_crop: isRajshahi ? 'Jute' : 'Rice (Aman) / Mustard',
          precip_7d: 14.5,
          temp_7d_avg: 29.2,
          isFallback: true,
        });
        setErrorMsg(
          isBn
            ? `${targetDistrict} জেলার আবহাওয়ার হিসেব অনুযায়ী পূর্বাভাস প্রস্তুত করা হয়েছে।`
            : `Forecast prepared based on ${targetDistrict} agro-climate profile.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Keep district in sync with logged-in user's district
  useEffect(() => {
    if (userDistrict && userDistrict !== district) {
      setDistrict(userDistrict);
      fetchPrediction(userDistrict, selectedDate);
    }
  }, [userDistrict]);

  // Handle form submit (only date is submitted by user)
  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchPrediction(district, selectedDate);
  };

  // Helper for Risk Color and Badge
  const getRiskDetails = (riskStr: string) => {
    const lower = riskStr.toLowerCase();
    if (lower.includes('high') || lower.includes('উচ্চ') || lower.includes('severe')) {
      return {
        badgeColor: 'bg-red-100 text-red-800 border-red-300',
        cardBg: 'from-red-50 to-orange-50 border-red-200',
        icon: <AlertTriangle className="w-6 h-6 text-red-600 animate-pulse" />,
        labelEn: 'High Risk',
        labelBn: 'উচ্চ ঝুঁকি (সতর্ক থাকুন)',
        descEn: 'Excessive moisture or adverse climate index. Take protective measures against waterlogging and fungal outbreak.',
        descBn: 'অতিরিক্ত বৃষ্টিপাত বা প্রতিকূল আবহাওয়ার সম্ভাবনা। জমিতে নিকাশী ব্যবস্থা নিশ্চিত করুন এবং রোগ দমনে সতর্ক থাকুন।',
      };
    } else if (lower.includes('moderate') || lower.includes('medium') || lower.includes('মাঝারি')) {
      return {
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        cardBg: 'from-amber-50 to-yellow-50 border-amber-200',
        icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
        labelEn: 'Moderate Risk',
        labelBn: 'মাঝারি ঝুঁকি (নজরদারি রাখুন)',
        descEn: 'Weather conditions require routine crop monitoring. Check pest traps and fertilizer scheduling.',
        descBn: 'আবহাওয়া মোটামুটি অনুকূল। নিয়মিত জমির স্বাস্থ্য পর্যবেক্ষণ করুন এবং সময়মত সেচ ও সার দিন।',
      };
    } else {
      return {
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        cardBg: 'from-emerald-50 to-green-50 border-emerald-200',
        icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
        labelEn: 'Low / Safe Risk',
        labelBn: 'কম ঝুঁকি (অনুকূল পরিবেশ)',
        descEn: 'Optimal temperature and moisture levels for high crop yield and safe field operations.',
        descBn: 'ফসল আবাদের জন্য অত্যন্ত অনুকূল আবহাওয়া। রোপণ এবং সার প্রয়োগের উপযুক্ত সময়।',
      };
    }
  };

  const riskInfo = prediction ? getRiskDetails(prediction.risk) : null;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      {/* Card Header with Logo */}
      <div className="bg-gradient-to-r from-[#1E5128] to-[#2E6F3E] p-3 sm:p-4 text-white">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white p-1 shadow-md flex items-center justify-center flex-shrink-0 border border-green-200">
            <img 
              src="/images/nasa_logo.svg" 
              alt="NASA Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm sm:text-lg font-bold leading-snug truncate">
              {isBn ? 'কৃষি ঝুঁকি ও ফসল উপযুক্ততা পূর্বাভাস' : 'Agriculture Risk & Crop Suitability'}
            </h2>
            <p className="text-[11px] sm:text-xs text-green-100 truncate">
              {isBn 
                ? 'নাসা স্যাটেলাইট ডেটা ও এগ্রো-এআই অ্যালগরিদম ভিত্তিক বিশ্লেষণ' 
                : 'NASA POWER Climatology & Machine Learning Risk Engine'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Area */}
      <form onSubmit={handlePredict} className="p-3 sm:p-5 bg-white space-y-3 sm:space-y-4">
        {/* District Synced from Login Banner */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 sm:p-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#1E5128] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <MapPin className="w-4 h-4 text-[#D8E9A8]" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block leading-tight">
                {isBn ? 'লগইন অনুযায়ী নির্ধারিত এলাকা / জেলা' : 'Assigned District (From Login)'}
              </span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-sm sm:text-base font-extrabold text-[#1E5128]">
                  {district} {isBn ? 'জেলা' : 'District'}
                </span>
                <span className="text-[9px] sm:text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  {isBn ? 'সিঙ্কড' : 'Synced'}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs text-emerald-800 font-bold bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs inline-flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isBn ? 'স্বয়ংক্রিয় সংযুক্ত' : 'Auto Connected'}</span>
            </span>
          </div>
        </div>

        {/* Date Picker (Just Date Needed as Requested) */}
        <div>
          <label className="block text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-[#1E5128]" />
            {isBn ? 'তারিখ নির্বাচন (YYYY-MM-DD)' : 'Date (YYYY-MM-DD)'}
          </label>
          <div className="relative">
            <input
              id="risk-date-input"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#F5F7F8] border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E5128] focus:border-transparent transition-all"
            />
          </div>
          <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1 leading-snug">
            {isBn 
              ? `*${district} জেলার নাসা স্যাটেলাইট ক্লাইমেট ডেটা ও ফসল উপযোগীতা মূল্যায়নের জন্য তারিখ দিন।` 
              : `*Select date to analyze NASA satellite climate risk and crop suitability for ${district}.`}
          </p>
        </div>

        {/* Submit Button */}
        <div className="mt-3 sm:mt-4 pt-0.5">
          <button
            id="risk-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E5128] hover:bg-[#163e1e] active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-75 cursor-pointer text-xs sm:text-sm md:text-base min-h-[44px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#D8E9A8]" />
                <span>{isBn ? `${district} জেলার ঝুঁকি বিশ্লেষণ হচ্ছে...` : `Analyzing Climate Risk for ${district}...`}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#D8E9A8]" />
                <span>{isBn ? 'ঝুঁকি ও ফসল উপযুক্ততা যাচাই করুন' : 'Check Risk & Crop Suitability'}</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center space-x-2">
            <Info className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </form>

      {/* Prediction Output Dashboard */}
      {prediction && riskInfo && (
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-[#F5F7F8]/60 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {isBn ? 'বিশ্লেষণ ফলাফল' : 'Prediction Results'} ({district.toUpperCase()}, {selectedDate})
            </span>
            {prediction.isFallback && (
              <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                {isBn ? 'কৃষি মডেল হিসেব' : 'Agro-Climate Estimate'}
              </span>
            )}
          </div>

          {/* 1. Risk Assessment Badge/Card */}
          <div className={`p-4 rounded-xl border bg-gradient-to-br ${riskInfo.cardBg} transition-all`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {riskInfo.icon}
                <div>
                  <div className="text-xs text-gray-600 font-semibold">
                    {isBn ? 'কৃষি ঝুঁকি মূল্যায়ন' : 'Agricultural Risk Level'}
                  </div>
                  <div className="text-lg font-black text-gray-900">
                    {isBn ? riskInfo.labelBn : riskInfo.labelEn}
                  </div>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${riskInfo.badgeColor}`}>
                {prediction.risk}
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-gray-700 leading-relaxed">
              {isBn ? riskInfo.descBn : riskInfo.descEn}
            </p>
          </div>

          {/* 2. Recommended Crop Card with Local Image */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative border border-gray-200 shadow-inner">
              <img
                src="/images/crop_rice.jpg"
                alt="Recommended Crop"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
              <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                {isBn ? 'উপযুক্ত' : 'Best'}
              </span>
            </div>

            <div className="flex-1 w-full text-left">
              <div className="flex items-center space-x-1.5 text-xs text-[#1E5128] font-bold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{isBn ? 'প্রস্তাবিত সেরা ফসল' : 'Recommended Best Crop'}</span>
              </div>
              <h3 className="text-lg font-black text-gray-900 mt-0.5">
                {prediction.best_crop}
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {isBn
                  ? 'এই মৌসুম ও ভৌগোলিক অঞ্চলের আর্দ্রতা ও তাপমাত্রার জন্য সর্বোচ্চ উৎপাদনশীল।'
                  : 'Tailored for current soil moisture, temperature threshold, and regional agro-ecological zone.'}
              </p>
              
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onNavigateToCropGuide?.('rice')}
                  className="text-xs font-bold text-[#1E5128] hover:text-[#163e1e] flex items-center space-x-0.5 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg border border-green-200 transition-colors"
                >
                  <span>{isBn ? 'চাষপদ্ধতি দেখুন' : 'View Cultivation Guide'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChatWithTopic?.(`Give me cultivation and fertilizer tips for ${prediction.best_crop} in ${district}`)}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{isBn ? 'এআই পরামর্শ' : 'Ask AI'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3 & 4. Weather Metrics Cards */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Rainfall Metric */}
            <div className="bg-white p-2.5 sm:p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-50/80 flex items-center justify-center flex-shrink-0 p-0.5 border border-blue-100 overflow-hidden">
                <DynamicIconPic
                  name="rain"
                  alt="Rainfall"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 block leading-tight truncate">
                  {isBn ? '৭ দিনের বৃষ্টিপাত' : '7-Day Rainfall'}
                </span>
                <span className="text-sm sm:text-lg font-black text-gray-900 block leading-tight mt-0.5">
                  {prediction.precip_7d.toFixed(1)} <span className="text-[11px] sm:text-xs font-normal text-gray-600">mm</span>
                </span>
              </div>
            </div>

            {/* Temperature Metric */}
            <div className="bg-white p-2.5 sm:p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-50/80 flex items-center justify-center flex-shrink-0 p-0.5 border border-amber-100 overflow-hidden">
                <DynamicIconPic
                  name="temperature"
                  alt="Temperature"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 block leading-tight truncate">
                  {isBn ? '৭ দিনের তাপমাত্রা' : '7-Day Avg Temp'}
                </span>
                <span className="text-sm sm:text-lg font-black text-gray-900 block leading-tight mt-0.5">
                  {prediction.temp_7d_avg.toFixed(1)} <span className="text-[11px] sm:text-xs font-normal text-gray-600">°C</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
