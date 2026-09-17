import React, { useState } from 'react';
import { 
  Sprout, 
  FlaskConical, 
  TrendingUp, 
  ShoppingBag, 
  Bot, 
  Leaf, 
  CloudSun 
} from 'lucide-react';

interface DynamicIconPicProps {
  name: string;
  alt: string;
  className?: string;
}

const KNOWN_SOURCES: Record<string, string[]> = {
  disease: [
    '/icons/disease.png',
    '/public/src/disease.png',
    '/images/sample_disease.jpg',
    '/images/leaf_sample.jpg',
    '/icons/disease_scanner.svg',
  ],
  soil: [
    '/images/soil_sample.jpg',
    '/icons/soil_test.svg',
  ],
  yield: [
    '/icons/yield_growth.svg',
    '/images/aerial_field.jpg',
  ],
  market: [
    '/icons/market.png',
    '/public/src/market.png',
    '/icons/market_price.svg',
  ],
  bot: [
    '/icons/bot.png',
    '/public/src/bot.png',
    '/icons/ai_bot.svg',
  ],
  chat: [
    '/icons/bot.png',
    '/public/src/bot.png',
    '/icons/ai_bot.svg',
  ],
  crops: [
    '/images/crop_rice.jpg',
  ],
  weather: [
    '/images/nasa_logo.svg',
    '/icons/rain.svg',
  ],
  nasa: [
    '/images/nasa_logo.svg',
  ],
};

export const DynamicIconPic: React.FC<DynamicIconPicProps> = ({
  name,
  alt,
  className = 'w-full h-full object-cover',
}) => {
  const normalizedName = name.toLowerCase().trim();
  const sources = KNOWN_SOURCES[normalizedName] || [
    `/icons/${normalizedName}.png`,
    `/icons/${normalizedName}.jpg`,
    `/icons/${normalizedName}.svg`,
    `/public/src/${normalizedName}.png`,
    `/public/src/${normalizedName}.jpg`,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Elegant fallback icon if image fails
    return (
      <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-[#1E5128]">
        {normalizedName.includes('soil') ? (
          <FlaskConical className="w-5 h-5 text-amber-700" />
        ) : normalizedName.includes('yield') ? (
          <TrendingUp className="w-5 h-5 text-teal-600" />
        ) : normalizedName.includes('market') ? (
          <ShoppingBag className="w-5 h-5 text-purple-600" />
        ) : normalizedName.includes('bot') ? (
          <Bot className="w-5 h-5 text-emerald-700" />
        ) : (
          <Sprout className="w-5 h-5 text-emerald-600" />
        )}
      </div>
    );
  }

  return (
    <img
      src={sources[currentIndex]}
      alt={alt}
      className={className}
      onError={() => {
        if (currentIndex < sources.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setHasError(true);
        }
      }}
    />
  );
};
