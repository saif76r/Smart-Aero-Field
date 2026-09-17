import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FlaskRound as Flask, 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  Layers, 
  HelpCircle 
} from 'lucide-react';
import { Language } from '../types';

interface SoilTestViewProps {
  language: Language;
  onBack: () => void;
  onOpenChatWithTopic?: (topic: string) => void;
}

export const SoilTestView: React.FC<SoilTestViewProps> = ({
  language,
  onBack,
  onOpenChatWithTopic,
}) => {
  const isBn = language === 'bn';
  const [testing, setTesting] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<'ribbon' | 'moist' | 'ph'>('moist');

  const [result, setResult] = useState<{
    texture: string;
    textureBn: string;
    ph: string;
    organicMatter: string;
    description: string;
    descriptionBn: string;
    crops: string[];
    recommendations: string[];
  }>({
    texture: 'Sandy Clay Loam (বেলে এঁটেল দোআঁশ)',
    textureBn: 'বেলে এঁটেল দোআঁশ মাটি',
    ph: '6.2 – 6.8 (Optimal)',
    organicMatter: '2.1% (Medium / মাঝারি)',
    description: 'Soil feels slightly gritty, moderately sticky, and easily forms a ribbon of 2-3 cm that holds together before breaking.',
    descriptionBn: 'মাটি হাত দিয়ে ভেজালে সামান্য দানাদার ও আঠালো অনুভূত হয়। সহজে ২-৩ সেন্টিমিটার রিবন বা দলা তৈরি করা যায়। ধান ও শাকসবজির জন্য অত্যন্ত উপযোগী।',
    crops: ['Rice (ধান)', 'Potato (আলু)', 'Maize (ভুট্টা)', 'Tomato (টমেটো)', 'Mustard (সরিষা)'],
    recommendations: [
      'Apply 2-3 tons of well-rotted cowdung or vermicompost per acre before tillage.',
      'Split nitrogen (Urea) into 3 applications to prevent leaching losses in sandy loam zones.',
      'Apply 20 kg Gypsum and 3-4 kg Zinc Sulphate per acre to prevent seedling stunting.',
    ],
  });

  const handleTestNow = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
    }, 1200);
  };

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
          <h2 className="text-lg font-black">{isBn ? 'মাটি পরীক্ষা ও স্বাস্থ্য যাচাই' : 'Soil Test & Texture Analysis'}</h2>
          <p className="text-xs text-green-200">
            {isBn ? 'মাটির ধরন ও গুণাগুণ অনুযায়ী উপযুক্ত সার নির্ধারণ' : 'Field Soil Texture, pH and NPK Nutrition Balance'}
          </p>
        </div>
      </div>

      {/* Soil Texture Card (Screenshot 13) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm space-y-4">
        <div className="relative rounded-2xl overflow-hidden h-44 bg-gray-900 border border-gray-200">
          <img
            src="/images/soil_sample.jpg"
            alt="Soil Texture Specimen"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
            <span className="bg-[#1E5128] text-white text-xs font-bold px-3 py-1 rounded-full shadow border border-green-300">
              {isBn ? 'মাটির নমুনা বিশ্লেষণ' : 'Field Soil Specimen'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          id="soil-test-run-btn"
          type="button"
          onClick={handleTestNow}
          disabled={testing}
          className="w-full py-3 bg-[#1E5128] hover:bg-[#163e1e] active:scale-[0.99] text-white font-bold rounded-xl shadow transition-all flex items-center justify-center space-x-2 text-sm"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#D8E9A8]" />
              <span>{isBn ? 'মাটির উপাদান বিশ্লেষণ হচ্ছে...' : 'Analyzing Soil Texture...'}</span>
            </>
          ) : (
            <>
              <Flask className="w-4 h-4 text-[#D8E9A8]" />
              <span>{isBn ? 'মাটি পরীক্ষা করুন (Test it)' : 'Run Soil Test Analysis'}</span>
            </>
          )}
        </button>

        {/* Results Card (Matching Screenshot 13) */}
        <div className="p-4 rounded-xl bg-[#F5F7F8] border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {isBn ? 'মাটি পরীক্ষার ফলাফল' : 'Result: Moistening By Hand Method'}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              {result.ph}
            </span>
          </div>

          <div>
            <div className="text-xs text-gray-500">{isBn ? 'শনাক্তকৃত মাটির বুনট:' : 'Identified Soil Texture:'}</div>
            <h3 className="text-base font-black text-gray-900 mt-0.5">
              {isBn ? result.textureBn : result.texture}
            </h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              {isBn ? result.descriptionBn : result.description}
            </p>
          </div>

          {/* Suitable Crops */}
          <div className="pt-2 border-t border-gray-200">
            <span className="text-xs font-bold text-gray-700 block mb-1.5">
              {isBn ? 'এই মাটির জন্য সবচেয়ে লাভজনক ফসলসমূহ:' : 'Highly Productive Crops for this Soil:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {result.crops.map((c, i) => (
                <span key={i} className="text-xs font-semibold bg-white text-gray-800 px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Agronomist Advice */}
          <div className="pt-2 border-t border-gray-200">
            <span className="text-xs font-bold text-gray-700 block mb-1">
              {isBn ? 'মাটির স্বাস্থ্য উন্নত করার সুপারিশ:' : 'Fertility Improvement Plan:'}
            </span>
            <ul className="space-y-1 text-xs text-gray-600">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenChatWithTopic?.('What organic compost and chemical fertilizers should I add for Sandy Clay Loam soil for Rice and Potato?')}
          className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-[#1E5128] rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1 border border-emerald-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{isBn ? 'এআই কৃষিবিদ থেকে কাস্টম সার চার্ট নিন' : 'Request Custom Soil Nutrition Plan'}</span>
        </button>
      </div>
    </div>
  );
};
