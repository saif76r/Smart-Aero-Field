// Bengali translation and agronomic dictionary for crop disease solutions & prescriptions

const EXACT_TRANSLATIONS: Record<string, string> = {
  // Chemical Prescriptions
  "Nativo 75 WG (Tebuconazole + Trifloxystrobin) at 0.4g per Liter of water":
    "নাটিভো ৭৫ ডব্লিউজি (টেবুকোনাজল + ট্রাইফ্লক্সিস্ট্রবিন) - প্রতি লিটার পানিতে ০.৪ গ্রাম হারে মিশিয়ে স্প্রে করুন।",
  "Nativo 75 WG (Tebuconazole + Trifloxystrobin) @ 0.4g per Liter of water":
    "নাটিভো ৭৫ ডব্লিউজি (টেবুকোনাজল + ট্রাইফ্লক্সিস্ট্রবিন) - প্রতি লিটার পানিতে ০.৪ গ্রাম হারে মিশিয়ে স্প্রে করুন।",
  "Nativo 75 WG (Tebuconazole + Trifloxystrobin) @ 0.6g per Liter.":
    "নাটিভো ৭৫ ডব্লিউজি (টেবুকোনাজল + ট্রাইফ্লক্সিস্ট্রবিন) - প্রতি লিটার পানিতে ০.৬ গ্রাম মিশিয়ে স্প্রে করুন।",
  "Amistar Top 325 SC (Azoxystrobin + Difenoconazole) at 1ml per Liter of water":
    "অ্যামিস্টার টপ ৩২৫ এসসি (অ্যাজোক্সিস্ট্রবিন + ডাইফেনোকোনাজল) - প্রতি লিটার পানিতে ১ মিলি হারে মিশিয়ে স্প্রে করুন।",
  "Azoxystrobin + Difenoconazole (Amistar Top 325 SC) @ 1ml per Liter of water.":
    "অ্যাজোক্সিস্ট্রবিন + ডাইফেনোকোনাজল (অ্যামিস্টার টপ ৩২৫ এসসি) - প্রতি লিটার পানিতে ১ মিলি হারে স্প্রে করুন।",
  "Azoxystrobin + Difenoconazole (Amistar Top 325 SC) @ 1ml per Liter.":
    "অ্যাজোক্সিস্ট্রবিন + ডাইফেনোকোনাজল (অ্যামিস্টার টপ ৩২৫ এসসি) - প্রতি লিটার পানিতে ১ মিলি হারে স্প্রে করুন।",
  "Spray thoroughly covering both sides of the leaves during early morning or late afternoon; repeat after 7-10 days if necessary.":
    "সকালবেলা বা বিকেলে পাতার উভয় পিঠ ভালো করে ভিজিয়ে স্প্রে করুন; প্রয়োজনে ৭-১০ দিন পর পুনরায় স্প্রে করুন।",
  "Mancozeb 75% WP (Dithane M-45 / Indofil) @ 2g per Liter of water.":
    "ম্যানকোজেব ৭৫% ডব্লিউপি (ডাইথেন এম-৪৫ / ইন্ডোফিল) - প্রতি লিটার পানিতে ২ গ্রাম হারে স্প্রে করুন।",
  "Mancozeb 75% WP (Indofil / Dithane M-45) @ 2g per Liter of water.":
    "ম্যানকোজেব ৭৫% ডব্লিউপি (ইন্ডোফিল / ডাইথেন এম-৪৫) - প্রতি লিটার পানিতে ২ গ্রাম হারে স্প্রে করুন।",
  "Mancozeb 75% WP @ 2g per Liter of water.":
    "ম্যানকোজেব ৭৫% ডব্লিউপি (ডাইথেন এম-৪৫) - প্রতি লিটার পানিতে ২ গ্রাম হারে স্প্রে করুন।",
  "Carbendazim (Autostin 50 WDG) @ 1.5g per Liter of water.":
    "কার্বেনডাজিম (অটোস্টিন ৫০ ডব্লিউডিজি) - প্রতি লিটার পানিতে ১.৫ গ্রাম হারে স্প্রে করুন।",
  "Copper Oxychloride (Cupravit 50 WP) @ 2g per Liter of water.":
    "কপার অক্সিক্লোরাইড (কুপ্রাভিট ৫০ ডব্লিউপি) - প্রতি লিটার পানিতে ২ গ্রাম হারে স্প্রে করুন।",
  "Amistar Top 325 SC @ 1ml/L or Nativo 75 WG @ 0.6g/L.":
    "অ্যামিস্টার টপ ৩২৫ এসসি প্রতি লিটার পানিতে ১ মিলি অথবা নাটিভো ৭৫ ডব্লিউজি ০.৬ গ্রাম হারে স্প্রে করুন।",
  "Azoxystrobin + Difenoconazole (Amistar Top) @ 1ml/L.":
    "অ্যাজোক্সিস্ট্রবিন + ডাইফেনোকোনাজল (অ্যামিস্টার টপ) প্রতি লিটার পানিতে ১ মিলি স্প্রে করুন।",
  "Dimethomorph + Mancozeb (Acrobat MZ) @ 2g per Liter of water.":
    "ডাইমেথোমর্ফ + ম্যানকোজেব (অ্যাক্রোব্যাট এমজেড) প্রতি লিটার পানিতে ২ গ্রাম হারে স্প্রে করুন।",
  "Nativo 75 WG @ 0.6g/L or Propiconazole (Tilt 250 EC) @ 0.5ml/L.":
    "নাটিভো ৭৫ ডব্লিউজি ০.৬ গ্রাম অথবা প্রপিকোনাজল (টিল্ট ২৫০ ইসি) প্রতি লিটার পানিতে ০.৫ মিলি স্প্রে করুন।",
  "Mancozeb + Cymoxanil (Curzate M8 / Acrobat MZ) @ 2g/L.":
    "ম্যানকোজেব + সাইমোক্সানিল (কারজেট এম৮ / অ্যাক্রোব্যাট) প্রতি লিটার পানিতে ২ গ্রাম স্প্রে করুন।",
  "Difenoconazole (Score 250 EC) @ 0.5ml/L for field sprays.":
    "ডাইফেনোকোনাজল (স্কোর ২৫০ ইসি) প্রতি লিটার পানিতে ০.৫ মিলি হারে স্প্রে করুন।",
  "Poison bait trap: 100g mashed sweet gourd + 1g Dipterex 80 SP in shallow pots.":
    "বিষটোপ ফাঁদ: ১০০ গ্রাম চটকানো মিষ্টি কুমড়া + ১ গ্রাম ডিপটেরেক্স ৮০ এসপি মাটির চাড়িতে রাখুন।",
  "Emamectin Benzoate 5% SG @ 1g/L for foliage protection.":
    "ইমামেকটিন বেনজয়েট ৫% এসজি প্রতি লিটার পানিতে ১ গ্রাম হারে পাতায় স্প্রে করুন।",
  "Azoxystrobin + Difenoconazole (Amistar Top) @ 1ml/L + Emamectin Benzoate @ 1g/L.":
    "অ্যামিস্টার টপ প্রতি লিটার পানিতে ১ মিলি + ইমামেকটিন বেনজয়েট ১ গ্রাম হারে মিশিয়ে স্প্রে করুন।",

  // Organic Prescriptions
  "Spray Neem Seed Kernel Extract (NSKE 5%) or cold-pressed Neem oil (5ml/L) with mild soapy water.":
    "নিম বীজের নির্যাস (৫%) অথবা কোল্ড-প্রেসড নিম তেল (প্রতি লিটার পানিতে ৫ মিলি) সামান্য সাবান পানি মিশিয়ে স্প্রে করুন।",
  "Spray bio-fungicide Trichoderma harzianum @ 5g/L early in the morning.":
    "সকালবেলা ট্রাইকোডার্মা হারজিয়ানাম জৈব ছত্রাকনাশক প্রতি লিটার পানিতে ৫ গ্রাম হারে স্প্রে করুন।",
  "Dust wood ash over damp leaves to reduce leaf surface wetness.":
    "ভেজা পাতার ওপর শুকনো কাঠের ছাই ছিটিয়ে দিন যাতে ছত্রাকের বিস্তার রোধ হয়।",
  "Double-layer brown paper fruit bagging when fruits reach marble/egg size.":
    "ফল মার্বেল বা ডিম্বাকৃতির হলে দুই স্তরের ব্রাউন পেপার বা বিশেষ কাগজের ব্যাগ পরিয়ে দিন (ফ্রুট ব্যাগিং)।",
  "Post-harvest hot water treatment of harvested mangoes (52°C for 5 minutes).":
    "ফল সংগ্রহের পর গরম পানিতে (৫২° সেলসিয়াস তাপমাত্রায় ৫ মিনিট) ডুবিয়ে শোধন করে নিন।",
  "Spray 1% Bordeaux mixture or 5ml/L neem seed oil after fruit set.":
    "ফল ধরার পর ১% বোর্দো মিশ্রণ অথবা নিম তেলের স্প্রে (প্রতি লিটার পানিতে ৫ মিলি) করুন।",
  "Prune infected twigs 2 inches below infection and apply copper paste on cut ends.":
    "আক্রান্ত ডালের সংক্রমণের ২ ইঞ্চি নিচ থেকে কেটে ফেলুন এবং কাটা অংশে কপার পেস্ট লাগান।",
  "Spray 5% neem seed kernel extract.":
    "৫% নিম বীজের নির্যাস প্রস্তুত করে গাছে ভালোভাবে স্প্রে করুন।",
  "Seed treatment with hot water (52°C for 10 minutes) before sowing.":
    "বীজ বপনের আগে গরম পানিতে (৫২° সেলসিয়াস তাপমাত্রায় ১০ মিনিট) ভিজিয়ে বীজ শোধন করুন।",
  "Spray Trichoderma viride bio-fungicide @ 5g/L at flowering.":
    "ফুল ফোটার সময় ট্রাইকোডার্মা ভিরিডি জৈব বালাইনাশক প্রতি লিটার পানিতে ৫ গ্রাম হারে স্প্রে করুন।",
  "High earthing up to keep tubers deep beneath soil cover.":
    "আলুর গাছের গোড়ায় ভালো করে মাটি তুলে দিন যাতে কন্দ মাটির গভীরে সুরক্ষিত থাকে।",
  "Store only completely cured, undamaged tubers in dry well-ventilated racks.":
    "সংরক্ষণের জন্য কেবল সুস্থ, সম্পূর্ণ শুকানো ও ক্ষতহীন আলু বাতাস চলাচলকারী মাচায় রাখুন।",
  "Cuelure Sex Pheromone Traps @ 4-6 traps per bigha.":
    "বিঘা প্রতি ৪-৬টি কিউলিউর সেক্স ফেরোমোন ফাঁদ স্থাপন করুন মাছি পোকা দমনে।",
  "Paper or mesh bagging of baby fruits immediately after pollination.":
    "পরাগায়নের পরপরই কচি ফলে কাগজের বা জালের ব্যাগ পরিয়ে দিন।",
  "Spray baking soda 5g + neem oil 5ml per Liter of water.":
    "প্রতি লিটার পানিতে ৫ গ্রাম বেকিং সোডা ও ৫ মিলি নিম তেল মিশিয়ে স্প্রে করুন।",
  "Deploy sex pheromone traps @ 4 per bigha.":
    "জমিতে বিঘা প্রতি ৪টি সেক্স ফেরোমোন ফাঁদ স্থাপন করুন।",
  "Spray cold-pressed neem oil 5ml/L mixed with soapy water.":
    "কোল্ড-প্রেসড নিম তেল প্রতি লিটার পানিতে ৫ মিলি সামান্য ডিটারজেন্ট মিশিয়ে স্প্রে করুন।",

  // Prevention Prescriptions
  "Ensure good air circulation and avoid excessively dense planting.":
    "গাছে পর্যাপ্ত আলো-বাতাস চলাচলের ব্যবস্থা রাখুন এবং অতিরিক্ত ঘন করে গাছ রোপণ করবেন না।",
  "Avoid overhead sprinkler irrigation late in the evening.":
    "বিকেল বা সন্ধ্যার সময় গাছের ওপর থেকে সরাসরি পানি ছিটানো পরিহার করুন।",
  "Apply balanced Potash (MoP) and Zinc to boost natural disease resistance; avoid excess Urea.":
    "গাছের রোগ প্রতিরোধ ক্ষমতা বাড়াতে সুষম মাত্রায় পটাশ (এমওপি) ও জিংক সার দিন; অতিরিক্ত ইউরিয়া সার দেওয়া থেকে বিরত থাকুন।",
  "Prune diseased twigs after harvest and spray copper oxychloride.":
    "ফল তোলার পর আক্রান্ত শুকনো বা পচা ডাল ছেঁটে পুড়িয়ে ফেলুন এবং কপার অক্সিক্লোরাইড স্প্রে করুন।",
  "Collect and destroy fallen rotten mangoes from the orchard floor.":
    "মাটিতে ঝরে পড়া পচা ফল সংগ্রহ করে মাটির নিচে কমপক্ষে ২ ফুট গভীরে পুঁতে ফেলুন।",
  "Avoid overhead irrigation during flowering and fruit setting.":
    "গাছে ফুল ও ফল আসার সময় ওপর থেকে পানি দেওয়া এড়িয়ে চলুন।",
  "Post-harvest orchard pruning and sanitary leaf burning.":
    "ফল সংগ্রহের পর বাগান পরিষ্কার-পরিচ্ছন্ন রাখুন এবং মরা পাতা ও ডালপালা দূরে অপসারণ করুন।",
  "Balanced fertilizer application with adequate organic compost.":
    "পর্যাপ্ত জৈব সারের সাথে সুষম মাত্রায় রাসায়নিক সার প্রয়োগ করুন।",
  "Ensure good drainage so water never stagnates around roots.":
    "গাছের গোড়ায় যেন কোনোভাবেই বৃষ্টির বা সেচের পানি জমে না থাকে সে জন্য দ্রুত নিষ্কাশন নালা তৈরি করুন।",
  "Collect and destroy all diseased fallen chilies.":
    "আক্রান্ত ও ঝরে পড়া সমস্ত মরিচ সংগ্রহ করে নষ্ট বা পুঁতে ফেলুন।",
  "Kill potato vines 10 days before harvesting (Dehaulming).":
    "আলু তোলার ১০ দিন আগে আলুর গাছের লতা কেটে অপসারণ করুন (ডিহমিং)।",
  "Never harvest during rainy or damp soil conditions.":
    "বৃষ্টির সময় বা ভেজা মাটিতে কখনোই আলু বা ফসল তুলবেন না।",
  "Collect and bury all stung dropped fruits in at least 2 feet deep soil.":
    "পোকা আক্রান্ত ঝরে পড়া সমস্ত ফল কুড়িয়ে অন্তত ২ ফুট মাটির নিচে পুঁতে ফেলুন।",
  "Plow the soil after harvest to expose resting pupae to birds and sun.":
    "ফসল তোলার পর জমি গভীর চাষ দিয়ে মাটির নিচে থাকা পোকার পুত্তলি রোদে শুকিয়ে নষ্ট করুন।",
  "Provide trellises/machang so leaves stay off the damp ground.":
    "উঁচু মাচা বা জাংলা তৈরি করে গাছ তুলে দিন যাতে পাতা ও ফল ভেজা মাটির সংস্পর্শে না আসে।",
  "Avoid wetting foliage during irrigation.":
    "সেচের সময় গাছের পাতা ও ডগা ভেজানো এড়িয়ে সরাসরি গোড়ায় পানি দিন।",
  "Clean up and bury all rotten fruits fallen beneath trees.":
    "গাছের নিচে পড়ে থাকা সমস্ত পচা ফল কুড়িয়ে মাটির গভীরে পুঁতে ফেলুন।",
  "Cover fruits with protective paper/cloth bags when young.":
    "কচি অবস্থাতেই ফল কাগজের বা সুতি কাপড়ের ব্যাগ দিয়ে ঢেকে রাখুন।",
};

export function translateSolutionToBengali(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();

  // 1. Direct dictionary match
  if (EXACT_TRANSLATIONS[trimmed]) {
    return EXACT_TRANSLATIONS[trimmed];
  }

  // If already contains Bengali characters, return as-is
  if (/[\u0980-\u09FF]/.test(trimmed)) {
    return trimmed;
  }

  // 2. Intelligent pattern translation for agronomic instructions
  let result = trimmed;

  // Replace common chemical brand lines
  result = result
    .replace(/Nativo 75 WG/gi, 'নাটিভো ৭৫ ডব্লিউজি')
    .replace(/Amistar Top 325 SC/gi, 'অ্যামিস্টার টপ ৩২৫ এসসি')
    .replace(/Dithane M-45/gi, 'ডাইথেন এম-৪৫')
    .replace(/Indofil/gi, 'ইন্ডোফিল')
    .replace(/Autostin 50 WDG/gi, 'অটোস্টিন ৫০ ডব্লিউডিজি')
    .replace(/Cupravit 50 WP/gi, 'কুপ্রাভিট ৫০ ডব্লিউপি')
    .replace(/Score 250 EC/gi, 'স্কোর ২৫০ ইসি')
    .replace(/Tilt 250 EC/gi, 'টিল্ট ২৫০ ইসি')
    .replace(/Virtako 40 WG/gi, 'ভার্টাকো ৪০ ডব্লিউজি')
    .replace(/Tebuconazole/gi, 'টেবুকোনাজল')
    .replace(/Trifloxystrobin/gi, 'ট্রাইফ্লক্সিস্ট্রবিন')
    .replace(/Azoxystrobin/gi, 'অ্যাজোক্সিস্ট্রবিন')
    .replace(/Difenoconazole/gi, 'ডাইফেনোকোনাজল')
    .replace(/Mancozeb/gi, 'ম্যানকোজেব')
    .replace(/Carbendazim/gi, 'কার্বেনডাজিম')
    .replace(/Copper Oxychloride/gi, 'কপার অক্সিক্লোরাইড')
    .replace(/Propiconazole/gi, 'প্রপিকোনাজল')
    .replace(/Emamectin Benzoate/gi, 'ইমামেকটিন বেনজয়েট')
    .replace(/Trichoderma/gi, 'ট্রাইকোডার্মা')
    .replace(/Neem oil/gi, 'নিম তেল')
    .replace(/Neem Seed Kernel Extract/gi, 'নিম বীজের নির্যাস')
    .replace(/Pheromone trap/gi, 'ফেরোমোন ফাঁদ')
    .replace(/Sticky cards/gi, 'আঠালো ফাঁদ')
    .replace(/Bordeaux mixture/gi, 'বোর্দো মিশ্রণ');

  // Replace dosage & frequency terminology
  result = result
    .replace(/at ([\d.]+)g per Liter of water/gi, '- প্রতি লিটার পানিতে $1 গ্রাম হারে মিশিয়ে স্প্রে করুন')
    .replace(/@ ([\d.]+)g per Liter of water/gi, '- প্রতি লিটার পানিতে $1 গ্রাম হারে স্প্রে করুন')
    .replace(/at ([\d.]+)ml per Liter of water/gi, '- প্রতি লিটার পানিতে $1 মিলি হারে মিশিয়ে স্প্রে করুন')
    .replace(/@ ([\d.]+)ml per Liter of water/gi, '- প্রতি লিটার পানিতে $1 মিলি হারে স্প্রে করুন')
    .replace(/@ ([\d.]+)g\/L/gi, '- প্রতি লিটার পানিতে $1 গ্রাম স্প্রে করুন')
    .replace(/@ ([\d.]+)ml\/L/gi, '- প্রতি লিটার পানিতে $1 মিলি স্প্রে করুন')
    .replace(/per Liter of water/gi, 'প্রতি লিটার পানিতে')
    .replace(/per Liter/gi, 'প্রতি লিটার পানিতে')
    .replace(/Spray thoroughly covering both sides of the leaves/gi, 'পাতার উভয় পিঠ ভালো করে ভিজিয়ে স্প্রে করুন')
    .replace(/during early morning or late afternoon/gi, 'সকালবেলা বা পড়ন্ত বিকেলে')
    .replace(/repeat after (\d+)-(\d+) days if necessary/gi, 'প্রয়োজনে $1-$2 দিন পর আবার স্প্রে করুন')
    .replace(/repeat after (\d+) days/gi, '$1 দিন পর আবার স্প্রে করুন')
    .replace(/early morning/gi, 'সকালবেলা')
    .replace(/late afternoon/gi, 'বিকেলে')
    .replace(/Spray/gi, 'স্প্রে করুন:')
    .replace(/Ensure good drainage/gi, 'পানি নিষ্কাশনের সুব্যবস্থা রাখুন')
    .replace(/Avoid excess Urea/gi, 'অতিরিক্ত ইউরিয়া সার দেওয়া পরিহার করুন');

  return result;
}
