import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calculator, 
  ShoppingBag, 
  CheckCircle2, 
  Sparkles,
  FlaskConical
} from 'lucide-react';
import { Language } from '../types';

interface SuppliesCalculatorProps {
  language: Language;
  onBack: () => void;
  onOpenChatWithTopic?: (topic: string) => void;
}

export const SuppliesCalculator: React.FC<SuppliesCalculatorProps> = ({
  language,
  onBack,
  onOpenChatWithTopic,
}) => {
  const isBn = language === 'bn';
  const [landArea, setLandArea] = useState<number>(1);
  const [selectedCrop, setSelectedCrop] = useState<string>('rice');

  // Multipliers per acre
  const getSupplies = () => {
    if (selectedCrop === 'potato') {
      return [
        { nameEn: 'Potato Seed Tubers (বীজ আলু)', nameBn: 'উন্নত বীজ আলু', amount: 600 * landArea, unit: 'Kg', estPrice: 24000 * landArea },
        { nameEn: 'Urea (ইউরিয়া সার)', nameBn: 'ইউরিয়া সার', amount: 110 * landArea, unit: 'Kg', estPrice: 2970 * landArea },
        { nameEn: 'TSP / DAP (টিএসপি/ডিএপি)', nameBn: 'টিএসপি সার', amount: 90 * landArea, unit: 'Kg', estPrice: 2430 * landArea },
        { nameEn: 'MoP (পটাশ সার)', nameBn: 'মিউরেট অব পটাশ', amount: 100 * landArea, unit: 'Kg', estPrice: 2200 * landArea },
        { nameEn: 'Mancozeb 80% WP (Fungicide)', nameBn: 'ম্যানকোজেব ৮০% ডব্লিউপি', amount: 2 * landArea, unit: 'Kg', estPrice: 1600 * landArea },
      ];
    }

    // Default rice (Aman/Boro)
    return [
      { nameEn: 'Certified Rice Seed (ধান বীজ)', nameBn: 'ব্রি প্রত্যয়িত বীজ (ধান)', amount: 10 * landArea, unit: 'Kg', estPrice: 850 * landArea },
      { nameEn: 'Urea Fertilizer (ইউরিয়া)', nameBn: 'ইউরিয়া সার (৩ কিস্তিতে)', amount: 85 * landArea, unit: 'Kg', estPrice: 2295 * landArea },
      { nameEn: 'TSP Fertilizer (টিএসপি)', nameBn: 'টিএসপি সার (জমি তৈরির সময়)', amount: 45 * landArea, unit: 'Kg', estPrice: 1215 * landArea },
      { nameEn: 'MoP / Potash (পটাশ)', nameBn: 'মিউরেট অব পটাশ (এমওপি)', amount: 35 * landArea, unit: 'Kg', estPrice: 770 * landArea },
      { nameEn: 'Gypsum (জিপসাম সার)', nameBn: 'জিপসাম সার', amount: 25 * landArea, unit: 'Kg', estPrice: 350 * landArea },
      { nameEn: 'Zinc Sulphate (দস্তা সার)', nameBn: 'জিংক সালফেট (দস্তা)', amount: 4 * landArea, unit: 'Kg', estPrice: 640 * landArea },
      { nameEn: 'Tricyclazole 75% WP (ব্লাস্ট নিরাময়)', nameBn: 'ট্রাইসাইক্লাজোল ৭৫% (ছত্রাকনাশক)', amount: 0.3 * landArea, unit: 'Kg', estPrice: 750 * landArea },
    ];
  };

  const supplies = getSupplies();
  const totalCost = supplies.reduce((acc, curr) => acc + curr.estPrice, 0);

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-3 bg-[#1E5128] text-white p-4 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-black">
            {isBn ? 'উপকরণ ও সার ক্যালকুলেটর' : 'Input Supplies & Cost Calculator'}
          </h2>
          <p className="text-xs text-green-200">
            {isBn ? 'জমির পরিমাপ অনুযায়ী প্রয়োজনীয় সার, বীজ ও ওষুধের হিসাব' : 'Exact kilogram dosage and government standard market prices'}
          </p>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {isBn ? 'ফসল নির্বাচন' : 'Crop'}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-[#F5F7F8] border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-900"
            >
              <option value="rice">{isBn ? 'ধান (Rice)' : 'Rice (Paddy)'}</option>
              <option value="potato">{isBn ? 'আলু (Potato)' : 'Potato'}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {isBn ? 'জমির পরিমাণ (একর)' : 'Land Size (Acres)'}
            </label>
            <input
              type="number"
              min="0.2"
              step="0.5"
              value={landArea}
              onChange={(e) => setLandArea(Math.max(0.1, parseFloat(e.target.value) || 1))}
              className="w-full bg-[#F5F7F8] border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Supplies Table / List */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {isBn ? 'প্রয়োজনীয় উপকরণের তালিকা' : 'Required Agricultural Inputs'}
          </span>
          <span className="text-xs font-bold text-[#1E5128]">
            {landArea} {isBn ? 'একর জমির জন্য' : 'Acre(s)'}
          </span>
        </div>

        <div className="space-y-2">
          {supplies.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[#F5F7F8] border border-gray-200/80 text-xs sm:text-sm"
            >
              <div>
                <span className="font-bold text-gray-900 block">
                  {isBn ? item.nameBn : item.nameEn}
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {isBn ? 'পরিমাণ: ' : 'Dosage: '} {item.amount.toFixed(1)} {item.unit}
                </span>
              </div>
              <div className="text-right">
                <span className="font-black text-gray-900">
                  {item.estPrice.toLocaleString()} <span className="text-xs text-[#1E5128]">Tk</span>
                </span>
                <span className="text-[10px] text-gray-500 block">{isBn ? 'সরকারি নির্ধারিত দর' : 'Govt BADC rate'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total Cost Summary */}
        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
          <div>
            <span className="text-xs font-bold text-emerald-900 block">
              {isBn ? 'আনুমানিক মোট উপকরণ খরচ' : 'Estimated Total Input Cost'}
            </span>
            <span className="text-[11px] text-emerald-700">
              {isBn ? 'ডিলার পয়েন্ট থেকে সংগ্রহের হিসাব' : 'Standard dealer market prices'}
            </span>
          </div>
          <div className="text-xl font-black text-[#1E5128]">
            {totalCost.toLocaleString()} <span className="text-xs">Tk</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenChatWithTopic?.(`How should I schedule fertilizer applications for ${landArea} acres of ${selectedCrop}? How to mix urea and potash?`)}
          className="w-full py-2.5 bg-[#1E5128] hover:bg-[#163e1e] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 shadow"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>{isBn ? 'সার প্রয়োগের কিস্তি ও সময়সূচি জানুন' : 'Get Step-by-Step Fertilizer Application Schedule'}</span>
        </button>
      </div>
    </div>
  );
};
