import React, { useState } from 'react';
import { 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Sprout, 
  ArrowRight,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { Language } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshAgriData';

interface LoginScreenProps {
  language: Language;
  onToggleLanguage?: () => void;
  onBackToLanguageSelect?: () => void;
  onLoginSuccess: (user: { name: string; phone: string; district: string; landSize: string }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  language,
  onToggleLanguage,
  onBackToLanguageSelect,
  onLoginSuccess,
}) => {
  const isBn = language === 'bn';

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginPhone, setLoginPhone] = useState<string>('01711-234567');
  const [loginPassword, setLoginPassword] = useState<string>('123456');
  const [loginDistrict, setLoginDistrict] = useState<string>('Rajshahi');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register fields
  const [regName, setRegName] = useState<string>('Md. Nasirul Islam');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regDistrict, setRegDistrict] = useState<string>('Rajshahi');
  const [regCrop, setRegCrop] = useState<string>('Rice (Aman)');
  const [regLandSize, setRegLandSize] = useState<string>('3.5');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim()) {
      setLoginError(isBn ? 'অনুগ্রহ করে মোবাইল নম্বর লিখুন' : 'Please enter your mobile number');
      return;
    }
    setLoginError(null);
    onLoginSuccess({
      name: 'Md. Nasirul Islam',
      phone: loginPhone,
      district: loginDistrict,
      landSize: '3.5',
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      setLoginError(isBn ? 'নাম এবং মোবাইল নম্বর বাধ্যতামূলক' : 'Name and mobile number are required');
      return;
    }
    setLoginError(null);
    onLoginSuccess({
      name: regName,
      phone: regPhone,
      district: regDistrict,
      landSize: regLandSize,
    });
  };

  const handleDemoLogin = () => {
    onLoginSuccess({
      name: 'Md. Nasirul Islam',
      phone: '01711-234567',
      district: loginDistrict,
      landSize: '3.5',
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1E5128] via-[#245D31] to-[#163E1E] flex flex-col justify-center items-center px-3 sm:px-4 py-3 sm:py-6 pt-safe pb-safe overflow-y-auto">
      
      {/* Main Mobile Card Container */}
      <div className="w-full max-w-sm bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Header Banner */}
        <div className="bg-[#1E5128] text-white p-3.5 sm:p-5 text-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#4E9F3D]/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-[#D8E9A8]/20 rounded-full blur-xl pointer-events-none" />

          {/* Back to Language Selection Button */}
          {onBackToLanguageSelect && (
            <button
              type="button"
              onClick={onBackToLanguageSelect}
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-[10px] font-bold flex items-center space-x-1 backdrop-blur-sm transition-all cursor-pointer z-10"
              title={isBn ? 'ভাষা নির্বাচন স্ক্রিনে ফিরে যান' : 'Back to Language Selection'}
            >
              <Languages className="w-3 h-3 text-[#D8E9A8]" />
              <span>{isBn ? 'ভাষা পরিবর্তন' : 'Language'}</span>
            </button>
          )}

          {/* Quick toggle if available */}
          {onToggleLanguage && !onBackToLanguageSelect && (
            <button
              type="button"
              onClick={onToggleLanguage}
              className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[10px] font-bold flex items-center space-x-1 backdrop-blur-sm transition-all cursor-pointer z-10"
            >
              <Languages className="w-3 h-3 text-[#D8E9A8]" />
              <span>{isBn ? 'EN' : 'বাংলা'}</span>
            </button>
          )}

          {/* KrishiGuide Logo */}
          <div className="w-12 h-12 sm:w-15 sm:h-15 mx-auto rounded-full bg-white shadow-md border-2 border-white/90 flex items-center justify-center mb-1.5 sm:mb-2 overflow-hidden">
            <img 
              src="/logo.png" 
              alt="KrishiGuide Logo" 
              className="w-full h-full object-cover scale-[1.12]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Krishi<span className="text-[#D8E9A8]">Guide</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-green-100 font-medium mt-0.5">
            {isBn ? 'স্মার্ট কৃষি ও আবহাওয়া সহায়িকা' : 'Smart Agriculture & Climate Risk Assistant'}
          </p>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 p-1 sm:p-1.5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setLoginError(null);
            }}
            className={`flex-1 py-2 sm:py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#1E5128] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {isBn ? 'লগইন করুন' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setLoginError(null);
            }}
            className={`flex-1 py-2 sm:py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-[#1E5128] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {isBn ? 'নতুন কৃষক নিবন্ধন' : 'Register Account'}
          </button>
        </div>

        {/* Form Body */}
        <div className="p-3.5 sm:p-5">
          {loginError && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {loginError}
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1 text-[#1E5128]" />
                  <span>{isBn ? 'মোবাইল নম্বর' : 'Mobile Number / Phone'}</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-[#F5F7F8] border border-gray-200 text-gray-900 rounded-xl px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E5128] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center">
                    <Lock className="w-3.5 h-3.5 mr-1 text-[#1E5128]" />
                    <span>{isBn ? 'পাসওয়ার্ড / পিন' : 'Password / PIN'}</span>
                  </span>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert(isBn ? 'আপনার নিবন্ধিত নম্বরে পিন পাঠানো হয়েছে।' : 'A reset PIN was sent to your phone.'); }} className="text-[10px] sm:text-[11px] text-[#1E5128] font-bold hover:underline">
                    {isBn ? 'পিন ভুলে গেছেন?' : 'Forgot PIN?'}
                  </a>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-[#F5F7F8] border border-gray-200 text-gray-900 rounded-xl px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E5128] transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* District Selection at Login */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-[#1E5128]" />
                    <span>{isBn ? 'আপনার জেলা নির্বাচন করুন' : 'Select District'}</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                    {isBn ? 'আবহাওয়া অটো-সিঙ্ক' : 'Auto Sync'}
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={loginDistrict}
                    onChange={(e) => setLoginDistrict(e.target.value)}
                    className="w-full bg-[#F5F7F8] border border-gray-200 text-gray-900 rounded-xl px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E5128] transition-all cursor-pointer"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-[10px] sm:text-[11px] text-gray-500 mt-1 block leading-tight">
                  {isBn 
                    ? '💡 এই জেলার ভিত্তিতে ফসল ঝুঁকি ও আবহাওয়া সরাসরি যুক্ত হবে।' 
                    : '💡 Crop suitability and climate risk will automatically sync.'}
                </span>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-[#1E5128] focus:ring-[#1E5128] w-3.5 h-3.5 sm:w-4 sm:h-4"
                  />
                  <span className="text-xs">{isBn ? 'আমাকে মনে রাখুন' : 'Remember me'}</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 sm:py-3 bg-[#1E5128] hover:bg-[#163e1e] active:scale-[0.99] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#D8E9A8]" />
                <span>{isBn ? 'লগইন করুন' : 'Sign In to KrishiGuide'}</span>
              </button>

              {/* 1-Click Demo Login */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2 sm:py-2.5 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-[#1E5128] font-bold rounded-xl border border-emerald-200 transition-all flex items-center justify-center space-x-1.5 text-[11px] sm:text-xs cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span className="truncate">{isBn ? 'ডেমো কৃষক হিসেবে সরাসরি প্রবেশ (১-ক্লিক)' : '1-Click Demo Farmer Login'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* MODE: REGISTER */
            <form onSubmit={handleRegister} className="space-y-2.5 sm:space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isBn ? 'কৃষকের পুরো নাম' : 'Farmer Full Name'}
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Md. Nasirul Islam"
                  className="w-full bg-[#F5F7F8] border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#1E5128] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isBn ? 'মোবাইল নম্বর' : 'Mobile Number'}
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-[#F5F7F8] border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#1E5128] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? 'জেলা' : 'District'}
                  </label>
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full bg-[#F5F7F8] border border-gray-200 text-gray-900 rounded-xl p-2 text-xs font-semibold focus:ring-2 focus:ring-[#1E5128] outline-none cursor-pointer"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? 'আবাদি জমি (একর)' : 'Land (Acres)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={regLandSize}
                    onChange={(e) => setRegLandSize(e.target.value)}
                    className="w-full bg-[#F5F7F8] border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#1E5128] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isBn ? 'প্রধান ফসল' : 'Primary Crop'}
                </label>
                <select
                  value={regCrop}
                  onChange={(e) => setRegCrop(e.target.value)}
                  className="w-full bg-[#F5F7F8] border border-gray-200 text-gray-900 rounded-xl p-2 text-xs font-semibold focus:ring-2 focus:ring-[#1E5128] outline-none cursor-pointer"
                >
                  <option value="Rice (Aman)">{isBn ? 'আমন ধান' : 'Rice (Aman)'}</option>
                  <option value="Rice (Boro)">{isBn ? 'বোরো ধান' : 'Rice (Boro)'}</option>
                  <option value="Potato">{isBn ? 'আলু' : 'Potato'}</option>
                  <option value="Wheat">{isBn ? 'গম' : 'Wheat'}</option>
                  <option value="Maize">{isBn ? 'ভুট্টা' : 'Maize / Corn'}</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 sm:py-3 bg-[#1E5128] hover:bg-[#163e1e] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm mt-1 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#D8E9A8]" />
                <span>{isBn ? 'নিবন্ধন সম্পন্ন করুন' : 'Register & Enter App'}</span>
              </button>
            </form>
          )}

          {/* Footer Security Badge */}
          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-100 flex items-center justify-center space-x-1 text-[10px] sm:text-[11px] text-gray-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4E9F3D] flex-shrink-0" />
            <span className="text-center">{isBn ? 'বাংলাদেশ কৃষি সম্প্রসারণ ও নাসা স্যাটেলাইট সংহত' : 'Integrated with DAE & NASA Satellite Feeds'}</span>
          </div>
        </div>
      </div>

      <p className="text-[10px] sm:text-xs text-white/75 mt-2.5 sm:mt-3 text-center font-medium">
        © 2026 KrishiGuide • All Rights Reserved
      </p>
    </div>
  );
};
