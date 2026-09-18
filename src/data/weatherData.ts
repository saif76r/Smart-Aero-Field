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
  const d = (districtName || '').toLowerCase();

  // Northeastern region (Sylhet division - higher rain)
  if (
    d.includes('sylhet') ||
    d.includes('sunamganj') ||
    d.includes('moulvibazar') ||
    d.includes('habiganj')
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

  // Coastal / Southeastern (Chattogram, Cox's Bazar, Barishal, Bhola)
  if (
    d.includes('chattogram') ||
    d.includes("cox's") ||
    d.includes('feni') ||
    d.includes('noakhali') ||
    d.includes('barishal') ||
    d.includes('bhola') ||
    d.includes('patuakhali')
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

  // South-Western / Barind fringe (Khulna, Satkhira, Jashore, Kushtia)
  if (
    d.includes('khulna') ||
    d.includes('satkhira') ||
    d.includes('jashore') ||
    d.includes('kushtia')
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

  // Central (Dhaka, Gazipur, Narayanganj, Tangail, Cumilla)
  if (
    d.includes('dhaka') ||
    d.includes('gazipur') ||
    d.includes('narayanganj') ||
    d.includes('tangail') ||
    d.includes('cumilla') ||
    d.includes('brahmanbaria')
  ) {
    return {
      temp: 31,
      conditionEn: 'Partly Cloudy',
      conditionBn: 'আংশিক মেঘলা',
      humidity: 68,
      rainChance: 25,
      windSpeed: 11,
      iconSrc: '/images/weather/partly_cloudy.jpg',
    };
  }

  // Northern & Western (Rajshahi, Rangpur, Dinajpur, Bogura, Naogaon, Pabna, Sirajganj)
  return {
    temp: 30,
    conditionEn: 'Partly Sunny',
    conditionBn: 'আংশিক রৌদ্রোজ্জ্বল',
    humidity: 64,
    rainChance: 15,
    windSpeed: 12,
    iconSrc: '/images/weather/partly_cloudy.jpg',
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
