import React from 'react';
import {
  Award,
  Shield,
  Zap,
  Radio,
  Cpu,
  Database,
  Users,
  AlertTriangle,
  FileText,
  Target,
  BookOpen,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#111C35] via-[#0E1A33] to-[#152342] border border-[#1E293B] rounded-2xl p-6 md:p-8 shadow-md">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            SMART INDIA HACKATHON 2026
          </span>
          <span className="px-3 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-full text-xs font-mono font-medium">
            PROBLEM ID: SIH26072
          </span>
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-semibold">
            TEAM: INNOVEXA_X
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
          VAJRA-X
        </h1>
        <p className="text-lg md:text-xl font-medium text-sky-400 mb-4">
          AI-Powered Thunderstorm & Lightning Nowcasting System
        </p>

        <div className="bg-[#0B1120]/80 border border-[#1E293B] rounded-xl p-4 text-sm text-slate-300 leading-relaxed font-sans">
          <span className="text-xs uppercase tracking-wider font-bold text-amber-400 block mb-1">
            Official Problem Statement:
          </span>
          “AIML based Nowcasting of thunderstorm and lightning using atmospheric observation including multiple radars, satellite, lightning and model data.”
        </div>
      </div>

      {/* Core Objectives & Value Proposition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#111C35] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">0–2 Hour Nowcast Window</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fills the operational latency gap between traditional NWP forecast models (which update every 1–6 hours) and rapidly developing convective storm cells that initiate and intensify in under 30 minutes.
          </p>
        </div>

        <div className="bg-[#111C35] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Dedicated Lightning Separation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Solves the critical meteorological reality where Lightning Risk ≠ Thunderstorm Risk. Differentiates high-shear dry lightning strikes from heavy-precipitation supercells.
          </p>
        </div>

        <div className="bg-[#111C35] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Actionable Sector Directives</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Translates complex multi-radar and AI tensors into clear, protocol-driven advisories for District Disaster Management Authorities (DDMA), farmers, airport air-traffic control, and power utilities.
          </p>
        </div>
      </div>

      {/* Multi-Source Observation Fusion Architecture */}
      <div className="bg-[#111C35] border border-[#1E293B] rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-sky-400" />
          AI/ML Multi-Modal Architecture & Methodology
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          VAJRA-X demonstrates how atmospheric observations from disparate sensors across India are synchronously fused using deep spatial-temporal neural networks:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[#0B1120] border border-[#1E293B] rounded-lg space-y-1.5">
            <span className="font-semibold text-sky-400 flex items-center gap-1.5">
              <Radio className="w-4 h-4" /> 1. Multi-Radar Doppler Fusion
            </span>
            <p className="text-slate-400">
              Dual-pol Doppler Weather Radars (IMD network) provide 3D hydrometeor classification, detecting graupel/hail aloft and updraft velocity ($Vr$) before cloud-to-ground strikes initiate.
            </p>
          </div>

          <div className="p-3.5 bg-[#0B1120] border border-[#1E293B] rounded-lg space-y-1.5">
            <span className="font-semibold text-indigo-400 flex items-center gap-1.5">
              <Database className="w-4 h-4" /> 2. Geostationary INSAT-3D/3DR
            </span>
            <p className="text-slate-400">
              Rapid-scan infrared (10.8 µm) and water vapor (6.7 µm) channels quantify deep convective clouds, overshooting tops, and rapid cloud-top cooling rates (ΔTb &gt; 8°C / 15 min).
            </p>
          </div>

          <div className="p-3.5 bg-[#0B1120] border border-[#1E293B] rounded-lg space-y-1.5">
            <span className="font-semibold text-amber-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> 3. Lightning Location Networks (LLN)
            </span>
            <p className="text-slate-400">
              Captures total lightning flash counts (Intra-Cloud + Cloud-to-Ground). High Intra-Cloud flash accelerations serve as a 15–30 minute lead-time precursor to destructive ground strikes.
            </p>
          </div>

          <div className="p-3.5 bg-[#0B1120] border border-[#1E293B] rounded-lg space-y-1.5">
            <span className="font-semibold text-purple-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> 4. NWP Mesoscale Background (NCUM/WRF)
            </span>
            <p className="text-slate-400">
              Convective Available Potential Energy (CAPE), Convective Inhibition (CIN), and 0–6 km bulk wind shear establish the environmental thermodynamic receptivity for storm organization.
            </p>
          </div>
        </div>
      </div>

      {/* Team Details & Hackathon Info */}
      <div className="bg-[#111C35] border border-[#1E293B] rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          Project Team & Hackathon Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 bg-[#0B1120] border border-[#1E293B] rounded-lg">
            <div className="text-slate-500 uppercase text-[10px]">Event</div>
            <div className="text-white font-bold text-sm mt-0.5 font-sans">Smart India Hackathon 2026</div>
          </div>
          <div className="p-3 bg-[#0B1120] border border-[#1E293B] rounded-lg">
            <div className="text-slate-500 uppercase text-[10px]">Problem ID</div>
            <div className="text-amber-400 font-bold text-sm mt-0.5">SIH26072</div>
          </div>
          <div className="p-3 bg-[#0B1120] border border-[#1E293B] rounded-lg">
            <div className="text-slate-500 uppercase text-[10px]">Team Name</div>
            <div className="text-sky-400 font-bold text-sm mt-0.5">Team INNOVEXA_X</div>
          </div>
          <div className="p-3 bg-[#0B1120] border border-[#1E293B] rounded-lg">
            <div className="text-slate-500 uppercase text-[10px]">Focus Domain</div>
            <div className="text-emerald-400 font-bold text-sm mt-0.5 font-sans">Disaster Management / AIML</div>
          </div>
        </div>
      </div>

      {/* Meteorological Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 flex items-start gap-3 text-amber-200 text-xs leading-relaxed">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider block text-amber-300 mb-1">
            Meteorological Disclaimer & Compliance Notice
          </span>
          VAJRA-X is a student prototype and hackathon technology demonstration designed for Smart India Hackathon 2026. All radar reflectivity plots, lightning strike densities, satellite cloud values, and forecast indices displayed in Demo Mode are synthesized from historical storm parameters and mathematical simulation models. This application is not an official warning service and must not be used for life-critical disaster management operations in place of official alerts issued by the India Meteorological Department (IMD) or NDMA.
        </div>
      </div>
    </div>
  );
};
