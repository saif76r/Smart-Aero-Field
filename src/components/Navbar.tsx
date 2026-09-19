import React from 'react';
import { Bell } from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  language: Language;
  onToggleLanguage?: () => void;
  unreadNotifications: number;
  onOpenNotifications: () => void;
  onOpenChat: () => void;
  isFirebaseConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  unreadNotifications,
  onOpenNotifications,
  onOpenChat,
  isFirebaseConnected,
}) => {
  const isBn = language === 'bn';

  return (
    <header className="sticky top-0 z-40 bg-[#1E5128] text-white shadow-md pt-safe">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        {/* App Logo & Brand */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md overflow-hidden flex items-center justify-center flex-shrink-0 border-2 border-[#D8E9A8]">
            <img
              src="/logo.png"
              alt="Smart Aero Field Logo"
              className="w-full h-full object-cover rounded-full scale-[1.24]"
              onError={(e) => {
                // Fallback to text icon if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base sm:text-lg md:text-xl tracking-tight text-white leading-tight">
                Smart Aero <span className="text-[#D8E9A8]">Field</span>
              </span>
              <span className="bg-[#4E9F3D] text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded text-white tracking-wide uppercase">
                {isBn ? 'কৃষি' : 'AI Agri'}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-green-100 font-medium leading-tight truncate max-w-[145px] xs:max-w-[200px] sm:max-w-none">
              {isBn ? 'স্মার্ট কৃষি ও আবহাওয়া সহায়িকা' : 'Smart Climate & Farm Advisory'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Cloud Firebase Status Pill */}
          <div 
            id="navbar-firebase-status"
            className="flex items-center space-x-1 bg-black/20 text-white/90 text-[10px] sm:text-[11px] px-2 py-1 rounded-full border border-white/10"
            title={isFirebaseConnected ? "Firebase Firestore & Auth Connected (aero-field)" : "Firebase Initializing"}
          >
            <span className={`w-2 h-2 rounded-full ${isFirebaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="hidden xs:inline">{isFirebaseConnected ? (isBn ? 'ক্লাউড সিঙ্ক' : 'Cloud Live') : (isBn ? 'সংযুক্ত হচ্ছে' : 'Connecting')}</span>
          </div>

          {/* AI Agronomist Quick Button */}
          <button
            id="navbar-ai-assistant-btn"
            onClick={onOpenChat}
            className="hidden sm:flex items-center space-x-1 bg-[#4E9F3D] hover:bg-[#3d852f] text-white text-xs px-3 py-1.5 rounded-full shadow transition-all font-medium active:scale-95 cursor-pointer"
            title="Ask AI Agronomist"
          >
            <span>{isBn ? 'এআই কৃষিবিদ' : 'AI Agronomist'}</span>
          </button>

          {/* Notifications Bell */}
          <button
            id="navbar-notifications-btn"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-white" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#1E5128]">
                {unreadNotifications}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
