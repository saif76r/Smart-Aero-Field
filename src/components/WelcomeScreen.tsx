import React from 'react';
import { 
  Check, 
  ArrowRight, 
  Globe2 
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
    <div className="min-h-screen w-full bg-gradient-to-b from-[#143B1D] via-[#1E5128] to-[#143B1D] flex flex-col justify-center items-center px-4 py-8">
      
      {/* Main Card Container */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-900/10">
        
        {/* Brand Header */}
        <div className="bg-[#1E5128] text-white pt-8 pb-7 px-6 text-center relative overflow-hidden">
          {/* Subtle Ambient Light Glows */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#4E9F3D]/25 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-[#D8E9A8]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Logo */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white shadow-md p-2 flex items-center justify-center mb-3 border border-white/80">
            <img 
              src="/logo.png" 
              alt="Smart Aero Field" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white">
            Smart Aero <span className="text-[#D8E9A8]">Field</span>
          </h1>
          <p className="text-xs text-emerald-100 font-medium mt-1">
            {isBn 
              ? 'স্মার্ট কৃষি ও ক্লাইমেট প্ল্যাটফর্ম' 
              : 'Smart Agriculture & Climate Platform'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Section Heading */}
          <div className="text-center space-y-1">
            <h2 className="text-base font-bold text-gray-900">
              {isBn ? 'ভাষা নির্বাচন করুন' : 'Choose Your Language'}
            </h2>
            <p className="text-xs text-gray-500">
              {isBn 
                ? 'আপনার সুবিধাজনক ভাষাটি বেছে নিন' 
                : 'Select your preferred app language'}
            </p>
          </div>

          {/* Language Selection Option Cards */}
          <div className="space-y-3">
            
            {/* Option 1: বাংলা (Bangla) */}
            <button
              type="button"
              id="lang-option-bn"
              onClick={() => onSelectLanguage('bn')}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${
                isBn
                  ? 'border-[#1E5128] bg-emerald-50/90 shadow-sm ring-2 ring-[#1E5128]/20'
                  : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-gray-50/80'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base transition-colors ${
                  isBn ? 'bg-[#1E5128] text-white shadow-xs' : 'bg-gray-100 text-gray-700'
                }`}>
                  বাং
                </div>
                <div>
                  <div className="font-extrabold text-base text-gray-900 leading-tight">
                    বাংলা
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Bangla
                  </span>
                </div>
              </div>

              {/* Radio Indicator */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                isBn
                  ? 'border-[#1E5128] bg-[#1E5128] text-white shadow-2xs'
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
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${
                !isBn
                  ? 'border-[#1E5128] bg-emerald-50/90 shadow-sm ring-2 ring-[#1E5128]/20'
                  : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-gray-50/80'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base transition-colors ${
                  !isBn ? 'bg-[#1E5128] text-white shadow-xs' : 'bg-gray-100 text-gray-700'
                }`}>
                  EN
                </div>
                <div>
                  <div className="font-extrabold text-base text-gray-900 leading-tight">
                    English
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    English (US / Global)
                  </span>
                </div>
              </div>

              {/* Radio Indicator */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                !isBn
                  ? 'border-[#1E5128] bg-[#1E5128] text-white shadow-2xs'
                  : 'border-gray-300 bg-white'
              }`}>
                {!isBn && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>
          </div>

          {/* Continue Action Button */}
          <div className="pt-2">
            <button
              type="button"
              id="btn-welcome-next"
              onClick={onNext}
              className="w-full py-3.5 bg-[#1E5128] hover:bg-[#163E1E] active:scale-[0.99] text-white rounded-2xl text-sm font-bold shadow-md shadow-[#1E5128]/20 hover:shadow-lg transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer group"
            >
              <span>{isBn ? 'এগিয়ে যান' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Clean Helper Note */}
          <p className="text-[11px] text-gray-500 text-center flex items-center justify-center space-x-1 pt-1">
            <Globe2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span>
              {isBn 
                ? 'সেটিংস থেকে যেকোনো সময় ভাষা পরিবর্তন করা যাবে' 
                : 'You can change your language anytime in settings'}
            </span>
          </p>
        </div>
      </div>

      {/* Subtle Footer Branding */}
      <p className="text-xs text-emerald-200/70 mt-4 text-center font-medium">
        Smart Aero Field • Agro AI
      </p>
    </div>
  );
};
