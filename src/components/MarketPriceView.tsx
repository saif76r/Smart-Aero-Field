import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ShoppingBag
} from 'lucide-react';
import { Language, MarketItem } from '../types';
import { BANGLADESH_DISTRICTS, INITIAL_MARKET_ITEMS, getDistrictNameBn } from '../data/bangladeshAgriData';

interface MarketPriceViewProps {
  language: Language;
  onBack: () => void;
  onOpenChatWithTopic?: (topic: string) => void;
}

export const MarketPriceView: React.FC<MarketPriceViewProps> = ({
  language,
  onBack,
  onOpenChatWithTopic,
}) => {
  const isBn = language === 'bn';
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Dhaka');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Rice', 'Wheat', 'Veg', 'Fruit', 'Spices'];

  const filteredItems = INITIAL_MARKET_ITEMS.filter((item) => {
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch =
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameBn.includes(searchQuery);
    return matchCategory && matchSearch;
  });

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
          <h2 className="text-lg font-black">{isBn ? 'দৈনিক বাজার দর' : 'Commodity Market Rates'}</h2>
          <p className="text-xs text-green-200">
            {isBn ? 'পাইকারি আড়ত ও খুচরা বাজারের নির্ভরযোগ্য দর' : 'Real-time wholesale market prices in Bangladeshi Taka (Tk)'}
          </p>
        </div>
      </div>

      {/* District & Search Filter (Screenshot 14) */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-700">
            <MapPin className="w-3.5 h-3.5 text-[#1E5128] flex-shrink-0" />
            <span>{isBn ? 'বাজার এলাকা:' : 'Market Hub:'}</span>
          </div>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full sm:flex-1 bg-[#F5F7F8] border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E5128] cursor-pointer"
          >
            {BANGLADESH_DISTRICTS.map((dist) => (
              <option key={dist} value={dist}>
                {isBn ? `${getDistrictNameBn(dist)} পাইকারি বাজার (${dist})` : `${dist} Wholesale Market`}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? 'পণ্যের নাম খুঁজুন (যেমন ধান, আলু, পেঁয়াজ)...' : 'Search commodity (e.g. Rice, Potato, Chili)...'}
            className="w-full bg-[#F5F7F8] border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1E5128]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1E5128] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'All' ? (isBn ? 'সব পণ্য' : 'All') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Market Items Grid (Screenshot 14) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-3.5 sm:p-4 border border-gray-200 shadow-sm flex items-center justify-between hover:border-[#1E5128]/40 transition-colors gap-2"
          >
            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                <img
                  src={item.image}
                  alt={item.nameEn}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                  {isBn ? item.nameBn : item.nameEn}
                </h4>
                <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium block truncate">
                  {selectedDistrict} {isBn ? 'বাজার' : 'Market'}
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-sm sm:text-base font-black text-gray-900">
                {item.price} <span className="text-xs font-bold text-[#1E5128]">Tk</span>
              </div>
              <div className="text-[10px] text-gray-500">{item.unit}</div>
              <div className="mt-0.5 flex items-center justify-end space-x-0.5 text-[10px] font-bold">
                {item.trend === 'up' && (
                  <span className="text-red-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    {isBn ? '+বৃদ্ধি' : '+Rise'}
                  </span>
                )}
                {item.trend === 'down' && (
                  <span className="text-emerald-600 flex items-center">
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                    {isBn ? '-হ্রাস' : '-Drop'}
                  </span>
                )}
                {item.trend === 'stable' && (
                  <span className="text-gray-500 flex items-center">
                    <Minus className="w-3 h-3 mr-0.5" />
                    {isBn ? 'স্থিতিশীল' : 'Stable'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onOpenChatWithTopic?.(`What is the price forecast for Aman rice and potato in ${selectedDistrict}? When is the best time to sell?`)}
        className="w-full py-3 bg-[#1E5128] hover:bg-[#163e1e] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow"
      >
        <span>{isBn ? 'বাজার পূর্বাভাস ও ফসল বিক্রির সেরা সময় জানুন' : 'Get Crop Selling Strategy & Price Forecast'}</span>
      </button>
    </div>
  );
};
