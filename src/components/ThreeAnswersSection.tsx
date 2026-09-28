import React from 'react';
import { MapPin, Navigation, AlertTriangle } from 'lucide-react';

export const ThreeAnswersSection: React.FC = () => {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="max-w-2xl mb-6">
        <span className="text-xs font-bold font-mono text-indigo-700 tracking-wider uppercase block mb-1">
          CORE CAPABILITY
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Three Things VAJRA-X Answers
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Designed so operational officers and field teams get direct answers in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 01 WHERE? */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xl font-black text-sky-700">01</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            WHERE?
          </h4>
          <p className="text-xs font-semibold text-slate-700 mb-2">
            Where is the storm now?
          </p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Identifies active convective cell centroids, peak reflectivity core (dBZ), and real-time intra-cloud & cloud-to-ground strike clusters.
          </p>
        </div>

        {/* 02 WHERE NEXT? */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xl font-black text-indigo-700">02</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Navigation className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            WHERE NEXT?
          </h4>
          <p className="text-xs font-semibold text-slate-700 mb-2">
            Where could the storm move?
          </p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Calculates optical flow and atmospheric steering vectors to project cell trajectory waypoints at +30 min, +60 min, and +120 min intervals.
          </p>
        </div>

        {/* 03 WHAT SHOULD WE EXPECT? */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xl font-black text-amber-700">03</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            WHAT SHOULD WE EXPECT?
          </h4>
          <p className="text-xs font-semibold text-slate-700 mb-2">
            What is the expected risk?
          </p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Separates lightning danger from precipitation intensity with calibrated probability percentiles and tailored sector mitigation actions.
          </p>
        </div>
      </div>
    </section>
  );
};
