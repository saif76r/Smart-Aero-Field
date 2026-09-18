import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Trash2, 
  Check, 
  User, 
  MapPin, 
  Sprout, 
  Calendar, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Language, FarmerUser } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshAgriData';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  user?: FarmerUser | null;
  onSave: (updatedUser: FarmerUser) => Promise<void> | void;
}

// Preset agri avatars for farmers who prefer not uploading a personal photo
const PRESET_AVATARS = [
  {
    id: 'farmer_1',
    labelBn: 'অভিজ্ঞ কৃষক',
    labelEn: 'Experienced Farmer',
    // SVG Data URI for an authentic illustrated farmer avatar
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231E5128"/><circle cx="50" cy="42" r="20" fill="%23FFD8A8"/><path d="M50 20 C32 20 30 32 30 32 C38 28 62 28 70 32 C70 32 68 20 50 20 Z" fill="%23F59E0B"/><rect x="22" y="30" width="56" height="6" rx="3" fill="%23D97706"/><circle cx="44" cy="40" r="2.5" fill="%231F2937"/><circle cx="56" cy="40" r="2.5" fill="%231F2937"/><path d="M44 48 Q50 54 56 48" stroke="%2392400E" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M26 88 C26 66 36 62 50 62 C64 62 74 66 74 88 Z" fill="%234E9F3D"/></svg>',
  },
  {
    id: 'farmer_2',
    labelBn: 'তরুণ উদ্যোক্তা',
    labelEn: 'Agri Entrepreneur',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230F766E"/><circle cx="50" cy="42" r="20" fill="%23FDE68A"/><path d="M30 34 C35 22 65 22 70 34 C64 30 36 30 30 34 Z" fill="%231F2937"/><circle cx="44" cy="41" r="2.5" fill="%231F2937"/><circle cx="56" cy="41" r="2.5" fill="%231F2937"/><path d="M45 49 Q50 54 55 49" stroke="%23B45309" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M26 88 C26 68 36 64 50 64 C64 64 74 68 74 88 Z" fill="%230D9488"/></svg>',
  },
  {
    id: 'farmer_3',
    labelBn: 'নারী কৃষিবিদ',
    labelEn: 'Female Farmer',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23047857"/><circle cx="50" cy="42" r="19" fill="%23FCD34D"/><path d="M28 44 C26 26 40 18 50 18 C60 18 74 26 72 44 C66 40 60 40 50 40 C40 40 34 40 28 44 Z" fill="%23374151"/><circle cx="43" cy="41" r="2.5" fill="%231F2937"/><circle cx="57" cy="41" r="2.5" fill="%231F2937"/><path d="M45 49 Q50 53 55 49" stroke="%23B45309" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M24 88 C24 66 35 62 50 62 C65 62 76 66 76 88 Z" fill="%23059669"/></svg>',
  },
  {
    id: 'farmer_4',
    labelBn: 'স্মার্ট অ্যারো ড্রোনার',
    labelEn: 'Aero Field Tech',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231E293B"/><circle cx="50" cy="42" r="20" fill="%23FED7AA"/><rect x="32" y="24" width="36" height="10" rx="3" fill="%232563EB"/><circle cx="43" cy="41" r="2.5" fill="%231F2937"/><circle cx="57" cy="41" r="2.5" fill="%231F2937"/><path d="M44 50 Q50 54 56 50" stroke="%23C2410C" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M26 88 C26 66 36 62 50 62 C64 62 74 66 74 88 Z" fill="%233B82F6"/></svg>',
  }
];

const AVAILABLE_CROPS = [
  { id: 'rice', labelBn: 'আমন ও বোরো ধান', labelEn: 'Rice (Aman/Boro)' },
  { id: 'potato', labelBn: 'আলু', labelEn: 'Potato' },
  { id: 'wheat', labelBn: 'গম', labelEn: 'Wheat' },
  { id: 'maize', labelBn: 'ভুট্টা', labelEn: 'Maize' },
  { id: 'jute', labelBn: 'পাট', labelEn: 'Jute' },
  { id: 'mustard', labelBn: 'সরিষা', labelEn: 'Mustard' },
  { id: 'chili', labelBn: 'মরিচ', labelEn: 'Chili' },
  { id: 'tomato', labelBn: 'টমেটো', labelEn: 'Tomato' },
  { id: 'eggplant', labelBn: 'বেগুন', labelEn: 'Eggplant' },
  { id: 'mango', labelBn: 'আম', labelEn: 'Mango' },
];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  language,
  user,
  onSave,
}) => {
  const isBn = language === 'bn';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || 'Md. Nasirul Islam');
  const [district, setDistrict] = useState(user?.district || 'Rajshahi');
  const [landSize, setLandSize] = useState(user?.landSize || '3.5');
  const [experienceYears, setExperienceYears] = useState(user?.experienceYears || '12');
  const [bio, setBio] = useState(user?.bio || (isBn ? 'আধুনিক প্রযুক্তি ও সুষম সার ব্যবহারে সমৃদ্ধ খামার।' : 'Progressive farmer practicing modern climate-resilient agriculture.'));
  const [photoUrl, setPhotoUrl] = useState<string>(user?.photoUrl || '');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(
    user?.primaryCrops && user.primaryCrops.length > 0
      ? user.primaryCrops
      : ['rice', 'potato']
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Handle image upload and client-side compression to lightweight data URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage(isBn ? 'অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন।' : 'Please select a valid image file.');
      return;
    }

    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress & scale to max 320x320 for snappy local/Firestore storage
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }
        } else {
          if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPhotoUrl(compressedDataUrl);
        } else {
          setPhotoUrl(event.target?.result as string);
        }
      };
      img.onerror = () => {
        setPhotoUrl(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const toggleCrop = (cropId: string) => {
    setSelectedCrops((prev) =>
      prev.includes(cropId) ? prev.filter((c) => c !== cropId) : [...prev, cropId]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage(isBn ? 'কৃষকের পূর্ণ নাম আবশ্যক।' : 'Farmer name is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    try {
      const updated: FarmerUser = {
        name: name.trim(),
        phone: user?.phone || '01711234567',
        district,
        landSize: landSize.trim() || '1.0',
        photoUrl: photoUrl || '',
        bio: bio.trim(),
        experienceYears: experienceYears.trim(),
        primaryCrops: selectedCrops,
      };

      await onSave(updated);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err?.message || (isBn ? 'সংরক্ষণ ব্যর্থ হয়েছে।' : 'Failed to save profile.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto pt-safe pb-safe">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#1E5128] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-[#D8E9A8]" />
            <h3 className="font-bold text-base sm:text-lg">
              {isBn ? 'কৃষক প্রোফাইল সম্পাদন' : 'Edit Farmer Profile'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Error & Success Alerts */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 font-bold">
              <Check className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{isBn ? 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!' : 'Profile updated successfully!'}</span>
            </div>
          )}

          {/* Picture Upload Section */}
          <div className="bg-[#F8FAF9] p-4 rounded-xl border border-gray-200 text-center space-y-3">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-3 border-[#1E5128] overflow-hidden bg-white shadow-md flex items-center justify-center">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-14 h-14 text-gray-400" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-2 bg-[#1E5128] hover:bg-[#163e1e] text-white rounded-full shadow-lg border-2 border-white transition-transform active:scale-90 cursor-pointer"
                  title={isBn ? 'ছবি নির্বাচন করুন' : 'Change Photo'}
                >
                  <Camera className="w-4 h-4 text-[#D8E9A8]" />
                </button>
              </div>

              {/* Hidden Native File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload & Remove Actions */}
              <div className="flex items-center space-x-2 mt-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-[#1E5128] hover:bg-[#163e1e] text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isBn ? 'নতুন ছবি আপলোড' : 'Upload Photo'}</span>
                </button>

                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg border border-red-200 flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'মুছুন' : 'Remove'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Avatar Presets */}
            <div className="pt-2 border-t border-gray-200">
              <span className="text-[11px] font-semibold text-gray-600 block mb-2">
                {isBn ? 'অথবা কৃষি অবতার নির্বাচন করুন:' : 'Or choose an Agri Avatar:'}
              </span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setPhotoUrl(av.url)}
                    className={`p-1 rounded-xl border flex flex-col items-center transition-all cursor-pointer ${
                      photoUrl === av.url
                        ? 'border-[#1E5128] bg-emerald-50 ring-2 ring-[#1E5128]'
                        : 'border-gray-200 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <img
                      src={av.url}
                      alt={av.labelEn}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-[9px] font-medium text-gray-700 mt-1 truncate max-w-[65px]">
                      {isBn ? av.labelBn : av.labelEn}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Farmer Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              {isBn ? 'কৃষকের পূর্ণ নাম *' : 'Farmer Full Name *'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isBn ? 'যেমন: মো. নাসিরুল ইসলাম' : 'e.g. Md. Nasirul Islam'}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E5128] focus:border-transparent"
              required
            />
          </div>

          {/* District & Land Size Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-[#1E5128]" />
                <span>{isBn ? 'জেলা (District)' : 'District'}</span>
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E5128] bg-white cursor-pointer"
              >
                {BANGLADESH_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                {isBn ? 'মোট আবাদি জমি (একর)' : 'Cultivated Land (Acres)'}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
                placeholder="3.5"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E5128]"
              />
            </div>
          </div>

          {/* Farming Experience Years */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-[#1E5128]" />
              <span>{isBn ? 'কৃষি অভিজ্ঞতা (বছর)' : 'Farming Experience (Years)'}</span>
            </label>
            <input
              type="number"
              min="0"
              max="70"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              placeholder="12"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E5128]"
            />
          </div>

          {/* Primary Crops Multi-select */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center justify-between">
              <span className="flex items-center">
                <Sprout className="w-3.5 h-3.5 mr-1 text-[#1E5128]" />
                {isBn ? 'প্রধান চাষকৃত ফসলসমূহ' : 'Primary Crops'}
              </span>
              <span className="text-[10px] text-gray-500 font-normal">
                {isBn ? 'একাধিক নির্বাচন করুন' : 'Select multiple'}
              </span>
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {AVAILABLE_CROPS.map((crop) => {
                const isSelected = selectedCrops.includes(crop.id);
                return (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => toggleCrop(crop.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center space-x-1 ${
                      isSelected
                        ? 'bg-[#1E5128] text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-[#D8E9A8]" />}
                    <span>{isBn ? crop.labelBn : crop.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Farm Bio / Note */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              {isBn ? 'খামারের সংক্ষিপ্ত বিবরণ বা লক্ষ্য' : 'Farm Bio / Motto'}
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={isBn ? 'যেমন: আধুনিক জাত ও সমন্বিত বালাই ব্যবস্থাপনা চর্চাকারী' : 'e.g. Modern climate-smart farmer'}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E5128]"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-bold text-white bg-[#1E5128] hover:bg-[#163e1e] active:scale-95 disabled:opacity-60 rounded-xl shadow transition-all cursor-pointer flex items-center space-x-1.5"
            >
              {isSaving ? (
                <span>{isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}</span>
              ) : (
                <>
                  <Check className="w-4 h-4 text-[#D8E9A8]" />
                  <span>{isBn ? 'প্রোফাইল সংরক্ষণ করুন' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
