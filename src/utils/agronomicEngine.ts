import { NotificationItem, Language } from '../types';
import { getDistrictWeather, DistrictWeatherInfo } from '../data/weatherData';

export interface AgronomicDailyCard {
  id: string;
  cropId: string;
  image?: string;
  cropTagEn: string;
  cropTagBn: string;
  tagColor: 'green' | 'amber' | 'blue' | 'purple' | 'emerald';
  titleEn: string;
  titleBn: string;
  dateRangeEn: string;
  dateRangeBn: string;
  isTodayActive: boolean;
  stageEn: string;
  stageBn: string;
  weatherAdviceEn: string;
  weatherAdviceBn: string;
  weatherBriefEn?: string;
  weatherBriefBn?: string;
  priority: number;
}

// Digits conversion to Bengali
export const toBnDigits = (val: number | string): string => {
  return String(val).replace(/\d/g, (ch) => '০১২৩৪৫৬৭৮৯'[parseInt(ch, 10)]);
};

export const getCropImage = (cropId: string): string => {
  const map: Record<string, string> = {
    rice: '/images/crop_rice.jpg',
    wheat: '/images/crop_wheat.jpg',
    potato: '/images/crop_potato.jpg',
    tomato: '/images/crop_tomato.jpg',
    mustard: '/images/crop_mustard.jpg',
    jute: '/images/crop_jute.jpg',
    chili: '/images/crop_chili.jpg',
    brinjal: '/images/crop_brinjal.jpg',
    onion: '/images/crop_onion.jpg',
    betel: '/images/crop_betel.jpg',
    mango: '/images/crop_mango.jpg',
    maize: '/images/crop_maize.jpg',
  };
  return map[cropId] || '/images/crop_rice.jpg';
};

/**
 * Calculates dynamic, real-time agronomic recommendations for TODAY
 * based on current calendar date, Bangladeshi agricultural seasons,
 * user's primary crop, and current district live weather.
 */
export const getRealtimeAgronomicUpdates = (
  district: string = 'Rajshahi',
  primaryCrop?: string,
  targetDate: Date = new Date()
): AgronomicDailyCard[] => {
  const month = targetDate.getMonth(); // 0 = Jan, 1 = Feb, ..., 8 = Sep, 11 = Dec
  const day = targetDate.getDate();
  const weather: DistrictWeatherInfo = getDistrictWeather(district);

  // Derive weather condition modifier
  let weatherNoteBn = '';
  let weatherNoteEn = '';
  let weatherBriefBn = '';
  let weatherBriefEn = '';

  if (weather.rainChance >= 40) {
    weatherNoteBn = `🌧️ আজ বৃষ্টির সম্ভাবনা (${toBnDigits(weather.rainChance)}%): ইউরিয়া সার উপরিপ্রয়োগ ও স্প্রে স্থগিত রাখুন; পানি নিষ্কাশন নালা সচল রাখুন।`;
    weatherNoteEn = `🌧️ Rain Expected Today (${weather.rainChance}%): Delay urea top-dressing & spraying; ensure drainage outlets are free.`;
    weatherBriefBn = `🌧️ বৃষ্টির সম্ভাবনা (${toBnDigits(weather.rainChance)}%) • স্প্রে স্থগিত রাখুন`;
    weatherBriefEn = `🌧️ Rain expected (${weather.rainChance}%) • Hold spray`;
  } else if (weather.temp >= 33) {
    weatherNoteBn = `☀️ আজ তীব্র রোদ ও তাপমাত্রা (${toBnDigits(weather.temp)}°C): প্রখর রোদে সার ছিটাবেন না; বাষ্পীভবন কমাতে সকালে বা বিকেলে সেচ দিন।`;
    weatherNoteEn = `☀️ High Temperature Alert (${weather.temp}°C): Avoid midday fertilization; irrigate in early morning or late afternoon.`;
    weatherBriefBn = `☀️ উচ্চ তাপমাত্রা (${toBnDigits(weather.temp)}°C) • সকালে/বিকেলে সেচ দিন`;
    weatherBriefEn = `☀️ High heat (${weather.temp}°C) • Irrigate early`;
  } else if (weather.humidity >= 78) {
    weatherNoteBn = `🌫️ উচ্চ আর্দ্রতা (${toBnDigits(weather.humidity)}%): ছত্রাক ও ব্লাস্ট রোগের ঝুঁকি; নিয়মিত পাতার নিচের অংশ পর্যবেক্ষণ করুন।`;
    weatherNoteEn = `🌫️ High Humidity Alert (${weather.humidity}%): Fungal blast risk elevated; inspect lower leaves for spots.`;
    weatherBriefBn = `🌫️ উচ্চ আর্দ্রতা (${toBnDigits(weather.humidity)}%) • ব্লাস্ট রোগ পর্যবেক্ষণ করুন`;
    weatherBriefEn = `🌫️ High humidity (${weather.humidity}%) • Monitor blast`;
  } else {
    weatherNoteBn = `🌤️ অনুকূল আবহাওয়া (${toBnDigits(weather.temp)}°C): জমিতে সার প্রয়োগ, নিড়ানি ও পরিচর্যার জন্য আজকের দিনটি খুবই উপযুক্ত।`;
    weatherNoteEn = `🌤️ Favorable Weather (${weather.temp}°C): Optimal conditions for scheduled fertilization, weeding, and scouting.`;
    weatherBriefBn = `🌤️ অনুকূল আবহাওয়া (${toBnDigits(weather.temp)}°C) • সার ও নিড়ানির উপযুক্ত সময়`;
    weatherBriefEn = `🌤️ Favorable (${weather.temp}°C) • Ideal for fertilizer`;
  }

  const allUpdates: AgronomicDailyCard[] = [];

  // Month-by-month agricultural rules for Bangladesh:
  switch (month) {
    case 0: // January
      allUpdates.push({
        id: 'boro-transplant',
        cropId: 'rice',
        cropTagEn: 'Boro Rice',
        cropTagBn: 'বোরো ধান',
        tagColor: 'green',
        titleEn: 'Main Transplanting & 1st Urea Top-Dressing',
        titleBn: 'চারা রোপণ ও প্রথম কিস্তির ইউরিয়া সার প্রয়োগ',
        dateRangeEn: '10 January – 10 February',
        dateRangeBn: '১০ জানুয়ারি – ১০ ফেব্রুয়ারি',
        isTodayActive: day >= 10,
        stageEn: 'Transplanting / Early Tillering',
        stageBn: 'রোপণ ও প্রাথমিক কুশি পর্যায়',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 1,
      });
      allUpdates.push({
        id: 'potato-late-blight',
        cropId: 'potato',
        cropTagEn: 'Potato',
        cropTagBn: 'আলু',
        tagColor: 'amber',
        titleEn: 'Earthing Up & Late Blight Prevention Spray',
        titleBn: 'গোড়ায় মাটি তোলা ও নাবী ধসা (Late Blight) প্রতিরোধ',
        dateRangeEn: '1 January – 25 January',
        dateRangeBn: '১ জানুয়ারি – ২৫ জানুয়ারি',
        isTodayActive: true,
        stageEn: 'Tuber Initiation',
        stageBn: 'আলুর গুটি পর্যায়',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 2,
      });
      break;

    case 1: // February
      allUpdates.push({
        id: 'boro-tillering',
        cropId: 'rice',
        cropTagEn: 'Boro Rice',
        cropTagBn: 'বোরো ধান',
        tagColor: 'green',
        titleEn: 'Active Tillering & AWD Water Management',
        titleBn: 'কুশি বৃদ্ধি ও পর্যায়ক্রমিক সেচ (AWD) ব্যবস্থাপনা',
        dateRangeEn: '1 February – 28 February',
        dateRangeBn: '১ ফেব্রুয়ারি – ২৮ ফেব্রুয়ারি',
        isTodayActive: true,
        stageEn: 'Vegetative Tillering',
        stageBn: 'কুশি বৃদ্ধি পর্যায়',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 1,
      });
      allUpdates.push({
        id: 'wheat-irrigation',
        cropId: 'wheat',
        cropTagEn: 'Wheat',
        cropTagBn: 'গম',
        tagColor: 'amber',
        titleEn: '2nd Irrigation at Flowering & Aphid Check',
        titleBn: 'ফুল ফোটার সময়ে ২য় সেচ ও জাবপোকা নজরদারি',
        dateRangeEn: '5 February – 25 February',
        dateRangeBn: '৫ ফেব্রুয়ারি – ২৫ ফেব্রুয়ারি',
        isTodayActive: true,
        stageEn: 'Flowering Stage',
        stageBn: 'ফুল ফোটার পর্যায়',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 2,
      });
      break;

    case 2: // March
      allUpdates.push({
        id: 'aus-sowing',
        cropId: 'rice',
        cropTagEn: 'Aus Rice',
        cropTagBn: 'আউশ ধান',
        tagColor: 'green',
        titleEn: 'Direct Seeded / Transplanted Aus Land Preparation',
        titleBn: 'বোনা ও রোপা আউশ ধানের জমি তৈরি ও বীজ বপন',
        dateRangeEn: '15 March – 30 April',
        dateRangeBn: '১৫ মার্চ – ৩০ এপ্রিল',
        isTodayActive: day >= 15,
        stageEn: 'Land Prep & Sowing',
        stageBn: 'জমি তৈরি ও বীজ বপন',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 1,
      });
      allUpdates.push({
        id: 'summer-veg',
        cropId: 'chili',
        cropTagEn: 'Summer Crops',
        cropTagBn: 'গ্রীষ্মকালীন ফসল',
        tagColor: 'purple',
        titleEn: 'Jute & Summer Vegetable Sowing Season',
        titleBn: 'পাট ও গ্রীষ্মকালীন সবজি (ঢ্যাঁড়শ, করলা) বপনের সময়',
        dateRangeEn: '15 March – 15 April',
        dateRangeBn: '১৫ মার্চ – ১৫ এপ্রিল',
        isTodayActive: day >= 15,
        stageEn: 'Sowing Window',
        stageBn: 'বপন মৌসুম',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 2,
      });
      break;

    case 3: // April
      allUpdates.push({
        id: 'jute-prime',
        cropId: 'jute',
        cropTagEn: 'Jute',
        cropTagBn: 'পাট',
        tagColor: 'green',
        titleEn: 'Prime Sowing Window for Tosha & Deshi Jute',
        titleBn: 'তোষা ও দেশি পাটের বীজ বপনের মোক্ষম সময়',
        dateRangeEn: '15 April – 15 May',
        dateRangeBn: '১৫ এপ্রিল – ১৫ মে',
        isTodayActive: day >= 15,
        stageEn: 'Sowing & Germination',
        stageBn: 'বপন ও গজানো',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 1,
      });
      allUpdates.push({
        id: 'boro-blast-protect',
        cropId: 'rice',
        cropTagEn: 'Boro Rice',
        cropTagBn: 'বোরো ধান',
        tagColor: 'amber',
        titleEn: 'Panicle Blast Surveillance during Storms',
        titleBn: 'কালবৈশাখী ঝড় ও আর্দ্রতায় শিষ ব্লাস্ট রোগ প্রতিরোধ',
        dateRangeEn: '1 April – 30 April',
        dateRangeBn: '১ এপ্রিল – ৩০ এপ্রিল',
        isTodayActive: true,
        stageEn: 'Panicle Initiation',
        stageBn: 'শীষ বের হওয়ার পর্যায়',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 2,
      });
      break;

    case 4: // May
      allUpdates.push({
        id: 'boro-harvest',
        cropId: 'rice',
        cropTagEn: 'Boro Harvest',
        cropTagBn: 'বোরো ধান কর্তন',
        tagColor: 'amber',
        titleEn: 'Golden Harvest & Sun-Drying to 12% Moisture',
        titleBn: '৮০% ধান পাকলে কর্তন ও ১২% আর্দ্রতায় শুকানো',
        dateRangeEn: '1 May – 25 May',
        dateRangeBn: '১ মে – ২৫ মে',
        isTodayActive: true,
        stageEn: 'Harvest & Post-Harvest',
        stageBn: 'ফসল কর্তন ও মাড়াই',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 1,
      });
      allUpdates.push({
        id: 'aman-seedbed-prep',
        cropId: 'rice',
        cropTagEn: 'Aman Rice',
        cropTagBn: 'আমন ধান',
        tagColor: 'green',
        titleEn: 'Seedbed Preparation for High-Yielding Aman',
        titleBn: 'উফশী ও হাইব্রিড রোপা আমনের বীজতলা তৈরির প্রস্তুতি',
        dateRangeEn: '25 May – 25 June',
        dateRangeBn: '২৫ মে – ২৫ জুন',
        isTodayActive: day >= 25,
        stageEn: 'Nursery Bed Sowing',
        stageBn: 'বীজতলা প্রস্তুত ও বীজ ফেলা',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 2,
      });
      break;

    case 5: // June
      allUpdates.push({
        id: 'aman-nursery',
        cropId: 'rice',
        cropTagEn: 'Aman Rice',
        cropTagBn: 'আমন ধান',
        tagColor: 'green',
        titleEn: 'Aman Seedbed Care & Early Land Preparation',
        titleBn: 'বীজতলার পরিচর্যা ও প্রধান জমির প্রাথমিক চাষ',
        dateRangeEn: '1 June – 30 June',
        dateRangeBn: '১ জুন – ৩০ জুন',
        isTodayActive: true,
        stageEn: 'Seedling Growth (২৫-৩০ দিন)',
        stageBn: 'চারার বয়স বৃদ্ধি',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 1,
      });
      allUpdates.push({
        id: 'jute-weeding',
        cropId: 'jute',
        cropTagEn: 'Jute',
        cropTagBn: 'পাট',
        tagColor: 'emerald',
        titleEn: 'First Weeding, Thinning & Soil Loosening',
        titleBn: 'প্রথম নিড়ানি, চারা পাতলাকরণ ও গোড়া আলগা করা',
        dateRangeEn: '1 June – 25 June',
        dateRangeBn: '১ জুন – ২৫ জুন',
        isTodayActive: true,
        stageEn: 'Vegetative Growth',
        stageBn: 'দৈহিক বৃদ্ধি পর্যায়',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 2,
      });
      break;

    case 6: // July
      allUpdates.push({
        id: 'aman-transplant',
        cropId: 'rice',
        cropTagEn: 'Aman Rice',
        cropTagBn: 'আমন ধান',
        tagColor: 'green',
        titleEn: 'Prime Transplanting Window & Basal Fertilizers',
        titleBn: 'চারা রোপণের সেরা সময় ও জমিতে বেসাল সার প্রয়োগ',
        dateRangeEn: '15 July – 15 August',
        dateRangeBn: '১৫ জুলাই – ১৫ আগস্ট',
        isTodayActive: day >= 15,
        stageEn: 'Transplanting Stage',
        stageBn: 'চারা রোপণ মৌসুম',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 1,
      });
      allUpdates.push({
        id: 'drainage-care',
        cropId: 'rice',
        cropTagEn: 'Monsoon Care',
        cropTagBn: 'বর্ষাকালীন পরিচর্যা',
        tagColor: 'blue',
        titleEn: 'Field Drainage & Standing Water Management',
        titleBn: 'জমিতে ২-৩ ইঞ্চি পানি ধরে রাখা ও অতিরিক্ত পানি নিষ্কাশন',
        dateRangeEn: '1 July – 31 July',
        dateRangeBn: '১ জুলাই – ৩১ জুলাই',
        isTodayActive: true,
        stageEn: 'Water Balance',
        stageBn: 'পানি নিয়ন্ত্রণ',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 2,
      });
      break;

    case 7: // August
      allUpdates.push({
        id: 'aman-first-topdress',
        cropId: 'rice',
        cropTagEn: 'Aman Rice',
        cropTagBn: 'আমন ধান',
        tagColor: 'green',
        titleEn: '1st Urea Top-Dressing & Weeding (15-20 DAT)',
        titleBn: 'রোপণের ১৫-২০ দিন পর ১ম কিস্তি ইউরিয়া সার ও নিড়ানি',
        dateRangeEn: '1 August – 31 August',
        dateRangeBn: '১ আগস্ট – ৩১ আগস্ট',
        isTodayActive: true,
        stageEn: 'Early Tillering',
        stageBn: 'প্রাথমিক কুশি পর্যায়',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 1,
      });
      allUpdates.push({
        id: 'betel-care',
        cropId: 'betel',
        cropTagEn: 'Betel Leaf & Chili',
        cropTagBn: 'পান ও মরিচ',
        tagColor: 'purple',
        titleEn: 'Humid Weather Foot Rot / Damping Off Vigilance',
        titleBn: 'অতিরিক্ত আর্দ্রতায় গোড়াপচা রোগ প্রতিরোধে কপার স্প্রে',
        dateRangeEn: '10 August – 30 August',
        dateRangeBn: '১০ আগস্ট – ৩০ আগস্ট',
        isTodayActive: true,
        stageEn: 'Disease Prevention',
        stageBn: 'রোগ প্রতিরোধ',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 2,
      });
      break;

    case 8: // September (Current Month)
      allUpdates.push({
        id: 'aman-fertilizer-update',
        cropId: 'rice',
        image: '/images/crop_rice.jpg',
        cropTagEn: 'Aman Rice',
        cropTagBn: 'আমন ধান',
        tagColor: 'green',
        titleEn: 'Urea & Potash Top-Dressing (2nd Dose)',
        titleBn: 'আমন ধানে ২য় কিস্তির সার প্রয়োগ (ইউরিয়া ও পটাশ)',
        dateRangeEn: '1 – 25 September',
        dateRangeBn: '১ – ২৫ সেপ্টেম্বর',
        isTodayActive: true,
        stageEn: 'Active Tillering Stage',
        stageBn: 'সক্রিয় কুশি বৃদ্ধি পর্যায়',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        weatherBriefEn,
        weatherBriefBn,
        priority: 1,
      });
      allUpdates.push({
        id: 'rabi-sowing-update',
        cropId: 'tomato',
        image: '/images/crop_tomato.jpg',
        cropTagEn: 'Rabi Crops',
        cropTagBn: 'রবি ফসল',
        tagColor: 'amber',
        titleEn: 'Tomato & Early Potato Seedbed Prep',
        titleBn: 'শীতকালীন টমেটো ও আলু বীজতলা তৈরি',
        dateRangeEn: '15 Sep – 15 Nov',
        dateRangeBn: '১৫ সেপ্টে – ১৫ নভে',
        isTodayActive: day >= 15,
        stageEn: 'Seedbed & Land Preparation',
        stageBn: 'বীজতলা ও জমি প্রস্তুতি',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        weatherBriefEn,
        weatherBriefBn,
        priority: 2,
      });
      allUpdates.push({
        id: 'mustard-prep',
        cropId: 'mustard',
        image: '/images/crop_mustard.jpg',
        cropTagEn: 'Mustard',
        cropTagBn: 'সরিষা',
        tagColor: 'emerald',
        titleEn: 'High-Yield Mustard Sowing Prep (BARI-14)',
        titleBn: 'উচ্চফলনশীল সরিষা বপন প্রস্তুতি (বারি-১৪/১৭)',
        dateRangeEn: '20 Sep – 20 Oct',
        dateRangeBn: '২০ সেপ্টে – ২০ অক্টো',
        isTodayActive: day >= 20,
        stageEn: 'Input & Variety Selection',
        stageBn: 'বীজ ও জাত নির্বাচন',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        weatherBriefEn,
        weatherBriefBn,
        priority: 3,
      });
      break;

    case 9: // October
      allUpdates.push({
        id: 'rabi-mustard-potato',
        cropId: 'mustard',
        cropTagEn: 'Rabi Crops',
        cropTagBn: 'রবি ফসল',
        tagColor: 'amber',
        titleEn: 'Prime Sowing of Mustard & Early Winter Potato',
        titleBn: 'উচ্চফলনশীল সরিষা ও আগাম জাতের আলু বপনের মোক্ষম সময়',
        dateRangeEn: '15 October – 20 November',
        dateRangeBn: '১৫ অক্টোবর – ২০ নভেম্বর',
        isTodayActive: day >= 15,
        stageEn: 'Main Sowing Window',
        stageBn: 'প্রধান বপন মৌসুম',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 1,
      });
      allUpdates.push({
        id: 'aman-pest-protect',
        cropId: 'rice',
        cropTagEn: 'Aman Rice',
        cropTagBn: 'আমন ধান',
        tagColor: 'green',
        titleEn: 'Brown Planthopper (BPH) & Neck Blast Protection',
        titleBn: 'কারেন্ট পোকা (BPH) ও শিষ ব্লাস্ট রোগ পর্যবেক্ষণ',
        dateRangeEn: '1 October – 31 October',
        dateRangeBn: '১ অক্টোবর – ৩১ অক্টোবর',
        isTodayActive: true,
        stageEn: 'Milking to Dough Stage',
        stageBn: 'দুধ ও শক্ত দানা পর্যায়',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 2,
      });
      break;

    case 10: // November
      allUpdates.push({
        id: 'wheat-potato-sowing',
        cropId: 'wheat',
        cropTagEn: 'Wheat & Potato',
        cropTagBn: 'গম ও আলু',
        tagColor: 'amber',
        titleEn: 'Optimal Sowing Window for Wheat (BARI Gom-33) & Potato',
        titleBn: 'গম (বারি গম-৩৩) এবং গোল আলুর প্রধান বপন ও রোপণ সময়',
        dateRangeEn: '15 November – 15 December',
        dateRangeBn: '১৫ নভেম্বর – ১৫ ডিসেম্বর',
        isTodayActive: day >= 15,
        stageEn: 'Sowing Window',
        stageBn: 'বপন মৌসুম',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 1,
      });
      allUpdates.push({
        id: 'boro-seedbed-prep',
        cropId: 'rice',
        cropTagEn: 'Boro Rice',
        cropTagBn: 'বোরো ধান',
        tagColor: 'green',
        titleEn: 'Boro Seedbed Preparation & Sprouted Seed Sowing',
        titleBn: 'বোরো ধানের বীজতলা প্রস্তুত ও অঙ্কুরিত বীজ বপন',
        dateRangeEn: '15 November – 15 December',
        dateRangeBn: '১৫ নভেম্বর – ১৫ ডিসেম্বর',
        isTodayActive: day >= 15,
        stageEn: 'Nursery Establishment',
        stageBn: 'বীজতলা স্থাপন',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 2,
      });
      break;

    case 11: // December
      allUpdates.push({
        id: 'boro-nursery-care',
        cropId: 'rice',
        cropTagEn: 'Boro Rice',
        cropTagBn: 'বোরো ধান',
        tagColor: 'green',
        titleEn: 'Cold-Injury Protection for Boro Seedlings (Polythene Cover)',
        titleBn: 'শৈত্যপ্রবাহে বোরো চারার যত্ন (রাতে পলিথিন ঢাকনা ও সকালে পানি পরিবর্তন)',
        dateRangeEn: '1 December – 31 December',
        dateRangeBn: '১ ডিসেম্বর – ৩১ ডিসেম্বর',
        isTodayActive: true,
        stageEn: 'Seedling Nursery Stage',
        stageBn: 'চারা সুরক্ষা পর্যায়',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 1,
      });
      allUpdates.push({
        id: 'wheat-cri-irrigation',
        cropId: 'wheat',
        cropTagEn: 'Wheat',
        cropTagBn: 'গম',
        tagColor: 'amber',
        titleEn: '1st Critical Irrigation at Crown Root Initiation (CRI)',
        titleBn: 'বপনের ১৭-২১ দিন পর শিকড় গজানোর সময়ে ১ম জরুরি সেচ ও সার',
        dateRangeEn: '10 December – 31 December',
        dateRangeBn: '১০ ডিসেম্বর – ৩১ ডিসেম্বর',
        isTodayActive: true,
        stageEn: 'Crown Root Stage (CRI)',
        stageBn: 'প্রাথমিক শিকড় বিস্তার',
        weatherAdviceEn: weatherNoteEn,
        weatherAdviceBn: weatherNoteBn,
        priority: 2,
      });
      break;

    default:
      break;
  }

  // Ensure every update has a valid image and weather brief
  allUpdates.forEach((u) => {
    if (!u.image) {
      u.image = getCropImage(u.cropId);
    }
    if (!u.weatherBriefBn) {
      u.weatherBriefBn = weatherBriefBn;
      u.weatherBriefEn = weatherBriefEn;
    }
  });

  // If user has a selected primary crop, boost its card to top priority
  if (primaryCrop) {
    const pCropLower = primaryCrop.toLowerCase();
    allUpdates.sort((a, b) => {
      const aMatch = a.cropId.toLowerCase().includes(pCropLower) || a.cropTagEn.toLowerCase().includes(pCropLower);
      const bMatch = b.cropId.toLowerCase().includes(pCropLower) || b.cropTagEn.toLowerCase().includes(pCropLower);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return a.priority - b.priority;
    });
  }

  return allUpdates.slice(0, 3); // Return the top 2-3 timely cards for today
};

/**
 * Generates Daily Weather-Triggered Notifications
 * tailored to today's date and the farmer's live district weather.
 */
export const generateDailyWeatherNotifications = (
  district: string = 'Rajshahi',
  targetDate: Date = new Date()
): NotificationItem[] => {
  const weather = getDistrictWeather(district);
  const dateNum = targetDate.getDate();
  const monthsBn = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const todayBn = `${toBnDigits(dateNum)} ${monthsBn[targetDate.getMonth()]}`;
  const todayEn = `${dateNum} ${monthsEn[targetDate.getMonth()]}`;
  const dateStamp = targetDate.toISOString().split('T')[0];

  const notifications: NotificationItem[] = [];

  // Notification 1: Weather Advisory for Today
  let weatherTextBn = '';
  let weatherTextEn = '';

  if (weather.rainChance >= 50) {
    weatherTextBn = `আজ ${district} জেলায় ভারী বৃষ্টির সম্ভাবনা (${toBnDigits(weather.rainChance)}%)—জমির ড্রেনেজ ব্যবস্থা পরীক্ষা করুন এবং সার ছিটানো বন্ধ রাখুন।`;
    weatherTextEn = `Heavy rain forecast for ${district} today (${weather.rainChance}%)—check drainage trenches and postpone top-dressing fertilizers.`;
  } else if (weather.rainChance >= 25) {
    weatherTextBn = `আজ ${district} এলাকায় আংশিক বৃষ্টি বা মেঘলা আকাশ (${toBnDigits(weather.temp)}°C)—ফসলে কীটনাশক স্প্রে করার আগে আকাশ পর্যবেক্ষণ করুন।`;
    weatherTextEn = `Scattered showers or cloudiness expected in ${district} (${weather.temp}°C)—observe sky conditions before applying foliar sprays.`;
  } else if (weather.temp >= 32) {
    weatherTextBn = `আজ ${district} এলাকায় তীব্র গরম (${toBnDigits(weather.temp)}°C, আর্দ্রতা ${toBnDigits(weather.humidity)}%)—বাষ্পীভবন রোধে সকালে বা বিকেলে জমিতে সেচ দিন।`;
    weatherTextEn = `High temperature alert in ${district} (${weather.temp}°C, Humidity ${weather.humidity}%)—irrigate early morning or late afternoon to prevent heat stress.`;
  } else {
    weatherTextBn = `আজকের আবহাওয়া পূর্বাভাস (${district}): তাপমাত্রা ${toBnDigits(weather.temp)}°C, ${weather.conditionBn}। জমিতে সার প্রয়োগ ও নিড়ানির জন্য উপযুক্ত দিন।`;
    weatherTextEn = `Today's Weather Advisory (${district}): Temp ${weather.temp}°C, ${weather.conditionEn}. Suitable day for fertilizer top-dressing and weeding.`;
  }

  notifications.push({
    id: `daily-weather-${dateStamp}-${district.toLowerCase()}`,
    titleEn: weatherTextEn,
    titleBn: weatherTextBn,
    category: 'weather',
    date: `Today, 08:00 AM (${todayEn})`,
    read: false,
  });

  // Notification 2: Real-time Irrigation Guidance based on rain chance
  let irrigationBn = '';
  let irrigationEn = '';

  if (weather.rainChance >= 40) {
    irrigationBn = `সেচ স্থগিত সতর্কতা: আজ বৃষ্টিপাতের সম্ভাবনা থাকায় অতিরিক্ত সেচ দেওয়া থেকে বিরত থাকুন এবং নিচু জমির পানি বের করে দিন।`;
    irrigationEn = `Irrigation Hold: Postpone supplementary watering today due to incoming precipitation risk.`;
  } else {
    irrigationBn = `দৈনিক সেচ পরামর্শ: মাটির রস ও আর্দ্রতা বজায় রাখতে গাছের বৃদ্ধির পর্যায় অনুযায়ী প্রয়োজন মতো পরিমিত সেচ দিন।`;
    irrigationEn = `Daily Irrigation Guidance: Moderate soil moisture requirement; apply measured irrigation according to crop growth stage.`;
  }

  notifications.push({
    id: `daily-irrigation-${dateStamp}`,
    titleEn: irrigationEn,
    titleBn: irrigationBn,
    category: 'irrigation',
    date: `Today, 09:30 AM (${todayEn})`,
    read: false,
  });

  // Notification 3: Climate-Linked Pest/Disease Alert or Calendar Advisory
  if (weather.humidity >= 75) {
    notifications.push({
      id: `daily-disease-alert-${dateStamp}`,
      titleEn: `High Humidity Disease Risk: Moisture index at ${weather.humidity}% favors fungal leaf blast and blight. Inspect crop canopy closely.`,
      titleBn: `আবহাওয়াজনিত রোগবালাই পূর্বাভাস: আর্দ্রতা ${toBnDigits(weather.humidity)}% হওয়ায় ব্লাস্ট ও ধসা রোগের ঝুঁকি বেশি। নিয়মিত ক্ষেতের পাতা পরীক্ষা করুন।`,
      category: 'pest',
      date: `Today, 11:00 AM (${todayEn})`,
      read: false,
    });
  } else {
    // Current seasonal calendar advisory
    const updates = getRealtimeAgronomicUpdates(district, undefined, targetDate);
    if (updates.length > 0) {
      const top = updates[0];
      notifications.push({
        id: `daily-agronomy-${dateStamp}`,
        titleEn: `Agronomic Calendar Alert (${todayEn}): Timely window for ${top.cropTagEn} - ${top.titleEn}.`,
        titleBn: `আজকের কৃষি সময়সূচি (${todayBn}): ${top.cropTagBn} এ "${top.titleBn}"-এর উপযুক্ত সময় চলছে।`,
        category: 'fertilizer',
        date: `Today, 11:00 AM (${todayEn})`,
        read: false,
      });
    }
  }

  return notifications;
};

/**
 * Requests browser push notification permission if supported
 */
export const requestBrowserPushPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return false;
  }
};

/**
 * Triggers native system push notification if permission is granted
 */
export const triggerNativePushNotification = (title: string, body: string, icon = '/icons/rain.svg') => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon,
        badge: '/icons/rain.svg',
      });
    } catch (e) {
      console.warn('Native notification failed:', e);
    }
  }
};
