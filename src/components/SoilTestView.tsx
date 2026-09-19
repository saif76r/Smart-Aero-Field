import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Droplets, 
  ChevronDown, 
  ChevronUp, 
  Sprout,
  ShieldCheck,
  FlaskConical
} from 'lucide-react';
import { Language } from '../types';

interface SoilTestViewProps {
  language: Language;
  onBack: () => void;
  onOpenChatWithTopic?: (topic: string) => void;
}

interface SoilType {
  id: string;
  nameBn: string;
  nameEn: string;
  badgeBn: string;
  badgeEn: string;
  badgeType: 'best' | 'good' | 'improve';
  descriptionBn: string;
  descriptionEn: string;
  suitableBn: string;
  suitableEn: string;
  ph: string;
  organicMatterBn: string;
  organicMatterEn: string;
  fertilizerTipsBn: string[];
  fertilizerTipsEn: string[];
  irrigationBn: string;
  irrigationEn: string;
}

export const SoilTestView: React.FC<SoilTestViewProps> = ({
  language,
  onBack,
  onOpenChatWithTopic,
}) => {
  const isBn = language === 'bn';
  const [selectedSoilId, setSelectedSoilId] = useState<string>('loamy');
  const [showMoreSoils, setShowMoreSoils] = useState<boolean>(false);

  // Soil types structured precisely matching the user's visual mockup
  const primarySoilTypes: SoilType[] = [
    {
      id: 'loamy',
      nameBn: 'দোআঁশ মাটি',
      nameEn: 'Loamy Soil',
      badgeBn: 'সর্বোত্তম',
      badgeEn: 'Best',
      badgeType: 'best',
      descriptionBn: 'ভেজা অবস্থায় নরম বল তৈরি হয় এবং সহজে ভেঙে যায় না। সকল ফসলের জন্য আদর্শ।',
      descriptionEn: 'Forms a soft, cohesive ball when moist and does not break easily. Ideal for all crops.',
      suitableBn: 'ধান, গম, আলু, সরিষা, ভুট্টা',
      suitableEn: 'Rice, Wheat, Potato, Mustard, Maize',
      ph: '6.5 - 7.2',
      organicMatterBn: '২.৫% – ৩.০% (উচ্চ ও সুষম)',
      organicMatterEn: '2.5% – 3.0% (High & Balanced)',
      fertilizerTipsBn: [
        'সুষম মাত্রায় ইউরিয়া, টিএসপি এবং এমওপি সার প্রয়োগ করুন।',
        'প্রতি শতকে ১৫-২০ কেজি পচা গোবর বা কেঁচো সার (ভার্মিকম্পোস্ট) দিলে মাটির উর্বরতা দীর্ঘস্থায়ী হয়।'
      ],
      fertilizerTipsEn: [
        'Apply balanced doses of Urea, TSP, and MoP in split applications.',
        'Add 15-20 kg well-decomposed cowdung or vermicompost per decimal for lasting fertility.'
      ],
      irrigationBn: 'পানি নিষ্কাশন ও ধারণক্ষমতা প্রাকৃতিক ও ভারসাম্যপূর্ণ। স্বাভাবিক সেচ দিলেই চলে।',
      irrigationEn: 'Natural, balanced water holding capacity and drainage. Standard irrigation schedule.',
    },
    {
      id: 'sandy-loam',
      nameBn: 'বেলে-দোআঁশ মাটি',
      nameEn: 'Sandy Loam Soil',
      badgeBn: 'ভালো',
      badgeEn: 'Good',
      badgeType: 'good',
      descriptionBn: 'হাতে নিলে কিছুটা খসখসে লাগে, দ্রুত পানি নিষ্কাশন হয়।',
      descriptionEn: 'Feels slightly gritty in hands, drains water quickly while supporting root breathing.',
      suitableBn: 'আলু, চিনাবাদাম, তরমুজ, গম',
      suitableEn: 'Potato, Groundnut, Watermelon, Wheat',
      ph: '6.0 - 6.8',
      organicMatterBn: '১.৫% – ২.০% (মাঝারি)',
      organicMatterEn: '1.5% – 2.0% (Moderate)',
      fertilizerTipsBn: [
        'ইউরিয়া সার একবারে না দিয়ে ৩-৪ কিস্তিতে প্রয়োগ করুন যাতে লিচিং হয়ে নষ্ট না হয়।',
        'মাটির রস ধরে রাখতে পর্যাপ্ত জৈব সার এবং খড়কুটোর মালচিং ব্যবহার করুন।'
      ],
      fertilizerTipsEn: [
        'Split nitrogen (Urea) into 3-4 applications to prevent leaching losses.',
        'Use organic compost and straw mulching to preserve essential soil moisture.'
      ],
      irrigationBn: 'পানি দ্রুত নিচে নেমে যায়, তাই অল্প পরিমাণে ঘন ঘন সেচ দেওয়া উত্তম।',
      irrigationEn: 'Water drains rapidly; frequent light watering is recommended.',
    },
    {
      id: 'clay-loam',
      nameBn: 'এঁটেল-দোআঁশ মাটি',
      nameEn: 'Clay Loam Soil',
      badgeBn: 'ভালো',
      badgeEn: 'Good',
      badgeType: 'good',
      descriptionBn: 'আঠালো ভাব থাকে এবং পানি ধরে রাখার ক্ষমতা অনেক বেশি।',
      descriptionEn: 'Sticky texture with high moisture and nutrient retention capacity.',
      suitableBn: 'আমন ও বোরো ধান, পাট',
      suitableEn: 'Aman and Boro Rice, Jute, Pulses',
      ph: '6.8 - 7.5',
      organicMatterBn: '২.০% – ২.৫% (সন্তোষজনক)',
      organicMatterEn: '2.0% – 2.5% (Satisfactory)',
      fertilizerTipsBn: [
        'টিএসপি এবং পটাশ সার জমি তৈরির শেষ চাষে মাটির নিচে ভালোভাবে মিশিয়ে দিন।',
        'মাটি যাতে শক্ত ঢেলা না বাঁধে সেজন্য পর্যাপ্ত পচা জৈব সার ও কাঠের ছাই ব্যবহার করুন।'
      ],
      fertilizerTipsEn: [
        'Thoroughly incorporate TSP and Potash during the final ploughing.',
        'Apply decomposed organic compost and wood ash to prevent hard soil clods.'
      ],
      irrigationBn: 'পানি জমে থাকার প্রবণতা বেশি, তাই জমিতে ড্রেনেজ বা নালা ব্যবস্থা রাখুন।',
      irrigationEn: 'Prone to water stagnation; maintain field drainage channels.'
    },
    {
      id: 'sandy',
      nameBn: 'বেলে মাটি',
      nameEn: 'Sandy Soil',
      badgeBn: 'উন্নতি প্রয়োজন',
      badgeEn: 'Needs Improvement',
      badgeType: 'improve',
      descriptionBn: 'হাতে চাপলে কোনো বল তৈরি হয় না, সম্পূর্ণ ঝুরঝুরে হয়ে পড়ে যায়।',
      descriptionEn: 'Does not form any ball when pressed, falls apart completely crumbly and loose.',
      suitableBn: 'চিনাবাদাম, মিষ্টি আলু, তরমুজ',
      suitableEn: 'Groundnut, Sweet Potato, Watermelon, Carrot',
      ph: '5.5 - 6.2',
      organicMatterBn: '০.৮% – ১.২% (স্বল্প)',
      organicMatterEn: '0.8% – 1.2% (Low)',
      fertilizerTipsBn: [
        'সবুজ সার (ধৈঞ্চা চাষ করে মাটিতে পচানো), গোবর সার ও ভার্মিকম্পোস্ট প্রয়োগ করে মাটির বুনট উন্নত করুন।',
        'দস্তা (জিংক) ও বোরনের ঘাটতি হতে পারে, তাই অনুখাদ্য নিয়মিত স্প্রে করুন।'
      ],
      fertilizerTipsEn: [
        'Grow green manure (Dhaincha) and incorporate generous compost to build soil texture.',
        'Supplement secondary micro-nutrients like Zinc and Boron which leach out rapidly.'
      ],
      irrigationBn: 'খুব দ্রুত শুকিয়ে যায়। ফোঁটা ফোঁটা (ড্রিপ) সেচ বা নিয়মিত হালকা সেচ জরুরি।',
      irrigationEn: 'Dries out extremely fast. Drip irrigation or regular light watering is essential.'
    }
  ];

  const additionalSoilTypes: SoilType[] = [
    {
      id: 'clay',
      nameBn: 'এঁটেল মাটি',
      nameEn: 'Clay Soil',
      badgeBn: 'উন্নতি প্রয়োজন',
      badgeEn: 'Needs Care',
      badgeType: 'improve',
      descriptionBn: 'খুব শক্ত ও আঠালো, ভেজা অবস্থায় পিচ্ছিল এবং শুকিয়ে গেলে ফেটে চৌচির হয়।',
      descriptionEn: 'Very dense and sticky, slippery when wet, forms deep cracks when dry.',
      suitableBn: 'বোরো ধান, গম, রবি ডাল',
      suitableEn: 'Boro Rice, Wheat, Pulses',
      ph: '7.0 - 8.2',
      organicMatterBn: '১.৮% – ২.২%',
      organicMatterEn: '1.8% – 2.2%',
      fertilizerTipsBn: [
        'মাটির শক্ত আঁটসাঁট ভাব দূর করতে জিপসাম ও গোবর সার প্রয়োগ করুন।',
        'গভীর চাষ দিয়ে মাটি ভেঙে রোদ খাওয়ালে রোগবালাই কমে।'
      ],
      fertilizerTipsEn: [
        'Apply agricultural Gypsum and well-rotted manure to loosen compaction.',
        'Perform deep tilling and solar exposure before planting.'
      ],
      irrigationBn: 'পানি চুইয়ে নামতে দেরি হয়, অতিরিক্ত পানি দ্রুত নিষ্কাশন করা আবশ্যক।',
      irrigationEn: 'Slow percolation; prompt water drainage is mandatory.'
    },
    {
      id: 'alluvial',
      nameBn: 'পলি মাটি',
      nameEn: 'Silty Alluvial Soil',
      badgeBn: 'সর্বোত্তম',
      badgeEn: 'Best',
      badgeType: 'best',
      descriptionBn: 'নরম ও গুঁড়ো ময়দার মতো মসৃণ। নদীর পলি বিধৌত অত্যন্ত উর্বর মাটি।',
      descriptionEn: 'Soft and smooth like flour. River-washed alluvial soil with high natural fertility.',
      suitableBn: 'আউশ ও আমন ধান, পাট, শাকসবজি, সরিষা',
      suitableEn: 'Aus & Aman Rice, Jute, Vegetables, Mustard',
      ph: '6.3 - 7.0',
      organicMatterBn: '২.৮% – ৩.২% (উচ্চ)',
      organicMatterEn: '2.8% – 3.2% (High)',
      fertilizerTipsBn: [
        'প্রাকৃতিক উর্বরতা বেশি থাকায় রাসায়নিক সারের অপচয় রোধে মাটি পরীক্ষার সঠিক ডোজ দিন।',
        'পটাসিয়াম ও ফসফরাস নিয়মিত বজায় রাখুন।'
      ],
      fertilizerTipsEn: [
        'Naturally rich; apply calculated fertilizer doses to avoid nutrient overload.',
        'Maintain balanced Potash and Phosphate.'
      ],
      irrigationBn: 'মাটির আর্দ্রতা দীর্ঘসময় থাকে, পরিমিত সেচই যথেষ্ট।',
      irrigationEn: 'Retains moisture well; moderate irrigation is sufficient.'
    }
  ];

  const displayedSoils = showMoreSoils 
    ? [...primarySoilTypes, ...additionalSoilTypes] 
    : primarySoilTypes;

  const currentSelectedSoil = displayedSoils.find(s => s.id === selectedSoilId) || primarySoilTypes[0];

  return (
    <div className="space-y-4 pb-20 max-w-xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-[#1E5128] text-white p-3.5 sm:p-4 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white transition-colors"
            title={isBn ? 'পেছনে যান' : 'Back'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black leading-tight">
              {isBn ? 'মাটি পরীক্ষা ও স্বাস্থ্য যাচাই' : 'Soil Test & Texture Analysis'}
            </h1>
            <p className="text-[11px] sm:text-xs text-green-200">
              {isBn ? 'সহজ পদ্ধতিতে মাটির প্রকার ও পুষ্টি যাচাই' : 'Field Soil Texture & Agronomic Matching'}
            </p>
          </div>
        </div>
      </div>

      {/* 1. Sample Soil Testing Method Card (নমুনা মাটি পরীক্ষা পদ্ধতি) - EXACT DESIGN MATCH */}
      <div className="bg-[#EDFAF1] rounded-3xl p-4 sm:p-5 border-2 border-[#B9E9C6] shadow-sm">
        <h2 className="text-base sm:text-lg font-black text-gray-900 mb-3 tracking-tight">
          {isBn ? 'নমুনা মাটি পরীক্ষা পদ্ধতি' : 'Soil Sampling & Testing Method'}
        </h2>

        {/* Sunset Field Image with overlaid bottom text */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[2/1] bg-gray-900 shadow-sm border border-emerald-200/60">
          <img
            src="/images/aerial_field.jpg"
            alt="Soil Testing Field"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/soil_sample.jpg';
            }}
          />
          {/* Bottom text overlay on dark banner */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/75 to-transparent p-3 sm:p-4">
            <p className="text-white text-xs sm:text-sm font-bold leading-snug drop-shadow-md">
              {isBn 
                ? 'মাটি ভেজা অবস্থায় হাতের মুঠোয় চেপে বল তৈরি করার চেষ্টা করুন' 
                : 'Try to form a ball by pressing wet soil in your fist'}
            </p>
          </div>
        </div>

        {/* Method Instruction Description under image */}
        <p className="text-xs sm:text-sm text-gray-800 font-medium mt-3.5 leading-relaxed">
          {isBn 
            ? 'আপনার জমির ৪-৫টি স্থান থেকে ৬-৯ ইঞ্চি গভীরতার মাটি সংগ্রহ করে মিশিয়ে নিন। সামান্য পানি দিয়ে গোল বল তৈরি করে মাটির প্রকার নিশ্চিত করুন।' 
            : 'Collect soil from 4-5 spots in your field from 6-9 inch depth and mix thoroughly. Add a little water to form a round ball to determine your soil type.'}
        </p>
      </div>

      {/* 2. Match with Your Soil Type Section Heading */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm sm:text-base font-black text-gray-900 tracking-tight">
            {isBn ? 'আপনার মাটির ধরনের সাথে মেলান' : 'Match with your soil type'}
          </h3>
          <span className="text-[11px] text-gray-500 font-medium">
            {isBn ? '(নির্বাচন করতে ট্যাপ করুন)' : '(Tap to select)'}
          </span>
        </div>

        {/* Interactive Soil Type Cards List */}
        <div className="space-y-3">
          {displayedSoils.map((item) => {
            const isSelected = selectedSoilId === item.id;
            return (
              <div 
                key={item.id}
                onClick={() => setSelectedSoilId(item.id)}
                className={`bg-white rounded-2xl p-4 sm:p-4.5 border transition-all duration-200 cursor-pointer shadow-2xs ${
                  isSelected 
                    ? 'border-2 border-[#1E5128] ring-2 ring-emerald-200/70 shadow-sm' 
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                {/* Top Row: Title + Badge */}
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-black text-sm sm:text-base text-gray-900 flex items-center gap-1.5">
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#1E5128] inline-block flex-shrink-0" />
                    )}
                    <span>{isBn ? item.nameBn : item.nameEn}</span>
                  </h4>
                  
                  {/* Status Badge */}
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                    item.badgeType === 'best'
                      ? 'bg-[#D1F7C4] text-[#1E5128]'
                      : item.badgeType === 'good'
                      ? 'bg-[#D8EDFC] text-[#0066CC]'
                      : 'bg-[#FFF0C2] text-[#B45309]'
                  }`}>
                    {isBn ? item.badgeBn : item.badgeEn}
                  </span>
                </div>

                {/* Description Body */}
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                  {isBn ? item.descriptionBn : item.descriptionEn}
                </p>

                {/* Subtle Divider */}
                <div className="border-t border-gray-100 my-2.5" />

                {/* Bottom Row: Suitable Crops + pH */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 font-medium truncate mr-2 text-gray-700">
                    <span className="text-gray-500 font-semibold">{isBn ? 'উপযুক্ত:' : 'Suitable:'}</span>
                    <span className="text-gray-800 font-medium truncate">
                      {isBn ? item.suitableBn : item.suitableEn}
                    </span>
                  </div>
                  <div className="flex-shrink-0 font-semibold text-gray-800 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                    <span className="text-gray-500 font-normal">pH: </span>{item.ph}
                  </div>
                </div>

                {/* Expanded Detailed Action Plan if Selected */}
                {isSelected && (
                  <div className="mt-3.5 pt-3.5 border-t border-emerald-100 bg-[#F6FBF7] -mx-4 -mb-4 p-4 rounded-b-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1E5128] uppercase tracking-wider flex items-center gap-1">
                        <FlaskConical className="w-3.5 h-3.5 text-[#1E5128]" />
                        <span>{isBn ? 'সার ও পুষ্টি ব্যবস্থাপনা' : 'Fertilizer & Nutrition Plan'}</span>
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                        {isBn ? `জৈব পদার্থ: ${item.organicMatterBn}` : `Organic Matter: ${item.organicMatterEn}`}
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-xs text-gray-800">
                      {(isBn ? item.fertilizerTipsBn : item.fertilizerTipsEn).map((tip, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4E9F3D] mt-0.5 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200/70 text-xs text-gray-700 flex items-start space-x-2">
                      <Droplets className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-gray-900 block">
                          {isBn ? 'সেচ ও পানি ব্যবস্থাপনা:' : 'Irrigation Advice:'}
                        </span>
                        <span className="text-gray-600 text-[11px] leading-relaxed">
                          {isBn ? item.irrigationBn : item.irrigationEn}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenChatWithTopic?.(
                          isBn
                            ? `আমার জমির মাটি ${item.nameBn} (pH ${item.ph})। এই মাটিতে ধান, আলু ও সবজির জন্য একরে সার প্রয়োগ ও সেচের সঠিক ডোজ বিস্তারিত জানাবেন।`
                            : `My field soil is ${item.nameEn} (pH ${item.ph}). What is the exact fertilizer dosage and irrigation schedule per acre for major crops?`
                        );
                      }}
                      className="w-full py-2.5 bg-[#1E5128] hover:bg-[#163e1e] active:scale-[0.99] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                    >
                      <span>{isBn ? 'এই মাটির জন্য এআই কৃষিবিদের পরামর্শ নিন' : 'Consult AI Agronomist for this Soil'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Toggle additional soil types for full Bangladesh coverage */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setShowMoreSoils(!showMoreSoils)}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#1E5128] hover:text-[#163e1e] bg-emerald-50 hover:bg-emerald-100/70 px-3.5 py-1.5 rounded-full border border-emerald-200 transition-colors"
          >
            <span>
              {showMoreSoils 
                ? (isBn ? 'কম মাটি দেখুন' : 'Show Less') 
                : (isBn ? 'অন্যান্য মাটির ধরন দেখুন (এঁটেল ও পলি মাটি)' : 'View More Soil Types (Clay & Silt)')}
            </span>
            {showMoreSoils ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
