import React from 'react';
import { 
  Check, 
  ArrowRight, 
  Sparkles, 
  Globe2, 
  ShieldCheck, 
  Leaf, 
  Sprout 
} from 'lucide-react';
import { Language } from '../types';

interface WelcomeScreenProps {
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  onNext: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  language,
  onSelectLanguage,
  onNext,
}) => {
  const isBn = language === 'bn';

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1E5128] via-[#245D31] to-[#163E1E] flex flex-col justify-center items-center px-3.5 sm:px-4 py-4 sm:py-6 overflow-y-auto">
      
      {/* Main Card Container */}
      <div className="w-full max-w-sm bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Header */}
        <div className="bg-[#1E5128] text-white p-5 sm:p-6 text-center relative overflow-hidden">
          {/* Subtle Ambient Light Gradients */}
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#4E9F3D]/25 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#D8E9A8]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Logo */}
          <div className="w-16 h-16 sm:w-18 sm:h-18 mx-auto rounded-full bg-white shadow-lg border-2 border-white/95 flex items-center justify-center mb-2.5 overflow-hidden">
            <img 
              src="/logo.png" 
              alt="KrishiGuide Logo" 
              className="w-full h-full object-cover scale-[1.12]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/15 text-[#D8E9A8] text-[10px] sm:text-[11px] font-bold tracking-wide uppercase mb-1">
            <Sparkles className="w-3 h-3 text-[#D8E9A8]" />
            <span>{isBn ? 'স্বাগতম • Welcome' : 'Welcome • স্বাগতম'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Krishi<span className="text-[#D8E9A8]">Guide</span>
          </h1>
          <p className="text-xs text-green-100 font-medium mt-1">
            {isBn 
              ? 'স্মার্ট কৃষি, এআই রোগ নির্ণয় ও আবহাওয়া সহায়িকা' 
              : 'Smart Agriculture & Climate Risk Assistant'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          
          {/* Instruction */}
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black text-gray-900">
              {isBn ? 'আপনার পছন্দের ভাষা নির্বাচন করুন' : 'Select Your Preferred Language'}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              {isBn 
                ? 'পরবর্তী ধাপে যেতে যেকোনো একটি ভাষা বেছে নিন' 
                : 'Choose a language to customize your farming experience'}
            </p>
          </div>

          {/* Language Selection Option Cards */}
          <div className="space-y-2.5">
            
            {/* Option 1: বাংলা (Bangla) */}
            <button
              type="button"
              id="lang-option-bn"
              onClick={() => onSelectLanguage('bn')}
              className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${
                isBn
                  ? 'border-[#1E5128] bg-emerald-50/80 shadow-md ring-2 ring-[#1E5128]/20'
                  : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-gray-50/70'
              }`}
            >
              <div className="flex items-center space-x-3 sm:space-x-3.5">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base transition-colors ${
                  isBn ? 'bg-[#1E5128] text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  বাং
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-sm sm:text-base text-gray-900">
                      বাংলা
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-800">
                      বাংলাদেশ
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5 font-medium">
                    সহজ বাংলা ভাষায় সকল কৃষি পরামর্শ ও এআই সেবা
                  </p>
                </div>
              </div>

              {/* Radio Indicator */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                isBn
                  ? 'border-[#1E5128] bg-[#1E5128] text-white'
                  : 'border-gray-300 bg-white'
              }`}>
                {isBn && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>

            {/* Option 2: English */}
            <button
              type="button"
              id="lang-option-en"
              onClick={() => onSelectLanguage('en')}
              className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${
                !isBn
                  ? 'border-[#1E5128] bg-emerald-50/80 shadow-md ring-2 ring-[#1E5128]/20'
                  : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-gray-50/70'
              }`}
            >
              <div className="flex items-center space-x-3 sm:space-x-3.5">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base transition-colors ${
                  !isBn ? 'bg-[#1E5128] text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  EN
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-sm sm:text-base text-gray-900">
                      English
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      Global
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5 font-medium">
                    Smart agronomy advice, diagnostics & analytics in English
                  </p>
                </div>
              </div>

              {/* Radio Indicator */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                !isBn
                  ? 'border-[#1E5128] bg-[#1E5128] text-white'
                  : 'border-gray-300 bg-white'
              }`}>
                {!isBn && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>
          </div>

          {/* Next Button */}
          <div className="pt-1">
            <button
              type="button"
              id="btn-welcome-next"
              onClick={onNext}
              className="w-full py-3 sm:py-3.5 bg-[#1E5128] hover:bg-[#163E1E] active:bg-[#0f2a14] text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-[#1E5128]/25 hover:shadow-xl transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer group"
            >
              <span>{isBn ? 'পরবর্তী ধাপ (Next) →' : 'Next Step →'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Quick Features Row */}
          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-gray-100 text-center">
            <div className="p-1.5 rounded-lg bg-gray-50 text-[10px] font-bold text-gray-600 flex flex-col items-center">
              <Leaf className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
              <span>{isBn ? 'ফসল সেবা' : 'Crop Care'}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-gray-50 text-[10px] font-bold text-gray-600 flex flex-col items-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 mb-0.5" />
              <span>{isBn ? 'এআই স্ক্যান' : 'AI Doctor'}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-gray-50 text-[10px] font-bold text-gray-600 flex flex-col items-center">
              <Globe2 className="w-3.5 h-3.5 text-cyan-600 mb-0.5" />
              <span>{isBn ? 'নাসা ক্লাইমেট' : 'Satellite'}</span>
            </div>
          </div>

          {/* Helper Note */}
          <p className="text-[10px] sm:text-[11px] text-gray-600 text-center">
            {isBn 
              ? '💡 আপনি পরবর্তীতে যেকোনো সময় অ্যাপের সেটিংস থেকে ভাষা পরিবর্তন করতে পারবেন।' 
              : '💡 You can switch your preferred language anytime from the settings menu.'}
          </p>
        </div>
      </div>

      {/* Footer Branding */}
      <p className="text-[10px] sm:text-xs text-white/75 mt-3 text-center font-medium">
        © 2026 KrishiGuide • Smart Agriculture for Bangladesh
      </p>
    </div>
  );
};
