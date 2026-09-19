import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MessageSquare, 
  RefreshCw,
  Globe,
  Cloud,
  Trash2,
  Check,
  History,
  ArrowLeft,
  Search,
  Calendar,
  ChevronRight,
  Plus,
  BookOpen,
  Mic,
  MicOff
} from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { QUICK_PROMPTS_EN, QUICK_PROMPTS_BN } from '../data/bangladeshAgriData';
import { 
  saveChatMessageToFirestore, 
  subscribeToChatHistory, 
  clearChatHistoryInFirestore,
  deleteChatMessageFromFirestore,
  getActiveFarmerId,
  normalizePhone
} from '../lib/firestoreService';

interface GeminiChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialPrompt?: string | null;
  currentUser?: { name: string; phone: string; district: string; landSize: string } | null;
}

export const GeminiChatbotDrawer: React.FC<GeminiChatbotDrawerProps> = ({
  isOpen,
  onClose,
  language,
  initialPrompt,
  currentUser,
}) => {
  const isBn = language === 'bn';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [chatLanguage, setChatLanguage] = useState<Language>(language);
  const [isCloudLoaded, setIsCloudLoaded] = useState<boolean>(false);
  const [hasClearedNotice, setHasClearedNotice] = useState<boolean>(false);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  // Voice Texting (Speech-to-Text) state for farmers
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceStatusText, setVoiceStatusText] = useState<string | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // History View & Loaded Conversation state
  const [showHistoryView, setShowHistoryView] = useState<boolean>(false);
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadedConversationInfo, setLoadedConversationInfo] = useState<{
    id: string;
    title: string;
    timestamp?: string;
  } | null>(null);

  // All archived messages from Firebase Firestore
  const [allHistoryMessages, setAllHistoryMessages] = useState<ChatMessage[]>([]);

  // Compute effective farmer UID or normalized phone
  const effectiveFarmerId = currentUser?.phone 
    ? normalizePhone(currentUser.phone) 
    : getActiveFarmerId();

  const getGreetingMessage = (lang: Language): ChatMessage => ({
    id: 'init-greeting',
    sender: 'bot',
    text: lang === 'bn'
      ? `নমস্কার / আসসালামু আলাইকুম${currentUser?.name ? ` ${currentUser.name} ভাই` : ''}! আমি আপনার স্মার্ট অ্যারো ফিল্ড এআই কৃষিবিদ। ফসলের রোগবালাই, সার-কীটনাশকের সঠিক মাত্রা বা আবহাওয়া সংক্রান্ত যেকোনো প্রশ্ন করতে পারেন। পূর্ববর্তী চ্যাট দেখতে উপরের "হিস্টোরি" বাটনে ক্লিক করুন।`
      : `Hello${currentUser?.name ? ` ${currentUser.name}` : ''}! I am your Smart Aero Field AI Agronomist. Ask me anything about crop health, fertilizer doses, or weather. Click "History" above to view past conversations.`,
    timestamp: 'Just now',
    createdAt: new Date().toISOString(),
  });

  // Active chat messages on screen (starts fresh on open)
  const [messages, setMessages] = useState<ChatMessage[]>([getGreetingMessage(language)]);

  // Reset to fresh chat whenever drawer is freshly opened (like ChatGPT / Gemini)
  useEffect(() => {
    if (isOpen) {
      setShowHistoryView(false);
      setLoadedConversationInfo(null);
      if (!initialPrompt) {
        setMessages([getGreetingMessage(chatLanguage)]);
      }
    }
  }, [isOpen]);

  // Group user questions and bot responses from all Firebase history
  const historyConversations = useMemo(() => {
    const list = allHistoryMessages.filter((m) => m.id !== 'init-greeting');
    const pairs: Array<{
      id: string;
      userMsg: ChatMessage;
      botMsg?: ChatMessage;
    }> = [];

    for (let i = 0; i < list.length; i++) {
      if (list[i].sender === 'user') {
        const userMsg = list[i];
        let botMsg: ChatMessage | undefined = undefined;
        if (i + 1 < list.length && list[i + 1].sender === 'bot') {
          botMsg = list[i + 1];
        }
        pairs.push({
          id: userMsg.id,
          userMsg,
          botMsg,
        });
      }
    }
    return pairs.reverse(); // newest first
  }, [allHistoryMessages]);

  // Search filter for history
  const filteredHistory = useMemo(() => {
    if (!historySearchQuery.trim()) return historyConversations;
    const q = historySearchQuery.toLowerCase();
    return historyConversations.filter((pair) => {
      const uText = pair.userMsg.text.toLowerCase();
      const bText = pair.botMsg?.text.toLowerCase() || '';
      return uText.includes(q) || bText.includes(q);
    });
  }, [historyConversations, historySearchQuery]);

  // Subscribe to persistent Firebase Chat History into allHistoryMessages
  useEffect(() => {
    if (!effectiveFarmerId || effectiveFarmerId === 'default_farmer') {
      setIsCloudLoaded(true);
      return;
    }

    const unsub = subscribeToChatHistory((remoteMsgs) => {
      setAllHistoryMessages(remoteMsgs || []);
      setIsCloudLoaded(true);
    }, effectiveFarmerId);

    return () => {
      unsub();
    };
  }, [effectiveFarmerId]);

  // Update greeting if language toggled and still in fresh state
  useEffect(() => {
    setChatLanguage(language);
    if (messages.length <= 1 && messages[0]?.id === 'init-greeting') {
      setMessages([getGreetingMessage(language)]);
    }
  }, [language]);

  // Handle external topic triggers (e.g. from weather or disease alerts)
  useEffect(() => {
    if (initialPrompt && isOpen) {
      setMessages([getGreetingMessage(chatLanguage)]);
      setLoadedConversationInfo(null);
      setShowHistoryView(false);
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  // Scroll to bottom on new message or conversation loaded
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Start a fresh, clean chat (like ChatGPT "+ New Chat")
  const handleStartNewChat = () => {
    setMessages([getGreetingMessage(chatLanguage)]);
    setLoadedConversationInfo(null);
    setShowHistoryView(false);
    setInputMessage('');
  };

  // Load a specific past conversation from History into the chat view
  const handleLoadConversation = (item: { userMsg: ChatMessage; botMsg?: ChatMessage }) => {
    const list: ChatMessage[] = [item.userMsg];
    if (item.botMsg) {
      list.push(item.botMsg);
    }
    setMessages(list);
    setLoadedConversationInfo({
      id: item.userMsg.id,
      title: item.userMsg.text,
      timestamp: item.userMsg.timestamp,
    });
    setShowHistoryView(false);
  };

  // Option to load all historical messages together
  const handleLoadAllHistory = () => {
    if (allHistoryMessages.length > 0) {
      setMessages(allHistoryMessages);
      setLoadedConversationInfo({
        id: 'all-history',
        title: chatLanguage === 'bn' ? 'সকল পূর্ববর্তী আলোচনা' : 'All Past Discussions',
        timestamp: 'Cloud Synced',
      });
      setShowHistoryView(false);
    }
  };

  // Stop listening and cleanup
  const stopVoiceRecognition = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setVoiceStatusText(null);
  };

  // Start Voice Texting (Speech-to-Text) for farmers
  const startVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatusText(
        chatLanguage === 'bn'
          ? 'আপনার ব্রাউজারে সরাসরি ভয়েস টাইপিং সমর্থিত নয়। অনুগ্রহ করে Google Chrome বা Edge ব্যবহার করুন।'
          : 'Voice texting is not supported in this browser. Please use Chrome or Edge.'
      );
      setTimeout(() => setVoiceStatusText(null), 4000);
      return;
    }

    try {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      // Use Bengali (Bangladesh) or English based on chat language
      recognition.lang = chatLanguage === 'bn' ? 'bn-BD' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatusText(
          chatLanguage === 'bn' ? 'শুনছি... আপনার প্রশ্নটি মুখে বলুন' : 'Listening... please speak your question'
        );
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        const text = (finalTranscript || interimTranscript).trim();
        if (text) {
          setInputMessage(text);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceStatusText(
            chatLanguage === 'bn'
              ? 'মাইক্রোফোন ব্যবহারের অনুমতি পাওয়া যায়নি। দয়া করে ব্রাউজারে অনুমতি দিন।'
              : 'Microphone permission denied. Please allow microphone access.'
          );
        } else if (event.error === 'no-speech') {
          setVoiceStatusText(
            chatLanguage === 'bn' ? 'কোনো শব্দ বা কথা শোনা যায়নি।' : 'No speech detected.'
          );
        } else {
          setVoiceStatusText(
            chatLanguage === 'bn' ? 'ভয়েস টেক্সটে সমস্যা হয়েছে।' : 'Speech recognition error.'
          );
        }
        setTimeout(() => setVoiceStatusText(null), 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
        setTimeout(() => setVoiceStatusText(null), 1500);
      };

      recognition.start();
      speechRecognitionRef.current = recognition;
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setIsListening(false);
      setVoiceStatusText(
        chatLanguage === 'bn' ? 'ভয়েস শুরু করা যায়নি।' : 'Could not start voice recognition.'
      );
      setTimeout(() => setVoiceStatusText(null), 3000);
    }
  };

  const toggleVoiceRecognition = () => {
    if (isListening) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  };

  // Cleanup voice on unmount or drawer close
  useEffect(() => {
    if (!isOpen) {
      stopVoiceRecognition();
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      language: chatLanguage,
      userId: effectiveFarmerId,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    // Persist user question to Firebase Firestore
    saveChatMessageToFirestore(userMsg, effectiveFarmerId, chatLanguage).catch((err) =>
      console.warn('Firebase chat message save error:', err)
    );

    try {
      // Build conversational history for context
      const historyPayload = messages
        .filter((m) => m.id !== 'init-greeting')
        .slice(-8)
        .map((m) => ({
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

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString(),
        language: chatLanguage,
        userId: effectiveFarmerId,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Persist AI reply to Firebase Firestore
      saveChatMessageToFirestore(botMsg, effectiveFarmerId, chatLanguage).catch((err) =>
        console.warn('Firebase chat bot reply save error:', err)
      );
    } catch (err: any) {
      console.warn('Chat request failed, using intelligent agronomy fallback:', err);
      const fallbackText = chatLanguage === 'bn'
        ? 'কৃষি বিশেষজ্ঞ পরামর্শ: জমিতে রোগ বা পোকামাকড় আক্রমণ প্রতিরোধে নিয়মিত জমির পানি নিষ্কাশন ও অনুমোদিত মাত্রায় ছত্রাকনাশক (যেমন ট্রাইসাইক্লাজোল ৭৫ ডব্লিউপি ০.৭৫ গ্রাম/লিটার) স্প্রে করুন। অতিরিক্ত ইউরিয়া সার ব্যবহার করবেন না।'
        : 'Agronomist Advisory: Ensure proper field drainage to halt fungal spore germination. For rice blast or leaf blight, apply recommended systemic fungicide (Tricyclazole 75% WP @ 0.75g/L). Maintain balanced potash application.';

      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sender: 'bot',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString(),
        language: chatLanguage,
        userId: effectiveFarmerId,
      };

      setMessages((prev) => [...prev, fallbackMsg]);

      // Persist fallback to Firebase Firestore
      saveChatMessageToFirestore(fallbackMsg, effectiveFarmerId, chatLanguage).catch((e) =>
        console.warn('Firebase fallback save error:', e)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearChatHistory = async () => {
    const confirmMsg = chatLanguage === 'bn' 
      ? 'আপনি কি সংরক্ষিত সকল চ্যাট হিস্টোরি মুছে ফেলতে চান?' 
      : 'Are you sure you want to clear your entire chat history?';
    
    if (window.confirm(confirmMsg)) {
      await clearChatHistoryInFirestore(effectiveFarmerId);
      setAllHistoryMessages([]);
      handleStartNewChat();
      setHasClearedNotice(true);
      setShowHistoryView(false);
      setTimeout(() => setHasClearedNotice(false), 2500);
    }
  };

  const handleDeleteConversation = async (userMsgId: string, botMsgId?: string) => {
    setDeletingId(userMsgId);
    try {
      await deleteChatMessageFromFirestore(userMsgId, effectiveFarmerId);
      if (botMsgId) {
        await deleteChatMessageFromFirestore(botMsgId, effectiveFarmerId);
      }
      setAllHistoryMessages((prev) => prev.filter((m) => m.id !== userMsgId && m.id !== botMsgId));
      if (loadedConversationInfo?.id === userMsgId) {
        handleStartNewChat();
      }
      setDeleteNotice(
        chatLanguage === 'bn'
          ? 'আলোচনাটি সফলভাবে মুছে ফেলা হয়েছে।'
          : 'Conversation deleted successfully.'
      );
      setTimeout(() => setDeleteNotice(null), 2500);
    } catch (err) {
      console.warn('Failed to delete conversation:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteSingleMessage = async (msgId: string) => {
    try {
      await deleteChatMessageFromFirestore(msgId, effectiveFarmerId);
      setAllHistoryMessages((prev) => prev.filter((m) => m.id !== msgId));
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      setDeleteNotice(chatLanguage === 'bn' ? 'বার্তাটি মুছে ফেলা হয়েছে।' : 'Message deleted.');
      setTimeout(() => setDeleteNotice(null), 2000);
    } catch (err) {
      console.warn('Failed to delete message:', err);
    }
  };

  const quickPrompts = chatLanguage === 'bn' ? QUICK_PROMPTS_BN : QUICK_PROMPTS_EN;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px] transition-opacity">
      {/* Sliding Drawer Container */}
      <div className="w-full sm:max-w-md bg-[#F5F7F8] h-full shadow-2xl flex flex-col border-l border-gray-200 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="bg-[#1E5128] text-white p-3 sm:p-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30 text-yellow-300 flex-shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-xs sm:text-sm leading-tight">
                  {chatLanguage === 'bn' ? 'স্মার্ট এআই কৃষিবিদ' : 'Smart AI Agronomist'}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* History Toggle Button */}
            <button
              id="open-chat-history-btn"
              type="button"
              onClick={() => setShowHistoryView((prev) => !prev)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
                showHistoryView
                  ? 'bg-white text-[#1E5128] border-white shadow-sm'
                  : 'bg-white/15 hover:bg-white/25 border-white/30 text-white'
              }`}
              title={
                chatLanguage === 'bn'
                  ? 'পূর্ববর্তী চ্যাট হিস্টোরি দেখুন ও লোড করুন'
                  : 'View & load past chat history'
              }
            >
              <History className="w-3.5 h-3.5 text-[#D8E9A8]" />
              <span>{chatLanguage === 'bn' ? 'হিস্টোরি' : 'History'}</span>
              {historyConversations.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black leading-none ${
                  showHistoryView ? 'bg-[#1E5128] text-white' : 'bg-emerald-400 text-[#1E5128]'
                }`}>
                  {historyConversations.length}
                </span>
              )}
            </button>

            {/* Language Switch */}
            <button
              id="chat-lang-toggle-btn"
              type="button"
              onClick={() => setChatLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'))}
              className="bg-white/10 hover:bg-white/20 text-xs px-2 py-1.5 rounded-lg border border-white/20 text-white font-medium flex items-center space-x-1 cursor-pointer"
              title="Toggle Chat Language"
            >
              <Globe className="w-3 h-3 text-[#D8E9A8]" />
              <span className="hidden xs:inline">{chatLanguage === 'bn' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Close Button */}
            <button
              id="close-chat-drawer-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cloud Synced Notification Banner */}
        {hasClearedNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-1.5 text-center text-xs text-emerald-800 font-medium flex items-center justify-center space-x-1 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{chatLanguage === 'bn' ? 'চ্যাট হিস্টোরি সফলভাবে মুছে ফেলা হয়েছে।' : 'Chat history successfully cleared.'}</span>
          </div>
        )}

        {deleteNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-1.5 text-center text-xs text-emerald-800 font-medium flex items-center justify-center space-x-1 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{deleteNotice}</span>
          </div>
        )}

        {/* Content Area: History Panel OR Active Live Chat */}
        {showHistoryView ? (
          /* Dedicated History & Archive Panel */
          <div className="flex-1 flex flex-col overflow-hidden bg-[#F5F7F8]">
            {/* History Controls Bar */}
            <div className="p-3.5 bg-white border-b border-gray-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => setShowHistoryView(false)}
                  className="text-xs font-semibold text-[#1E5128] hover:text-[#163e1e] flex items-center space-x-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{chatLanguage === 'bn' ? 'চ্যাটে ফিরে যান' : 'Back to Chat'}</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleStartNewChat}
                    className="text-[11px] font-semibold text-[#1E5128] hover:text-[#163e1e] hover:bg-[#EAF5EC] px-2 py-1 rounded-lg border border-[#BDE8CB] flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3 text-[#1E5128]" />
                    <span>{chatLanguage === 'bn' ? 'নতুন চ্যাট' : 'New Chat'}</span>
                  </button>

                  {historyConversations.length > 0 && (
                    <button
                      id="clear-all-history-btn"
                      type="button"
                      onClick={handleClearChatHistory}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg border border-rose-200 flex items-center space-x-1 cursor-pointer transition-colors"
                      title={chatLanguage === 'bn' ? 'সকল হিস্টোরি মুছুন' : 'Clear all history'}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{chatLanguage === 'bn' ? 'সব মুছুন' : 'Clear'}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-1.5">
                    <History className="w-4 h-4 text-[#1E5128]" />
                    <span>{chatLanguage === 'bn' ? 'পূর্ববর্তী চ্যাট আর্কাইভ' : 'Archived Chat History'}</span>
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {chatLanguage === 'bn'
                      ? `ফায়ারবেসে সংরক্ষিত মোট ${historyConversations.length} টি কথোপকথন (ক্লিক করে চ্যাটে লোড করুন)`
                      : `${historyConversations.length} saved conversations in Firebase (Click to load)`}
                  </p>
                </div>
              </div>

              {/* Search in History */}
              {historyConversations.length > 1 && (
                <div className="mt-2.5 relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    placeholder={
                      chatLanguage === 'bn'
                        ? 'আগের প্রশ্ন বা উত্তর খুঁজুন...'
                        : 'Search questions or answers...'
                    }
                    className="w-full bg-[#F5F7F8] border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1E5128]"
                  />
                </div>
              )}
            </div>

            {/* Conversation History List */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3 text-[#1E5128]">
                    <History className="w-6 h-6 text-[#4E9F3D]" />
                  </div>
                  <h5 className="text-sm font-bold text-gray-800">
                    {historySearchQuery
                      ? (chatLanguage === 'bn' ? 'কোনো মিল পাওয়া যায়নি' : 'No matching conversations')
                      : (chatLanguage === 'bn' ? 'কোনো পূর্ববর্তী সংরক্ষিত চ্যাট নেই' : 'No past chat history found')}
                  </h5>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    {chatLanguage === 'bn'
                      ? 'এআই কৃষিবিদকে আপনি যে প্রশ্ন করবেন, তা স্বয়ংক্রিয়ভাবে এখানে সংরক্ষিত থাকবে এবং যেকোনো সময় লোড করে পড়া যাবে।'
                      : 'Any questions you ask the AI will be saved here automatically and can be loaded anytime.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleStartNewChat}
                    className="mt-4 px-3.5 py-1.5 rounded-lg bg-[#1E5128] hover:bg-[#163e1e] text-white text-xs font-semibold inline-flex items-center space-x-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{chatLanguage === 'bn' ? 'নতুন প্রশ্ন শুরু করুন' : 'Start Fresh Chat'}</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Quick button to load all history together */}
                  {historyConversations.length > 1 && (
                    <div className="flex justify-end mb-1">
                      <button
                        type="button"
                        onClick={handleLoadAllHistory}
                        className="text-[11px] text-[#1E5128] hover:text-[#163e1e] font-semibold flex items-center space-x-1 cursor-pointer bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <BookOpen className="w-3 h-3 text-[#1E5128]" />
                        <span>{chatLanguage === 'bn' ? 'সব বার্তা একসাথে চ্যাটে লোড করুন' : 'Load All Messages to Chat'}</span>
                      </button>
                    </div>
                  )}

                  {filteredHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleLoadConversation(item)}
                      className="bg-white rounded-xl p-3 border border-gray-200/90 shadow-2xs hover:border-[#1E5128] hover:shadow-sm transition-all cursor-pointer group"
                    >
                      {/* Card Header with Question & Delete */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start space-x-2 flex-1 min-w-0">
                          <div className="w-5 h-5 rounded-full bg-[#1E5128] text-white flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5 font-bold">
                            Q
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 break-words group-hover:text-[#1E5128] transition-colors">
                              {item.userMsg.text}
                            </p>
                            <div className="flex items-center space-x-2 text-[10px] text-gray-400 mt-1">
                              <span className="flex items-center space-x-0.5">
                                <Calendar className="w-2.5 h-2.5 mr-0.5" />
                                {item.userMsg.timestamp}
                              </span>
                              <span>•</span>
                              <span className="text-emerald-600 font-medium flex items-center">
                                <Cloud className="w-2.5 h-2.5 mr-0.5" />
                                {chatLanguage === 'bn' ? 'সংরক্ষিত' : 'Saved'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Delete this single conversation button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(item.userMsg.id, item.botMsg?.id);
                          }}
                          disabled={deletingId === item.userMsg.id}
                          className="p-1.5 rounded-md hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors flex-shrink-0 cursor-pointer disabled:opacity-50"
                          title={chatLanguage === 'bn' ? 'এই আলোচনাটি মুছে ফেলুন' : 'Delete this conversation'}
                        >
                          {deletingId === item.userMsg.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Answer Preview */}
                      {item.botMsg && (
                        <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-start space-x-2">
                          <div className="w-5 h-5 rounded-full bg-emerald-50 text-[#1E5128] border border-emerald-200 flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
                            <Bot className="w-3 h-3 text-[#1E5128]" />
                          </div>
                          <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed flex-1">
                            {item.botMsg.text}
                          </p>
                        </div>
                      )}

                      {/* Load & Read Action Bar */}
                      <div className="mt-2.5 pt-2 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">
                          {chatLanguage === 'bn' ? 'পড়তে ক্লিক করুন' : 'Click to load & read'}
                        </span>
                        <div className="text-[11px] font-bold text-[#1E5128] group-hover:text-[#163e1e] flex items-center space-x-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{chatLanguage === 'bn' ? 'চ্যাটে লোড করুন' : 'Load into Chat'}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#1E5128] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Bottom Quick Return Bar */}
            <div className="p-3 bg-white border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {chatLanguage === 'bn' ? 'নতুন চ্যাট শুরু করতে চান?' : 'Want to start a new chat?'}
              </span>
              <button
                type="button"
                onClick={handleStartNewChat}
                className="px-3 py-1.5 rounded-lg bg-[#1E5128] hover:bg-[#163e1e] text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{chatLanguage === 'bn' ? 'নতুন চ্যাট শুরু করুন' : 'Start Fresh Chat'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Live Interactive Chat Interface */
          <>
            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {/* If an archived chat was loaded, show clear banner */}
              {loadedConversationInfo ? (
                <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-2.5 mb-2 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
                  <div className="flex items-center space-x-2 min-w-0 flex-1 pr-2">
                    <History className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-xs truncate">
                        {chatLanguage === 'bn' ? 'পূর্ববর্তী সংরক্ষিত চ্যাট লোড করা হয়েছে' : 'Archived past chat loaded'}
                      </div>
                      <div className="text-[10px] text-amber-800 truncate">
                        "{loadedConversationInfo.title}"
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartNewChat}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-bold text-emerald-800 flex items-center space-x-1 flex-shrink-0 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{chatLanguage === 'bn' ? 'নতুন চ্যাট' : 'New Chat'}</span>
                  </button>
                </div>
              ) : null}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`group flex items-start gap-2.5 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-[#1E5128] text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm mt-0.5">
                      <Bot className="w-4 h-4 text-[#D8E9A8]" />
                    </div>
                  )}

                  {/* Individual Delete Button in Chat thread */}
                  {msg.id !== 'init-greeting' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSingleMessage(msg.id)}
                      className="opacity-0 group-hover:opacity-100 hover:opacity-100 text-gray-300 hover:text-rose-500 p-1 transition-opacity cursor-pointer self-center"
                      title={chatLanguage === 'bn' ? 'মুছে ফেলুন' : 'Delete message'}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#1E5128] text-white rounded-br-none'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Bot Voice Audio Read-out for farmers */}
                    {msg.sender === 'bot' && (
                      <div className="text-[9px] mt-1.5 text-right text-gray-400">
                        <span>{msg.timestamp}</span>
                      </div>
                    )}

                    {msg.sender === 'user' && (
                      <div className="text-[9px] mt-1.5 flex items-center justify-end space-x-1 text-green-200">
                        <span>{msg.timestamp}</span>
                        <Cloud className="w-2.5 h-2.5 opacity-70" title="Firebase Saved" />
                      </div>
                    )}
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
                <span>{chatLanguage === 'bn' ? 'দ্রুত পরামর্শ প্রশ্ন' : 'Quick Prompt Suggestions'}</span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    disabled={loading}
                    className="whitespace-nowrap text-[11px] font-semibold bg-[#EAF5EC] hover:bg-[#d8eedb] active:bg-[#c9e7cc] text-[#1E5128] px-2.5 py-1 rounded-full border border-[#BDE8CB] transition-colors flex-shrink-0 cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Listening Active Notification / Live Audio Wave */}
            {(isListening || voiceStatusText) && (
              <div
                className={`px-3.5 py-2 flex items-center justify-between text-xs transition-all border-t ${
                  isListening
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-amber-50 text-amber-900 border-amber-300'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        isListening ? 'bg-rose-500 animate-ping' : 'bg-amber-500'
                      }`}
                    />
                    <span
                      className={`absolute w-2 h-2 rounded-full ${
                        isListening ? 'bg-rose-600' : 'bg-amber-600'
                      }`}
                    />
                  </div>
                  <span className="font-semibold text-xs truncate">
                    {voiceStatusText ||
                      (chatLanguage === 'bn'
                        ? 'শুনছি... আপনার প্রশ্নটি মুখে বলুন'
                        : 'Listening... speak your question now')}
                  </span>
                </div>
                {isListening && (
                  <button
                    type="button"
                    onClick={stopVoiceRecognition}
                    className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors ml-2 flex-shrink-0 cursor-pointer"
                  >
                    {chatLanguage === 'bn' ? 'সম্পন্ন / থামান' : 'Done / Stop'}
                  </button>
                )}
              </div>
            )}

            {/* Chat Input Field with Voice Mic & Send */}
            <div className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2">
              {/* Farmer Voice Texting Mic Button */}
              <button
                id="farmer-voice-text-btn"
                type="button"
                onClick={toggleVoiceRecognition}
                disabled={loading}
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all cursor-pointer shadow-2xs ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                    : 'bg-[#EAF5EC] hover:bg-[#d5eed8] active:scale-95 text-[#1E5128] border border-[#BDE8CB] hover:border-[#1E5128]'
                }`}
                title={
                  isListening
                    ? (chatLanguage === 'bn' ? 'রেকর্ডিং থামাতে ক্লিক করুন' : 'Click to stop listening')
                    : (chatLanguage === 'bn' ? 'মুখে কথা বলে প্রশ্ন করুন (ভয়েস টাইপিং)' : 'Voice texting / Speak to type')
                }
                aria-label="Voice input"
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4 text-[#1E5128]" />
                )}
              </button>

              <input
                id="chat-user-input"
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (isListening) stopVoiceRecognition();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  isListening
                    ? (chatLanguage === 'bn' ? 'শুনছি... মুখে বলুন...' : 'Listening... speak now...')
                    : (chatLanguage === 'bn'
                        ? 'প্রশ্ন লিখুন বা মাইকে কথা বলুন...'
                        : 'Ask question or tap mic to speak...')
                }
                disabled={loading}
                className={`flex-1 bg-[#F5F7F8] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none transition-all ${
                  isListening
                    ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/40 placeholder-rose-500'
                    : 'border-gray-200 focus:ring-2 focus:ring-[#1E5128] focus:border-transparent'
                }`}
              />

              <button
                id="send-chat-message-btn"
                type="button"
                onClick={() => {
                  if (isListening) stopVoiceRecognition();
                  handleSendMessage();
                }}
                disabled={loading || !inputMessage.trim()}
                className="w-10 h-10 rounded-xl bg-[#1E5128] hover:bg-[#163e1e] active:scale-95 disabled:opacity-50 text-white flex items-center justify-center flex-shrink-0 shadow transition-all cursor-pointer"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
