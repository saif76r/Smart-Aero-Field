import React, { useState } from 'react';
import { 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  Sparkles, 
  Globe, 
  CheckCircle2, 
  MapPin, 
  Sprout, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Language } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshAgriData';

interface LoginScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onLoginSuccess: (user: { name: string; phone: string; district: string; landSize: string }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  language,
  onToggleLanguage,
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
  const [regCrop, setRegCrop] = useState<string>('Rice (আমন ধান)');
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
    <div className="min-h-screen bg-gradient-to-b from-[#1E5128] via-[#245D31] to-[#F5F7F8] flex flex-col justify-center items-center px-3.5 sm:px-4 py-6 sm:py-8 pt-safe pb-safe">
      
      {/* Top Language Toggle */}
      <div className="w-full max-w-sm flex justify-end mb-3">
        <button
          type="button"
          onClick={onToggleLanguage}
          className="bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/25 flex items-center space-x-1.5 transition-all font-semibold"
        >
          <Globe className="w-3.5 h-3.5 text-[#D8E9A8]" />
          <span>{isBn ? 'English' : 'বাংলা'}</span>
        </button>
      </div>

      {/* Main Mobile Card Container */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Header Banner */}
        <div className="bg-[#1E5128] text-white p-6 text-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#4E9F3D]/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-[#D8E9A8]/20 rounded-full blur-xl pointer-events-none" />

          {/* KrishiGuide Logo */}
          <div className="w-18 h-18 mx-auto rounded-2xl bg-white p-1.5 shadow-lg border-2 border-[#4E9F3D] flex items-center justify-center mb-3">
            <img 
              src="/logo.png" 
              alt="KrishiGuide Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <h1 className="text-2xl font-black tracking-tight">
            Krishi<span className="text-[#D8E9A8]">Guide</span>
          </h1>
          <p className="text-xs text-green-100 font-medium mt-1">
            {isBn ? 'স্মার্ট কৃষি ও আবহাওয়া সহায়িকা' : 'Smart Agriculture & Climate Risk Assistant'}
          </p>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 p-1.5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setLoginError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
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
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white text-[#1E5128] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {isBn ? 'নতুন কৃষক নিবন্ধন' : 'Register Account'}
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {loginError}
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1 text-[#1E5128]" />
                  <span>{isBn ? 'মোবাইল নম্বর' : 'Mobile Number / Phone'}</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-[#F5F7F8] border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E5128] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center">
                    <Lock className="w-3.5 h-3.5 mr-1 text-[#1E5128]" />
                    <span>{isBn ? 'পাসওয়ার্ড / পিন' : 'Password / PIN'}</span>
                  </span>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert(isBn ? 'আপনার নিবন্ধিত নম্বরে পিন পাঠানো হয়েছে।' : 'A reset PIN was sent to your phone.'); }} className="text-[11px] text-[#1E5128] font-bold hover:underline">
                    {isBn ? 'পিন ভুলে গেছেন?' : 'Forgot PIN?'}
                  </a>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-[#F5F7F8] border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E5128] transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* District Selection at Login */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
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
                    className="w-full bg-[#F5F7F8] border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E5128] transition-all cursor-pointer"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-[11px] text-gray-500 mt-1 block">
                  {isBn 
                    ? '💡 এই জেলার ভিত্তিতে ড্যাশবোর্ডে ফসল ঝুঁকি ও আবহাওয়া পূর্বাভাস সরাসরি যুক্ত হবে।' 
                    : '💡 Crop suitability and NASA climate risk will automatically sync for this district.'}
                </span>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-[#1E5128] focus:ring-[#1E5128] w-4 h-4"
                  />
                  <span>{isBn ? 'আমাকে মনে রাখুন' : 'Remember me'}</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#1E5128] hover:bg-[#163e1e] active:scale-[0.99] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#D8E9A8]" />
                <span>{isBn ? 'লগইন করুন' : 'Sign In to KrishiGuide'}</span>
              </button>

              {/* 1-Click Demo Login */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#1E5128] font-bold rounded-xl border border-emerald-200 transition-all flex items-center justify-center space-x-2 text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isBn ? 'ডেমো কৃষক হিসেবে সরাসরি প্রবেশ (১-ক্লিক)' : '1-Click Demo Farmer Login'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* MODE: REGISTER */
            <form onSubmit={handleRegister} className="space-y-3.5">
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

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isBn ? 'জেলা' : 'District'}
                  </label>
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full bg-[#F5F7F8] border border-gray-200 text-gray-900 rounded-xl p-2 text-xs font-semibold focus:ring-2 focus:ring-[#1E5128] outline-none"
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
                  className="w-full bg-[#F5F7F8] border border-gray-200 text-gray-900 rounded-xl p-2 text-xs font-semibold focus:ring-2 focus:ring-[#1E5128] outline-none"
                >
                  <option value="Rice (আমন ধান)">Rice (আমন ধান)</option>
                  <option value="Rice (বোরো ধান)">Rice (বোরো ধান)</option>
                  <option value="Potato (আলু)">Potato (আলু)</option>
                  <option value="Wheat (গম)">Wheat (গম)</option>
                  <option value="Maize (ভুট্টা)">Maize (ভুট্টা)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1E5128] hover:bg-[#163e1e] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm mt-2"
              >
                <UserPlus className="w-4 h-4 text-[#D8E9A8]" />
                <span>{isBn ? 'নিবন্ধন সম্পন্ন করুন' : 'Register & Enter App'}</span>
              </button>
            </form>
          )}

          {/* Footer Security Badge */}
          <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-center space-x-1 text-[11px] text-gray-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4E9F3D]" />
            <span>{isBn ? 'বাংলাদেশ কৃষি সম্প্রসারণ ও নাসা স্যাটেলাইট সংহত' : 'Integrated with DAE & NASA Satellite Feeds'}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-white/75 mt-4 text-center font-medium">
        © 2026 KrishiGuide • All Rights Reserved
      </p>
    </div>
  );
};
