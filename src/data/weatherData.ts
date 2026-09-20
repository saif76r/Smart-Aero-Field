export interface DistrictWeatherInfo {
  temp: number;
  conditionEn: string;
  conditionBn: string;
  humidity: number;
  rainChance: number;
  windSpeed: number;
  iconSrc: string;
}

export const getDistrictWeather = (districtName: string = 'Rajshahi'): DistrictWeatherInfo => {
  const d = (districtName || '').toLowerCase().trim();

  // 1. Chittagong Hill Tracts (Bandarban, Rangamati, Khagrachhari)
  if (d.includes('bandarban') || d.includes('rangamati') || d.includes('khagrachhari')) {
    return {
      temp: 27,
      conditionEn: 'Misty Hill Breezes',
      conditionBn: 'পাহাড়ি স্নিগ্ধ কুয়াশাচ্ছন্ন',
      humidity: 84,
      rainChance: 50,
      windSpeed: 10,
      iconSrc: '/images/weather/partly_cloudy.jpg',
    };
  }

  // 2. Northeastern region (Sylhet division + Haor belt - highest rain)
  if (
    d.includes('sylhet') ||
    d.includes('sunamganj') ||
    d.includes('moulvibazar') ||
    d.includes('habiganj') ||
    d.includes('netrokona')
  ) {
    return {
      temp: 28,
      conditionEn: 'Light Rain & Humid',
      conditionBn: 'হালকা বৃষ্টি ও আর্দ্র',
      humidity: 82,
      rainChance: 65,
      windSpeed: 14,
      iconSrc: '/images/weather/rain.jpg',
    };
  }

  // 3. Coastal & Southeastern Delta (Chattogram, Cox's Bazar, Barishal, Bhola, Patuakhali, Barguna, Pirojpur, Jhalokathi, Feni, Noakhali, Lakshmipur)
  if (
    d.includes('chattogram') ||
    d.includes('chittagong') ||
    d.includes("cox's") ||
    d.includes('coxs') ||
    d.includes('feni') ||
    d.includes('noakhali') ||
    d.includes('lakshmipur') ||
    d.includes('chandpur') ||
    d.includes('barishal') ||
    d.includes('barisal') ||
    d.includes('bhola') ||
    d.includes('patuakhali') ||
    d.includes('barguna') ||
    d.includes('pirojpur') ||
    d.includes('jhalokathi') ||
    d.includes('jhalokati')
  ) {
    return {
      temp: 29,
      conditionEn: 'Scattered Showers',
      conditionBn: 'বিক্ষিপ্ত বৃষ্টিপাত',
      humidity: 78,
      rainChance: 45,
      windSpeed: 18,
      iconSrc: '/images/weather/rain.jpg',
    };
  }

  // 4. South-Western & Saline / Semi-Arid Belt (Khulna, Satkhira, Bagerhat, Jashore, Narail, Magura, Kushtia, Meherpur, Chuadanga, Jhenaidah)
  if (
    d.includes('khulna') ||
    d.includes('satkhira') ||
    d.includes('bagerhat') ||
    d.includes('jashore') ||
    d.includes('jessore') ||
    d.includes('kushtia') ||
    d.includes('meherpur') ||
    d.includes('chuadanga') ||
    d.includes('jhenaidah') ||
    d.includes('magura') ||
    d.includes('narail')
  ) {
    return {
      temp: 32,
      conditionEn: 'Warm & Sunny',
      conditionBn: 'উষ্ণ ও রৌদ্রোজ্জ্বল',
      humidity: 58,
      rainChance: 10,
      windSpeed: 15,
      iconSrc: '/images/weather/sunny.jpg',
    };
  }

  // 5. Barind Tract & Northern Drought Corridor (Rajshahi, Chapainawabganj, Naogaon, Natore, Bogura, Joypurhat, Pabna, Sirajganj)
  if (
    d.includes('rajshahi') ||
    d.includes('chapainawabganj') ||
    d.includes('nawabganj') ||
    d.includes('bogura') ||
    d.includes('bogra') ||
    d.includes('joypurhat') ||
    d.includes('naogaon') ||
    d.includes('natore') ||
    d.includes('pabna') ||
    d.includes('sirajganj')
  ) {
    return {
      temp: 33,
      conditionEn: 'Dry & Clear Sun',
      conditionBn: 'শুষ্ক ও উজ্জ্বল রোদ',
      humidity: 55,
      rainChance: 10,
      windSpeed: 12,
      iconSrc: '/images/weather/sunny.jpg',
    };
  }

  // 6. Northern Piedmont & Tista (Dinajpur, Panchagarh, Thakurgaon, Nilphamari, Rangpur, Kurigram, Gaibandha, Lalmonirhat)
  if (
    d.includes('dinajpur') ||
    d.includes('panchagarh') ||
    d.includes('thakurgaon') ||
    d.includes('nilphamari') ||
    d.includes('rangpur') ||
    d.includes('kurigram') ||
    d.includes('gaibandha') ||
    d.includes('lalmonirhat')
  ) {
    return {
      temp: 29,
      conditionEn: 'Pleasant & Breezy',
      conditionBn: 'অনুকূল ও মৃদু বাতাস',
      humidity: 65,
      rainChance: 20,
      windSpeed: 13,
      iconSrc: '/images/weather/partly_cloudy.jpg',
    };
  }

  // 7. North-Central (Mymensingh, Jamalpur, Sherpur) & Central Padma Basin (Faridpur, Gopalganj, Madaripur, Rajbari, Shariatpur, Cumilla, Brahmanbaria)
  // + Central Capital (Dhaka, Gazipur, Narayanganj, Narsingdi, Tangail, Manikganj, Munshiganj, Kishoreganj)
  return {
    temp: 31,
    conditionEn: 'Partly Cloudy',
    conditionBn: 'আংশিক মেঘলা',
    humidity: 68,
    rainChance: 25,
    windSpeed: 11,
    iconSrc: '/images/weather/partly_cloudy.jpg',
  };
};

export interface DistrictLandData {
  district: string;
  ndvi: number;
  ndviStatusEn: string;
  ndviStatusBn: string;
  soilMoisture: number; // percentage
  soilMoistureStatusEn: string;
  soilMoistureStatusBn: string;
  temp: number; // in °C
  tempStatusEn: string;
  tempStatusBn: string;
  rainFall7d: number; // in mm
  soilTextureEn: string;
  soilTextureBn: string;
  soilPh: number;
  soilPhStatusEn: string;
  soilPhStatusBn: string;
  nitrogenEn: string;
  nitrogenBn: string;
  phosphorusEn: string;
  phosphorusBn: string;
  potassiumEn: string;
  potassiumBn: string;
  aezNameEn: string;
  aezNameBn: string;
}

export const getDistrictLandData = (districtName: string = 'Dhaka'): DistrictLandData => {
  const d = (districtName || '').toLowerCase().trim();

  // 1. Dinajpur & Northern Piedmont (Dinajpur, Panchagarh, Thakurgaon, Nilphamari)
  if (d.includes('dinajpur') || d.includes('panchagarh') || d.includes('thakurgaon') || d.includes('nilphamari')) {
    return {
      district: districtName,
      ndvi: 0.81,
      ndviStatusEn: 'Lush Vegetation',
      ndviStatusBn: 'উর্বর ও ঘন ফসল',
      soilMoisture: 39,
      soilMoistureStatusEn: 'Optimal',
      soilMoistureStatusBn: 'পর্যাপ্ত আর্দ্রতা',
      temp: 28.5,
      tempStatusEn: 'Pleasant Normal',
      tempStatusBn: 'অনুকূল স্বাভাবিক',
      rainFall7d: 38,
      soilTextureEn: 'Tista Meander Sandy Loam',
      soilTextureBn: 'তিস্তা পলি ও বেলে দোআঁশ মাটি',
      soilPh: 5.9,
      soilPhStatusEn: 'Slightly Acidic (Optimal for Rice & Potato)',
      soilPhStatusBn: 'মৃদু অম্লীয় (ধান ও আলুর জন্য আদর্শ)',
      nitrogenEn: 'Medium',
      nitrogenBn: 'মাঝারি',
      phosphorusEn: 'High',
      phosphorusBn: 'উচ্চ',
      potassiumEn: 'High',
      potassiumBn: 'উচ্চ',
      aezNameEn: 'AEZ-1 Old Himalayan Piedmont & Tista Plain',
      aezNameBn: 'হিমালয় পাদদেশীয় ও তিস্তা প্লাবনভূমি',
    };
  }

  // 2. Rangpur, Kurigram, Gaibandha
  if (d.includes('rangpur') || d.includes('kurigram') || d.includes('gaibandha') || d.includes('lalmonirhat')) {
    return {
      district: districtName,
      ndvi: 0.79,
      ndviStatusEn: 'Healthy Canopy',
      ndviStatusBn: 'সতেজ ও ঘন ফসল',
      soilMoisture: 41,
      soilMoistureStatusEn: 'Optimal',
      soilMoistureStatusBn: 'পর্যাপ্ত আর্দ্রতা',
      temp: 28.8,
      tempStatusEn: 'Normal',
      tempStatusBn: 'স্বাভাবিক',
      rainFall7d: 42,
      soilTextureEn: 'Active Tista Floodplain Silt Loam',
      soilTextureBn: 'তিস্তা পলি দোআঁশ মাটি',
      soilPh: 6.2,
      soilPhStatusEn: 'Near Neutral (Favorable)',
      soilPhStatusBn: 'আদর্শ নিরপেক্ষ',
      nitrogenEn: 'Medium',
      nitrogenBn: 'মাঝারি',
      phosphorusEn: 'Medium',
      phosphorusBn: 'মাঝারি',
      potassiumEn: 'High',
      potassiumBn: 'উচ্চ',
      aezNameEn: 'AEZ-3 Tista Meander Floodplain',
      aezNameBn: 'তিস্তা পলি অববাহিকা অঞ্চল',
    };
  }

  // 3. Bogura, Naogaon, Joypurhat
  if (d.includes('bogura') || d.includes('bogra') || d.includes('joypurhat') || d.includes('naogaon')) {
    return {
      district: districtName,
      ndvi: 0.76,
      ndviStatusEn: 'Good Health',
      ndviStatusBn: 'ভালো বৃদ্ধি',
      soilMoisture: 35,
      soilMoistureStatusEn: 'Medium',
      soilMoistureStatusBn: 'মাঝারি',
      temp: 29.8,
      tempStatusEn: 'Normal',
      tempStatusBn: 'স্বাভাবিক',
      rainFall7d: 26,
      soilTextureEn: 'Karatoa-Bangali Silt & Clay Loam',
      soilTextureBn: 'করতোয়া-বাঙালি পলি ও এঁটেল দোআঁশ',
      soilPh: 6.5,
      soilPhStatusEn: 'Optimal Neutral',
      soilPhStatusBn: 'আদর্শ নিরপেক্ষ',
      nitrogenEn: 'Medium',
      nitrogenBn: 'মাঝারি',
      phosphorusEn: 'High',
      phosphorusBn: 'উচ্চ',
      potassiumEn: 'High',
      potassiumBn: 'উচ্চ',
      aezNameEn: 'AEZ-4 Karatoa-Bangali Floodplain',
      aezNameBn: 'করতোয়া-বাঙালি প্লাবনভূমি',
    };
  }

  // 4. Rajshahi, Chapai Nawabganj, Pabna, Sirajganj, Natore
  if (d.includes('rajshahi') || d.includes('nawabganj') || d.includes('pabna') || d.includes('sirajganj') || d.includes('natore')) {
    return {
      district: districtName,
      ndvi: 0.68,
      ndviStatusEn: 'Moderate Vigour',
      ndviStatusBn: 'সুস্থ ফসল (নিয়ন্ত্রিত সেচ)',
      soilMoisture: 24,
      soilMoistureStatusEn: 'Low (Irrigation Recommended)',
      soilMoistureStatusBn: 'কম (সেচ প্রয়োজন)',
      temp: 33.2,
      tempStatusEn: 'Hot & Dry',
      tempStatusBn: 'উষ্ণ ও শুষ্ক',
      rainFall7d: 8,
      soilTextureEn: 'High Barind Compact Grey Clay',
      soilTextureBn: 'বরেন্দ্র ধূসর এঁটেল ও পলি মাটি',
      soilPh: 7.3,
      soilPhStatusEn: 'Slightly Alkaline (Clay Heavy)',
      soilPhStatusBn: 'মৃদু ক্ষারীয় ও শক্ত এঁটেল',
      nitrogenEn: 'Low',
      nitrogenBn: 'কম',
      phosphorusEn: 'Low',
      phosphorusBn: 'কম',
      potassiumEn: 'High',
      potassiumBn: 'উচ্চ',
      aezNameEn: 'AEZ-25 Level Barind Tract',
      aezNameBn: 'বরেন্দ্র সমভূমি কৃষি অঞ্চল',
    };
  }

  // 5. Kushtia, Jashore, Meherpur, Chuadanga, Jhenaidah
  if (d.includes('kushtia') || d.includes('jashore') || d.includes('jessore') || d.includes('meherpur') || d.includes('chuadanga') || d.includes('jhenaidah')) {
    return {
      district: districtName,
      ndvi: 0.70,
      ndviStatusEn: 'Good Vegetative Growth',
      ndviStatusBn: 'সুস্থ উদ্ভিজ্জ বৃদ্ধি',
      soilMoisture: 28,
      soilMoistureStatusEn: 'Moderate Low',
      soilMoistureStatusBn: 'মাঝারি কম',
      temp: 32.4,
      tempStatusEn: 'Warm',
      tempStatusBn: 'উষ্ণ',
      rainFall7d: 14,
      soilTextureEn: 'High Ganges Floodplain Calcareous Loam',
      soilTextureBn: 'উচ্চ গঙ্গা প্লাবন চুনযুক্ত দোআঁশ',
      soilPh: 7.4,
      soilPhStatusEn: 'Calcareous Loam',
      soilPhStatusBn: 'মৃদু চুনযুক্ত ক্ষারীয়',
      nitrogenEn: 'Medium',
      nitrogenBn: 'মাঝারি',
      phosphorusEn: 'Medium',
      phosphorusBn: 'মাঝারি',
      potassiumEn: 'High',
      potassiumBn: 'উচ্চ',
      aezNameEn: 'AEZ-11 High Ganges River Floodplain',
      aezNameBn: 'উচ্চ গঙ্গা নদী প্লাবনভূমি',
    };
  }

  // 6. Sylhet, Sunamganj, Moulvibazar, Habiganj (Northeast Rain Belt)
  if (d.includes('sylhet') || d.includes('sunamganj') || d.includes('moulvibazar') || d.includes('habiganj')) {
    return {
      district: districtName,
      ndvi: 0.85,
      ndviStatusEn: 'Dense Lush Canopy',
      ndviStatusBn: 'অত্যন্ত ঘন ও সতেজ ফসল',
      soilMoisture: 54,
      soilMoistureStatusEn: 'High / Waterlogged',
      soilMoistureStatusBn: 'উচ্চ আর্দ্রতা / ভেজা মাটি',
      temp: 27.6,
      tempStatusEn: 'Cool Rain-Washed',
      tempStatusBn: 'শীতল ও আর্দ্র',
      rainFall7d: 94,
      soilTextureEn: 'Surma Basin Acidic Silt & Peat Loam',
      soilTextureBn: 'সুরমা অববাহিকার অম্লীয় ও পিট দোআঁশ',
      soilPh: 5.1,
      soilPhStatusEn: 'Acidic (High Organic Matter)',
      soilPhStatusBn: 'অম্লীয় (জৈব পদার্থ সমৃদ্ধ)',
      nitrogenEn: 'High',
      nitrogenBn: 'উচ্চ',
      phosphorusEn: 'Medium',
      phosphorusBn: 'মাঝারি',
      potassiumEn: 'Medium',
      potassiumBn: 'মাঝারি',
      aezNameEn: 'AEZ-20 Eastern Surma-Kushiyara Plain',
      aezNameBn: 'সুরমা-কুশিয়ারা নদী অববাহিকা',
    };
  }

  // 7. Khulna, Satkhira, Bagerhat (Coastal Saline)
  if (d.includes('khulna') || d.includes('satkhira') || d.includes('bagerhat')) {
    return {
      district: districtName,
      ndvi: 0.66,
      ndviStatusEn: 'Moderate Delta Greenery',
      ndviStatusBn: 'উপকূলীয় মাঝারি ফসল',
      soilMoisture: 42,
      soilMoistureStatusEn: 'Moist / Saline',
      soilMoistureStatusBn: 'আর্দ্র ও মৃদু লবণাক্ত',
      temp: 32.1,
      tempStatusEn: 'Warm Coastal',
      tempStatusBn: 'উষ্ণ উপকূলীয়',
      rainFall7d: 21,
      soilTextureEn: 'Ganges Tidal Saline Heavy Clay',
      soilTextureBn: 'জোয়ার-ভাটা প্লাবিত লবণাক্ত এঁটেল',
      soilPh: 7.7,
      soilPhStatusEn: 'Saline Alkaline',
      soilPhStatusBn: 'লবণাক্ত মৃদু ক্ষারীয়',
      nitrogenEn: 'Medium',
      nitrogenBn: 'মাঝারি',
      phosphorusEn: 'Medium',
      phosphorusBn: 'মাঝারি',
      potassiumEn: 'High',
      potassiumBn: 'উচ্চ',
      aezNameEn: 'AEZ-13 Ganges Tidal Floodplain',
      aezNameBn: 'গঙ্গা জোয়ার-ভাটা উপকূলীয় অঞ্চল',
    };
  }

  // 8. Barishal, Bhola, Patuakhali, Pirojpur, Jhalokati, Barguna
  if (d.includes('barishal') || d.includes('barisal') || d.includes('bhola') || d.includes('patuakhali') || d.includes('pirojpur') || d.includes('jhalokati') || d.includes('barguna')) {
    return {
      district: districtName,
      ndvi: 0.72,
      ndviStatusEn: 'Healthy Delta Crops',
      ndviStatusBn: 'স্বাস্থ্যকর উপকূলীয় ফসল',
      soilMoisture: 48,
      soilMoistureStatusEn: 'High Moisture',
      soilMoistureStatusBn: 'পর্যাপ্ত আর্দ্রতা',
      temp: 29.5,
      tempStatusEn: 'Humid Maritime',
      tempStatusBn: 'আর্দ্র সামুদ্রিক',
      rainFall7d: 54,
      soilTextureEn: 'Lower Meghna Tidal Silt Clay',
      soilTextureBn: 'মেঘনা অববাহিকার উর্বর পলি এঁটেল',
      soilPh: 6.9,
      soilPhStatusEn: 'Optimal Near Neutral',
      soilPhStatusBn: 'আদর্শ নিরপেক্ষ দোআঁশ',
      nitrogenEn: 'Medium',
      nitrogenBn: 'মাঝারি',
      phosphorusEn: 'Medium',
      phosphorusBn: 'মাঝারি',
      potassiumEn: 'High',
      potassiumBn: 'উচ্চ',
      aezNameEn: 'AEZ-18 Young Meghna Estuarine Plain',
      aezNameBn: 'মেঘনা মোহনা প্লাবন সমভূমি',
    };
  }

  // 9. Chattogram, Cox's Bazar, Feni, Noakhali
  if (d.includes('chattogram') || d.includes('chittagong') || d.includes("cox's") || d.includes('coxs') || d.includes('feni') || d.includes('noakhali')) {
    return {
      district: districtName,
      ndvi: 0.78,
      ndviStatusEn: 'Lush Maritime Canopy',
      ndviStatusBn: 'ঘন শ্যামল উপকূলীয় ফসল',
      soilMoisture: 44,
      soilMoistureStatusEn: 'Optimal Moisture',
      soilMoistureStatusBn: 'পর্যাপ্ত আর্দ্রতা',
      temp: 29.8,
      tempStatusEn: 'Maritime Normal',
      tempStatusBn: 'স্বাভাবিক সামুদ্রিক',
      rainFall7d: 68,
      soilTextureEn: 'Chittagong Coastal Sandy Clay Loam',
      soilTextureBn: 'উপকূলীয় বেলে এঁটেল দোআঁশ',
      soilPh: 6.1,
      soilPhStatusEn: 'Slightly Acidic',
      soilPhStatusBn: 'মৃদু অম্লীয় উর্বর',
      nitrogenEn: 'Medium',
      nitrogenBn: 'মাঝারি',
      phosphorusEn: 'High',
      phosphorusBn: 'উচ্চ',
      potassiumEn: 'Medium',
      potassiumBn: 'মাঝারি',
      aezNameEn: 'AEZ-23 Chittagong Coastal Plain',
      aezNameBn: 'চট্টগ্রাম উপকূলীয় সমভূমি',
    };
  }

  // 10. Chittagong Hill Tracts (Bandarban, Rangamati, Khagrachhari)
  if (d.includes('bandarban') || d.includes('rangamati') || d.includes('khagrachhari')) {
    return {
      district: districtName,
      ndvi: 0.86,
      ndviStatusEn: 'Dense Hill Forest & Orchard',
      ndviStatusBn: 'ঘন পাহাড়ি বন ও ফলবাগান',
      soilMoisture: 46,
      soilMoistureStatusEn: 'Optimal Hill Moisture',
      soilMoistureStatusBn: 'পর্যাপ্ত পাহাড়ি আর্দ্রতা',
      temp: 27.2,
      tempStatusEn: 'Mild Hill Climate',
      tempStatusBn: 'স্নিগ্ধ পাহাড়ি আবহাওয়া',
      rainFall7d: 74,
      soilTextureEn: 'Brown Hill Loam & Sandy Clay',
      soilTextureBn: 'বাদামি পাহাড়ি দোআঁশ ও বেলে এঁটেল',
      soilPh: 5.2,
      soilPhStatusEn: 'Strongly Acidic',
      soilPhStatusBn: 'তীব্র অম্লীয় পাহাড়ি মাটি',
      nitrogenEn: 'High',
      nitrogenBn: 'উচ্চ',
      phosphorusEn: 'Low',
      phosphorusBn: 'কম',
      potassiumEn: 'Medium',
      potassiumBn: 'মাঝারি',
      aezNameEn: 'AEZ-29 Northern and Eastern Hills',
      aezNameBn: 'উত্তর ও পূর্ব পাহাড়ি অঞ্চল',
    };
  }

  // 11. Cumilla, Brahmanbaria, Chandpur, Lakshmipur
  if (d.includes('cumilla') || d.includes('comilla') || d.includes('brahmanbaria') || d.includes('chandpur') || d.includes('lakshmipur')) {
    return {
      district: districtName,
      ndvi: 0.71,
      ndviStatusEn: 'Healthy Vegetation',
      ndviStatusBn: 'সুস্থ ফসল',
      soilMoisture: 37,
      soilMoistureStatusEn: 'Medium Optimal',
      soilMoistureStatusBn: 'মাঝারি উপযুক্ত',
      temp: 30.6,
      tempStatusEn: 'Normal',
      tempStatusBn: 'স্বাভাবিক',
      rainFall7d: 28,
      soilTextureEn: 'Old Meghna Estuarine Silt Loam',
      soilTextureBn: 'পুরাতন মেঘনা পলি দোআঁশ মাটি',
      soilPh: 6.4,
      soilPhStatusEn: 'Optimal Neutral',
      soilPhStatusBn: 'আদর্শ নিরপেক্ষ',
      nitrogenEn: 'Medium',
      nitrogenBn: 'মাঝারি',
      phosphorusEn: 'Medium',
      phosphorusBn: 'মাঝারি',
      potassiumEn: 'High',
      potassiumBn: 'উচ্চ',
      aezNameEn: 'AEZ-19 Old Meghna Estuarine Plain',
      aezNameBn: 'পুরাতন মেঘনা মোহনা প্লাবনভূমি',
    };
  }

  // 12. Mymensingh, Netrokona, Sherpur, Jamalpur, Kishoreganj
  if (d.includes('mymensingh') || d.includes('netrokona') || d.includes('sherpur') || d.includes('jamalpur') || d.includes('kishoreganj')) {
    return {
      district: districtName,
      ndvi: 0.77,
      ndviStatusEn: 'Vibrant Greenery',
      ndviStatusBn: 'ঘন শ্যামল ধানক্ষেত',
      soilMoisture: 42,
      soilMoistureStatusEn: 'Optimal Moisture',
      soilMoistureStatusBn: 'পর্যাপ্ত আর্দ্রতা',
      temp: 29.4,
      tempStatusEn: 'Normal',
      tempStatusBn: 'স্বাভাবিক',
      rainFall7d: 36,
      soilTextureEn: 'Old Brahmaputra Silt Clay Loam',
      soilTextureBn: 'পুরাতন ব্রহ্মপুত্র পলি ও এঁটেল দোআঁশ',
      soilPh: 6.3,
      soilPhStatusEn: 'Optimal',
      soilPhStatusBn: 'আদর্শ নিরপেক্ষ',
      nitrogenEn: 'Medium',
      nitrogenBn: 'মাঝারি',
      phosphorusEn: 'High',
      phosphorusBn: 'উচ্চ',
      potassiumEn: 'Medium',
      potassiumBn: 'মাঝারি',
      aezNameEn: 'AEZ-9 Old Brahmaputra Floodplain',
      aezNameBn: 'পুরাতন ব্রহ্মপুত্র প্লাবন সমভূমি',
    };
  }

  // 13. Faridpur, Gopalganj, Madaripur, Rajbari, Shariatpur (Low Ganges Floodplain)
  if (d.includes('faridpur') || d.includes('gopalganj') || d.includes('madaripur') || d.includes('rajbari') || d.includes('shariatpur')) {
    return {
      district: districtName,
      ndvi: 0.73,
      ndviStatusEn: 'Alluvial Riverine Crops',
      ndviStatusBn: 'প্লাবন পলির সমৃদ্ধ ফসল',
      soilMoisture: 40,
      soilMoistureStatusEn: 'Optimal Alluvial Moisture',
      soilMoistureStatusBn: 'পর্যাপ্ত নদীর পলি আর্দ্রতা',
      temp: 30.8,
      tempStatusEn: 'Warm Riverine',
      tempStatusBn: 'উষ্ণ নদী অববাহিকা',
      rainFall7d: 24,
      soilTextureEn: 'Low Ganges Silt Loam & Organic Clay',
      soilTextureBn: 'নিম্ন গঙ্গা পলি দোআঁশ ও এঁটেল',
      soilPh: 6.8,
      soilPhStatusEn: 'Neutral Fertile',
      soilPhStatusBn: 'উর্বর নিরপেক্ষ মাটি',
      nitrogenEn: 'Medium',
      nitrogenBn: 'মাঝারি',
      phosphorusEn: 'Medium',
      phosphorusBn: 'মাঝারি',
      potassiumEn: 'High',
      potassiumBn: 'উচ্চ',
      aezNameEn: 'AEZ-12 Low Ganges River Floodplain',
      aezNameBn: 'নিম্ন গঙ্গা নদী প্লাবন সমভূমি',
    };
  }

  // 12. Central Default / Dhaka, Gazipur, Narayanganj, Tangail, Manikganj, Munshiganj, Narsingdi
  return {
    district: districtName,
    ndvi: 0.63,
    ndviStatusEn: 'Moderate Vegetation',
    ndviStatusBn: 'মাঝারি ঘন ফসল',
    soilMoisture: 33,
    soilMoistureStatusEn: 'Medium',
    soilMoistureStatusBn: 'মাঝারি',
    temp: 31.4,
    tempStatusEn: 'Warm Normal',
    tempStatusBn: 'উষ্ণ স্বাভাবিক',
    rainFall7d: 18,
    soilTextureEn: 'Madhupur Clay & Silt Loam',
    soilTextureBn: 'মধুপুর কর্দমাক্ত ও পলি দোআঁশ',
    soilPh: 6.4,
    soilPhStatusEn: 'Optimal Neutral',
    soilPhStatusBn: 'আদর্শ নিরপেক্ষ',
    nitrogenEn: 'Low',
    nitrogenBn: 'কম',
    phosphorusEn: 'Medium',
    phosphorusBn: 'মাঝারি',
    potassiumEn: 'Medium',
    potassiumBn: 'মাঝারি',
    aezNameEn: 'AEZ-28 Madhupur Tract',
    aezNameBn: 'মধুপুর গড় ও অববাহিকা অঞ্চল',
  };
};

export const getLiveDateDisplay = (isBn: boolean) => {
  const now = new Date();
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsBn = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];

  const dayOfWeek = isBn ? daysBn[now.getDay()] : daysEn[now.getDay()];
  const month = isBn ? monthsBn[now.getMonth()] : monthsEn[now.getMonth()];
  const dateNum = now.getDate();
  const year = now.getFullYear();

  const toBnDigits = (val: number | string) =>
    String(val).replace(/\d/g, (ch) => '০১২৩৪৫৬৭৮৯'[parseInt(ch, 10)]);

  return {
    dayOfWeek,
    dayFormatted: isBn ? `${toBnDigits(dateNum)} ${month}` : `${dateNum} ${month}`,
    fullDateFormatted: isBn
      ? `${toBnDigits(dateNum)} ${month}, ${toBnDigits(year)}`
      : `${dateNum} ${month}, ${year}`,
  };
};
