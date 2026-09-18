import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  MessageSquare, 
  RefreshCw,
  Globe
} from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { QUICK_PROMPTS_EN, QUICK_PROMPTS_BN } from '../data/bangladeshAgriData';

interface GeminiChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialPrompt?: string | null;
}

export const GeminiChatbotDrawer: React.FC<GeminiChatbotDrawerProps> = ({
  isOpen,
  onClose,
  language,
  initialPrompt,
}) => {
  const isBn = language === 'bn';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [chatLanguage, setChatLanguage] = useState<Language>(language);

  // Sync initial greeting based on language
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: isBn
        ? 'নমস্কার / আসসালামু আলাইকুম! আমি আপনার স্মার্ট অ্যারো ফিল্ড এআই কৃষিবিদ। ফসলের রোগ, সার ও কীটনাশকের সঠিক মাত্রা, সেচ বা আবহাওয়া বিষয়ক যেকোনো প্রশ্ন জিজ্ঞেস করতে পারেন।'
        : 'Hello! I am your Smart Aero Field AI Agronomist. Ask me any question regarding crop diseases, exact fertilizer dosage, pest outbreaks, or localized weather warnings.',
      timestamp: 'Just now',
    },
  ]);

  // Update greeting if language toggled and only 1 message
  useEffect(() => {
    setChatLanguage(language);
    if (messages.length <= 1) {
      setMessages([
        {
          id: 'init-1',
          sender: 'bot',
          text: language === 'bn'
            ? 'নমস্কার / আসসালামু আলাইকুম! আমি আপনার স্মার্ট অ্যারো ফিল্ড এআই কৃষিবিদ। ফসলের রোগ, সার ও কীটনাশকের সঠিক মাত্রা, সেচ বা আবহাওয়া বিষয়ক যেকোনো প্রশ্ন জিজ্ঞেস করতে পারেন।'
            : 'Hello! I am your Smart Aero Field AI Agronomist. Ask me any question regarding crop diseases, exact fertilizer dosage, pest outbreaks, or localized weather warnings.',
          timestamp: 'Just now',
        },
      ]);
    }
  }, [language]);

  // Handle external topic triggers
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Build history for context
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: chatLanguage,
          history: historyPayload,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.reply || (chatLanguage === 'bn' ? 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি।' : 'No answer available.');

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      console.warn('Chat request failed, using intelligent agronomy fallback:', err);
      const fallbackText = chatLanguage === 'bn'
        ? 'কৃষি বিশেষজ্ঞ পরামর্শ: জমিতে রোগ বা পোকামাকড় আক্রমণ প্রতিরোধে নিয়মিত জমির পানি নিষ্কাশন ও অনুমোদিত মাত্রায় ছত্রাকনাশক (যেমন ট্রাইসাইক্লাজোল ৭৫ ডব্লিউপি ০.৭৫ গ্রাম/লিটার) স্প্রে করুন। অতিরিক্ত ইউরিয়া সার ব্যবহার করবেন না।'
        : 'Agronomist Advisory: Ensure proper field drainage to halt fungal spore germination. For rice blast or leaf blight, apply recommended systemic fungicide (Tricyclazole 75% WP @ 0.75g/L). Maintain balanced potash application.';

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = chatLanguage === 'bn' ? QUICK_PROMPTS_BN : QUICK_PROMPTS_EN;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px] transition-opacity">
      {/* Sliding Drawer Container */}
      <div className="w-full sm:max-w-md bg-[#F5F7F8] h-full shadow-2xl flex flex-col border-l border-gray-200 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="bg-[#1E5128] text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/30 text-yellow-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  {chatLanguage === 'bn' ? 'স্মার্ট অ্যারো ফিল্ড এআই কৃষিবিদ' : 'Smart Aero Field AI Agronomist'}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-green-200">
                {chatLanguage === 'bn' ? 'Google Gemini 3.8 Powered' : 'Powered by Google Gemini 3.8'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Switch within Chat */}
            <button
              id="chat-lang-toggle-btn"
              type="button"
              onClick={() => setChatLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'))}
              className="bg-white/10 hover:bg-white/20 text-xs px-2 py-1 rounded-md border border-white/20 text-white font-medium flex items-center space-x-1"
              title="Toggle Chat Language"
            >
              <Globe className="w-3 h-3 text-[#D8E9A8]" />
              <span>{chatLanguage === 'bn' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Close Button */}
            <button
              id="close-chat-drawer-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-full bg-[#1E5128] text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm mt-0.5">
                  <Bot className="w-4 h-4 text-[#D8E9A8]" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#1E5128] text-white rounded-br-none'
                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-green-200' : 'text-gray-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-gray-500 text-xs bg-white p-3 rounded-2xl border border-gray-200 w-max shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-[#1E5128]" />
              <span>{chatLanguage === 'bn' ? 'এআই কৃষিবিদ চিন্তা করছে...' : 'Agronomist is drafting advice...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Pills */}
        <div className="px-3 pt-2 pb-1 bg-white border-t border-gray-200/80">
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center">
            <Sparkles className="w-3 h-3 mr-1 text-[#4E9F3D]" />
            <span>{chatLanguage === 'bn' ? 'দ্রুত পরামর্শ প্রশ্ন' : 'Quick Prompt Suggestions'}</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="whitespace-nowrap text-[11px] font-semibold bg-[#EAF5EC] hover:bg-[#d8eedb] active:bg-[#c9e7cc] text-[#1E5128] px-2.5 py-1 rounded-full border border-[#BDE8CB] transition-colors flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Field */}
        <div className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2">
          <input
            id="chat-user-input"
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              chatLanguage === 'bn'
                ? 'ফসলের সমস্যা বা সার নিয়ে প্রশ্ন লিখুন...'
                : 'Ask about crop care, fertilizer, disease...'
            }
            disabled={loading}
            className="flex-1 bg-[#F5F7F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1E5128] focus:border-transparent transition-all"
          />

          <button
            id="send-chat-message-btn"
            type="button"
            onClick={() => handleSendMessage()}
            disabled={loading || !inputMessage.trim()}
            className="w-10 h-10 rounded-xl bg-[#1E5128] hover:bg-[#163e1e] active:scale-95 disabled:opacity-50 text-white flex items-center justify-center flex-shrink-0 shadow transition-all cursor-pointer"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
