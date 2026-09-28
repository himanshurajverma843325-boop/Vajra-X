import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  Award,
  Layers,
  Cpu,
  Radio,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface HeroSectionProps {
  onExploreNowcast: () => void;
  onHowItWorks: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreNowcast,
  onHowItWorks,
}) => {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs mb-8">
      {/* Top Badge Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>SMART INDIA HACKATHON 2026 • SIH26072</span>
        </div>

        <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
          SIMULATED DEMO DATA
        </span>
      </div>

      {/* Main Title & Subtitle */}
      <div className="max-w-4xl space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            VAJRA<span className="text-sky-600">-X</span>
          </h1>
          <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-700 font-mono text-xs font-bold">
            Prototype
          </span>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-[#0F223D] tracking-tight">
          AI-Powered Thunderstorm & Lightning Nowcasting System
        </p>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl pt-1">
          VAJRA-X combines radar, satellite, lightning, atmospheric and model data using AI/ML to estimate where thunderstorms and lightning may develop in the next few hours.
        </p>
      </div>

      {/* 4 Core Pillars answering the 4 questions directly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-black tracking-wider uppercase text-sky-700 block mb-1">
            WHAT IS VAJRA-X?
          </span>
          <p className="text-xs font-semibold text-slate-900 mb-1">
            Hyperlocal Nowcasting
          </p>
          <p className="text-[11px] text-slate-600 leading-normal">
            Short-term 0–2 hour prediction window filling the gap before severe convective onset.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-black tracking-wider uppercase text-cyan-700 block mb-1">
            WHAT DATA DOES IT USE?
          </span>
          <p className="text-xs font-semibold text-slate-900 mb-1">
            5 Atmospheric Streams
          </p>
          <p className="text-[11px] text-slate-600 leading-normal">
            Doppler radar, geostationary satellite, lightning sensor network, surface AWS & NWP.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-black tracking-wider uppercase text-indigo-700 block mb-1">
            WHAT DOES AI DO?
          </span>
          <p className="text-xs font-semibold text-slate-900 mb-1">
            Multi-Source Fusion
          </p>
          <p className="text-[11px] text-slate-600 leading-normal">
            Aligns heterogeneous tensors, classifies storm cells, and forecasts trajectory vectors.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-black tracking-wider uppercase text-emerald-700 block mb-1">
            WHAT DOES USER GET?
          </span>
          <p className="text-xs font-semibold text-slate-900 mb-1">
            Actionable Early Alerts
          </p>
          <p className="text-[11px] text-slate-600 leading-normal">
            Separate lightning vs storm risks with tailored SOPs for DDMAs, public & farmers.
          </p>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 mt-8">
        <button
          onClick={onExploreNowcast}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
        >
          <span>Explore Nowcast</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onHowItWorks}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs transition-colors cursor-pointer"
        >
          <span>How VAJRA-X Works</span>
          <ArrowDown className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </section>
  );
};
