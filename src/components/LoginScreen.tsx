import React, { useState } from 'react';
import { 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1E5128] via-[#245D31] to-[#163E1E] flex flex-col justify-center items-center px-3 sm:px-4 py-3 sm:py-6 pt-safe pb-safe overflow-y-auto">
      
      {/* Main Mobile Card Container */}
      <div className="w-full max-w-sm bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Header Banner */}
        <div className="bg-[#1E5128] text-white pt-7 pb-6 px-6 text-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#4E9F3D]/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-[#D8E9A8]/20 rounded-full blur-xl pointer-events-none" />

          {/* Back to Language Selection Button */}
          {onBackToLanguageSelect && (
            <button
              type="button"
              onClick={onBackToLanguageSelect}
              className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-[11px] font-semibold flex items-center space-x-1.5 backdrop-blur-sm transition-all cursor-pointer z-10 border border-white/20"
              title={isBn ? 'ভাষা পরিবর্তন' : 'Language'}
            >
              <Languages className="w-3.5 h-3.5 text-[#D8E9A8]" />
              <span>{isBn ? 'ভাষা' : 'Language'}</span>
            </button>
          )}

          {/* Quick toggle if available */}
          {onToggleLanguage && !onBackToLanguageSelect && (
            <button
              type="button"
              onClick={onToggleLanguage}
              className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold flex items-center space-x-1 backdrop-blur-sm transition-all cursor-pointer z-10 border border-white/20"
            >
              <Languages className="w-3.5 h-3.5 text-[#D8E9A8]" />
              <span>{isBn ? 'EN' : 'বাং'}</span>
            </button>
          )}

          {/* Large, Prominent Circular Smart Aero Field Logo */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-white shadow-2xl p-1 flex items-center justify-center mb-3 border-3 border-white/95 overflow-hidden transition-transform hover:scale-105">
            <img 
              src="/logo.png" 
              alt="Smart Aero Field" 
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white leading-tight">
            Smart Aero <span className="text-[#D8E9A8]">Field</span>
          </h1>
          <p className="text-xs text-emerald-100 font-medium mt-1">
            {isBn ? 'স্মার্ট কৃষি ও ক্লাইমেট প্ল্যাটফর্ম' : 'Smart Agriculture & Climate Platform'}
          </p>
        </div>

        {/* Clean Segmented Tab Switcher: Login vs Register */}
        <div className="p-3 bg-gray-50 border-b border-gray-100">
          <div className="bg-gray-200/70 p-1 rounded-2xl flex">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLoginError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                mode === 'login'
                  ? 'bg-white text-[#1E5128] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
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
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                mode === 'register'
                  ? 'bg-white text-[#1E5128] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isBn ? 'নতুন নিবন্ধন' : 'Register Account'}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6">
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
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-[#1E5128]" />
                  <span>{isBn ? 'মোবাইল নম্বর' : 'Mobile Number'}</span>
                </label>
                <input
                  type="text"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E5128] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-[#1E5128]" />
                  <span>{isBn ? 'পাসওয়ার্ড / পিন' : 'Password / PIN'}</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E5128] focus:bg-white transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot PIN Row */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-[#1E5128] focus:ring-[#1E5128] w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium">{isBn ? 'আমাকে মনে রাখুন' : 'Remember me'}</span>
                </label>

                <a
                  href="#forgot"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    alert(isBn ? 'আপনার নম্বরে পিন পাঠানো হয়েছে।' : 'A reset PIN was sent to your phone.'); 
                  }} 
                  className="text-xs text-[#1E5128] font-bold hover:underline"
                >
                  {isBn ? 'পিন ভুলে গেছেন?' : 'Forgot PIN?'}
                </a>
              </div>

              {/* Primary Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#1E5128] hover:bg-[#163E1E] active:scale-[0.99] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-[#D8E9A8]" />
                  <span>{isBn ? 'লগইন করুন' : 'Sign In'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* MODE: REGISTER */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isBn ? 'কৃষকের পুরো নাম' : 'Farmer Full Name'}
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Md. Nasirul Islam"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-[#1E5128] outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isBn ? 'মোবাইল নম্বর' : 'Mobile Number'}
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-[#1E5128] outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isBn ? 'জেলা' : 'District'}
                  </label>
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-2.5 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#1E5128] outline-none cursor-pointer focus:bg-white"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isBn ? 'আবাদি জমি (একর)' : 'Land (Acres)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={regLandSize}
                    onChange={(e) => setRegLandSize(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-[#1E5128] outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isBn ? 'প্রধান ফসল' : 'Primary Crop'}
                </label>
                <select
                  value={regCrop}
                  onChange={(e) => setRegCrop(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-2.5 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#1E5128] outline-none cursor-pointer focus:bg-white"
                >
                  <option value="Rice (Aman)">{isBn ? 'আমন ধান' : 'Rice (Aman)'}</option>
                  <option value="Rice (Boro)">{isBn ? 'বোরো ধান' : 'Rice (Boro)'}</option>
                  <option value="Potato">{isBn ? 'আলু' : 'Potato'}</option>
                  <option value="Wheat">{isBn ? 'গম' : 'Wheat'}</option>
                  <option value="Maize">{isBn ? 'ভুট্টা' : 'Maize / Corn'}</option>
                </select>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#1E5128] hover:bg-[#163E1E] active:scale-[0.99] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#D8E9A8]" />
                  <span>{isBn ? 'নিবন্ধন সম্পন্ন করুন' : 'Complete Registration'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Footer Security Badge */}
          <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-center space-x-1.5 text-xs text-gray-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="text-center">{isBn ? 'ডিএই ও নাসা স্যাটেলাইট সংহত' : 'Integrated with DAE & NASA Feeds'}</span>
          </div>
        </div>
      </div>

      <p className="text-[10px] sm:text-xs text-white/75 mt-2.5 sm:mt-3 text-center font-medium">
        © 2026 Smart Aero Field • All Rights Reserved
      </p>
    </div>
  );
};
