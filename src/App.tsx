import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Satellite, 
  Scan, 
  Calendar, 
  ArrowRight, 
  TrendingUp, 
  FlaskRound as Flask, 
  BookOpen, 
  ChevronRight,
  Bot,
  CloudRain,
  Droplets,
  Wind,
  User,
  RefreshCw
} from 'lucide-react';
import { Language, NotificationItem, FarmerUser } from './types';
import { INITIAL_NOTIFICATIONS } from './data/bangladeshAgriData';
import { getDistrictWeather, getLiveDateDisplay } from './data/weatherData';
import { 
  getRealtimeAgronomicUpdates, 
  generateDailyWeatherNotifications, 
  triggerNativePushNotification 
} from './utils/agronomicEngine';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { LeafDiseaseScanner } from './components/LeafDiseaseScanner';
import { GeminiChatbotDrawer } from './components/GeminiChatbotDrawer';
import { NasaEarthView } from './components/NasaEarthView';
import { HubView } from './components/HubView';
import { CropInfoView } from './components/CropInfoView';
import { SoilTestView } from './components/SoilTestView';
import { MarketPriceView } from './components/MarketPriceView';
import { YieldMaxWizard } from './components/YieldMaxWizard';
import { FarmerProfileView } from './components/FarmerProfileView';
import { SuppliesCalculator } from './components/SuppliesCalculator';
import { NotificationsModal } from './components/NotificationsModal';
import { SettingsModal } from './components/SettingsModal';
import { LoginScreen } from './components/LoginScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { DynamicIconPic } from './components/DynamicIconPic';
import { testConnection, ensureAuthenticatedUser, auth } from './lib/firebase';
import { signOut } from 'firebase/auth';
import { saveFarmerProfileToFirestore, fetchFarmerProfileFromFirestore } from './lib/firestoreService';

export function App() {
  // App Global State
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('krishi_language');
      return saved === 'en' || saved === 'bn' ? saved : 'bn';
    } catch {
      return 'bn';
    }
  });
  const isBn = language === 'bn';

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('krishi_language', newLang);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDistrictChange = (newDistrict: string) => {
    if (currentUser) {
      const updated = { ...currentUser, district: newDistrict };
      setCurrentUser(updated);
      try {
        localStorage.setItem('krishi_farmer_user', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Authentication & Onboarding State
  const [hasCompletedWelcome, setHasCompletedWelcome] = useState<boolean>(() => {
    try {
      return localStorage.getItem('krishi_welcome_completed') === 'true';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<FarmerUser | null>(() => {
    try {
      const saved = localStorage.getItem('krishi_farmer_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear out the dummy preset from before registration was required
        if (parsed?.name === 'Md. Nasirul Islam' && parsed?.phone === '01711-234567') {
          localStorage.removeItem('krishi_farmer_user');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Navigation Tab State: 'home' | 'hub' | 'scan' | 'nasa' | 'profile' | 'crops' | 'soil' | 'market' | 'yield' | 'supplies'
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCropId, setSelectedCropId] = useState<string | undefined>(undefined);

  // Chat Drawer State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatTopic, setChatTopic] = useState<string | null>(null);

  // Notifications State with local storage persistence and daily weather updates
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('krishi_notifications_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed reading notifications from storage', e);
    }
    return INITIAL_NOTIFICATIONS;
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem('krishi_notifications_list', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  // Sync real-time daily notifications based on weather
  const syncWeatherNotifications = useCallback((forceRefresh: boolean = false) => {
    const district = currentUser?.district || 'Rajshahi';
    const todayDate = new Date();
    const todayKey = todayDate.toISOString().split('T')[0];
    const lastSyncDate = localStorage.getItem('krishi_last_weather_notify_date');
    const lastSyncDistrict = localStorage.getItem('krishi_last_weather_district');

    if (forceRefresh || lastSyncDate !== todayKey || lastSyncDistrict !== district) {
      const dailyAlerts = generateDailyWeatherNotifications(district, todayDate);
      
      setNotifications((prev) => {
        const filtered = prev.filter(
          (item) => 
            !item.id.startsWith(`daily-weather-${todayKey}`) && 
            !item.id.startsWith(`daily-irrigation-${todayKey}`) && 
            !item.id.startsWith(`daily-disease-alert-${todayKey}`) && 
            !item.id.startsWith(`daily-agronomy-${todayKey}`)
        );
        const updated = [...dailyAlerts, ...filtered].slice(0, 30);
        try {
          localStorage.setItem('krishi_notifications_list', JSON.stringify(updated));
          localStorage.setItem('krishi_last_weather_notify_date', todayKey);
          localStorage.setItem('krishi_last_weather_district', district);
        } catch (e) {
          console.warn('Failed saving notifications', e);
        }
        return updated;
      });

      if (dailyAlerts.length > 0) {
        const top = dailyAlerts[0];
        triggerNativePushNotification(
          isBn ? 'স্মার্ট অ্যারো ফিল্ড - আজকের আবহাওয়া সতর্কতা' : 'Smart Aero Field - Today Weather Advisory',
          isBn ? top.titleBn : top.titleEn
        );
      }
    }
  }, [currentUser?.district, isBn]);

  useEffect(() => {
    syncWeatherNotifications(false);
  }, [syncWeatherNotifications]);

  // Dynamic Real-time Agronomic Updates for TODAY based on live date, weather & crop
  const [agronomicRefreshCount, setAgronomicRefreshCount] = useState<number>(0);
  const agronomicUpdates = useMemo(() => {
    return getRealtimeAgronomicUpdates(
      currentUser?.district || 'Rajshahi',
      currentUser?.primaryCrop,
      new Date()
    );
  }, [currentUser?.district, currentUser?.primaryCrop, agronomicRefreshCount]);

  const openChatWithTopic = (topic: string) => {
    setChatTopic(topic);
    setIsChatOpen(true);
  };

  const handleNavigateToCrop = (cropId: string) => {
    setSelectedCropId(cropId);
    setCurrentTab('crops');
  };

  const handleLoginSuccess = (user: FarmerUser) => {
    try {
      localStorage.setItem('krishi_farmer_user', JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage not available', e);
    }
    setCurrentUser(user);
    setCurrentTab('home');
  };

  const handleUpdateUserProfile = async (updated: FarmerUser) => {
    try {
      localStorage.setItem('krishi_farmer_user', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    setCurrentUser(updated);

    try {
      await saveFarmerProfileToFirestore({
        name: updated.name,
        phone: updated.phone,
        district: updated.district,
        farmSizeAcres: parseFloat(updated.landSize) || 0,
        photoUrl: updated.photoUrl,
        bio: updated.bio,
        experienceYears: updated.experienceYears ? parseInt(updated.experienceYears, 10) : undefined,
        primaryCrops: updated.primaryCrops,
      });
    } catch (e) {
      console.warn('Firestore profile save note:', e);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('krishi_farmer_user');
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    signOut(auth).catch(() => {});
    setCurrentUser(null);
  };

  // Firebase initialization, server connection test and auth session setup
  useEffect(() => {
    let isMounted = true;
    testConnection().then((connected) => {
      if (isMounted) {
        setIsFirebaseConnected(connected);
      }
    }).catch(() => {
      if (isMounted) setIsFirebaseConnected(false);
    });

    ensureAuthenticatedUser().then((user) => {
      if (user && currentUser) {
        saveFarmerProfileToFirestore({
          name: currentUser.name,
          phone: currentUser.phone,
          district: currentUser.district,
          farmSizeAcres: parseFloat(currentUser.landSize) || 0,
          photoUrl: currentUser.photoUrl,
          bio: currentUser.bio,
          primaryCrops: currentUser.primaryCrops,
          experienceYears: currentUser.experienceYears ? parseInt(currentUser.experienceYears, 10) : undefined,
        }).catch((e) => console.warn('Firestore profile sync note:', e));

        fetchFarmerProfileFromFirestore().then((prof) => {
          if (prof && prof.photoUrl && !currentUser.photoUrl && isMounted) {
            const updated = { ...currentUser, photoUrl: prof.photoUrl };
            try {
              localStorage.setItem('krishi_farmer_user', JSON.stringify(updated));
            } catch {}
            setCurrentUser(updated);
          }
        }).catch((e) => console.warn('Profile fetch note:', e));
      }
    }).catch((e) => console.warn('Auth note:', e));

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // IF NOT LOGGED IN -> CHECK IF WELCOME / LANGUAGE STEP IS COMPLETED FIRST
  if (!currentUser) {
    if (!hasCompletedWelcome) {
      return (
        <WelcomeScreen
          language={language}
          onSelectLanguage={handleLanguageChange}
          onNext={() => {
            try {
              localStorage.setItem('krishi_welcome_completed', 'true');
            } catch (e) {
              console.error(e);
            }
            setHasCompletedWelcome(true);
          }}
        />
      );
    }

    return (
      <LoginScreen
        language={language}
        onToggleLanguage={() => handleLanguageChange(language === 'bn' ? 'en' : 'bn')}
        onBackToLanguageSelect={() => setHasCompletedWelcome(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Live Weather & Date for the logged-in Farmer's district
  const currentWeather = getDistrictWeather(currentUser.district);
  const liveDate = getLiveDateDisplay(language === 'bn');
  const toBnDigits = (val: number | string) =>
    String(val).replace(/\d/g, (ch) => '০১২৩৪৫৬৭৮৯'[parseInt(ch, 10)]);

  // IF LOGGED IN -> RENDER KRISHIGUIDE MOBILE APP
  return (
    <div className="min-h-screen bg-[#F5F7F8] text-[#111827] flex flex-col font-sans selection:bg-[#4E9F3D] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'))}
        unreadNotifications={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenChat={() => {
          setChatTopic(null);
          setIsChatOpen(true);
        }}
        isFirebaseConnected={isFirebaseConnected}
      />

      {/* Main Screen Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-32 sm:pb-36">
        
        {/* VIEW: HOME (Matching Screenshot 4) */}
        {currentTab === 'home' && (
          <div className="space-y-4 sm:space-y-5">
            
            {/* Farmer Welcome Hero Banner with Live Weather on Right (Screenshot 4) */}
            <div className="relative rounded-3xl overflow-hidden shadow-sm border border-gray-200/80 bg-gradient-to-br from-[#1E5128] via-[#266333] to-[#16401f] text-white">
              <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
                <img
                  src="/images/aerial_field.jpg"
                  alt="Farm Terraces"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
                  {/* Left Column: Greeting, Farmer Name, Crop Advice & Stats */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2.5">
                      {/* User Uploaded Profile Picture Avatar (Replaces logo with user picture) */}
                      <button
                        type="button"
                        onClick={() => setCurrentTab('profile')}
                        title={isBn ? 'প্রোফাইল দেখতে বা ছবি পরিবর্তন করতে ক্লিক করুন' : 'Click to view profile or change photo'}
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-md border-2 border-[#D8E9A8] flex items-center justify-center flex-shrink-0 overflow-hidden hover:ring-2 hover:ring-white transition-all cursor-pointer group active:scale-95"
                      >
                        {currentUser.photoUrl ? (
                          <img
                            src={currentUser.photoUrl}
                            alt={currentUser.name}
                            className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#1E5128]/15 flex items-center justify-center text-[#1E5128]">
                            <User className="w-6 h-6 text-[#1E5128]" />
                          </div>
                        )}
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-[#D8E9A8] uppercase tracking-wider block">
                            {isBn ? 'স্বাগতম' : 'Welcome'}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-emerald-400" />
                          <span className="text-[10px] font-semibold text-green-200 truncate">
                            {currentUser.district}
                          </span>
                        </div>
                        <h1 className="text-lg sm:text-xl font-black tracking-tight truncate">
                          {currentUser.name}
                        </h1>
                      </div>
                    </div>

                    <p className="text-xs text-green-100 mt-1.5 leading-snug">
                      {isBn
                        ? `${currentUser.district} জেলার বর্তমান আবহাওয়া আমন ধান পরিচর্যার জন্য উপযোগী।`
                        : `Current conditions in ${currentUser.district} are favorable for paddy cultivation.`}
                    </p>
                  </div>

                  {/* Right Column: Today's Live Weather Widget (Requested by User) */}
                  <div
                    id="hero-todays-weather-widget"
                    onClick={() => setCurrentTab('nasa')}
                    title={isBn ? 'সম্পূর্ণ ৭ দিনের আবহাওয়া ও নাসা স্যাটেলাইট তথ্য দেখতে ক্লিক করুন' : "Click to view NASA Earth data & 7-day weather forecast"}
                    className="flex-shrink-0 bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-md border border-white/25 hover:border-white/40 rounded-2xl p-2.5 sm:p-3 transition-all duration-150 cursor-pointer shadow-md hover:shadow-lg group sm:min-w-[190px]"
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#D8E9A8]">
                          {isBn ? 'আজকের আবহাওয়া' : "Today's Weather"}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-green-200 group-hover:text-white transition-colors">
                        {liveDate.dayOfWeek}, {liveDate.dayFormatted}
                      </span>
                    </div>

                    {/* Main Temperature & Weather Icon Row */}
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/20 border border-white/30 overflow-hidden shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          <img
                            src={currentWeather.iconSrc}
                            alt={currentWeather.conditionEn}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/weather/partly_cloudy.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <span className="text-lg sm:text-xl font-black text-white leading-none block">
                            {isBn ? `+${toBnDigits(currentWeather.temp)}°সে` : `+${currentWeather.temp}°C`}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-semibold text-green-100 block mt-0.5 whitespace-nowrap">
                            {isBn ? currentWeather.conditionBn : currentWeather.conditionEn}
                          </span>
                        </div>
                      </div>

                      {/* Mini Agro-climatic Metrics */}
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] pl-2.5 border-l border-white/20">
                        <div className="flex items-center space-x-1 text-green-100" title={isBn ? 'বাতাসের আর্দ্রতা' : 'Humidity'}>
                          <Droplets className="w-3 h-3 text-cyan-300 flex-shrink-0" />
                          <span className="font-bold">{isBn ? `${toBnDigits(currentWeather.humidity)}%` : `${currentWeather.humidity}%`}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-green-100" title={isBn ? 'বৃষ্টির সম্ভাবনা' : 'Rain Chance'}>
                          <CloudRain className="w-3 h-3 text-blue-300 flex-shrink-0" />
                          <span className="font-bold">{isBn ? `${toBnDigits(currentWeather.rainChance)}%` : `${currentWeather.rainChance}%`}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-green-100 col-span-2" title={isBn ? 'বাতাসের গতিবেগ' : 'Wind Speed'}>
                          <Wind className="w-3 h-3 text-emerald-300 flex-shrink-0" />
                          <span className="font-bold">
                            {isBn ? `${toBnDigits(currentWeather.windSpeed)} কিমি/ঘ` : `${currentWeather.windSpeed} km/h`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Link Hint */}
                    <div className="mt-2 pt-1.5 border-t border-white/15 flex items-center justify-between text-[10px] text-green-200 group-hover:text-white transition-colors">
                      <span className="font-medium text-emerald-200">
                        {currentUser.district}
                      </span>
                      <span className="font-bold text-[#D8E9A8] flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>{isBn ? '৭ দিনের পূর্বাভাস' : '7-Day Forecast'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* NASA Earth Data Banner Card with Satellite Earth Picture Background */}
            <div
              id="nasa-earth-data-banner"
              onClick={() => setCurrentTab('nasa')}
              className="relative rounded-2xl p-3.5 sm:p-4 border border-blue-900/30 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-between group overflow-hidden text-white"
            >
              {/* Background Satellite Earth Image with Precision Overlay */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                  src="/images/satellite_earth.jpg"
                  alt="NASA Satellite Earth Imagery"
                  className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Multi-layer Dark Gradient: Keeps text 100% crystal clear & readable */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/88 to-blue-950/75" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-cyan-500/10" />
              </div>

              {/* Foreground Card Content */}
              <div className="relative z-10 flex items-center justify-between w-full gap-2.5">
                <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0">
                  {/* NASA Insignia with subtle glow and border */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 p-0.5 flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-cyan-400/50 group-hover:border-cyan-300 group-hover:scale-105 transition-all overflow-hidden ring-2 ring-blue-500/20">
                    <img
                      src="/images/nasa_logo.svg"
                      alt="NASA Meatball Insignia Logo"
                      className="w-full h-full object-cover scale-[1.04]"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                      <h3 className="font-black text-sm sm:text-base text-white group-hover:text-cyan-200 transition-colors tracking-tight truncate">
                        NASA Earth Data
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] bg-blue-500/30 border border-blue-400/40 text-cyan-200 font-bold px-2 py-0.5 rounded-full flex-shrink-0 backdrop-blur-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        Live MODIS
                      </span>
                      <span className="text-[10px] bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 font-bold px-2 py-0.5 rounded-full flex-shrink-0 backdrop-blur-xs">
                        {isBn ? 'ঝুঁকি ও ফসল পূর্বাভাস' : 'Risk & Crops'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 group-hover:text-slate-100 transition-colors mt-0.5 truncate font-normal">
                      {isBn
                        ? `${currentUser.district} জেলার স্যাটেলাইট ক্লাইমেট, ঝুঁকি ও ফসল উপযুক্ততা যাচাই`
                        : `Satellite climatology, risk analysis & crop suitability for ${currentUser.district}`}
                    </p>
                  </div>
                </div>

                {/* Right Arrow Button */}
                <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all flex-shrink-0 group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:border-cyan-400 shadow-md">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* "Use Now" Quick Action Pills (Screenshot 4) */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                <span>{isBn ? 'প্রয়োজনীয় সেবা ও টুলস' : 'Quick Actions & Tools'}</span>
                <span 
                  onClick={() => setCurrentTab('hub')}
                  className="text-[#1E5128] font-bold cursor-pointer hover:underline"
                >
                  {isBn ? 'সব দেখুন →' : 'View all →'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* 1. Disease Detection -> Goes to dedicated Scan Screen */}
                <button
                  type="button"
                  onClick={() => setCurrentTab('scan')}
                  className="p-3.5 bg-white hover:bg-emerald-50 active:bg-emerald-100 rounded-2xl border border-gray-200 text-center flex flex-col items-center justify-center transition-all group shadow-2xs cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2 mx-auto group-hover:scale-105 transition-transform overflow-hidden shadow-2xs">
                    <DynamicIconPic
                      name="disease"
                      alt="Disease Diagnostics"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-900 block leading-tight text-center">
                    {isBn ? 'পাতা ও ফলের রোগ' : 'Leaf & Fruit Disease'}
                  </span>
                  <span className="text-[10px] text-gray-500 block text-center mt-0.5">
                    {isBn ? 'স্মার্ট এআই স্ক্যান' : 'Smart AI Scanner'}
                  </span>
                </button>

                {/* 2. Soil Test -> Goes to dedicated Soil Test Screen */}
                <button
                  type="button"
                  onClick={() => setCurrentTab('soil')}
                  className="p-3.5 bg-white hover:bg-amber-50 active:bg-amber-100 rounded-2xl border border-gray-200 text-center flex flex-col items-center justify-center transition-all group shadow-2xs cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2 mx-auto group-hover:scale-105 transition-transform overflow-hidden shadow-2xs">
                    <DynamicIconPic
                      name="soil"
                      alt="Soil Test"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-900 block leading-tight text-center">
                    {isBn ? 'মাটি পরীক্ষা' : 'Soil Test'}
                  </span>
                  <span className="text-[10px] text-gray-500 block text-center mt-0.5">
                    {isBn ? 'গুণাগুণ যাচাই' : 'NPK Texture'}
                  </span>
                </button>

                {/* 3. Yield Max -> Goes to dedicated 5-Step Wizard Screen */}
                <button
                  type="button"
                  onClick={() => setCurrentTab('yield')}
                  className="p-3.5 bg-white hover:bg-teal-50 active:bg-teal-100 rounded-2xl border border-gray-200 text-center flex flex-col items-center justify-center transition-all group shadow-2xs cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2 mx-auto group-hover:scale-105 transition-transform overflow-hidden shadow-2xs">
                    <DynamicIconPic
                      name="yield"
                      alt="Yield Max"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-900 block leading-tight text-center">
                    {isBn ? 'ফলন বৃদ্ধি' : 'Yield Max'}
                  </span>
                  <span className="text-[10px] text-gray-500 block text-center mt-0.5">
                    {isBn ? '৫-ধাপ উইজার্ড' : 'Harvest Plan'}
                  </span>
                </button>

                {/* 4. Market Price -> Goes to dedicated Wholesale Price Screen */}
                <button
                  type="button"
                  onClick={() => setCurrentTab('market')}
                  className="p-3.5 bg-white hover:bg-purple-50 active:bg-purple-100 rounded-2xl border border-gray-200 text-center flex flex-col items-center justify-center transition-all group shadow-2xs cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2 mx-auto group-hover:scale-105 transition-transform overflow-hidden shadow-2xs">
                    <DynamicIconPic
                      name="market"
                      alt="Market Price"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-900 block leading-tight text-center">
                    {isBn ? 'বাজার দর' : 'Market Price'}
                  </span>
                  <span className="text-[10px] text-gray-500 block text-center mt-0.5">
                    {isBn ? 'পাইকারি রেট' : 'Daily Rates'}
                  </span>
                </button>
              </div>
            </div>

            {/* Direct Feature Banner: Input Supplies & Profit/Loss Calculator */}
            <div
              id="supplies-profit-calculator-banner"
              onClick={() => setCurrentTab('supplies')}
              className="bg-white rounded-2xl p-3.5 sm:p-4 border border-emerald-300 shadow-2xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-between group bg-gradient-to-r from-emerald-50/90 via-white to-indigo-50/70 gap-2"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-[#1E5128] text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-6 h-6 text-[#D8E9A8]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                    <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 group-hover:text-[#1E5128] transition-colors truncate">
                      {isBn ? 'উপকরণ খরচ ও লাভ-ক্ষতি ক্যালকুলেটর' : 'Supplies & Profit/Loss Calculator'}
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded flex-shrink-0">
                      {isBn ? 'হিসাব খাতা' : 'Ledger'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                    {isBn
                      ? 'সার, কীটনাশক, বীজ ক্রয় তালিকা এবং ফসল বিক্রির লাভ/ক্ষতির সঠিক হিসাব'
                      : 'Fertilizer, pesticide & seed costs with instant net profit/loss calculation'}
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-emerald-100/70 group-hover:bg-emerald-200 text-[#1E5128] flex items-center justify-center transition-colors flex-shrink-0">
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* AI Suggestion Card (Screenshot 4) */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-100 rounded-2xl p-3.5 sm:p-4 border border-emerald-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden border border-emerald-300">
                  <DynamicIconPic
                    name="bot"
                    alt="AI Agronomist"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 leading-tight">
                    {isBn ? 'কৃষি পরামর্শ চান?' : 'Need Instant Agronomic Advice?'}
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5 leading-snug">
                    {isBn
                      ? 'সার, সেচ বা পোকার দমনে সরাসরি এআই কৃষিবিদকে প্রশ্ন করুন'
                      : 'Ask Gemini Agronomist about fertilizer doses, weeds or pest alerts.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setChatTopic(null);
                  setIsChatOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#1E5128] hover:bg-[#163e1e] active:scale-95 text-white rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm cursor-pointer text-center"
              >
                {isBn ? 'পরামর্শ নিন' : 'Get Advice'}
              </button>
            </div>

            {/* Recent Agricultural Updates (Clean & Photo-Rich Daily Real-Time Schedule) */}
            <div className="space-y-3">
              {/* Clean unified header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-black text-sm sm:text-base text-gray-900 tracking-tight">
                      {isBn ? 'দৈনিক কৃষি সময়সূচি ও পরামর্শ' : 'Daily Agronomic Schedule'}
                    </h3>
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      <span>{isBn ? 'লাইভ' : 'Live'}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    📅 {liveDate.fullDateFormatted} • {currentUser.district} {isBn ? 'এর ফসল পর্যায়' : 'Crop Phase'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setAgronomicRefreshCount((c) => c + 1)}
                  title={isBn ? 'আজকের তথ্য রিফ্রেশ করুন' : 'Refresh today recommendations'}
                  className="flex items-center space-x-1 text-[11px] font-semibold text-gray-600 hover:text-[#1E5128] hover:bg-emerald-50 transition-all px-2.5 py-1.5 rounded-xl border border-gray-200 cursor-pointer active:scale-95 shadow-2xs bg-white"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden sm:inline">{isBn ? 'রিফ্রেশ' : 'Sync'}</span>
                </button>
              </div>

              {/* Clean Photo Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agronomicUpdates.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      if (item.cropId) {
                        handleNavigateToCrop(item.cropId);
                      } else {
                        openChatWithTopic(isBn ? item.titleBn : item.titleEn);
                      }
                    }}
                    className="bg-white p-3 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-600/50 transition-all cursor-pointer flex gap-3 items-center group relative overflow-hidden"
                  >
                    {/* Crop Picture Thumbnail */}
                    <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100 shadow-2xs">
                      <img 
                        src={item.image || '/images/crop_rice.jpg'} 
                        alt={item.cropTagEn} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        loading="lazy"
                      />
                      {item.isTodayActive && (
                        <span className="absolute bottom-1 left-1 right-1 text-[9px] font-bold bg-[#1E5128]/95 backdrop-blur-xs text-white text-center rounded py-0.5 shadow-xs">
                          {isBn ? 'সক্রিয়' : 'Active'}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.tagColor === 'amber' ? 'bg-amber-100/80 text-amber-900' :
                          item.tagColor === 'blue' ? 'bg-blue-100/80 text-blue-900' :
                          item.tagColor === 'purple' ? 'bg-purple-100/80 text-purple-900' :
                          item.tagColor === 'emerald' ? 'bg-emerald-100/80 text-emerald-900' :
                          'bg-green-100/80 text-green-900'
                        }`}>
                          {isBn ? item.cropTagBn : item.cropTagEn}
                        </span>

                        <span className="text-[10px] font-medium text-emerald-800 flex items-center space-x-0.5">
                          <Calendar className="w-3 h-3 text-emerald-700 mr-0.5" />
                          <span>{isBn ? item.dateRangeBn : item.dateRangeEn}</span>
                        </span>
                      </div>

                      <h4 className="font-extrabold text-xs sm:text-sm text-gray-900 leading-snug truncate group-hover:text-[#1E5128] transition-colors">
                        {isBn ? item.titleBn : item.titleEn}
                      </h4>

                      <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                        {isBn ? item.stageBn : item.stageEn}
                      </p>

                      {/* Compact Weather Advisory Pill */}
                      <div className="mt-1.5 flex items-center justify-between text-[10px] bg-emerald-50/70 border border-emerald-100/80 text-emerald-900 px-2 py-1 rounded-lg">
                        <span className="truncate font-medium">
                          {isBn ? item.weatherBriefBn : item.weatherBriefEn}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-700 ml-1.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: HUB / SERVICES (Screenshots 10) */}
        {currentTab === 'hub' && (
          <HubView
            language={language}
            onChangeLanguage={handleLanguageChange}
            currentDistrict={currentUser.district}
            onChangeDistrict={handleDistrictChange}
            onSelectService={(serviceId) => {
              if (serviceId === 'disease') setCurrentTab('scan');
              else if (serviceId === 'weather') setCurrentTab('nasa');
              else if (serviceId === 'crops') setCurrentTab('crops');
              else if (serviceId === 'soil') setCurrentTab('soil');
              else if (serviceId === 'market') setCurrentTab('market');
              else if (serviceId === 'yield') setCurrentTab('yield');
              else if (serviceId === 'supplies') setCurrentTab('supplies');
            }}
            onOpenChat={() => {
              setChatTopic(null);
              setIsChatOpen(true);
            }}
          />
        )}

        {/* VIEW: DEDICATED LEAF SCAN SCREEN (Screenshots 7, 8, 9) */}
        {currentTab === 'scan' && (
          <LeafDiseaseScanner
            language={language}
            onOpenChatWithTopic={openChatWithTopic}
            onBack={() => setCurrentTab('home')}
          />
        )}

        {/* VIEW: DEDICATED NASA SATELLITE EARTH DATA (Screenshots 5, 6) */}
        {currentTab === 'nasa' && (
          <NasaEarthView
            language={language}
            onBack={() => setCurrentTab('home')}
            selectedDistrict={currentUser.district}
            onOpenChatWithTopic={openChatWithTopic}
            onNavigateToCropGuide={handleNavigateToCrop}
          />
        )}

        {/* VIEW: DEDICATED CROP ENCYCLOPEDIA (Screenshots 11, 12) */}
        {currentTab === 'crops' && (
          <CropInfoView
            language={language}
            onBack={() => setCurrentTab('home')}
            selectedCropId={selectedCropId}
            onOpenChatWithTopic={openChatWithTopic}
          />
        )}

        {/* VIEW: DEDICATED SOIL TEST (Screenshot 13) */}
        {currentTab === 'soil' && (
          <SoilTestView
            language={language}
            onBack={() => setCurrentTab('home')}
            onOpenChatWithTopic={openChatWithTopic}
          />
        )}

        {/* VIEW: DEDICATED MARKET PRICE (Screenshot 14) */}
        {currentTab === 'market' && (
          <MarketPriceView
            language={language}
            onBack={() => setCurrentTab('home')}
            onOpenChatWithTopic={openChatWithTopic}
          />
        )}

        {/* VIEW: DEDICATED YIELD MAX WIZARD (Screenshots 15, 16, 17, 18) */}
        {currentTab === 'yield' && (
          <YieldMaxWizard
            language={language}
            onBack={() => setCurrentTab('home')}
            onOpenChatWithTopic={openChatWithTopic}
          />
        )}

        {/* VIEW: DEDICATED INPUT SUPPLIES CALCULATOR (Screenshot 20) */}
        {currentTab === 'supplies' && (
          <SuppliesCalculator
            language={language}
            onBack={() => setCurrentTab('home')}
            onOpenChatWithTopic={openChatWithTopic}
            currentUser={currentUser}
          />
        )}

        {/* VIEW: DEDICATED FARMER PROFILE */}
        {currentTab === 'profile' && (
          <FarmerProfileView
            language={language}
            user={currentUser}
            onUpdateUser={handleUpdateUserProfile}
            onOpenChatWithTopic={openChatWithTopic}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onLogout={handleLogout}
            onNavigateToTab={(tab: string) => setCurrentTab(tab)}
          />
        )}
      </main>

      {/* FLOATING GEMINI AI AGRONOMIST BUTTON (Bottom-Right) */}
      <div className="fixed bottom-[74px] sm:bottom-20 right-3 sm:right-5 z-30">
        <button
          id="floating-ai-agronomist-btn"
          type="button"
          onClick={() => {
            setChatTopic(null);
            setIsChatOpen(true);
          }}
          className="relative group bg-[#1E5128] hover:bg-[#163e1e] active:scale-95 text-white p-2 sm:p-2.5 rounded-full shadow-xl flex items-center justify-center border-2 border-[#D8E9A8] transition-all cursor-pointer"
          aria-label="Open AI Agronomist Chat"
          title={isBn ? 'এআই কৃষিবিদকে প্রশ্ন করুন' : 'Ask AI Agronomist'}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex items-center justify-center border border-white/20 flex-shrink-0">
            <DynamicIconPic name="bot" alt="AI Agronomist" className="w-full h-full object-cover rounded-full" />
          </div>
          <span className="hidden xl:inline text-xs font-bold pl-1.5 pr-2 whitespace-nowrap">
            {isBn ? 'এআই কৃষিবিদ' : 'AI Agronomist'}
          </span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-yellow-500 border-2 border-white" />
          </span>
        </button>
      </div>

      {/* MODULE 3: GEMINI AI AGRONOMIST CHATBOT DRAWER */}
      <GeminiChatbotDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        language={language}
        initialPrompt={chatTopic}
        currentUser={currentUser}
      />

      {/* NOTIFICATIONS MODAL (Screenshot 21) */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        language={language}
        notifications={notifications}
        currentDistrict={currentUser.district}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onRefreshDailyWeatherAlerts={() => syncWeatherNotifications(true)}
        onOpenChatWithTopic={openChatWithTopic}
      />

      {/* GLOBAL SETTINGS MODAL */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        onChangeLanguage={handleLanguageChange}
        currentDistrict={currentUser.district}
        onChangeDistrict={handleDistrictChange}
      />

      {/* BOTTOM PERSISTENT NAVIGATION BAR */}
      <BottomNav
        currentTab={
          currentTab === 'home' || currentTab === 'hub' || currentTab === 'scan' || currentTab === 'nasa' || currentTab === 'profile'
            ? (currentTab as any)
            : 'home'
        }
        onSelectTab={(tab) => {
          setSelectedCropId(undefined);
          setCurrentTab(tab);
        }}
        language={language}
        userPhotoUrl={currentUser.photoUrl}
      />
    </div>
  );
}

export default App;
