import React from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Zap,
  CloudLightning,
  ShieldCheck,
} from 'lucide-react';

export const ExampleNowcastCard: React.FC = () => {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold font-mono text-sky-700 uppercase tracking-wider block mb-0.5">
            CONCRETE WALKTHROUGH
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Example Nowcast
          </h3>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold font-mono">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          SIMULATED DEMO — NOT A REAL-TIME WARNING
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Key Parameters */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              LOCATION
            </span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              <span className="text-sm font-black text-slate-900">Ghaziabad</span>
            </div>
            <span className="text-[10px] text-slate-500">NCR / Uttar Pradesh</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              TIME WINDOW
            </span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-sm font-black text-slate-900">Next 30–60 min</span>
            </div>
            <span className="text-[10px] text-slate-500">Short-term nowcast</span>
          </div>

          <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200">
            <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider block mb-1">
              THUNDERSTORM RISK
            </span>
            <div className="flex items-center gap-1.5">
              <CloudLightning className="w-3.5 h-3.5 text-orange-600" />
              <span className="text-sm font-black text-orange-900">HIGH</span>
            </div>
            <span className="text-[10px] text-orange-700">78% probability</span>
          </div>

          <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200">
            <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider block mb-1">
              LIGHTNING RISK
            </span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-orange-600" />
              <span className="text-sm font-black text-orange-900">HIGH</span>
            </div>
            <span className="text-[10px] text-orange-700">82% strike density</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              STORM MOVEMENT
            </span>
            <div className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-sm font-black text-slate-900">SW → NE</span>
            </div>
            <span className="text-[10px] text-slate-500">Speed ~34 km/h</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              CONFIDENCE
            </span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-sm font-black text-emerald-900">87%</span>
            </div>
            <span className="text-[10px] text-emerald-700">High multi-sensor match</span>
          </div>
        </div>

        {/* Right Column: Why? Explainable AI Factors */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 block mb-3">
              Why did VAJRA-X predict this risk?
            </span>

            <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Increasing radar signal:</strong> Doppler reflectivity crossed 48 dBZ in the southwestern quadrant.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Rising lightning activity:</strong> Total flash rate accelerating (+18 flashes/min jump precursor).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Rapid cloud development:</strong> INSAT-3D TIR1 channel records cloud-top cooling of 8.2°C over 15 min.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Supporting atmospheric conditions:</strong> High CAPE (2,450 J/kg) and low CIN indicate ready instability.</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
            Model output: Verified by synchronized 5-feed AI tensor
          </div>
        </div>
      </div>
    </section>
  );
};
