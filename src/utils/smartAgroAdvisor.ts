import { BANGLADESH_CROPS } from '../data/bangladeshAgriData';
import { getDistrictWeather } from '../data/weatherData';
import { Language } from '../types';

/**
 * Intelligent Bengali & English Agricultural Knowledge & Advisory Engine.
 * Provides rich, domain-verified agronomic responses when Gemini API key is missing
 * or when deployed on offline / static environments like Vercel without serverless.
 */
export function generateSmartAgronomicReply(
  query: string,
  language: Language = 'bn',
  userCrop?: string,
  userDistrict?: string
): string {
  const isBn = language === 'bn';
  const q = (query || '').toLowerCase().trim();
  const district = userDistrict || 'Rajshahi';
  const weather = getDistrictWeather(district);

  // 1. Identify crop mentioned in query or fallback to user profile / rice
  let detectedCrop = 'rice';
  if (q.includes('আলু') || q.includes('potato')) detectedCrop = 'potato';
  else if (q.includes('গম') || q.includes('wheat')) detectedCrop = 'wheat';
  else if (q.includes('ভুট্টা') || q.includes('maize') || q.includes('corn')) detectedCrop = 'corn';
  else if (q.includes('পাট') || q.includes('jute')) detectedCrop = 'jute';
  else if (q.includes('সরিষা') || q.includes('mustard')) detectedCrop = 'mustard';
  else if (q.includes('টমেটো') || q.includes('tomato')) detectedCrop = 'tomato';
  else if (q.includes('মরিচ') || q.includes('chili') || q.includes('chilli')) detectedCrop = 'chili';
  else if (q.includes('বেগুন') || q.includes('brinjal') || q.includes('eggplant')) detectedCrop = 'brinjal';
  else if (q.includes('পিঁয়াজ') || q.includes('পেঁয়াজ') || q.includes('onion')) detectedCrop = 'onion';
  else if (q.includes('আম') || q.includes('mango')) detectedCrop = 'mango';
  else if (q.includes('পান') || q.includes('betel')) detectedCrop = 'betel';
  else if (q.includes('ধান') || q.includes('rice') || q.includes('paddy') || q.includes('বোরো') || q.includes('আমন') || q.includes('আউশ')) detectedCrop = 'rice';
  else if (userCrop) {
    const uc = userCrop.toLowerCase();
    if (uc.includes('potato') || uc.includes('আলু')) detectedCrop = 'potato';
    else if (uc.includes('wheat') || uc.includes('গম')) detectedCrop = 'wheat';
    else if (uc.includes('maize') || uc.includes('corn') || uc.includes('ভুট্টা')) detectedCrop = 'corn';
    else if (uc.includes('jute') || uc.includes('পাট')) detectedCrop = 'jute';
    else if (uc.includes('tomato') || uc.includes('টমেটো')) detectedCrop = 'tomato';
    else if (uc.includes('chili') || uc.includes('মরিচ')) detectedCrop = 'chili';
    else if (uc.includes('mustard') || uc.includes('সরিষা')) detectedCrop = 'mustard';
  }

  const cropData = BANGLADESH_CROPS.find((c) => c.id === detectedCrop) || BANGLADESH_CROPS[0];

  // ==========================================
  // TOPIC 1: FERTILIZER & DOSAGE (সার ও সারের মাত্রা)
  // ==========================================
  const isFertilizerQuery =
    q.includes('সার') ||
    q.includes('মাত্রা') ||
    q.includes('ইউরিয়া') ||
    q.includes('ইউরিয়া') ||
    q.includes('টিএসপি') ||
    q.includes('পটাশ') ||
    q.includes('ড্যাপ') ||
    q.includes('জিংকিং') ||
    q.includes('দস্তা') ||
    q.includes('জিপসাম') ||
    q.includes('বোরন') ||
    q.includes('fertilizer') ||
    q.includes('dose') ||
    q.includes('urea') ||
    q.includes('tsp') ||
    q.includes('potash') ||
    q.includes('dap');

  if (isFertilizerQuery) {
    if (detectedCrop === 'rice') {
      if (isBn) {
        return `🌾 **ধানের জন্য বৈজ্ঞানিক অনুমোদিত সারের মাত্রা ও প্রয়োগ সূচি (বিঘা প্রতি - ৩৩ শতক):**

১. **ইউরিয়া (Urea):** ২৮ - ৩২ কেজি।
   • ১ম কিস্তি (১/৩ অংশ): চারা রোপণের ১৫-২০ দিন পর (কুশি আসার শুরুতে)।
   • ২য় কিস্তি (১/৩ অংশ): চারা রোপণের ৩০-৩৫ দিন পর (সর্বোচ্চ কুশি অবস্থায়)।
   • ৩য় কিস্তি (১/৩ অংশ): কাইচথোড় আসার ৫-৭ দিন পূর্বে।
   *(টিপস: ইউরিয়া প্রয়োগের সময় জমিতে পরিমিত আর্দ্রতা রাখুন, বেশি পানি থাকলে বের করে দিন)।*

২. **টিএসপি / ডিএপি:** ১৩ - ১৫ কেজি।
   • জমি তৈরির শেষ চাষের সময় সম্পূর্ণ পরিমাণ মাটিতে মিশিয়ে দিন। (ডিএপি দিলে ১ম কিস্তির ইউরিয়া ৫ কেজি কম লাগবে)।

৩. **এমওপি (পটাশ):** ১২ - ১৫ কেজি।
   • ৫০% জমি তৈরির শেষ চাষে এবং বাকি ৫০% শেষ কিস্তি ইউরিয়ার সাথে দিন (ধান পুষ্ট হতে সাহায্য করে)।

৪. **জিপসাম (গন্ধক):** ৮ - ১০ কেজি।
   • জমি তৈরির শেষ চাষে প্রয়োগ করুন।

৫. **দস্তা (জিংক সালফেট):** ১.৫ - ২ কেজি (হেপ্টাহাইড্রেট) অথবা ১ কেজি (মনোহাইড্রেট)।
   • জমি তৈরির সময় দিন; কখনো টিএসপির সাথে একসাথে মেশাবেন না।

📌 **জরুরি টিপস:** গুটি ইউরিয়া ব্যবহার করলে সাধারণ ইউরিয়ার চেয়ে ৩০% সাশ্রয় হয় এবং ফলন ১৫-২০% বৃদ্ধি পায়।`;
      } else {
        return `🌾 **Scientific Fertilizer Schedule for Rice (per Bigha - 33 Decimals):**

1. **Urea:** 28 - 32 kg
   • Split 1 (1/3): 15-20 days after transplanting (early tillering).
   • Split 2 (1/3): 30-35 days after transplanting (peak tillering).
   • Split 3 (1/3): 5-7 days before panicle initiation.
2. **TSP / DAP:** 13 - 15 kg
   • Apply 100% during final land preparation.
3. **MoP (Potash):** 12 - 15 kg
   • 50% at final land prep and 50% at panicle initiation with last urea split.
4. **Gypsum:** 8 - 10 kg at final tillage.
5. **Zinc Sulphate:** 1.5 - 2 kg at final tillage (do not mix directly with TSP).

📌 **Note:** Deep placement of Urea Briquettes (Guti Urea) saves 30% nitrogen and boosts yield by 15-20%.`;
      }
    }

    if (detectedCrop === 'potato') {
      if (isBn) {
        return `🥔 **আলুর জন্য অনুমোদিত সারের সঠিক মাত্রা (বিঘা প্রতি - ৩৩ শতক):**

১. **গোবর সার / কম্পোস্ট:** ৬০০ - ৮০০ কেজি (জমি তৈরির শুরুতে)।
২. **ইউরিয়া:** ৩৫ - ৩৮ কেজি (অর্ধেক শেষ চাষে, বাকি অর্ধেক রোপণের ৩০-৩৫ দিন পর গাছের গোড়ায় মাটি তোলার সময়)।
৩. **টিএসপি:** ২২ - ২৫ কেজি (সম্পূর্ণ শেষ চাষে)।
৪. **এমওপি (পটাশ):** ৩৫ - ৪০ কেজি (অর্ধেক শেষ চাষে, বাকি অর্ধেক মাটি তোলার সময়)।
৫. **জিপসাম:** ১৫ - ১৮ কেজি।
৬. **ম্যাগনেসিয়াম সালফেট ও বোরন:** বোরন ১.৫ কেজি এবং ম্যাগনেসিয়াম ২ কেজি জমিতে মিশিয়ে দিন।

📌 **সতর্কতা:** আলুর আকার বড় করতে ও ফাঁপা রোগ রোধ করতে পর্যাপ্ত পটাশ ও বোরন নিশ্চিত করুন।`;
      } else {
        return `🥔 **Potato Fertilizer Recommendation (per Bigha - 33 Decimals):**

1. **Well-decomposed Cowdung:** 600-800 kg during early plowing.
2. **Urea:** 35-38 kg (50% at planting, 50% at earthing up 30-35 days after planting).
3. **TSP:** 22-25 kg (100% at basal application).
4. **MoP (Potash):** 35-40 kg (50% basal, 50% at earthing up).
5. **Gypsum:** 15-18 kg, **Boric Acid:** 1.5 kg.

📌 High potassium improves tuber size, firmness, and storage shelf-life.`;
      }
    }

    if (detectedCrop === 'maize' || detectedCrop === 'corn') {
      if (isBn) {
        return `🌽 **ভুট্টার জন্য আদর্শ সারের মাত্রা (বিঘা প্রতি - ৩৩ শতক):**

• **ইউরিয়া:** ৪০ - ৪৫ কেজি (৩ কিস্তিতে: চারা গজানোর ২৫ দিন পর, হাঁটু সমান উচ্চতায় এবং মোচা বের হওয়ার সময়)।
• **টিএসপি:** ২২ - ২৫ কেজি (জমি তৈরির শেষ চাষে)।
• **এমওপি (পটাশ):** ১৮ - ২০ কেজি (অর্ধেক শেষ চাষে, বাকি অর্ধেক হাঁটু সমান উচ্চতায়)।
• **জিপসাম:** ১২ - ১৫ কেজি এবং **দস্তা (জিংক):** ১.৫ কেজি।
• **বোরন:** ১ কেজি (দানা পূর্ণ হওয়ার জন্য অপরিহার্য)।`;
      } else {
        return `🌽 **Maize / Corn Fertilizer Schedule (per Bigha):**

• **Urea:** 40-45 kg (Split at 25 days, knee-high stage at 45 days, and tasseling stage).
• **TSP:** 22-25 kg (Full basal).
• **MoP:** 18-20 kg (50% basal, 50% at knee-high).
• **Gypsum:** 12-15 kg, **Zinc:** 1.5 kg, **Boron:** 1 kg.`;
      }
    }

    // Generic crop fertilizer recommendation
    if (isBn) {
      return `🌱 **${cropData.nameBn} ফসলের সার প্রয়োগ নির্দেশিকা:**

• **প্রস্তাবিত মাত্রা:** ${cropData.fertilizer}
• **জৈব সার:** ভালো ফলনের জন্য প্রতি শতকে ২০-২৫ কেজি পচা গোবর বা কম্পোস্ট শেষ চাষের সময় মাটিতে মিশিয়ে দিন।
• **সুষম সার ব্যবস্থাপনা:** নাইট্রোজেন (ইউরিয়া) কখনো একবারে দেবেন না, ২-৩ কিস্তিতে ভাগ করে প্রয়োগ করুন। জমি তৈরির সময় টিএসপি, পটাশ, জিপসাম ও জিংক প্রয়োগ করুন।`;
    } else {
      return `🌱 **Fertilizer Schedule for ${cropData.nameEn}:**

• **Recommended Dosage:** ${cropData.fertilizer}
• **Organic Matter:** Apply well-rotted organic compost at 2 tons/acre during early tillage.
• **Split Schedule:** Never apply total nitrogen at once. Divide urea into 2-3 top dressings aligned with critical root growth phases.`;
    }
  }

  // ==========================================
  // TOPIC 2: PEST CONTROL (কীটপতঙ্গ ও পোকা দমন)
  // ==========================================
  const isPestQuery =
    q.includes('পোকা') ||
    q.includes('কীটপতঙ্গ') ||
    q.includes('মাজরা') ||
    q.includes('কারেন্ট') ||
    q.includes('বিপিএইচ') ||
    q.includes('পাতা মোড়ানো') ||
    q.includes('পাতা মোড়ানো') ||
    q.includes('কাটুই') ||
    q.includes('লেদা') ||
    q.includes('জাব') ||
    q.includes('সাদামাছি') ||
    q.includes('সাদা মাছি') ||
    q.includes('pest') ||
    q.includes('insect') ||
    q.includes('borer') ||
    q.includes('armyworm') ||
    q.includes('planthopper') ||
    q.includes('aphid');

  if (isPestQuery) {
    if (isBn) {
      return `🐛 **ফসলের ক্ষতিকর কীটপতঙ্গ সমন্বিত দমন ব্যবস্থাপনা (IPM):**

১. **মাজরা পোকা (Stem Borer):**
   • **লক্ষণ:** ডিগ বা শিষ শুকিয়ে 'সাদা শিষ' বা 'মরা ডিগ' হয়।
   • **প্রাকৃতিক দমন:** ডিমের গাদা হাত দিয়ে তুলে ধ্বংস করুন; জমিতে প্রতি বিঘায় ৫-৬টি ডাল বা বাঁশের কঞ্চি পুঁতে 'পার্চিং' করুন যাতে পাখি বসে পোকা খেতে পারে।
   • **রাসায়নিক ওষুধ:** আক্রমণ বেশি হলে কার্বোফিউরান ৫জি (ফুরাডান / সানফুরান) বিঘায় ১.৫-২ কেজি অথবা ভিরতাকো অনুমোদিত মাত্রায় মাটিতে প্রয়োগ করুন। স্প্রে হিসেবে কার্বোসালফান (মার্শাল ২০ ইসি ২ মিলি/লিটার)।

২. **কারেন্ট পোকা / বাদামি গাছফড়িং (BPH):**
   • **লক্ষণ:** গাছের গোড়ায় বসে রস চুষে নেয়, ফলে পুরো ক্ষেত বৃত্তাকারে পুড়ে শুকিয়ে যায় ('হপার বার্ন')।
   • **দমন:** অবিলম্বে জমির পানি সরিয়ে ৩-৪ দিন মাটি শুকিয়ে নিন; ১০-১২ সারি পর পর ১ সারি ফাঁকা রাখুন।
   • **ওষুধ:** পাইমেট্রোজিন (চেস ৫০ ডব্লিউজি ০.৬ গ্রাম/লিটার) অথবা ডিনোটেফিউরান গাছের গোড়ায় স্প্রে করুন।

৩. **পাতা মোড়ানো পোকা (Leaf Folder):**
   • **লক্ষণ:** পাতা নলের মতো মুড়িয়ে সবুজ অংশ খেয়ে ফেলে।
   • **ওষুধ:** কারটাপ হাইড্রোক্লোরাইড (সানটাপ ৫০ এসপি ১.২ গ্রাম/লিটার) বা ক্লোরানট্রানিলিপ্রোল স্প্রে করুন।

৪. **জাব পোকা, সাদা মাছি ও থ্রিপস (সবজি ও মরিচে):**
   • **জৈব দমন:** হলুদ আঠালো ফাঁদ (Yellow sticky trap) স্থাপন করুন; নিম তেলের সাথে ডিটারজেন্ট মিশিয়ে স্প্রে করুন।
   • **ওষুধ:** ইমিডাক্লোপ্রিড (টিডো / ইমিটাফ ০.৫ মিলি/লিটার) অথবা অ্যাসিটামিপ্রিড স্প্রে করুন।`;
    } else {
      return `🐛 **Integrated Pest Management (IPM) Protocols:**

1. **Stem Borer (মাজরা পোকা):**
   • **Eco-friendly:** Practice perching (bamboo twigs @ 10-12/acre) for insectivorous birds; collect and destroy egg clusters.
   • **Chemical:** Apply Carbofuran 5G @ 1.5 kg/bigha or Virtako. Alternatively, spray Carbosulfan (Marshal 20 EC @ 2ml/L).
2. **Brown Planthopper / BPH (কারেন্ট পোকা):**
   • **Cultural Control:** Drain standing water immediately for 3-4 days to expose root bases. Maintain ventilation alleys.
   • **Chemical:** Spray Pymetrozine (Chess 50 WG @ 0.6g/L) or Dinotefuran targeting lower stem zone.
3. **Leaf Folder:**
   • Spray Cartap Hydrochloride (Santap 50 SP @ 1.2g/L) or Chlorantraniliprole.
4. **Aphids, Whiteflies & Thrips (Vegetables):**
   • Use Yellow Sticky Traps; spray 5% Neem seed kernel extract or Imidacloprid @ 0.5ml/L.`;
    }
  }

  // ==========================================
  // TOPIC 3: DISEASES & FUNGUS (রোগবালাই ও ছত্রাকনাশক)
  // ==========================================
  const isDiseaseQuery =
    q.includes('রোগ') ||
    q.includes('ছত্রাক') ||
    q.includes('ব্লাস্ট') ||
    q.includes('পচা') ||
    q.includes('ঝলসা') ||
    q.includes('ধসা') ||
    q.includes('দাগ') ||
    q.includes('মরক') ||
    q.includes('ভাইরাস') ||
    q.includes('disease') ||
    q.includes('fungus') ||
    q.includes('blast') ||
    q.includes('blight') ||
    q.includes('rot') ||
    q.includes('wilt') ||
    q.includes('spot');

  if (isDiseaseQuery) {
    if (detectedCrop === 'rice') {
      if (isBn) {
        return `🔬 **ধানের প্রধান রোগবালাই ও অনুমোদিত চিকিৎসাব্যবস্থা:**

১. **ধানের ব্লাস্ট রোগ (পাতা ব্লাস্ট, গিঁট ব্লাস্ট ও শিষ ব্লাস্ট):**
   • **লক্ষণ:** পাতায় চোখের মতো বা নৌকাকৃতির বাদামি দাগ; শিষের গোড়া কালো হয়ে শিষ ভেঙে পড়ে।
   • **চিকিৎসা:** রোগ দেখা মাত্রই ট্রাইসাইক্লাজোল ৭৫% ডব্লিউপি (যেমন ট্রুপার / দিফা / বিম) প্রতি লিটার পানিতে ০.৭৫ গ্রাম অথবা ট্রাইফ্লক্সিস্ট্রবিন + টেবুকোনাজল (নেটিভো ৭৫ ডব্লিউজি) প্রতি লিটার পানিতে ০.৬ গ্রাম মিশিয়ে বিকেলে পুরো গাছে স্প্রে করুন। ৭-১০ দিন পর আরেকবার স্প্রে করুন।
   • ইউরিয়া সার প্রয়োগ সাময়িক স্থগিত রাখুন এবং পটাশ সার দিন।

২. **খোলপচা ও খোলপোড়া রোগ (Sheath Blight):**
   • **চিকিৎসা:** ভ্যালিডামাইসিন (ভ্যালিডা ৩ এল ২ মিলি/লিটার) অথবা হেক্সাকোনাজল (কনটাফ ৫ ইসি ১ মিলি/লিটার) গাছের গোড়ার খোলে স্প্রে করুন।

৩. **ব্যাকটেরিয়াজনিত পাতাপোড়া (BLB):**
   • শিষ আসার আগে পাতা ওপর থেকে নিচে শুকিয়ে খড়ের মতো হয়।
   • বিঘায় ৫ কেজি অতিরিক্ত পটাশ সার এবং ১ কেজি থিওভিট দিন। নাইট্রোজেন সার বন্ধ রাখুন।`;
      } else {
        return `🔬 **Rice Disease Diagnosis & Management:**

1. **Rice Blast (Pyricularia oryzae):**
   • **Symptoms:** Spindle/eye-shaped brown lesions with gray centers; rotten black panicle neck.
   • **Remedy:** Spray Tricyclazole 75% WP (Trooper / Beam @ 0.75g/L) or Nativo 75 WG (0.6g/L) in late afternoon. Repeat after 7-10 days.
   • Suspend Urea top-dressing and supplement with extra Potash (MoP).
2. **Sheath Blight:**
   • Spray Validamycin (Valida 3L @ 2ml/L) or Hexaconazole (Contaf 5 EC @ 1ml/L) directed at leaf sheaths.
3. **Bacterial Leaf Blight (BLB):**
   • Drain excess water, halt urea, and apply 5 kg/bigha supplemental Potash with Thiovit.`;
      }
    }

    if (detectedCrop === 'potato' || detectedCrop === 'tomato') {
      if (isBn) {
        return `🔬 **আলু ও টমেটোর নাবি ধসা (Late Blight) ও আগাম ধসা দমন:**

• **লক্ষণ:** কুয়াশাচ্ছন্ন ও মেঘলা আবহাওয়ায় পাতায় ভেজা কালো ছোপ ধরে এবং দ্রুত পুরো গাছ পচে কালচে হয়ে ভেঙে পড়ে।
• **প্রতিরোধমূলক ব্যবস্থা:** কুয়াশা শুরু হওয়ার সাথে সাথে ম্যানকোজেব ৮০ ডব্লিউপি (ডাইথেন এম-৪৫ অথবা ইন্ডোফিল ২ গ্রাম/লিটার) স্প্রে করুন।
• **আক্রমণ শুরু হলে:** ম্যানকোজেব + মেটালেক্সিল (রিডোমিল গোল্ড ২ গ্রাম/লিটার) অথবা ফেনামিডন + ম্যানকোজেব (সিকিউর ১ গ্রাম/লিটার) পাতার ওপর-নিচ ভালো করে ভিজিয়ে স্প্রে করুন।
• সেচ বন্ধ রাখুন এবং আক্রান্ত গাছ দ্রুত অপসারণ করুন।`;
      } else {
        return `🔬 **Late Blight Management (Potato & Tomato):**

• **Preventive:** In cloudy/foggy weather, spray Mancozeb 80% WP (Indofil @ 2g/L) proactively.
• **Curative:** At onset of water-soaked lesions, spray Metalaxyl + Mancozeb (Ridomil Gold @ 2g/L) or Secure (1g/L).
• Withhold furrow irrigation and prune severely rotten stems.`;
      }
    }

    if (isBn) {
      return `🔬 **${cropData.nameBn} ফসলের রোগবালাই নিরাময় গাইড:**

• **সাধারণ রোগবালাই:** ${cropData.diseases.join(', ')}
• **প্রতিরোধমূলক ব্যবস্থা:** ${cropData.prevention.join(' | ')}
• **ছত্রাকনাশক পরামর্শ:** ছত্রাকজনিত দাগ বা পচন দেখা দিলে কার্বেনডাজিম ৫০ ডব্লিউপি (অটোস্টিন / নোইন ২ গ্রাম/লিটার) অথবা ম্যানকোজেব ২ গ্রাম/লিটার সকালে বা বিকেলে স্প্রে করুন।`;
    } else {
      return `🔬 **Disease Protocol for ${cropData.nameEn}:**

• **Prevalent Diseases:** ${cropData.diseases.join(', ')}
• **Preventive Protocols:** ${cropData.prevention.join(' | ')}
• **General Remedy:** Apply systemic Carbendazim 50% WP @ 2g/L or broad-spectrum Mancozeb @ 2g/L at first appearance of spots.`;
    }
  }

  // ==========================================
  // TOPIC 4: IRRIGATION & WATER (সেচ ও পানি)
  // ==========================================
  const isWaterQuery =
    q.includes('সেচ') ||
    q.includes('পানি') ||
    q.includes('খরা') ||
    q.includes('বন্যা') ||
    q.includes('নিষ্কাশন') ||
    q.includes('water') ||
    q.includes('irrigation') ||
    q.includes('drainage') ||
    q.includes('drought') ||
    q.includes('flood');

  if (isWaterQuery) {
    if (isBn) {
      return `💧 **সেচ ও পানি ব্যবস্থাপনা গাইডলাইন (${district} জেলা আবহাওয়া: তাপমাত্রা ${weather.temp}°C, বৃষ্টি সম্ভাবনা ${weather.rainChance}%):**

১. **এডাব্লিউডি (AWD - অল্টারনেট ওয়েটিং অ্যান্ড ড্রায়িং) পদ্ধতি:**
   • জমিতে সার্বক্ষণিক পানি আটকে না রেখে পর্যায়ক্রমে শুকানো ও ভিজানো পদ্ধতি অবলম্বন করুন।
   • একটি ছিদ্রযুক্ত প্লাস্টিক পাইপ জমিতে পুঁতে পানির স্তর পর্যবেক্ষণ করুন। পানির স্তর মাটি থেকে ৭-১০ সেমি নিচে নামলে পুনরায় ২-৩ ইঞ্চি সেচ দিন। এতে ৩০% সেচের পানি সাশ্রয় হয়।

২. **সংকটময় পর্যায় (যেসব সময় পানি অবশ্যই থাকতে হবে):**
   • চারা রোপণের প্রথম ১০ দিন (২-৩ ইঞ্চি পানি)।
   • কাইচথোড় আসার সময় থেকে ফুল ফোটা ও দানা দুধাল অবস্থা পর্যন্ত (মাটিতে রস পর্যাপ্ত থাকতে হবে, কোনোভাবেই ফাটল ধরতে দেওয়া যাবে না)।

৩. **ভারী বৃষ্টির পর:** জমিতে পানি জমতে না দিয়ে নিষ্কাশন নালা খুলে দিন যাতে শিকড়ে পচন না ধরে।`;
    } else {
      return `💧 **Irrigation & Water Guidance (${district} Weather: Temp ${weather.temp}°C, Rain ${weather.rainChance}%):**

1. **AWD (Alternate Wetting and Drying):**
   • Do not submerge field continuously. Let soil dry until water level drops 7-10 cm below surface before applying next 5 cm irrigation. Saves 30% diesel/fuel costs.
2. **Critical Moisture Window:**
   • Transplanting stage (first 10 days) and panicle initiation to grain-filling stage (keep 2-3 inches shallow standing water).
3. **Drainage Alert:** Ensure peripheral field ditches are clear to drain stagnant storm water quickly.`;
    }
  }

  // ==========================================
  // TOPIC 5: SEEDS & VARIETIES (বীজ ও উন্নত জাত)
  // ==========================================
  const isSeedQuery =
    q.includes('বীজ') ||
    q.includes('জাত') ||
    q.includes('চারা') ||
    q.includes('রোপণ') ||
    q.includes('seed') ||
    q.includes('variety') ||
    q.includes('planting');

  if (isSeedQuery) {
    if (isBn) {
      return `🌱 **${cropData.nameBn} ফসলের উচ্চফলনশীল জাত ও বীজ শোধন নির্দেশিকা:**

• **সেরা অনুমোদিত জাত:** ${cropData.seed}
• **উপযুক্ত বপন মৌসুম:** ${cropData.bestSeason}
• **বীজ শোধন পদ্ধতি:** বীজ বপনের আগে প্রতি কেজি বীজে ২.৫ গ্রাম কার্বেনডাজিম (অটোস্টিন) বা প্রোভ্যাক্স মিশিয়ে শোধন করে নিন। এতে বীজবাহিত ছত্রাক ও ধসা রোগ ৯০% প্রতিরোধ হয়।
• **চারা রোপণের দূরত্ব:** সারিতে ২৫ সেমি এবং গাছ থেকে গাছে ১৫-২০ সেমি দূরত্ব বজায় রাখুন।`;
    } else {
      return `🌱 **Recommended Varieties & Seed Care for ${cropData.nameEn}:**

• **Top Varieties:** ${cropData.seed}
• **Planting Season:** ${cropData.bestSeason}
• **Seed Treatment:** Treat seeds with Carbendazim (Autostin @ 2g/kg seed) before germination to eliminate seed-borne pathogens.`;
    }
  }

  // ==========================================
  // TOPIC 6: GREETING & GENERAL QUESTIONS
  // ==========================================
  const isGreeting =
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q === 'হাই' ||
    q === 'হ্যালো' ||
    q === 'সালাম' ||
    q === 'আসসালামু আলাইকুম' ||
    q.startsWith('কেমন') ||
    q.startsWith('how are you');

  if (isGreeting) {
    if (isBn) {
      return `হ্যালো! আমি আপনার স্মার্ট অ্যারো ফিল্ড এআই কৃষিবিদ। আপনার এলাকার (${district}) বর্তমান আবহাওয়া ও কৃষিতথ্য অনুযায়ী আমি প্রস্তুত।

আপনি আমাকে ফসলের যেকোনো বিষয় জিজ্ঞেস করতে পারেন, যেমন:
• **"ধানের জন্য সারের সঠিক মাত্রা কত?"**
• **"কীটপতঙ্গ বা মাজরা পোকা দমন কীভাবে করব?"**
• **"পাতাপোড়া বা ব্লাস্ট রোগের সমাধান কী?"**
• **"আলু বা ভুট্টার ভালো জাত ও যত্ন কী?"**

আপনার ফসল বা সমস্যা সম্পর্কে বিস্তারিত লিখুন, আমি সঠিক কৃষি সমাধান দিচ্ছি।`;
    } else {
      return `Hello! I am your Smart Aero Field AI Agronomist, calibrated with live agricultural and climate telemetry for ${district}.

Feel free to ask me questions like:
• **"What is the recommended fertilizer dose for rice?"**
• **"How to control stem borers and brown planthoppers?"**
• **"How to treat fungal blast or late blight?"**
• **"Best irrigation practices for high yield?"**

Type your question or crop name and I will provide immediate recommendations.`;
    }
  }

  // ==========================================
  // DEFAULT SMART AGRONOMIC SYNTHESIS
  // ==========================================
  if (isBn) {
    return `🌾 **স্মার্ট অ্যারো ফিল্ড কৃষি বিশেষজ্ঞ পরামর্শ (${cropData.nameBn} ফসল ও ${district} অঞ্চল):**

আপনার প্রশ্ন "${query}" সংক্রান্ত বৈজ্ঞানিক বিশ্লেষণ:

১. **মাটি ও পুষ্টি ব্যবস্থাপনা:** জমিতে সুষম সার (ইউরিয়া, টিএসপি, পটাশ, জিপসাম ও জিংক) প্রয়োগ নিশ্চিত করুন। অতিরিক্ত ইউরিয়া ব্যবহার পোকা ও রোগের আক্রমণ বাড়ায়।
২. **নজরদারি ও রোগবালাই প্রতিরোধ:** নিয়মিত জমির চারপাশ ঘুরে পাতার গোড়া ও শিষ পর্যবেক্ষণ করুন। পোকার প্রাথমিক অবস্থায় পার্চিং ও নিম নির্যাস ব্যবহার করুন।
৩. **পানি ব্যবস্থাপনা:** জলাবদ্ধতা পরিহার করে সুষম সেচ দিন।

💡 *টিপস: সম্পূর্ণ জেমিনি লাইভ এআই সক্রিয় করতে Vercel Environment Variables-এ \`GEMINI_API_KEY\` যুক্ত করুন অথবা সেটিংস থেকে এআই কী কনফিগার করুন।*`;
  } else {
    return `🌾 **Smart Aero Field Agronomic Advisory (${cropData.nameEn} in ${district}):**

Scientific assessment for "${query}":

1. **Balanced Nutrition:** Apply recommended split fertilizer dosages (Urea, TSP, MoP, Gypsum, Zinc). Avoid excessive nitrogen which attracts chewing pests.
2. **Crop Scouting:** Monitor stem bases and leaf undersides weekly. Deploy organic traps (perching, light traps) before chemical intervention.
3. **Moisture Control:** Maintain field drainage to prevent fungal spore proliferation.

💡 *Tip: For live unrestricted Gemini AI responses on Vercel, ensure \`GEMINI_API_KEY\` is added to Vercel Environment Variables.*`;
  }
}
