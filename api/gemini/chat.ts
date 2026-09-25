import { GoogleGenAI } from '@google/genai';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.VITE_GOOGLE_API_KEY ||
    process.env.GEMINI_KEY ||
    process.env.API_KEY;

  if (!apiKey) {
    console.warn('[Vercel Serverless]: No Gemini API Key found in environment variables.');
    return null;
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build-vercel',
      },
    },
  });
}

export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { message, language = 'bn', history = [] } = body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGeminiClient();

    if (ai) {
      const systemPrompt = `You are "Smart Aero Field AI Agronomist" (স্মার্ট অ্যারো ফিল্ড এআই কৃষিবিদ), a dedicated expert agricultural consultant for smallholder farmers in Bangladesh and South Asia.
Current conversation language requested: ${language === 'bn' ? 'Bengali (বাংলা)' : 'English'}.
Always respond clearly, warmly, respectfully, and practically.
When greeting in Bengali, always use "হ্যালো" (Hello) or "আসসালামু আলাইকুম / হ্যালো". Never use "নমস্কার".
Include concrete, practical steps:
- Identify pest, fungus, or disease quickly
- Provide specific chemical active ingredients (e.g., Tricyclazole, Mancozeb, Carbendazim, Imidacloprid) with exact dosage
- Provide eco-friendly organic alternative (Neem extract, wood ash, Trichoderma, hand-picking)
- Advise on water management and balanced fertilizer application (Urea, TSP, MoP, Gypsum, Zinc)
Keep paragraphs concise and bulleted for easy reading on mobile screens by farmers.`;

      const contents = [
        ...history.map((h: { role: string; text: string }) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        })),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      const candidateModels = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-3.8-flash',
        'gemini-3.1-flash-lite',
      ];
      for (const modelCandidate of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelCandidate,
            contents,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.7,
            },
          });

          if (response.text) {
            return res.status(200).json({ reply: response.text });
          }
        } catch (candidateErr: any) {
          console.warn(`[Vercel Serverless ${modelCandidate} failed]:`, candidateErr?.message || candidateErr);
        }
      }
    }

    // Intelligent fallback based on agricultural keywords when API key is missing or models are busy
    const isBn = language === 'bn';
    const lower = message.toLowerCase();

    let reply = '';
    if (lower.includes('সার') || lower.includes('fertilizer') || lower.includes('urea') || lower.includes('মাত্রা') || lower.includes('টিএসপি') || lower.includes('পটাশ')) {
      reply = isBn
        ? `🌾 **ধান ও ফসলের জন্য আদর্শ সারের মাত্রা ও প্রয়োগ সময়সূচি (বিঘা প্রতি - ৩৩ শতক):**\n\n• **ইউরিয়া:** ২৮-৩২ কেজি (৩ কিস্তিতে: চারা রোপণের ১৫-২০ দিন, ৩০-৩৫ দিন ও কাইচথোড় আসার ৫-৭ দিন আগে প্রয়োগ করুন)।\n• **টিএসপি / ডিএপি:** ১৩-১৫ কেজি (জমি তৈরির শেষ চাষে সম্পূর্ণ প্রয়োগ করুন)।\n• **এমওপি (পটাশ):** ১২-১৪ কেজি (৫০% শেষ চাষে এবং ৫০% কাইচথোড়ের সময়)।\n• **জিপসাম:** ৮-১০ কেজি ও **দস্তা (জিংক সালফেট):** ১.৫ কেজি শেষ চাষে দিন।\n\n💡 *টিপস: ইউরিয়া সার ছিটানোর সময় জমিতে পরিমিত আর্দ্রতা রাখুন। জলাবদ্ধ জমিতে সার ছিটাবেন না।*`
        : `🌾 **Standard Fertilizer Schedule (per Bigha):**\n\n• **Urea:** 28-32 kg (in 3 split doses: 15-20 days, 30-35 days, and panicle initiation).\n• **TSP / DAP:** 13-15 kg (during final land preparation).\n• **MoP (Potash):** 12-14 kg (50% basal, 50% at panicle initiation).\n• **Gypsum:** 8-10 kg & **Zinc Sulphate:** 1.5 kg at final plowing.`;
    } else if (lower.includes('পোকা') || lower.includes('pest') || lower.includes('কীটপতঙ্গ') || lower.includes('মাজরা') || lower.includes('দমন')) {
      reply = isBn
        ? `🐛 **ক্ষতিকর কীটপতঙ্গ ও মাজরা পোকা সমন্বিত দমন ব্যবস্থাপনা:**\n\n১. **প্রাকৃতিক ও জৈব দমন:**\n   • জমিতে বাঁশের কঞ্চি বা ডালপালা পুঁতে পার্চিং করুন (পাখি বসে পোকা খাবে)।\n   • ডিমের গাদা হাত দিয়ে সংগ্রহ করে ধ্বংস করুন এবং আলোক ফাঁদ ব্যবহার করুন।\n   • নিম পাতার নির্যাস (৫%) স্প্রে করুন।\n\n২. **অনুমোদিত রাসায়নিক বালাইনাশক:**\n   • মাজরা পোকা বেশি হলে: কার্বোফিউরান ৫জি (ফুরাডান বিঘায় ১.৫ কেজি) অথবা ভিরতাকো অনুমোদিত মাত্রায় দিন।\n   • স্প্রে করার জন্য: কার্বোসালফান (মার্শাল ২০ ইসি ২ মিলি/লিটার) বা কারটাপ (সানটাপ ১.২ গ্রাম/লিটার)।\n   • বাদামি গাছফড়িং (কারেন্ট পোকা) দেখা দিলে অবিলম্বে পানি শুকিয়ে পাইমেট্রোজিন (চেস ০.৬ গ্রাম/লিটার) গোড়ায় স্প্রে করুন।`
        : `🐛 **Integrated Pest Management for Crops:**\n\n1. **Cultural/Biological:** Install bird perches across the field; set up light traps; use 5% neem extract.\n2. **Approved Chemicals:** For stem borer, apply Carbofuran 5G @ 1.5kg/bigha or spray Carbosulfan (Marshal 20 EC @ 2ml/L). For brown planthopper (BPH), drain water and apply Pymetrozine (Chess 50 WG @ 0.6g/L).`;
    } else if (lower.includes('ব্লাস্ট') || lower.includes('রোগ') || lower.includes('ছত্রাক') || lower.includes('পচা') || lower.includes('ধসা') || lower.includes('blight') || lower.includes('blast')) {
      reply = isBn
        ? `🔬 **ধানের ব্লাস্ট ও ছত্রাকজনিত রোগ নিরাময় ব্যবস্থা:**\n\n• **ছত্রাকনাশক স্প্রে:** ট্রাইসাইক্লাজোল ৭৫% ডব্লিউপি (যেমন ট্রুপার / দিফা) প্রতি লিটার পানিতে ০.৭৫ গ্রাম অথবা নেটিভো ৭৫ ডব্লিউজি প্রতি লিটার পানিতে ০.৬ গ্রাম বিকেলে পুরো গাছে স্প্রে করুন। ৭-১০ দিন পর আরেকবার স্প্রে করুন।\n• **সার ব্যবস্থাপনা:** ইউরিয়া সারের উপরিপ্রয়োগ সাময়িকভাবে বন্ধ রাখুন এবং বিঘা প্রতি ৫ কেজি অতিরিক্ত পটাশ সার প্রয়োগ করুন।\n• **পানি নিষ্কাশন:** জমিতে সার্বক্ষণিক জলাবদ্ধতা পরিহার করে শিকড়ে বাতাস চলাচলের ব্যবস্থা করুন।`
        : `🔬 **Fungal Blast & Blight Protocol:**\n\n• Spray Tricyclazole 75% WP @ 0.75g/L or Nativo 75 WG @ 0.6g/L during late afternoon. Repeat after 7-10 days.\n• Suspend Urea top-dressing and apply supplemental Potash (MoP).\n• Maintain optimal drainage to aerate crop roots.`;
    } else if (lower.includes('সেচ') || lower.includes('পানি') || lower.includes('water') || lower.includes('irrigation')) {
      reply = isBn
        ? `💧 **সেচ ও এডাব্লিউডি (AWD) পানি ব্যবস্থাপনা:**\n\n• **পর্যায়ক্রমে শুকানো ও ভিজানো:** জমিতে সর্বদা পানি জমিয়ে না রেখে একটি ছিদ্রযুক্ত পাইপ দিয়ে পর্যবেক্ষণ করুন। পানির স্তর মাটির ৭-১০ সেমি নিচে নামলে ২-৩ ইঞ্চি সেচ দিন। এতে ৩০% সেচের পানি ও জ্বালানি সাশ্রয় হয়।\n• **সংকটময় সময়:** চারা রোপণের প্রথম ১০ দিন এবং কাইচথোড় থেকে ফুল ফোটা অবস্থায় জমিতে পরিমিত রস/পানি অবশ্যই বজায় রাখুন।`
        : `💧 **Irrigation & Alternate Wetting and Drying (AWD):**\n\n• Irrigate only when perched water table recedes 7-10 cm below soil surface. Saves up to 30% irrigation costs.\n• Maintain shallow standing water during early transplanting and flowering.`;
    } else {
      reply = isBn
        ? `🌾 **স্মার্ট অ্যারো ফিল্ড কৃষি বিশেষজ্ঞ পরামর্শ:**\n\nআপনার প্রশ্ন "${message}" সংক্রান্ত তথ্যের জন্য:\n১. মাটিতে সুষম সার (ইউরিয়া, টিএসপি, পটাশ, জিপসাম ও জিংক) সঠিক কিস্তিতে ব্যবহার করুন।\n২. পোকা বা রোগের প্রাথমিক লক্ষণ দেখামাত্র জৈব বা অনুমোদিত বালাইনাশক প্রয়োগ করুন।\n৩. আবহাওয়ার পূর্বাভাস অনুযায়ী সেচ ও পানি নিষ্কাশন নিশ্চিত করুন।\n\n💡 *টিপস: লাইভ জেমিনি এআই সক্রিয় করতে Vercel Environment Variables-এ \`GEMINI_API_KEY\` যুক্ত করুন।*`
        : `🌾 **Smart Aero Field Agronomist Advisory:**\n\nFor "${message}": Ensure balanced fertilizer application (NPK+Gypsum+Zinc), monitor weekly for pests and fungal diseases, and ensure proper drainage.\n\n💡 *Tip: To enable live Gemini AI models on Vercel, add \`GEMINI_API_KEY\` to your Vercel Project Environment Variables.*`;
    }

    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error('[Vercel Chat Handler Error]:', error);
    return res.status(500).json({
      reply: 'দুঃখিত, তথ্য প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।',
    });
  }
}
