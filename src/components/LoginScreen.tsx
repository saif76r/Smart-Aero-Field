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
  Languages,
  AlertCircle,
  Loader2,
  UserCheck
} from 'lucide-react';
import { Language } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshAgriData';
import { 
  verifyFarmerLogin, 
  registerFarmerAccount, 
  normalizePhone 
} from '../lib/firestoreService';

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
  
  // Loading & error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [notRegisteredAttempt, setNotRegisteredAttempt] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Login fields - clean and empty (no dummy presets)
  const [loginPhone, setLoginPhone] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Register fields - clean and empty
  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPin, setRegPin] = useState<string>('');
  const [showRegPin, setShowRegPin] = useState<boolean>(false);
  const [regDistrict, setRegDistrict] = useState<string>('ঢাকা');
  const [regCrop, setRegCrop] = useState<string>('Rice (Aman)');
  const [regLandSize, setRegLandSize] = useState<string>('১.০');

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setNotRegisteredAttempt(null);

    const cleanInputPhone = normalizePhone(loginPhone);
    if (!cleanInputPhone) {
      setLoginError(isBn ? 'অনুগ্রহ করে আপনার মোবাইল নম্বর লিখুন' : 'Please enter your mobile number');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError(isBn ? 'অনুগ্রহ করে আপনার গোপন পিন বা পাসওয়ার্ড লিখুন' : 'Please enter your password / PIN');
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyFarmerLogin(loginPhone, loginPassword);

      if (!result.success) {
        if (result.errorType === 'NOT_REGISTERED') {
          setNotRegisteredAttempt(loginPhone);
          setLoginError(
            isBn 
              ? '❌ এই মোবাইল নম্বরটি নিবন্ধিত নয়! অ্যাপটি ব্যবহারের আগে অনুগ্রহ করে নিচে "নতুন নিবন্ধন" করুন।'
              : '❌ This mobile number is not registered! Please create an account before logging in.'
          );
        } else if (result.errorType === 'INVALID_PIN') {
          setLoginError(
            isBn
              ? 'ভুল পিন বা পাসওয়ার্ড! অনুগ্রহ করে সঠিক পিন প্রদান করুন।'
              : 'Incorrect PIN or password. Please try again.'
          );
        } else {
          setLoginError(result.error || (isBn ? 'লগইন করা সম্ভব হয়নি' : 'Login failed'));
        }
        setIsLoading(false);
        return;
      }

      if (result.user) {
        setSuccessNotice(isBn ? `স্বাগতম, ${result.user.name}!` : `Welcome back, ${result.user.name}!`);
        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 500);
      }
    } catch (err) {
      console.error(err);
      setLoginError(isBn ? 'সংযোগ সমস্যা, আবার চেষ্টা করুন' : 'Network error, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setNotRegisteredAttempt(null);

    if (!regName.trim()) {
      setLoginError(isBn ? 'কৃষকের পুরো নাম লিখুন' : 'Please enter your full name');
      return;
    }
    const cleanPhone = normalizePhone(regPhone);
    if (!cleanPhone || cleanPhone.length < 10) {
      setLoginError(isBn ? 'সঠিক মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)' : 'Please enter a valid mobile number');
      return;
    }
    if (!regPin.trim() || regPin.trim().length < 4) {
      setLoginError(isBn ? 'কমপক্ষে ৪ ডিজিটের একটি পিন বা পাসওয়ার্ড লিখুন' : 'Please enter a PIN (at least 4 digits)');
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerFarmerAccount({
        name: regName.trim(),
        phone: regPhone.trim(),
        pin: regPin.trim(),
        district: regDistrict,
        landSize: regLandSize,
        crop: regCrop,
      });

      if (!result.success) {
        setLoginError(result.error || (isBn ? 'নিবন্ধন করা সম্ভব হয়নি' : 'Registration failed'));
        setIsLoading(false);
        return;
      }

      if (result.user) {
        setSuccessNotice(isBn ? `নিবন্ধন সফল হয়েছে! স্বাগতম, ${result.user.name}।` : `Registration successful! Welcome, ${result.user.name}.`);
        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 600);
      }
    } catch (err) {
      console.error(err);
      setLoginError(isBn ? 'সংযোগ সমস্যা, আবার চেষ্টা করুন' : 'Network error, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick switch from unregistered warning to registration tab
  const handleSwitchToRegister = () => {
    setMode('register');
    if (notRegisteredAttempt) {
      setRegPhone(notRegisteredAttempt);
    }
    setLoginError(null);
    setNotRegisteredAttempt(null);
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
                setNotRegisteredAttempt(null);
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
                setNotRegisteredAttempt(null);
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
          {/* Success Notice */}
          {successNotice && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Unregistered Alert Banner with Quick Switch Button */}
          {loginError && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-medium space-y-2">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{loginError}</div>
              </div>

              {notRegisteredAttempt && (
                <button
                  type="button"
                  onClick={handleSwitchToRegister}
                  className="w-full mt-1.5 py-2 px-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isBn ? '👉 এখনই নিবন্ধন করুন (বিনামূল্যে)' : '👉 Register Now (Free)'}</span>
                </button>
              )}
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-[#1E5128]" />
                  <span>{isBn ? 'নিবন্ধিত মোবাইল নম্বর' : 'Registered Mobile Number'}</span>
                </label>
                <input
                  type="tel"
                  value={loginPhone}
                  onChange={(e) => {
                    setLoginPhone(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder={isBn ? 'যেমন: 017XXXXXXXX' : 'e.g. 017XXXXXXXX'}
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E5128] focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-normal"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  {isBn ? '* পূর্বে নিবন্ধন করা মোবাইল নম্বরটি লিখুন' : '* Enter your previously registered phone number'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-[#1E5128]" />
                  <span>{isBn ? 'পিন বা পাসওয়ার্ড' : 'PIN / Password'}</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder={isBn ? 'আপনার গোপন পিন (কমপক্ষে ৪ সংখ্যা)' : '••••••'}
                    required
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E5128] focus:bg-white transition-all pr-10 placeholder:text-gray-400 placeholder:font-normal"
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

              {/* Remember Me & Switch to Register Prompt */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-[#1E5128] focus:ring-[#1E5128] w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium">{isBn ? 'মনে রাখুন' : 'Remember me'}</span>
                </label>

                <button
                  type="button"
                  onClick={handleSwitchToRegister}
                  className="text-xs text-[#1E5128] font-bold hover:underline cursor-pointer"
                >
                  {isBn ? 'অ্যাকাউন্ট নেই? নিবন্ধন' : 'No account? Register'}
                </button>
              </div>

              {/* Primary Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#1E5128] hover:bg-[#163E1E] active:scale-[0.99] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D8E9A8]" />
                      <span>{isBn ? 'যাচাই করা হচ্ছে...' : 'Verifying account...'}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 text-[#D8E9A8]" />
                      <span>{isBn ? 'লগইন করুন' : 'Sign In'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* MODE: REGISTER */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center">
                  <UserCheck className="w-3.5 h-3.5 mr-1.5 text-[#1E5128]" />
                  <span>{isBn ? 'কৃষকের পুরো নাম *' : 'Farmer Full Name *'}</span>
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={isBn ? 'যেমন: মো: রফিকুল ইসলাম' : 'e.g. Md. Rafiqul Islam'}
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-[#1E5128] outline-none focus:bg-white placeholder:text-gray-400 placeholder:font-normal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-[#1E5128]" />
                  <span>{isBn ? 'মোবাইল নম্বর *' : 'Mobile Number *'}</span>
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder={isBn ? 'যেমন: 017XXXXXXXX' : '01XXXXXXXXX'}
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-[#1E5128] outline-none focus:bg-white placeholder:text-gray-400 placeholder:font-normal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-[#1E5128]" />
                  <span>{isBn ? 'গোপন পিন বা পাসওয়ার্ড (৪-৬ সংখ্যা) *' : 'PIN / Password (4-6 digits) *'}</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPin ? 'text' : 'password'}
                    value={regPin}
                    onChange={(e) => setRegPin(e.target.value)}
                    placeholder="যেমন: 1234"
                    maxLength={10}
                    required
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-[#1E5128] outline-none focus:bg-white pr-10 placeholder:text-gray-400 placeholder:font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPin(!showRegPin)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    {showRegPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-[#1E5128]" />
                    <span>{isBn ? 'জেলা' : 'District'}</span>
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
                    step="0.1"
                    min="0"
                    value={regLandSize}
                    onChange={(e) => setRegLandSize(e.target.value)}
                    placeholder="১.০"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-[#1E5128] outline-none focus:bg-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center">
                  <Sprout className="w-3.5 h-3.5 mr-1.5 text-[#1E5128]" />
                  <span>{isBn ? 'প্রধান ফসল' : 'Primary Crop'}</span>
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
                  <option value="Jute">{isBn ? 'পাট' : 'Jute'}</option>
                  <option value="Vegetables">{isBn ? 'শাকসবজি' : 'Vegetables'}</option>
                </select>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#1E5128] hover:bg-[#163E1E] active:scale-[0.99] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D8E9A8]" />
                      <span>{isBn ? 'নিবন্ধন করা হচ্ছে...' : 'Registering...'}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 text-[#D8E9A8]" />
                      <span>{isBn ? 'নিবন্ধন সম্পন্ন করুন' : 'Complete Registration'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setLoginError(null);
                  }}
                  className="text-xs text-gray-500 hover:text-[#1E5128] font-semibold cursor-pointer"
                >
                  {isBn ? 'ইতিমধ্যে নিবন্ধিত? লগইন করুন' : 'Already registered? Sign In'}
                </button>
              </div>
            </form>
          )}

          {/* Footer Security Badge */}
          <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-center space-x-1.5 text-xs text-gray-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="text-center">{isBn ? 'ডিএই ও নাসা স্যাটেলাইট সংহত • ফায়ারবেস ক্লাউড সংরক্ষিত' : 'DAE & NASA Satellite Feeds • Firebase Cloud Secured'}</span>
          </div>
        </div>
      </div>

      <p className="text-[10px] sm:text-xs text-white/75 mt-2.5 sm:mt-3 text-center font-medium">
        © 2026 Smart Aero Field • All Rights Reserved
      </p>
    </div>
  );
};
