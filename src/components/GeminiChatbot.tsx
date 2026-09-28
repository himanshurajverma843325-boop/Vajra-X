import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  ChevronDown,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { LocationPoint } from '../types/nowcast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
}

interface GeminiChatbotProps {
  currentLocation?: LocationPoint;
  stormIntensity?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ROLES = [
  {
    id: 'meteorologist',
    name: 'Chief Radar Meteorologist',
    instruction:
      'You are the VAJRA-X Chief Radar Meteorologist specializing in convective storm physics, dual-polarization radar reflectivity (Z, Vr, Zdr), lightning jump analysis, and short-term 0-2 hour nowcasting across India.',
  },
  {
    id: 'disaster_commander',
    name: 'Disaster Response (NDMA / DDMA)',
    instruction:
      'You are the Disaster Response Commander advising District Disaster Management Authorities (DDMA), state emergency operational centers, and emergency services on evacuation, lightning shelter rules, and civic risk mitigation.',
  },
  {
    id: 'agri_advisor',
    name: 'Rural & Farmer Safety Advisor',
    instruction:
      'You are the Agricultural & Rural Safety Specialist advising farmers, laborers, and rural communities on lightning hazard protocols in open paddy fields, livestock safety, and hailstorm protection.',
  },
];

const MODELS = [
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', tag: 'General & Fast' },
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', tag: 'High Speed' },
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview', tag: 'Complex Reasoning' },
];

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  currentLocation,
  stormIntensity,
  isOpen,
  onClose,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [selectedRole, setSelectedRole] = useState(ROLES[0].id);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Welcome to **VAJRA-X Gemini Meteorological Intelligence**. I am your AI weather analyst powered by Google Gemini. \n\nI can interpret dual-pol Doppler radar echoes, explain lightning jump precursors, assess lightning vs thunderstorm divergence, or provide NDMA disaster directives for **${
        currentLocation?.name || 'Ghaziabad, UP'
      }**. What would you like to examine?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: MODELS[0].id,
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputPrompt).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const activeRole = ROLES.find((r) => r.id === selectedRole) || ROLES[0];
      const contextPrefix = currentLocation
        ? `[Current Monitored Location: ${currentLocation.name}, ${currentLocation.state} (lat: ${currentLocation.lat}, lng: ${currentLocation.lng}), Storm Intensity: ${stormIntensity || 'Moderate'}]\n\n`
        : '';

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          systemInstruction: contextPrefix + activeRole.instruction,
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'No response returned from model.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model || selectedModel,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Unable to reach Gemini API (${err.message || 'Network error'}). Please verify the server connection and try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Conversation reset. How can I assist with your meteorological nowcast analysis today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: selectedModel,
      },
    ]);
  };

  const SUGGESTED_QUERIES = [
    'Explain DWR Doppler reflectivity & hail signatures',
    'What is the difference between IC and CG lightning?',
    'What precautions should farmers take during lightning alert?',
    'How does rapid cloud-top cooling indicate storm intensification?',
  ];

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex flex-col rounded-2xl shadow-2xl transition-all border ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800'
          : 'bg-[#0F172A] border-[#1E293B] text-slate-100'
      } ${minimized ? 'w-80 h-14' : 'w-[95vw] sm:w-[500px] h-[640px] max-h-[88vh]'}`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 rounded-t-2xl flex items-center justify-between border-b cursor-pointer select-none ${
          isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-[#111C35] border-[#1E293B]'
        }`}
        onClick={() => setMinimized(!minimized)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold tracking-tight">VAJRA MetGPT</h3>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-sky-500/10 text-sky-600 border border-sky-500/30 font-semibold">
                Gemini
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {ROLES.find((r) => r.id === selectedRole)?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMinimized(!minimized)}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-800 text-slate-400'
            }`}
            title={minimized ? 'Expand' : 'Minimize'}
          >
            {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-800 text-slate-400'
            }`}
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Controls Bar: Role & Model Selectors */}
          <div
            className={`px-3 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-xs ${
              isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-[#0B1120] border-[#1E293B]'
            }`}
          >
            <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
              <span className="text-[11px] font-medium text-slate-500">Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className={`text-xs rounded px-2 py-1 border transition-colors outline-none font-medium flex-1 ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-800 focus:border-sky-500'
                    : 'bg-[#1E293B] border-slate-700 text-slate-200 focus:border-sky-500'
                }`}
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-500">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className={`text-xs rounded px-2 py-1 border transition-colors outline-none font-mono text-[11px] ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-800 focus:border-sky-500'
                    : 'bg-[#1E293B] border-slate-700 text-slate-200 focus:border-sky-500'
                }`}
              >
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleClearHistory}
                className={`p-1 rounded hover:text-rose-500 transition-colors ${
                  isLight ? 'text-slate-400 hover:bg-slate-200' : 'text-slate-500 hover:bg-slate-800'
                }`}
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-4 text-xs ${
              isLight ? 'bg-slate-50/50' : 'bg-[#080D1A]'
            }`}
          >
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      isUser
                        ? 'bg-sky-600 text-white'
                        : isLight
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`max-w-[82%] space-y-1`}>
                    <div
                      className={`p-3 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                        isUser
                          ? 'bg-sky-600 text-white rounded-tr-none shadow-sm'
                          : isLight
                          ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                          : 'bg-[#111C35] text-slate-200 border border-[#1E293B] rounded-tl-none shadow-sm'
                      }`}
                    >
                      {m.content}
                    </div>

                    <div
                      className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span>{m.timestamp}</span>
                      {m.model && <span className="font-mono text-[9px]">({m.model})</span>}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div
                  className={`p-3 rounded-2xl rounded-tl-none border text-xs flex items-center gap-2 ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-500'
                      : 'bg-[#111C35] border-[#1E293B] text-slate-400'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-500" />
                  <span>Synthesizing meteorological assessment...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div
            className={`px-3 py-2 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0B1120] border-[#1E293B]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            {SUGGESTED_QUERIES.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className={`shrink-0 px-2.5 py-1 rounded-full border transition-all text-[11px] ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-700 hover:border-sky-500 hover:text-sky-600'
                    : 'bg-[#1E293B] border-slate-700 text-slate-300 hover:border-sky-400 hover:text-sky-300'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div
            className={`p-3 border-t rounded-b-2xl ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0F172A] border-[#1E293B]'
            }`}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask about Doppler echoes, lightning safety, or CAPE..."
                className={`flex-1 text-xs rounded-xl px-3.5 py-2.5 border outline-none transition-all ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                    : 'bg-[#111C35] border-slate-700 text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                }`}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className={`p-2.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  inputPrompt.trim() && !isLoading
                    ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm'
                    : isLight
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
