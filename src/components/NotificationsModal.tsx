import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  CloudRain, 
  Droplet, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  CheckCheck,
  RefreshCw,
  Send
} from 'lucide-react';
import { Language, NotificationItem } from '../types';
import { getDistrictWeather } from '../data/weatherData';
import { requestBrowserPushPermission, toBnDigits } from '../utils/agronomicEngine';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  notifications: NotificationItem[];
  currentDistrict?: string;
  onMarkAllAsRead: () => void;
  onRefreshDailyWeatherAlerts?: () => void;
  onOpenChatWithTopic?: (topic: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  language,
  notifications,
  currentDistrict = 'Rajshahi',
  onMarkAllAsRead,
  onRefreshDailyWeatherAlerts,
  onOpenChatWithTopic,
}) => {
  const isBn = language === 'bn';
  const [pushStatus, setPushStatus] = useState<string>('idle'); // 'idle' | 'granted' | 'denied'
  const weather = getDistrictWeather(currentDistrict);

  if (!isOpen) return null;

  const handleEnablePush = async () => {
    const granted = await requestBrowserPushPermission();
    setPushStatus(granted ? 'granted' : 'denied');
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'weather':
        return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'irrigation':
        return <Droplet className="w-5 h-5 text-cyan-600" />;
      case 'fertilizer':
        return <Sparkles className="w-5 h-5 text-amber-600" />;
      case 'pest':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'market':
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-green-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs pt-safe pb-safe">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in fade-in-50 zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1E5128] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-[#D8E9A8]" />
            <h3 className="font-black text-base">
              {isBn ? 'দৈনিক আবহাওয়া ও কৃষি বিজ্ঞপ্তি' : 'Daily Weather & Farming Alerts'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Weather Status Bar for Today */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-b border-emerald-100/80 p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-emerald-200 flex items-center justify-center flex-shrink-0">
              <CloudRain className="w-4 h-4 text-[#1E5128]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-bold text-gray-900">
                  {currentDistrict} {isBn ? 'আবহাওয়া' : 'Live'}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                  {isBn ? 'আজকের' : 'Today'}
                </span>
              </div>
              <p className="text-[10px] text-gray-600">
                {isBn ? weather.conditionBn : weather.conditionEn} • {isBn ? toBnDigits(weather.temp) : weather.temp}°C • {isBn ? `বৃষ্টিপাত ${toBnDigits(weather.rainChance)}%` : `Rain ${weather.rainChance}%`}
              </p>
            </div>
          </div>

          {onRefreshDailyWeatherAlerts && (
            <button
              type="button"
              onClick={onRefreshDailyWeatherAlerts}
              title={isBn ? 'আজকের আবহাওয়া সতর্কতা রিফ্রেশ করুন' : 'Refresh today weather alerts'}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-white hover:bg-emerald-100 border border-emerald-200 rounded-lg text-[10px] font-bold text-emerald-800 transition-colors shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-emerald-700" />
              <span>{isBn ? 'রিফ্রেশ' : 'Sync'}</span>
            </button>
          )}
        </div>

        {/* Web Push Notification Trigger Banner */}
        {typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted' && pushStatus !== 'granted' && (
          <div className="px-3.5 py-2 bg-amber-50 border-b border-amber-200/70 flex items-center justify-between text-xs">
            <span className="text-[11px] text-amber-900 font-medium leading-tight">
              {isBn ? 'প্রতিদিন সকালে আবহাওয়ার সতর্কবার্তা পেতে চান?' : 'Get daily morning weather alerts?'}
            </span>
            <button
              type="button"
              onClick={handleEnablePush}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-lg text-[10px] font-bold cursor-pointer whitespace-nowrap shadow-xs ml-2"
            >
              {isBn ? 'নোটিফিকেশন চালু করুন' : 'Enable Alerts'}
            </button>
          </div>
        )}

        {/* Action bar */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>{notifications.length} {isBn ? 'টি সক্রিয় বিজ্ঞপ্তি' : 'active alerts'}</span>
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-[#1E5128] font-bold hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{isBn ? 'সব পড়া হয়েছে' : 'Mark all read'}</span>
          </button>
        </div>

        {/* Notifications List (Matching Screenshot 21) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onClose();
                onOpenChatWithTopic?.(isBn ? item.titleBn : item.titleEn);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 hover:shadow-xs ${
                item.read
                  ? 'bg-white border-gray-200 text-gray-700'
                  : 'bg-emerald-50/70 border-emerald-300 text-gray-900 shadow-2xs ring-1 ring-emerald-200/50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 shadow-2xs">
                {getIcon(item.category)}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-1.5 mb-1">
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  )}
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                    {item.category === 'weather' ? (isBn ? 'আবহাওয়া' : 'Weather') :
                     item.category === 'irrigation' ? (isBn ? 'সেচ' : 'Irrigation') :
                     item.category === 'fertilizer' ? (isBn ? 'সার ও পুষ্টি' : 'Fertilizer') :
                     item.category === 'pest' ? (isBn ? 'রোগবালাই' : 'Pest Alert') :
                     (isBn ? 'বিজ্ঞপ্তি' : 'Alert')}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold leading-snug">
                  {isBn ? item.titleBn : item.titleEn}
                </p>
                <div className="flex items-center justify-between mt-2 text-[10px] text-gray-500">
                  <span className="text-gray-400">{item.date}</span>
                  <span className="text-[#1E5128] font-bold flex items-center space-x-0.5 hover:underline">
                    <span>{isBn ? 'পরামর্শ নিন' : 'Ask AI'}</span>
                    <Send className="w-2.5 h-2.5 ml-0.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
