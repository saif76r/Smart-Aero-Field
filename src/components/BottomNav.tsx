import React from 'react';
import { Home, Grid, Scan, Satellite, User } from 'lucide-react';
import { Language } from '../types';

interface BottomNavProps {
  currentTab: 'home' | 'hub' | 'scan' | 'nasa' | 'profile';
  onSelectTab: (tab: 'home' | 'hub' | 'scan' | 'nasa' | 'profile') => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  language,
}) => {
  const isBn = language === 'bn';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe">
      <div className="max-w-md mx-auto px-1.5 sm:px-4 py-1 sm:py-2 flex items-center justify-between">
        {/* Home */}
        <button
          id="nav-home-btn"
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 min-h-[44px] transition-all active:scale-95 cursor-pointer ${
            currentTab === 'home' ? 'text-[#1E5128]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-bold mt-0.5 leading-none whitespace-nowrap">
            {isBn ? 'হোম' : 'Home'}
          </span>
        </button>

        {/* Hub / Services */}
        <button
          id="nav-hub-btn"
          type="button"
          onClick={() => onSelectTab('hub')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 min-h-[44px] transition-all active:scale-95 cursor-pointer ${
            currentTab === 'hub' ? 'text-[#1E5128]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Grid className={`w-5 h-5 ${currentTab === 'hub' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-bold mt-0.5 leading-none whitespace-nowrap">
            {isBn ? 'সার্ভিস' : 'Hub'}
          </span>
        </button>

        {/* Floating Quick Scan Action Button in Center */}
        <div className="flex-1 flex justify-center -mt-5 sm:-mt-6 px-1">
          <button
            id="nav-scan-action-btn"
            type="button"
            onClick={() => onSelectTab('scan')}
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#1E5128] hover:bg-[#163e1e] active:scale-90 text-white flex items-center justify-center shadow-lg border-3 sm:border-4 border-white transition-all cursor-pointer flex-shrink-0"
            aria-label="Scan Leaf Disease"
            title="Scan Leaf"
          >
            <Scan className="w-5 h-5 sm:w-6 sm:h-6 text-[#D8E9A8]" />
          </button>
        </div>

        {/* NASA Earth */}
        <button
          id="nav-nasa-btn"
          type="button"
          onClick={() => onSelectTab('nasa')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 min-h-[44px] transition-all active:scale-95 cursor-pointer ${
            currentTab === 'nasa' ? 'text-[#1E5128]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Satellite className={`w-5 h-5 ${currentTab === 'nasa' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-bold mt-0.5 leading-none whitespace-nowrap">
            {isBn ? 'স্যাটেলাইট' : 'NASA'}
          </span>
        </button>

        {/* Profile */}
        <button
          id="nav-profile-btn"
          type="button"
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 min-h-[44px] transition-all active:scale-95 cursor-pointer ${
            currentTab === 'profile' ? 'text-[#1E5128]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-bold mt-0.5 leading-none whitespace-nowrap">
            {isBn ? 'প্রোফাইল' : 'Profile'}
          </span>
        </button>
      </div>
    </nav>
  );
};
