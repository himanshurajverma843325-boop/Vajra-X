import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Radio,
  Zap,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  Send,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { LocationPoint } from '../types/nowcast';

interface LiveVoiceAssistantProps {
  currentLocation?: LocationPoint;
  stormIntensity?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const LiveVoiceAssistant: React.FC<LiveVoiceAssistantProps> = ({
  currentLocation,
  stormIntensity,
  isOpen,
  onClose,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<
    { speaker: 'user' | 'gemini'; text: string; time: string }[]
  >([]);
  const [textInput, setTextInput] = useState('');

  // Refs for Web Audio API & WebSocket
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioQueueRef = useRef<AudioBufferSourceNode[]>([]);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  // Connect WebSocket when modal is open
  useEffect(() => {
    if (!isOpen) {
      cleanup();
      return;
    }

    startConnection();

    return () => {
      cleanup();
    };
  }, [isOpen]);

  const cleanup = () => {
    stopMic();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
  };

  const startConnection = () => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Prepare Output AudioContext (24kHz as required by Gemini Live output)
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        outputAudioCtxRef.current = new AudioCtx({ sampleRate: 24000 });
        nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
      }

      ws.onopen = () => {
        setIsConnected(true);
        setErrorMessage(null);
        setTranscripts((prev) => [
          ...prev,
          {
            speaker: 'gemini',
            text: `Live Voice Session initialized with gemini-3.8-live. Monitored zone: ${
              currentLocation?.name || 'Ghaziabad, UP'
            }. Click "Enable Mic" to speak with the AI meteorologist.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.interrupted) {
            handleInterruption();
          }

          if (data.text) {
            setTranscripts((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.speaker === 'gemini') {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: last.text + ' ' + data.text },
                ];
              } else {
                return [
                  ...prev,
                  {
                    speaker: 'gemini',
                    text: data.text,
                    time: new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                  },
                ];
              }
            });
          }

          if (data.audio) {
            playAudioChunk(data.audio);
          }

          if (data.status === 'error') {
            setErrorMessage(data.error);
          }
        } catch (e) {
          console.error('Error handling WS audio message:', e);
        }
      };

      ws.onerror = (e) => {
        console.error('WebSocket Live error:', e);
        setErrorMessage('Failed to connect to Live API WebSocket.');
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsListening(false);
        setIsSpeaking(false);
      };
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection failed.');
    }
  };

  // Convert raw base64 PCM 24kHz to AudioBuffer and schedule
  const playAudioChunk = (base64Audio: string) => {
    if (!outputAudioCtxRef.current) return;
    const ctx = outputAudioCtxRef.current;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    try {
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert 16-bit PCM little-endian to Float32 [-1.0, 1.0]
      const int16Array = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.copyToChannel(float32Array, 0);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime + 0.05;
      }

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;

      audioQueueRef.current.push(source);
      setIsSpeaking(true);

      source.onended = () => {
        const idx = audioQueueRef.current.indexOf(source);
        if (idx !== -1) audioQueueRef.current.splice(idx, 1);
        if (audioQueueRef.current.length === 0) {
          setIsSpeaking(false);
        }
      };
    } catch (err) {
      console.error('Audio decode/play error:', err);
    }
  };

  const handleInterruption = () => {
    // Stop all currently playing audio chunks
    audioQueueRef.current.forEach((src) => {
      try {
        src.stop();
      } catch (e) {}
    });
    audioQueueRef.current = [];
    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
    setIsSpeaking(false);
  };

  // Microphone capture (16kHz PCM little endian)
  const startMic = async () => {
    try {
      setErrorMessage(null);
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      const source = inputCtx.createMediaStreamSource(stream);
      // ScriptProcessor buffer 4096
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(inputCtx.destination);

      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to 16-bit PCM little-endian
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Base64 encode
        let binary = '';
        const bytes = new Uint8Array(pcm16.buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);

        wsRef.current.send(JSON.stringify({ audio: base64 }));
      };

      setIsListening(true);
      setTranscripts((prev) => [
        ...prev,
        {
          speaker: 'user',
          text: '🎤 [Microphone engaged - speaking to Gemini Live]',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setErrorMessage(
        'Microphone permission denied or unsupported. You can also send text commands directly below.'
      );
      setIsListening(false);
    }
  };

  const stopMic = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    setIsListening(false);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({ text: textInput.trim() }));
    setTranscripts((prev) => [
      ...prev,
      {
        speaker: 'user',
        text: textInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setTextInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col overflow-hidden transition-all ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-[#0F172A] border-[#1E293B] text-slate-100'
        } max-h-[90vh]`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111C35] border-[#1E293B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-500 to-sky-500 flex items-center justify-center text-white shadow-md">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">
                  Gemini Live Voice Conversation
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30">
                  gemini-3.8-live
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Low-latency, bidirectional real-time audio nowcasting agent
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Audio Visualizer Stage */}
        <div
          className={`p-6 border-b flex flex-col items-center justify-center relative overflow-hidden ${
            isLight ? 'bg-gradient-to-b from-sky-50/50 to-white' : 'bg-[#0B1120]'
          }`}
        >
          {/* Connection status tag */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'
              }`}
            />
            <span className="text-xs font-mono font-medium">
              {isConnected
                ? isSpeaking
                  ? 'Gemini Live is Speaking (24kHz Audio)...'
                  : isListening
                  ? 'Listening for your voice (16kHz PCM)...'
                  : 'Ready — Mic is muted'
                : 'Connecting to WebSocket /live...'}
            </span>
          </div>

          {/* Animated Waveform Orb */}
          <div className="relative flex items-center justify-center my-2">
            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
                isSpeaking
                  ? 'bg-gradient-to-tr from-sky-500 via-indigo-500 to-rose-500 shadow-lg shadow-sky-500/40 scale-110'
                  : isListening
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/40 animate-pulse'
                  : isLight
                  ? 'bg-slate-200 text-slate-500'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isSpeaking ? (
                <Volume2 className="w-10 h-10 text-white animate-bounce" />
              ) : isListening ? (
                <Mic className="w-10 h-10 text-white" />
              ) : (
                <MicOff className="w-10 h-10" />
              )}
            </div>

            {/* Ripple rings when active */}
            {(isSpeaking || isListening) && (
              <div
                className={`absolute inset-0 rounded-full border-2 border-dashed animate-spin ${
                  isSpeaking ? 'border-sky-400/50' : 'border-emerald-400/50'
                }`}
                style={{ animationDuration: '6s' }}
              />
            )}
          </div>

          {/* Mic Control Toggle */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={isListening ? stopMic : startMic}
              disabled={!isConnected}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Mute Microphone</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Enable Live Microphone</span>
                </>
              )}
            </button>

            {isSpeaking && (
              <button
                onClick={handleInterruption}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/30 hover:bg-amber-500/20"
                title="Interrupt current Gemini response"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Interrupt</span>
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="mt-3 flex items-center gap-2 text-rose-500 text-xs bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Live Conversation Transcript Feed */}
        <div
          className={`flex-1 overflow-y-auto p-4 space-y-3 min-h-[160px] max-h-[240px] text-xs ${
            isLight ? 'bg-slate-50' : 'bg-[#080D1A]'
          }`}
        >
          {transcripts.map((t, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border ${
                t.speaker === 'user'
                  ? isLight
                    ? 'bg-sky-50 border-sky-200 text-sky-950 ml-6'
                    : 'bg-sky-950/40 border-sky-900/60 text-sky-200 ml-6'
                  : isLight
                  ? 'bg-white border-slate-200 text-slate-800 mr-6 shadow-xs'
                  : 'bg-[#111C35] border-[#1E293B] text-slate-200 mr-6'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-mono">
                <span className="font-bold uppercase tracking-wider">
                  {t.speaker === 'user' ? 'You (Voice/Text)' : 'Gemini 3.8 Live'}
                </span>
                <span>{t.time}</span>
              </div>
              <p className="leading-relaxed">{t.text}</p>
            </div>
          ))}
          <div ref={transcriptEndRef} />
        </div>

        {/* Fallback Text Input (supports users without mic) */}
        <div
          className={`p-3 border-t ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0F172A] border-[#1E293B]'
          }`}
        >
          <form onSubmit={handleSendText} className="flex items-center gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Or type a spoken command: e.g. 'Give me an emergency briefing on Ghaziabad'..."
              className={`flex-1 text-xs rounded-xl px-3.5 py-2.5 border outline-none ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-sky-500'
                  : 'bg-[#111C35] border-slate-700 text-slate-100 focus:border-sky-500'
              }`}
            />
            <button
              type="submit"
              disabled={!textInput.trim() || !isConnected}
              className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold cursor-pointer disabled:opacity-40"
              title="Send to Live session"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
