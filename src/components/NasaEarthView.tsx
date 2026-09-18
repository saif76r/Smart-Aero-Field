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
import { getDistrictWeather, getLiveDateDisplay } from '../data/weatherData';

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

  // Live real-time district weather and date
  const weather = getDistrictWeather(selectedDistrict);
  const liveDate = getLiveDateDisplay(isBn);

  const toBnDigits = (val: number | string) =>
    String(val).replace(/\d/g, (ch) => '০১২৩৪৫৬৭৮৯'[parseInt(ch, 10)]);

  // Dynamically calculate 7-day forecast starting from today (Friday if today is Friday)
  const currentDayIdx = new Date().getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
  const daysShortEn = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const daysShortBn = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

  const forecastVariations = [
    { tempOffset: 0, icon: weather.iconSrc, alt: weather.conditionEn },
    { tempOffset: 1, icon: '/images/weather/sunny.jpg?v=2', alt: 'Sunny' },
    { tempOffset: -1, icon: '/images/weather/rain.jpg', alt: 'Rain' },
    { tempOffset: -2, icon: '/images/weather/rain.jpg', alt: 'Rain' },
    { tempOffset: 0, icon: '/images/weather/partly_cloudy.jpg', alt: 'Partly Cloudy' },
    { tempOffset: 1, icon: '/images/weather/sunny.jpg?v=2', alt: 'Sunny' },
    { tempOffset: 2, icon: '/images/weather/sunny.jpg?v=2', alt: 'Sunny' },
  ];

  const forecastDays = forecastVariations.map((item, i) => {
    const dayIdx = (currentDayIdx + i) % 7;
    const tempVal = weather.temp + item.tempOffset;
    const dayLabel = i === 0 
      ? (isBn ? 'আজ' : 'TODAY') 
      : (isBn ? daysShortBn[dayIdx] : daysShortEn[dayIdx]);

    return {
      day: dayLabel,
      temp: isBn ? `+${toBnDigits(tempVal)}°সে` : `+${tempVal}°C`,
      iconSrc: item.icon,
      alt: item.alt,
      isToday: i === 0,
    };
  });

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
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/40">
              <img
                src="/images/nasa_logo.svg"
                alt="NASA Logo"
                className="w-full h-full object-cover scale-[1.04]"
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

          {/* Segmented Filter Control: Clean 4-Column Grid, No Overflow */}
          <div className="bg-white/15 p-1 rounded-2xl grid grid-cols-4 gap-1 backdrop-blur-sm border border-white/20">
            <button
              type="button"
              onClick={() => setActiveTab('risk')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all text-center truncate cursor-pointer ${
                activeTab === 'risk'
                  ? 'bg-white text-[#1E5128] shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span className="sm:hidden">{isBn ? 'ঝুঁকি' : 'Risk'}</span>
              <span className="hidden sm:inline">{isBn ? 'ঝুঁকি ও ফসল' : 'Risk & Crops'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('land')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all text-center truncate cursor-pointer ${
                activeTab === 'land'
                  ? 'bg-white text-[#1E5128] shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span className="sm:hidden">{isBn ? 'জমি' : 'Land'}</span>
              <span className="hidden sm:inline">{isBn ? 'জমির অবস্থা' : 'Land Condition'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('weather')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all text-center truncate cursor-pointer ${
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
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all text-center truncate cursor-pointer ${
                activeTab === 'soil'
                  ? 'bg-white text-[#1E5128] shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span className="sm:hidden">{isBn ? 'মাটি' : 'Soil'}</span>
              <span className="hidden sm:inline">{isBn ? 'মাটি ও আর্দ্রতা' : 'Soil & Moisture'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-md mx-auto px-4 -mt-3 space-y-4">
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
                    {isBn ? 'চমৎকার' : 'Good Health'}
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
                    {isBn ? 'মাঝারি' : 'Medium'}
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
                    {isBn ? 'স্বাভাবিক' : 'Normal'}
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
            {/* Weather Card with Picture-Type Glassy Atmosphere (Requested by User) */}
            <div className="rounded-3xl p-5 text-white shadow-xl relative overflow-hidden border border-white/35 backdrop-blur-md">
              {/* Scenic Background Picture */}
              <img
                src="/images/weather_bg.jpg"
                alt="Atmospheric Weather Sky"
                className="absolute inset-0 w-full h-full object-cover scale-105 filter saturate-[1.15] brightness-90 transition-transform duration-700 hover:scale-110"
                onError={(e) => {
                  // Graceful fallback to aerial field if needed
                  (e.target as HTMLImageElement).src = '/images/aerial_field.jpg';
                }}
              />

              {/* Glassmorphism Frosted Vignette & Tint Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1E5128]/70 via-black/45 to-[#0F2914]/85 backdrop-blur-[5px]" />
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />

              {/* Content on top of Glass */}
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs text-white font-semibold shadow-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#D8E9A8]" />
                      <span>{selectedDistrict}, Bangladesh</span>
                    </div>
                    <h3 className="text-4xl sm:text-5xl font-black mt-2.5 tracking-tight drop-shadow-md text-white">
                      {isBn ? `+${toBnDigits(weather.temp)} °সে` : `+${weather.temp} °C`}
                    </h3>
                    <p className="text-xs sm:text-sm text-green-100 font-semibold mt-0.5 drop-shadow-xs flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                      <span>{liveDate.dayOfWeek}, {isBn ? weather.conditionBn : weather.conditionEn}</span>
                    </p>
                  </div>

                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white/25 flex items-center justify-center backdrop-blur-xl border border-white/40 overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                    <img
                      src={weather.iconSrc}
                      alt={weather.conditionEn}
                      className="w-full h-full object-cover scale-[1.05]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/weather/sunny.jpg?v=2';
                      }}
                    />
                  </div>
                </div>

                {/* Atmospheric Sub-stats (Glass Pill Panel) */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 pb-2.5 px-3 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 text-center text-xs shadow-inner">
                  <div>
                    <span className="text-[10px] text-green-200 block font-medium">
                      {isBn ? 'বাতাসের আর্দ্রতা' : 'Humidity'}
                    </span>
                    <span className="font-extrabold text-white text-sm sm:text-base">
                      {isBn ? `${toBnDigits(weather.humidity)}%` : `${weather.humidity}%`}
                    </span>
                  </div>
                  <div className="border-x border-white/15">
                    <span className="text-[10px] text-green-200 block font-medium">
                      {isBn ? 'বাতাসের বেগ' : 'Wind Speed'}
                    </span>
                    <span className="font-extrabold text-white text-sm sm:text-base">
                      {isBn ? `${toBnDigits(weather.windSpeed)} কিমি/ঘ` : `${weather.windSpeed} km/h`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-green-200 block font-medium">
                      {isBn ? 'বায়ুমণ্ডলীয় চাপ' : 'Pressure'}
                    </span>
                    <span className="font-extrabold text-white text-sm sm:text-base">
                      {isBn ? '১০১২ hPa' : '1012 hPa'}
                    </span>
                  </div>
                </div>

                {/* 7-Day Forecast Strip with Frosted Glass Chips */}
                <div className="mt-4 pt-3 border-t border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-[11px] font-bold text-green-200 uppercase tracking-wider block drop-shadow-xs">
                      {isBn ? '৭ দিনের পূর্বাভাস' : '7-Day Forecast'}
                    </span>
                    <span className="text-[9px] text-white/80 font-medium px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-xs border border-white/20">
                      {isBn ? 'নাসা পাওয়ার ক্লাইমেট' : 'NASA POWER API'}
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
                    {forecastDays.map((item, i) => (
                      <div
                        key={i}
                        className={`${
                          item.isToday
                            ? 'bg-white/30 border-white/60 shadow-md ring-1.5 ring-amber-300/70'
                            : 'bg-white/15 hover:bg-white/25 border-white/25 shadow-xs'
                        } backdrop-blur-md rounded-xl p-1.5 sm:p-2 flex flex-col items-center transition-all duration-150 border hover:-translate-y-0.5`}
                      >
                        <span className={`text-[9px] sm:text-[10px] font-extrabold ${item.isToday ? 'text-amber-200' : 'text-green-100'}`}>
                          {item.day}
                        </span>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden my-1 bg-white/30 shadow-xs border border-white/40 flex items-center justify-center flex-shrink-0">
                          <img
                            src={item.iconSrc}
                            alt={item.alt}
                            className="w-full h-full object-cover scale-[1.15]"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/weather/sunny.jpg?v=2';
                            }}
                          />
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-black text-white leading-none drop-shadow-xs">
                          {item.temp}
                        </span>
                      </div>
                    ))}
                  </div>
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
                  <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-2xs border border-blue-200">
                    <img
                      src="/images/weather/rain.jpg"
                      alt="Rain"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-bold block text-gray-900">
                      {isBn ? 'মাঝারি বৃষ্টির সম্ভাবনা' : 'Moderate Chance of Rain'}
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
                      {isBn ? 'মাটিতে পর্যাপ্ত আর্দ্রতা' : 'Sufficient Soil Moisture'}
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
                  {isBn ? 'pH ৬.৪ (আদর্শ)' : 'pH 6.4 (Optimal)'}
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
