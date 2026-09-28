import React from 'react';
import { CloudLightning, Zap, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export const WhyItMattersSection: React.FC = () => {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="max-w-3xl mb-6">
        <span className="text-xs font-bold font-mono text-amber-700 uppercase tracking-wider block mb-1">
          OPERATIONAL IMPACT
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Why Early Nowcasting Matters
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Filling the high-consequence lead-time gap before sudden convective onset.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <CloudLightning className="w-4 h-4 text-sky-600" />
            <h4 className="text-xs font-black tracking-wider uppercase text-slate-900">
              THUNDERSTORMS
            </h4>
          </div>
          <p className="text-xs text-slate-700 font-semibold mb-1">
            Can intensify rapidly
          </p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Severe cells can initiate, breach the tropopause, and produce downburst winds in under 30 minutes.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-black tracking-wider uppercase text-slate-900">
              LIGHTNING
            </h4>
          </div>
          <p className="text-xs text-slate-700 font-semibold mb-1">
            Can create sudden local hazards
          </p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Ground strikes often strike several kilometers ahead of rain, catching outdoor workers unprepared.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-black tracking-wider uppercase text-slate-900">
              SHORT-TERM FORECAST
            </h4>
          </div>
          <p className="text-xs text-slate-700 font-semibold mb-1">
            Enables early preparation
          </p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Helps citizens, farmers, and disaster authorities take protective action before conditions deteriorate.
          </p>
        </div>
      </div>

      {/* Triad Flow Banner */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-around gap-3 text-center">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-mono font-bold text-xs flex items-center justify-center">
            1
          </span>
          <span className="text-xs font-black tracking-wider text-slate-900 uppercase">
            EARLIER SIGNAL
          </span>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-mono font-bold text-xs flex items-center justify-center">
            2
          </span>
          <span className="text-xs font-black tracking-wider text-slate-900 uppercase">
            BETTER PREPAREDNESS
          </span>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-mono font-bold text-xs flex items-center justify-center">
            3
          </span>
          <span className="text-xs font-black tracking-wider text-slate-900 uppercase">
            SAFER DECISIONS
          </span>
        </div>
      </div>
    </section>
  );
};
