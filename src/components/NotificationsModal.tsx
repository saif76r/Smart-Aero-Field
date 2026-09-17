import React from 'react';
import { 
  X, 
  Bell, 
  CloudRain, 
  Droplet, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  CheckCheck 
} from 'lucide-react';
import { Language, NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onOpenChatWithTopic?: (topic: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  language,
  notifications,
  onMarkAllAsRead,
  onOpenChatWithTopic,
}) => {
  const isBn = language === 'bn';

  if (!isOpen) return null;

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
              {isBn ? 'কৃষি বিজ্ঞপ্তি ও জরুরি সতর্কতা' : 'Farming Alerts & Advisories'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>{notifications.length} {isBn ? 'টি বিজ্ঞপ্তি' : 'notifications'}</span>
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-[#1E5128] font-bold hover:underline flex items-center space-x-1"
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
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                item.read
                  ? 'bg-white border-gray-200 text-gray-700'
                  : 'bg-emerald-50/50 border-emerald-200 text-gray-900 shadow-2xs'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 shadow-2xs">
                {getIcon(item.category)}
              </div>

              <div className="flex-1">
                <p className="text-xs sm:text-sm font-semibold leading-snug">
                  {isBn ? item.titleBn : item.titleEn}
                </p>
                <div className="flex items-center justify-between mt-1.5 text-[10px] text-gray-500">
                  <span>{item.date}</span>
                  <span className="text-[#1E5128] font-bold hover:underline">
                    {isBn ? 'বিস্তারিত জানুন →' : 'Ask advice →'}
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
