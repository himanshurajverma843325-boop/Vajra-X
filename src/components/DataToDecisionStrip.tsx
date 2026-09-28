import React from 'react';
import {
  Database,
  Cpu,
  Zap,
  MapPin,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: 'Atmospheric Data',
    icon: <Database className="w-4 h-4 text-sky-600" />,
    desc: 'Heterogeneous sensor ingestion from radar, satellite, AWS & lightning.',
    color: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    number: '02',
    title: 'AI/ML Fusion',
    icon: <Cpu className="w-4 h-4 text-cyan-600" />,
    desc: 'Cross-modality grid alignment on a standardized spatial-temporal tensor.',
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  {
    number: '03',
    title: 'Nowcast',
    icon: <Zap className="w-4 h-4 text-indigo-600" />,
    desc: 'Deep learning inference predicts 0–2 hour storm initiation & flash rates.',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    number: '04',
    title: 'Risk Map',
    icon: <MapPin className="w-4 h-4 text-amber-600" />,
    desc: 'Spatial visualization of hazard envelopes and forecast movement vectors.',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    number: '05',
    title: 'Alert',
    icon: <ShieldAlert className="w-4 h-4 text-orange-600" />,
    desc: 'Automated thresholding separates lightning hazard from rain intensity.',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  {
    number: '06',
    title: 'Action',
    icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    desc: 'SOP protocols translated for DDMAs, farmers, airports and utilities.',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
];

export const DataToDecisionStrip: React.FC = () => {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider block mb-0.5">
            INFOGRAPHIC OVERVIEW
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            From Data to Decision
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          6-Stage Meteorological Intelligence Flow
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {STEPS.map((step, idx) => (
          <div
            key={step.number}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:bg-slate-100/60 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center font-mono font-black text-sm text-slate-900 shadow-2xs">
                  {step.number}
                </div>
                <div className={`p-1.5 rounded-lg border ${step.color}`}>
                  {step.icon}
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-900 tracking-tight mb-1">
                {step.title}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>

            {idx < STEPS.length - 1 && (
              <div className="hidden lg:flex items-center justify-end text-slate-300 mt-3 pt-2 border-t border-slate-200/60">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
