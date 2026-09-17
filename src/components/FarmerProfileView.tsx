import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Plus, 
  TrendingUp, 
  Award, 
  Settings, 
  FileText,
  Sparkles,
  LogOut
} from 'lucide-react';
import { Language } from '../types';

interface FarmerProfileViewProps {
  language: Language;
  user?: { name: string; phone: string; district: string; landSize: string } | null;
  onOpenChatWithTopic?: (topic: string) => void;
  onOpenSettings?: () => void;
  onLogout?: () => void;
}

export const FarmerProfileView: React.FC<FarmerProfileViewProps> = ({
  language,
  user,
  onOpenChatWithTopic,
  onOpenSettings,
  onLogout,
}) => {
  const isBn = language === 'bn';
  const displayName = user?.name || 'Md. Nasirul Islam';
  const displayDistrict = user?.district || 'Rajshahi';
  const displayLand = user?.landSize || '3.5';

  const [tasks, setTasks] = useState([
    { id: '1', titleEn: 'Morning Irrigation — Plot 2 (BRRI dhan49)', titleBn: 'সকালের সেচ — প্লট ২ (ব্রি ধান৪৯)', done: true },
    { id: '2', titleEn: 'Check Light Trap for Brown Planthopper (BPH)', titleBn: 'আলোর ফাঁদ পরীক্ষা (বাদামী গাছফড়িং)', done: false },
    { id: '3', titleEn: 'Top-dressing 2nd dose Urea & Potash (Plot 1)', titleBn: 'ইউরিয়া ও পটাশ সারের ২য় কিস্তি প্রয়োগ', done: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Profile Card Header (Screenshot 19) */}
      <div className="bg-[#1E5128] text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-[#D8E9A8] p-1 flex items-center justify-center flex-shrink-0 text-white shadow-inner">
            <User className="w-9 h-9 text-[#D8E9A8]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-white">{displayName}</h2>
              <span className="bg-[#4E9F3D] text-[10px] font-bold px-2 py-0.5 rounded-full text-white">
                {isBn ? 'প্রগতিশীল কৃষক' : 'Verified Farmer'}
              </span>
            </div>
            <p className="text-xs text-green-200 flex items-center mt-0.5">
              <MapPin className="w-3.5 h-3.5 mr-1 text-[#D8E9A8]" />
              <span>{displayDistrict}, Bangladesh</span>
            </p>
            <p className="text-[11px] text-green-100 mt-1">
              {isBn 
                ? `মোট আবাদি জমি: ${displayLand} একর | চলতি ফসল: আমন ধান ও আলু` 
                : `Total Land: ${displayLand} Acres | Active Crops: Aman Rice & Potato`}
            </p>
          </div>
        </div>

        {/* Quick Badges */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20 text-center text-xs">
          <div>
            <span className="text-[10px] text-green-200 block">{isBn ? 'জমির প্লট' : 'Plots'}</span>
            <span className="font-bold text-sm">{isBn ? '৩টি প্লট' : '3 Plots'}</span>
          </div>
          <div>
            <span className="text-[10px] text-green-200 block">{isBn ? 'কৃষি স্কোর' : 'Agri Score'}</span>
            <span className="font-bold text-sm text-[#D8E9A8]">{isBn ? '৯২ / ১০০' : '92 / 100'}</span>
          </div>
          <div>
            <span className="text-[10px] text-green-200 block">{isBn ? 'সফল মৌসুম' : 'Seasons'}</span>
            <span className="font-bold text-sm">{isBn ? '১২ বছর' : '12 Years'}</span>
          </div>
        </div>
      </div>

      {/* Today's Daily Farm Tasks (Screenshot 19) */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900">
              {isBn ? 'আজকের খামার রুটিন ও কাজ' : "Today's Farm Action Tasks"}
            </h3>
            <p className="text-xs text-gray-500">
              {isBn ? 'সময়মত কাজ সম্পন্ন করে ফলন বৃদ্ধি করুন' : 'Stay on schedule for optimal crop growth cycle.'}
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            {tasks.filter((t) => t.done).length} / {tasks.length} {isBn ? 'সম্পন্ন' : 'Done'}
          </span>
        </div>

        <div className="space-y-2 pt-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                task.done
                  ? 'bg-emerald-50/70 border-emerald-200 text-gray-500 line-through'
                  : 'bg-white border-gray-200 hover:border-[#1E5128] text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    task.done
                      ? 'bg-[#1E5128] border-[#1E5128] text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {task.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs sm:text-sm font-semibold">
                  {isBn ? task.titleBn : task.titleEn}
                </span>
              </div>
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Farm Land Records */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-gray-900 flex items-center justify-between">
          <span>{isBn ? 'আমার নিবন্ধিত ফসলি জমি' : 'My Registered Plots & Lands'}</span>
          <span className="text-xs text-[#1E5128] font-bold hover:underline cursor-pointer">
            + {isBn ? 'নতুন জমি যোগ' : 'Add Plot'}
          </span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-[#F5F7F8] rounded-xl border border-gray-200 flex justify-between items-center">
            <div>
              <span className="font-bold text-gray-900 block">
                {isBn ? 'প্লট ক: উত্তর মাঠ' : 'Plot A: North Field'}
              </span>
              <span className="text-gray-500">
                {isBn ? '২.০ একর — ধান (ব্রি ধান৪৯) | রোপণ: ১৫ জুলাই' : '2.0 Acres — Rice (BRRI dhan49) | Transplanted: July 15'}
              </span>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              {isBn ? 'কুশি পর্যায়' : 'Tillering'}
            </span>
          </div>

          <div className="p-3 bg-[#F5F7F8] rounded-xl border border-gray-200 flex justify-between items-center">
            <div>
              <span className="font-bold text-gray-900 block">
                {isBn ? 'প্লট খ: পশ্চিম পুকুরপাড়' : 'Plot B: West Field'}
              </span>
              <span className="text-gray-500">
                {isBn ? '১.৫ একর — দেশি গোল আলু ও সরিষা | রবি প্রস্তুতি' : '1.5 Acres — Potato & Mustard | Rabi Prep'}
              </span>
            </div>
            <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              {isBn ? 'জমি তৈরি' : 'Land Prep'}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpenChatWithTopic?.('Analyze my 3.5-acre farm in Rangpur and suggest a crop rotation plan for highest annual revenue')}
        className="w-full py-3 bg-[#1E5128] hover:bg-[#163e1e] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow"
      >
        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
        <span>{isBn ? 'আমার খামারের জন্য এআই পরামর্শ নিন' : 'Request Personalized Agronomy Plan'}</span>
      </button>

      {onOpenSettings && (
        <button
          type="button"
          onClick={onOpenSettings}
          className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Settings className="w-4 h-4 text-[#1E5128]" />
          <span>{isBn ? 'অ্যাপ সেটিংস ও ভাষা (Settings & Language)' : 'Settings & Language'}</span>
        </button>
      )}

      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>{isBn ? 'লগআউট করুন' : 'Log Out'}</span>
        </button>
      )}
    </div>
  );
};
