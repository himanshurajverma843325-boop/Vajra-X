import React from 'react';
import {
  Layers,
  MapPin,
  Zap,
  Navigation,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const DIFFERENTIATORS = [
  {
    num: '01',
    title: 'Multi-Source Fusion',
    subtitle: 'Radar + Satellite + Lightning + Atmospheric + Model Data',
    desc: 'Unlike single-sensor tools, VAJRA-X synchronously ingests radar reflectivity, geostationary infrared channels, lightning sensors, AWS stations, and NWP background fields into one model.',
    icon: <Layers className="w-4 h-4 text-sky-600" />,
  },
  {
    num: '02',
    title: 'Hyperlocal Nowcasting',
    subtitle: 'Location-specific short-term prediction',
    desc: 'Focuses on the high-consequence 0–2 hour window, filling the critical operational gap before traditional 6-hour NWP models can update their grid boundaries.',
    icon: <MapPin className="w-4 h-4 text-cyan-600" />,
  },
  {
    num: '03',
    title: 'Separate Lightning Prediction',
    subtitle: 'Lightning risk analysed separately from rain',
    desc: 'Recognizes that lightning danger does not always equal rain intensity. Separates high-shear dry electrical strikes from heavy rain supercells for safety.',
    icon: <Zap className="w-4 h-4 text-amber-600" />,
  },
  {
    num: '04',
    title: 'Storm Trajectory',
    subtitle: 'Estimate movement & direction of storm cells',
    desc: 'Deep neural optical flow estimates the steering vector, forward speed (km/h), and arrival timestamps at downwind districts (+30m, +60m, +120m).',
    icon: <Navigation className="w-4 h-4 text-indigo-600" />,
  },
  {
    num: '05',
    title: 'Explainable AI',
    subtitle: 'Show WHY the system predicts a risk',
    desc: 'Every alert highlights physical meteorological drivers—such as cloud-top cooling rate, rapid flash acceleration, or high CAPE—so meteorologists can verify the reasoning.',
    icon: <Sparkles className="w-4 h-4 text-purple-600" />,
  },
  {
    num: '06',
    title: 'Confidence-Aware',
    subtitle: 'Show prediction confidence & uncertainty',
    desc: 'Quantifies cross-sensor agreement as a percentage score, enabling disaster authorities to distinguish strong signals from borderline observations.',
    icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
  },
];

export const WhyVajraSection: React.FC = () => {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="max-w-3xl mb-6">
        <span className="text-xs font-bold font-mono text-sky-700 uppercase tracking-wider block mb-1">
          KEY INNOVATIONS
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Why VAJRA-X?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Six meteorological and algorithmic innovations designed specifically for Smart India Hackathon problem statement SIH26072.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DIFFERENTIATORS.map((item) => (
          <div
            key={item.num}
            className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-lg font-black text-slate-400">
                  {item.num}
                </span>
                <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  {item.icon}
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-1">
                {item.title}
              </h4>
              <p className="text-[11px] font-semibold text-slate-700 mb-2">
                {item.subtitle}
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
