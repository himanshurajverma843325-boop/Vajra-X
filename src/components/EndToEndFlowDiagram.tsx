import React from 'react';
import {
  Radio,
  Satellite,
  Zap,
  Wind,
  Cpu,
  Layers,
  Sparkles,
  MapPin,
  Navigation,
  ShieldAlert,
  ShieldCheck,
  ArrowDown,
} from 'lucide-react';

export const EndToEndFlowDiagram: React.FC = () => {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="max-w-3xl mb-6 text-center mx-auto">
        <span className="text-xs font-bold font-mono text-sky-700 uppercase tracking-wider block mb-1">
          SYSTEM ARCHITECTURE SUMMARY
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          End-to-End System Flow
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Complete conceptual blueprint of the VAJRA-X nowcasting pipeline for Smart India Hackathon 2026.
        </p>
      </div>

      <div className="max-w-xl mx-auto flex flex-col items-center space-y-2">
        {/* Tier 1: Ingestion Sensors */}
        <div className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
            INGESTION LAYER
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-800">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
              <Radio className="w-3.5 h-3.5 text-sky-600" /> RADAR
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
              <Satellite className="w-3.5 h-3.5 text-indigo-600" /> SATELLITE
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-amber-600" /> LIGHTNING
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
              <Wind className="w-3.5 h-3.5 text-teal-600" /> ATMOSPHERIC
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
              <Cpu className="w-3.5 h-3.5 text-purple-600" /> NWP
            </span>
          </div>
        </div>

        <ArrowDown className="w-4 h-4 text-slate-400" />

        {/* Tier 2: Multi-Source Data Fusion */}
        <div className="w-full p-3.5 rounded-xl bg-cyan-50/70 border border-cyan-200 text-center">
          <span className="text-xs font-black text-cyan-950 uppercase tracking-wider block">
            MULTI-SOURCE DATA FUSION
          </span>
          <span className="text-[11px] text-cyan-800 block mt-0.5">
            Polar-to-Cartesian LCC spatial grid alignment & 15-min cadence synchronization
          </span>
        </div>

        <ArrowDown className="w-4 h-4 text-slate-400" />

        {/* Tier 3: AI / ML Nowcasting */}
        <div className="w-full p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-center">
          <span className="text-xs font-black text-indigo-950 uppercase tracking-wider block">
            AI / ML NOWCASTING (0–2 HR)
          </span>
          <span className="text-[11px] text-indigo-800 block mt-0.5">
            Spatial-temporal ConvLSTM / neural optical flow deep learning model
          </span>
        </div>

        <ArrowDown className="w-4 h-4 text-slate-400" />

        {/* Tier 4: Thunderstorm + Lightning Risk */}
        <div className="w-full p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-center">
          <span className="text-xs font-black text-amber-950 uppercase tracking-wider block">
            THUNDERSTORM + LIGHTNING RISK
          </span>
          <span className="text-[11px] text-amber-800 block mt-0.5">
            Separated probability percentiles (rain intensity ≠ dielectric breakdown)
          </span>
        </div>

        <ArrowDown className="w-4 h-4 text-slate-400" />

        {/* Tier 5: Storm Trajectory */}
        <div className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
            STORM TRAJECTORY
          </span>
          <span className="text-[11px] text-slate-600 block mt-0.5">
            Kinematic tracking + forward displacement projection at +30m, +60m, +120m
          </span>
        </div>

        <ArrowDown className="w-4 h-4 text-slate-400" />

        {/* Tier 6: Explainable Alert */}
        <div className="w-full p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 text-center">
          <span className="text-xs font-black text-sky-950 uppercase tracking-wider block">
            EXPLAINABLE ALERT
          </span>
          <span className="text-[11px] text-sky-800 block mt-0.5">
            Confidence score + physical drivers (cooling rate, flash jump, CAPE)
          </span>
        </div>

        <ArrowDown className="w-4 h-4 text-slate-400" />

        {/* Tier 7: Disaster Management Action */}
        <div className="w-full p-4 rounded-xl bg-emerald-600 text-white text-center shadow-xs">
          <span className="text-xs font-black uppercase tracking-wider block">
            DISASTER MANAGEMENT ACTION
          </span>
          <span className="text-[11px] text-emerald-100 block mt-0.5 font-medium">
            Life-saving directives for DDMAs, public citizens, farmers, airports, and power grids
          </span>
        </div>
      </div>
    </section>
  );
};
