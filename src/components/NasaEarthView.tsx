import React, { useState, useEffect } from 'react';
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
  Layers, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { Language } from '../types';
import { RiskPredictorCard } from './RiskPredictorCard';
import { getDistrictWeather, getDistrictLandData, getLiveDateDisplay } from '../data/weatherData';
import { BANGLADESH_DISTRICTS, getDistrictNameBn } from '../data/bangladeshAgriData';

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

  // Interactive district selection that syncs with prop but allows instant live switching
  const [currentDistrict, setCurrentDistrict] = useState<string>(selectedDistrict || 'Dhaka');

  useEffect(() => {
    if (selectedDistrict) {
      setCurrentDistrict(selectedDistrict);
    }
  }, [selectedDistrict]);

  // Live real-time district weather, land condition and soil telemetry
  const weather = getDistrictWeather(currentDistrict);
  const landData = getDistrictLandData(currentDistrict);
  const liveDate = getLiveDateDisplay(isBn);

  const toBnDigits = (val: number | string) =>
    String(val).replace(/\d/g, (ch) => '০১২৩৪৫৬৭৮৯'[parseInt(ch, 10)]);

  // Dynamically calculate 7-day forecast starting from today
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
    <div className="space-y-4">
      {/* Top Header Card - With Real Satellite Earth Picture Background */}
      <div className="rounded-2xl sm:rounded-3xl text-white p-4 sm:p-5 shadow-lg relative overflow-hidden border border-blue-900/50">
        {/* Real Satellite Earth Picture Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/images/satellite_earth.jpg"
            alt="NASA Satellite Earth Imagery"
            className="w-full h-full object-cover object-center scale-100"
          />
          {/* Multi-layer gradient so the Earth picture is clearly visible and rich, with 100% crisp text */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/75 to-blue-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-cyan-500/15" />
        </div>

        <div className="relative z-10">
          {/* Back & Title */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 mb-3.5 sm:mb-4">
            <button
              id="nasa-back-btn"
              type="button"
              onClick={onBack}
              className="p-2 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 text-white transition-colors flex-shrink-0 cursor-pointer backdrop-blur-xs border border-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 shadow-md flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-cyan-400/60 ring-2 ring-blue-500/20">
              <img
                src="/images/nasa_logo.svg"
                alt="NASA Logo"
                className="w-full h-full object-cover scale-[1.04]"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-lg sm:text-xl font-black flex items-center gap-1.5 truncate text-white">
                  <span>NASA Earth Data</span>
                  <span className="text-[10px] bg-blue-500/30 border border-blue-400/40 text-cyan-200 px-2 py-0.5 rounded-full font-bold uppercase flex-shrink-0 backdrop-blur-xs">
                    POWER API
                  </span>
                </h1>
                {/* Compact District Switcher in Top Bar */}
                <div className="flex items-center space-x-1 bg-white/15 backdrop-blur-md px-2 py-1 rounded-xl border border-white/25 shadow-xs">
                  <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <select
                    id="nasa-header-district-select"
                    value={currentDistrict}
                    onChange={(e) => setCurrentDistrict(e.target.value)}
                    className="bg-transparent text-white font-bold text-xs border-none outline-none cursor-pointer focus:ring-0 pr-1 py-0"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d} className="bg-slate-900 text-white">
                        {isBn ? `${getDistrictNameBn(d)} (${d})` : d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs text-slate-200 truncate mt-0.5">
                {isBn ? `${getDistrictNameBn(currentDistrict)} জেলার স্যাটেলাইট ও মৃত্তিকা তথ্য` : `Satellite & soil telemetry for ${currentDistrict}`}
              </p>
            </div>
          </div>

          {/* Segmented Filter Control: Clean 4-Column Grid, No Overflow */}
          <div className="bg-black/40 p-1 rounded-2xl grid grid-cols-4 gap-1 backdrop-blur-md border border-white/20 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('risk')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all text-center truncate cursor-pointer ${
                activeTab === 'risk'
                  ? 'bg-white text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
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
                  ? 'bg-white text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
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
                  ? 'bg-white text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {isBn ? 'আবহাওয়া' : 'Weather'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('soil')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all text-center truncate cursor-pointer ${
                activeTab === 'soil'
                  ? 'bg-white text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="sm:hidden">{isBn ? 'মাটি' : 'Soil'}</span>
              <span className="hidden sm:inline">{isBn ? 'মাটি ও আর্দ্রতা' : 'Soil & Moisture'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-4 space-y-4">
        {/* Tab 0: Agriculture Risk & Crop Suitability Predictor */}
        {activeTab === 'risk' && (
          <div>
            <RiskPredictorCard
              language={language}
              userDistrict={currentDistrict}
              onNavigateToCropGuide={onNavigateToCropGuide}
              onOpenChatWithTopic={onOpenChatWithTopic}
            />
          </div>
        )}

        {/* Tab 1: Land Condition (Dynamic per District) */}
        {activeTab === 'land' && (
          <div className="space-y-4">
            {/* Satellite Map Preview Card */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 h-48 border border-gray-200 shadow-sm">
              <img
                src="/images/aerial_field.jpg"
                alt="Satellite Field NDVI"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
              {/* Location Pill with Interactive Selector */}
              <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-xs font-medium flex items-center space-x-1.5 border border-white/20 shadow-lg">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <select
                  id="nasa-land-district-selector"
                  value={currentDistrict}
                  onChange={(e) => setCurrentDistrict(e.target.value)}
                  className="bg-transparent text-white font-bold text-xs border-none outline-none cursor-pointer focus:ring-0 pr-1 py-0.5"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d} value={d} className="bg-slate-900 text-white">
                      {isBn ? `${getDistrictNameBn(d)} (${d})` : `${d}, Bangladesh`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic NDVI banner badge for selected district */}
              <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-400/50 flex items-center space-x-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span>
                  NDVI: {landData.ndvi} ({isBn ? landData.ndviStatusBn : landData.ndviStatusEn})
                </span>
              </div>
            </div>

            {/* 4 Metric Cards - Fully Dynamic per selected district */}
            <div className="grid grid-cols-2 gap-3">
              {/* NDVI */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-3 transition-all hover:shadow-md">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase block">NDVI</span>
                  <span className="text-base font-black text-gray-900">{landData.ndvi}</span>
                  <span className="text-[10px] font-bold text-emerald-600 block truncate">
                    {isBn ? landData.ndviStatusBn : landData.ndviStatusEn}
                  </span>
                </div>
              </div>

              {/* Soil Moisture */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-3 transition-all hover:shadow-md">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase block">
                    {isBn ? 'মাটির আর্দ্রতা' : 'Soil Moisture'}
                  </span>
                  <span className="text-base font-black text-gray-900">
                    {isBn ? `${toBnDigits(landData.soilMoisture)}%` : `${landData.soilMoisture}%`}
                  </span>
                  <span className={`text-[10px] font-bold block truncate ${landData.soilMoisture < 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {isBn ? landData.soilMoistureStatusBn : landData.soilMoistureStatusEn}
                  </span>
                </div>
              </div>

              {/* Temperature */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-3 transition-all hover:shadow-md">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase block">
                    {isBn ? 'তাপমাত্রা' : 'Temperature'}
                  </span>
                  <span className="text-base font-black text-gray-900">
                    {isBn ? `${toBnDigits(landData.temp)} °সে` : `${landData.temp} °C`}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 block truncate">
                    {isBn ? landData.tempStatusBn : landData.tempStatusEn}
                  </span>
                </div>
              </div>

              {/* Rainfall */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-3 transition-all hover:shadow-md">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
                  <CloudRain className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase block">
                    {isBn ? 'বৃষ্টিপাত' : 'Rain Fall'}
                  </span>
                  <span className="text-base font-black text-gray-900">
                    {isBn ? `${toBnDigits(landData.rainFall7d)} মিমি` : `${landData.rainFall7d} mm`}
                  </span>
                  <span className="text-[10px] text-gray-500 block">
                    ({isBn ? 'গত ৭ দিন' : 'last 7 days'})
                  </span>
                </div>
              </div>
            </div>

            {/* Regional AEZ Classification Banner */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span className="font-semibold text-emerald-900">
                  {isBn ? landData.aezNameBn : landData.aezNameEn}
                </span>
              </div>
              <span className="text-[10px] font-bold bg-white text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full shadow-2xs">
                NASA MODIS & BARC
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Weather & Forecast */}
        {activeTab === 'weather' && (
          <div className="space-y-4">
            {/* Weather Card with Picture-Type Glassy Atmosphere */}
            <div className="rounded-3xl p-5 text-white shadow-xl relative overflow-hidden border border-white/35 backdrop-blur-md">
              {/* Scenic Background Picture */}
              <img
                src="/images/weather_bg.jpg"
                alt="Atmospheric Weather Sky"
                className="absolute inset-0 w-full h-full object-cover scale-105 filter saturate-[1.15] brightness-90 transition-transform duration-700 hover:scale-110"
                onError={(e) => {
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
                      <select
                        id="nasa-weather-district-select"
                        value={currentDistrict}
                        onChange={(e) => setCurrentDistrict(e.target.value)}
                        className="bg-transparent text-white font-bold text-xs border-none outline-none cursor-pointer focus:ring-0 pr-1 py-0"
                      >
                        {BANGLADESH_DISTRICTS.map((d) => (
                          <option key={d} value={d} className="bg-slate-900 text-white">
                            {isBn ? `${getDistrictNameBn(d)} (${d})` : `${d}, Bangladesh`}
                          </option>
                        ))}
                      </select>
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

                {/* Atmospheric Sub-stats */}
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
                      {isBn ? 'বৃষ্টিপাতের ঝুঁকি' : 'Rain Chance'}
                    </span>
                    <span className="font-extrabold text-white text-sm sm:text-base">
                      {isBn ? `${toBnDigits(weather.rainChance)}%` : `${weather.rainChance}%`}
                    </span>
                  </div>
                </div>

                {/* 7-Day Forecast Strip */}
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

            {/* Farming Guidance for Current Weather */}
            <div className="bg-[#E7F7ED] border border-[#BDE8CB] rounded-2xl p-4 text-gray-900 shadow-sm">
              <h4 className="text-xs font-bold text-[#1E5128] uppercase tracking-wider mb-3">
                {isBn ? `${currentDistrict} অঞ্চলের জন্য চাষের গুরুত্বপূর্ণ তথ্য` : `Farming Guidance for ${currentDistrict}`}
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
                      {weather.rainChance > 40
                        ? (isBn ? 'বৃষ্টিপাতের উচ্চ সম্ভাবনা' : 'High Chance of Rain')
                        : (isBn ? 'স্বল্প বৃষ্টির সম্ভাবনা' : 'Low Chance of Rain')}
                    </span>
                    <span className="text-[11px] text-gray-600">
                      {weather.rainChance > 40
                        ? (isBn ? 'জমির নিচু অংশে নিষ্কাশন নিশ্চিত করুন। সার প্রয়োগ স্থগিত রাখুন।' : 'Ensure field drainage. Postpone fertilizer broadcasting.')
                        : (isBn ? 'হালকা আর্দ্রতা রয়েছে, প্রয়োজনীয় সেচের পরিকল্পনা নিন।' : 'Soil moisture stable, plan irrigation as scheduled.')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pb-2 border-b border-green-200/60">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-bold block text-gray-900">
                      {isBn ? `মাটির আর্দ্রতা: ${toBnDigits(landData.soilMoisture)}%` : `Soil Moisture: ${landData.soilMoisture}%`}
                    </span>
                    <span className="text-[11px] text-gray-600">
                      {landData.soilMoisture < 30
                        ? (isBn ? 'মাটির আর্দ্রতা কম, দ্রুত সেচ প্রদান জরুরি।' : 'Soil moisture is low, timely irrigation recommended.')
                        : (isBn ? 'মাটিতে উপযুক্ত আর্দ্রতা বিরাজমান।' : 'Optimal soil wetness, no excess water needed.')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-bold block text-gray-900">
                      {isBn ? `তাপমাত্রা: ${toBnDigits(landData.temp)} °সে (${landData.tempStatusBn})` : `Temperature: ${landData.temp} °C (${landData.tempStatusEn})`}
                    </span>
                    <span className="text-[11px] text-gray-600">
                      {isBn ? 'ফসলের বৃদ্ধি ও পরাগায়নের জন্য অনুকূল পরিবেশ।' : 'Favorable thermal conditions for active growth and grain filling.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Soil & Moisture (Dynamic per District) */}
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
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900">
                    {isBn ? `${currentDistrict} মাটির স্বাস্থ্য প্রোফাইল` : `${currentDistrict} Soil Health Profile`}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {isBn ? 'BARC সারগ্রন্থ' : 'BARC AEZ'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5 font-medium">
                  {isBn ? landData.soilTextureBn : landData.soilTextureEn}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {isBn ? `pH ${toBnDigits(landData.soilPh)} (${landData.soilPhStatusBn})` : `pH ${landData.soilPh} (${landData.soilPhStatusEn})`}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {isBn ? landData.aezNameBn : landData.aezNameEn}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-[10px] font-medium text-gray-500 block">Nitrogen (N)</span>
                <span className="font-bold text-xs text-amber-700">{isBn ? landData.nitrogenBn : landData.nitrogenEn}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-[10px] font-medium text-gray-500 block">Phosphorus (P)</span>
                <span className="font-bold text-xs text-emerald-700">{isBn ? landData.phosphorusBn : landData.phosphorusEn}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-[10px] font-medium text-gray-500 block">Potassium (K)</span>
                <span className="font-bold text-xs text-emerald-700">{isBn ? landData.potassiumBn : landData.potassiumEn}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenChatWithTopic?.(`What organic manure and fertilizer doses should I add for ${landData.soilTextureEn} in ${currentDistrict} district of Bangladesh?`)}
              className="w-full py-2.5 bg-[#1E5128] hover:bg-[#163e1e] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <span>{isBn ? `${currentDistrict} মাটির জন্য সারের সঠিক মাত্রা জানুন` : `Get Fertilizer Recommendation for ${currentDistrict}`}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
