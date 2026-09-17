import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  FlaskConical, 
  Leaf, 
  Layers,
  ArrowLeft,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { Language, DiseaseDiagnostic } from '../types';

interface LeafDiseaseScannerProps {
  language: Language;
  onOpenChatWithTopic?: (topic: string) => void;
  onBack?: () => void;
}

type AIEngineMode = 'dual' | 'gemini' | 'huggingface';

export const LeafDiseaseScanner: React.FC<LeafDiseaseScannerProps> = ({
  language,
  onOpenChatWithTopic,
  onBack,
}) => {
  const isBn = language === 'bn';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States: No demo image or scan by default; strictly awaits user upload/capture
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStage, setScanStage] = useState<string>('');
  const [selectedEngine, setSelectedEngine] = useState<AIEngineMode>('dual');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [selectedPlantPart, setSelectedPlantPart] = useState<string>('all');
  const [activeSolutionTab, setActiveSolutionTab] = useState<'chemical' | 'organic' | 'prevention'>('chemical');
  
  // Initially null - no default diagnostic results
  const [diagnostic, setDiagnostic] = useState<DiseaseDiagnostic | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper to compress and resize large camera photos for fast, reliable upload
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.88));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle local file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);

    try {
      const imageBase64 = await compressImage(file);
      setSelectedImage(imageBase64);
      runDiagnostics(imageBase64, selectedCrop, selectedPlantPart, selectedEngine);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const imageBase64 = reader.result as string;
          setSelectedImage(imageBase64);
          runDiagnostics(imageBase64, selectedCrop, selectedPlantPart, selectedEngine);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Load sample image to verify disease diagnosis
  const loadSampleImage = async (url: string, cropName: string, part: string) => {
    setErrorMessage(null);
    setSelectedCrop(cropName);
    setSelectedPlantPart(part);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        runDiagnostics(base64, cropName, part, selectedEngine);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error('Failed to load sample image:', e);
    }
  };

  // Run dual AI diagnosis (Hugging Face + Gemini Vision) for leaves and fruits across all crops
  const runDiagnostics = async (
    imageBase64Url: string, 
    cropToUse: string = selectedCrop, 
    partToUse: string = selectedPlantPart,
    engineToUse: AIEngineMode = selectedEngine
  ) => {
    setIsScanning(true);
    setErrorMessage(null);
    setScanProgress(20);
    setScanStage(isBn ? 'চিত্র বিশ্লেষণ ও রোগ অনুসন্ধান চলছে...' : 'Analyzing crop imagery...');

    const timer1 = setTimeout(() => {
      setScanProgress(60);
      setScanStage(isBn ? 'লক্ষণ ও প্যাথলজি যাচাই করা হচ্ছে...' : 'Verifying symptoms & pathology...');
    }, 400);

    const timer2 = setTimeout(() => {
      setScanProgress(85);
      setScanStage(isBn ? 'কৃষি পরামর্শ ও সমাধান প্রস্তুত হচ্ছে...' : 'Preparing treatment recommendations...');
    }, 850);

    try {
      const response = await fetch('/api/ai/diagnose-leaf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageBase64Url,
          cropType: cropToUse,
          plantPart: partToUse,
          engine: engineToUse,
        }),
      });

      const data = await response.json();
      clearTimeout(timer1);
      clearTimeout(timer2);
      setScanProgress(100);
      setScanStage(isBn ? 'রোগ শনাক্তকরণ সম্পন্ন!' : 'Diagnostic Verified!');

      setTimeout(() => {
        setIsScanning(false);
        if (data.success && data.data) {
          setDiagnostic(data.data);
          if (data.data.cropDetected && selectedCrop === 'All') {
            // Keep the context informative
          }
        } else {
          setErrorMessage(isBn ? 'ছবিটি বিশ্লেষণ করা যায়নি, অনুগ্রহ করে পুনরায় চেষ্টা করুন।' : 'Could not analyze image, please try again.');
        }
      }, 400);
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsScanning(false);
      setErrorMessage(isBn ? 'সার্ভার সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Connection error. Please try again.');
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      {/* Banner / Title Header */}
      <div className="bg-[#1E5128] text-white p-4 sm:p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#D8E9A8] uppercase tracking-wider">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-1 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white mr-1"
                title={isBn ? 'পেছনে যান' : 'Back'}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <Leaf className="w-4 h-4" />
            <span>{isBn ? 'সব ফসলের পাতা ও ফলের রোগ নির্ণয়' : 'Universal Crop Disease Diagnostics'}</span>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-black">
          {isBn ? 'ফসলের পাতা ও ফলের রোগ শনাক্তকরণ' : 'Crop Disease & Pest Diagnostics'}
        </h2>
        <p className="text-xs sm:text-sm text-green-100 mt-1">
          {isBn 
            ? 'আক্রান্ত পাতা বা ফলের ছবি আপলোড করে তাৎক্ষণিক রোগ শনাক্ত করুন ও সঠিক সমাধান জানুন।' 
            : 'Upload a photo of the affected crop leaf or fruit to instantly identify diseases and receive expert remedies.'}
        </p>
      </div>

      {/* Part & Crop Selection Controls Bar */}
      <div className="bg-[#F9FAF8] border-b border-gray-200 px-4 py-3 space-y-2.5">
        {/* Plant Part Selector (Leaf vs Fruit vs Stem) */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-gray-600 mr-1 flex items-center space-x-1">
            <span>🌿</span>
            <span>{isBn ? 'আক্রান্ত অংশ:' : 'Part:'}</span>
          </span>
          {[
            { id: 'all', nameBn: 'সব অংশ (স্বয়ংক্রিয়)', nameEn: 'All Parts (Auto)' },
            { id: 'leaf', nameBn: '🍃 পাতা (Leaf)', nameEn: '🍃 Leaf' },
            { id: 'fruit', nameBn: '🍎 ফল (Fruit)', nameEn: '🍎 Fruit' },
            { id: 'stem', nameBn: '🌱 কাণ্ড ও কুঁড়ি', nameEn: '🌱 Stem/Bud' },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSelectedPlantPart(p.id);
                if (selectedImage) runDiagnostics(selectedImage, selectedCrop, p.id, selectedEngine);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedPlantPart === p.id
                  ? 'bg-[#1E5128] text-white shadow-2xs font-bold ring-1 ring-emerald-700'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {isBn ? p.nameBn : p.nameEn}
            </button>
          ))}
        </div>

        {/* Row 3: Multi-Crop Selector */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gray-100">
          <span className="text-[11px] font-bold text-gray-600 mr-1">
            {isBn ? 'ফসল নির্বাচন:' : 'Target Crop:'}
          </span>
          {[
            { id: 'All', nameBn: '🌾 সব ফসল (Auto)', nameEn: '🌾 All Crops (Auto)' },
            { id: 'Mango', nameBn: '🥭 আম', nameEn: 'Mango' },
            { id: 'Tomato', nameBn: '🍅 টমেটো', nameEn: 'Tomato' },
            { id: 'Eggplant', nameBn: '🍆 বেগুন', nameEn: 'Eggplant' },
            { id: 'Chili', nameBn: '🌶️ মরিচ', nameEn: 'Chili' },
            { id: 'Rice', nameBn: '🌾 ধান', nameEn: 'Rice' },
            { id: 'Potato', nameBn: '🥔 আলু', nameEn: 'Potato' },
            { id: 'Citrus', nameBn: '🍋 লেবু', nameEn: 'Lemon' },
            { id: 'Banana', nameBn: '🍌 কলা', nameEn: 'Banana' },
            { id: 'Guava', nameBn: '🍈 পেয়ারা ও পেঁপে', nameEn: 'Guava/Papaya' },
            { id: 'Corn', nameBn: '🌽 ভুট্টা ও গম', nameEn: 'Corn/Wheat' },
            { id: 'Cucurbit', nameBn: '🥒 শসা ও লাউ', nameEn: 'Cucurbits' },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSelectedCrop(c.id);
                if (selectedImage) runDiagnostics(selectedImage, c.id, selectedPlantPart, selectedEngine);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                selectedCrop === c.id
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-400 font-bold'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {isBn ? c.nameBn : c.nameEn}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {/* Upload & Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          
          {/* Left: Upload / Camera UI area */}
          <div className="space-y-3">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-400 bg-emerald-50/40 hover:bg-emerald-50/80 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center min-h-[200px]"
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={handleFileChange}
                className="hidden" 
              />
              
              <div className="w-14 h-14 rounded-2xl bg-white shadow-md text-[#1E5128] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-emerald-100">
                <Upload className="w-7 h-7 text-[#4E9F3D]" />
              </div>

              <span className="text-sm font-bold text-gray-900 group-hover:text-[#1E5128]">
                {isBn ? 'আক্রান্ত পাতা বা ফলের ছবি আপলোড করুন' : 'Upload Infected Leaf or Fruit Photo'}
              </span>
              <span className="text-xs text-gray-600 mt-1 flex items-center gap-1 font-medium">
                <Camera className="w-3.5 h-3.5 text-gray-400" />
                {isBn ? 'অথবা ক্যামেরা দিয়ে পাতা বা ফলের সরাসরি ছবি তুলুন' : 'or take live camera photo of leaf or fruit'}
              </span>
              <span className="text-[10px] text-gray-600 mt-2 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                {isBn ? 'সব ধরণের ফসল ও ফল উপযোগী • JPG, PNG — সর্বোচ্চ ১০ মেগাবাইট' : 'Supports all crops & fruits • JPG, PNG — Max 10MB'}
              </span>
            </div>

            {/* Clear photo guideline box and quick test samples */}
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/80 text-xs text-gray-700 space-y-2.5">
              <div className="flex items-start space-x-2.5">
                <Leaf className="w-4 h-4 text-[#1E5128] mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-gray-900">
                    {isBn ? 'নির্ভুল পরীক্ষার জন্য নির্দেশিকা:' : 'Guidelines for accurate detection:'}
                  </p>
                  <p className="text-gray-600 text-[11px] leading-relaxed">
                    {isBn 
                      ? 'আক্রান্ত পাতা বা ফলের স্পষ্ট, আলোযুক্ত ও ফোকাসড ছবি তুলুন যাতে লক্ষণসমূহ স্পষ্টভাবে শনাক্ত করা যায়।' 
                      : 'Take a clear, focused, well-lit photo of the affected leaf or fruit showing disease spots.'}
                  </p>
                </div>
              </div>

              {/* Instant sample verification buttons */}
              <div className="pt-2 border-t border-emerald-200/60">
                <span className="text-[11px] font-bold text-gray-700 block mb-1.5">
                  {isBn ? 'বা তাৎক্ষণিক নমুনা ছবি দিয়ে যাচাই করুন:' : 'Or test with sample photos:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => loadSampleImage('/images/leaf_sample.jpg', 'Rice', 'leaf')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-lg border border-emerald-300 shadow-2xs transition-colors"
                  >
                    <span>🌾</span>
                    <span>{isBn ? 'ধানের পাতা ব্লাস্ট নমুনা' : 'Rice Blast Leaf'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSampleImage('/images/sample_disease.jpg', 'Tomato', 'fruit')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-lg border border-amber-300 shadow-2xs transition-colors"
                  >
                    <span>🍎</span>
                    <span>{isBn ? 'টমেটো ফল পচা নমুনা' : 'Tomato Fruit Rot'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-bold underline ml-2"
                >
                  {isBn ? 'পুনরায় চেষ্টা' : 'Retry'}
                </button>
              </div>
            )}
          </div>

          {/* Right: Leaf Photo with Laser Scanner Overlay or Clean Awaiting State */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video sm:aspect-square flex items-center justify-center border-2 border-gray-200 shadow-inner">
            {selectedImage ? (
              <>
                <img 
                  src={selectedImage} 
                  alt="Leaf Sample Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />

                {/* Laser scanning beam */}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-laser-scan absolute" />
                    <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[1px] flex items-center justify-center p-4">
                      <div className="bg-black/85 text-white px-4 py-3 rounded-xl text-xs font-bold flex flex-col items-center space-y-2 border border-cyan-400/50 shadow-2xl max-w-[280px] text-center">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                          <span>{scanStage}</span>
                        </div>
                        <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full transition-all duration-300"
                            style={{ width: `${scanProgress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-300 font-normal">
                          Hugging Face + Gemini Dual AI ({scanProgress}%)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {!isScanning && diagnostic && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-[11px] font-medium flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-semibold">{diagnostic?.diseaseNameBn || diagnostic?.diseaseName}</span>
                    </div>
                    {diagnostic?.aiEngines?.ensembleConfidence && (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/40">
                        {diagnostic.aiEngines.ensembleConfidence}% Confidence
                      </span>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* Clean empty state awaiting user upload */
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center text-center p-6 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-3 shadow-inner">
                  <ImageIcon className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-xs font-semibold text-gray-300">
                  {isBn ? 'কোন ছবি নির্বাচিত হয়নি' : 'No photo uploaded yet'}
                </p>
                <p className="text-[11px] text-gray-500 mt-1 max-w-[200px]">
                  {isBn ? 'বামপাশের আপলোড বক্সে ক্লিক করে পাতা বা ফলের ছবি দিন' : 'Click upload on the left to scan your affected crop'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Diagnosis Results Display */}
        {diagnostic && (
          <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
            {/* Warning if image is not a recognized plant specimen */}
            {diagnostic.isCropSpecimen === false && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 text-amber-900 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">
                    {isBn ? 'সতর্কতা: ছবিতে কোনো ফসলের পাতা বা ফল শনাক্ত হয়নি' : 'Notice: Unclear Agricultural Crop Specimen'}
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {isBn
                      ? 'আপলোডকৃত ছবিতে কোনো সুস্পষ্ট ফসলের পাতা, ফল বা কাণ্ড দেখা যাচ্ছে না। শতভাগ সঠিক ও নির্ভুল রোগ নির্ণয়ের জন্য আক্রান্ত পাতা বা ফলের একটি পরিষ্কার ও আলোকিত ছবি আপলোড করুন।'
                      : 'The uploaded image does not clearly depict a recognized crop leaf, fruit, or plant. For accurate diagnosis, please upload a clear, focused photo of the affected crop.'}
                  </p>
                </div>
              </div>
            )}

            {/* 1. Possible Disease Title Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border font-bold text-sm ${
                diagnostic.severity === 'None'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {diagnostic.severity === 'None' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                )}
                <span>
                  {isBn 
                    ? (diagnostic.severity === 'None' ? 'ফসল নিরীক্ষা: ' : 'শনাক্তকৃত রোগ: ') 
                    : (diagnostic.severity === 'None' ? 'Health Status: ' : 'Diagnosed Issue: ')}
                  {isBn ? diagnostic.diseaseNameBn : diagnostic.diseaseName}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Crop Badge */}
                {(diagnostic.cropDetected || diagnostic.cropDetectedBn) && (
                  <div className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    🌾 {isBn ? (diagnostic.cropDetectedBn || diagnostic.cropDetected) : (diagnostic.cropDetected || diagnostic.cropDetectedBn)}
                  </div>
                )}

                {/* Plant Part Badge (Leaf vs Fruit vs Stem) */}
                {(diagnostic.plantPartDetected || diagnostic.plantPartDetectedBn) && (
                  <div className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300 flex items-center space-x-1">
                    <span>{diagnostic.plantPartDetected === 'Fruit' ? '🍎' : '🍃'}</span>
                    <span>
                      {isBn 
                        ? `অংশ: ${diagnostic.plantPartDetectedBn || (diagnostic.plantPartDetected === 'Fruit' ? 'ফল' : 'পাতা')}` 
                        : `Part: ${diagnostic.plantPartDetected || 'Leaf'}`}
                    </span>
                  </div>
                )}

                {/* Severity Badge */}
                <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {isBn ? 'তীব্রতা: ' : 'Severity: '} 
                  {isBn 
                    ? (diagnostic.severity === 'High' ? 'উচ্চ' : diagnostic.severity === 'Moderate' ? 'মাঝারি' : diagnostic.severity === 'Moderate to High' ? 'মাঝারি থেকে উচ্চ' : diagnostic.severity === 'Low' ? 'কম' : diagnostic.severity === 'None' ? 'নেই' : diagnostic.severity)
                    : (diagnostic.severity === 'উচ্চ' ? 'High' : diagnostic.severity === 'মাঝারি' ? 'Moderate' : diagnostic.severity === 'কম' ? 'Low' : diagnostic.severity === 'নেই' ? 'None' : diagnostic.severity)}
                </div>
              </div>
            </div>

            {/* 2. Disease Description (Purple Box matching screenshot 9) */}
            <div className="bg-[#EAE4F8] border border-[#D5C7F5] rounded-xl p-4 text-gray-900">
              <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-1">
                {isBn ? 'রোগের বিবরণ:' : 'Disease Description:'}
              </h4>
              <p className="text-sm font-medium leading-relaxed">
                {isBn ? (diagnostic.descriptionBn || diagnostic.description) : (diagnostic.description || diagnostic.descriptionBn)}
              </p>
            </div>

            {/* 3. Symptoms Card (Amber / Yellow box matching screenshot 9) */}
            <div className="bg-[#FFF4D0] border border-[#FDE08B] rounded-xl p-4 text-gray-900">
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-2 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-amber-800" />
                <span>{isBn ? 'প্রধান লক্ষণসমূহ:' : 'Key Symptoms:'}</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm font-medium text-gray-800">
                {((isBn ? (diagnostic.symptomsBn || diagnostic.symptoms) : (diagnostic.symptoms || diagnostic.symptomsBn)) || []).map((sym, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-700 font-bold leading-tight">•</span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Solutions Tabs Card (White box with tabs matching screenshot 9) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1">
                  <ShieldCheck className="w-4 h-4 text-[#1E5128]" />
                  <span>{isBn ? 'সমাধান ও প্রতিকার' : 'Prescription & Solutions'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenChatWithTopic?.(`How to treat ${diagnostic.diseaseName} (${diagnostic.diseaseNameBn}) in my field? What exact fungicide dosage should I spray?`)}
                  className="text-xs font-semibold text-[#1E5128] hover:underline flex items-center space-x-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{isBn ? 'কৃষিবিদের সাহায্য নিন' : 'Ask Agronomist'}</span>
                </button>
              </div>

              {/* Segmented Pill Tabs */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setActiveSolutionTab('chemical')}
                  className={`text-[11px] sm:text-xs py-2 px-1 sm:px-3 rounded-lg font-bold transition-all flex items-center justify-center text-center leading-tight ${
                    activeSolutionTab === 'chemical'
                      ? 'bg-[#4E9F3D] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                  <span className="truncate">{isBn ? 'রাসায়নিক' : 'Chemical'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSolutionTab('organic')}
                  className={`text-[11px] sm:text-xs py-2 px-1 sm:px-3 rounded-lg font-bold transition-all flex items-center justify-center text-center leading-tight ${
                    activeSolutionTab === 'organic'
                      ? 'bg-[#4E9F3D] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Leaf className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                  <span className="truncate">{isBn ? 'জৈব প্রতিকার' : 'Organic'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSolutionTab('prevention')}
                  className={`text-[11px] sm:text-xs py-2 px-1 sm:px-3 rounded-lg font-bold transition-all flex items-center justify-center text-center leading-tight ${
                    activeSolutionTab === 'prevention'
                      ? 'bg-[#4E9F3D] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                  <span className="truncate">{isBn ? 'প্রতিরোধ' : 'Prevention'}</span>
                </button>
              </div>

              {/* Tab Content Box (Green tinted light container like screenshot 9) */}
              <div className="bg-[#E7F8ED] border border-[#BDE8CB] rounded-xl p-3.5 text-gray-900">
                {activeSolutionTab === 'chemical' && (
                  <div className="space-y-2">
                    <div className="font-bold text-xs sm:text-sm text-emerald-950 flex items-center space-x-1">
                      <span>{isBn ? 'অনুমোদিত রাসায়নিক বালাইনাশক ও সঠিক মাত্রা:' : 'Approved Chemical Fungicides & Accurate Dosages:'}</span>
                    </div>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-900">
                      {diagnostic.solutions.chemical.map((sol, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeSolutionTab === 'organic' && (
                  <div className="space-y-2">
                    <div className="font-bold text-xs sm:text-sm text-emerald-950">
                      {isBn ? 'পরিবেশবান্ধব জৈব প্রতিকার:' : 'Eco-friendly Organic Remedies:'}
                    </div>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-900">
                      {diagnostic.solutions.organic.map((sol, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <Leaf className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeSolutionTab === 'prevention' && (
                  <div className="space-y-2">
                    <div className="font-bold text-xs sm:text-sm text-emerald-950">
                      {isBn ? 'ভবিষ্যৎ প্রতিরোধের উপায়:' : 'Preventive Agronomy Protocol:'}
                    </div>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-900">
                      {diagnostic.solutions.prevention.map((sol, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

