import React from 'react';
import {
  Radio,
  Satellite,
  Zap,
  Wind,
  Cpu,
  ArrowRight,
  Layers,
  Sparkles,
  MapPin,
  ShieldAlert,
  Users,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export const HowItWorksPipeline: React.FC = () => {
  return (
    <section id="how-it-works-section" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs mb-8">
      {/* Section Header */}
      <div className="max-w-3xl mb-8">
        <span className="text-xs font-bold font-mono text-sky-700 tracking-wider uppercase block mb-1">
          ARCHITECTURAL PIPELINE
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          How VAJRA-X Works
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
          From multi-sensor observations across India to synchronized tensor fusion, explainable risk probabilities, and life-saving sector directives.
        </p>
      </div>

      {/* Visual Left-to-Right 5-Step Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative">
        {/* STEP 1: DATA COLLECTION */}
        <div className="flex flex-col rounded-xl bg-slate-50 border border-slate-200 p-4 justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                STEP 1
              </span>
              <span className="text-[11px] font-black text-slate-700 uppercase">
                DATA COLLECTION
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              5 synchronous sensor networks
            </p>

            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">RADAR</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  Storm structure & reflectivity
                </p>
              </div>

              <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Satellite className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">SATELLITE</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  Cloud development
                </p>
              </div>

              <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">LIGHTNING</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  Strike activity
                </p>
              </div>

              <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Wind className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">ATMOSPHERIC DATA</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  Temperature • Humidity • Wind
                </p>
              </div>

              <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">NWP / MODEL DATA</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  Atmospheric forecast guidance
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-center text-sky-700 text-xs font-bold gap-1">
            <span>Fusing into Step 2</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* STEP 2: DATA FUSION */}
        <div className="flex flex-col rounded-xl bg-slate-50 border border-slate-200 p-4 justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                STEP 2
              </span>
              <span className="text-[11px] font-black text-slate-700 uppercase">
                DATA FUSION
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-cyan-50 border border-cyan-200 mb-3 text-center">
              <span className="text-xs font-black text-cyan-900 tracking-tight block">
                MULTI-SOURCE AI/ML FUSION
              </span>
            </div>

            {/* Vertical Flow Steps */}
            <div className="space-y-1.5 font-mono text-[11px] text-center">
              <div className="p-1.5 rounded bg-white border border-slate-200 text-slate-800 font-semibold">
                Clean
              </div>
              <div className="text-slate-400 text-[10px]">↓</div>
              <div className="p-1.5 rounded bg-white border border-slate-200 text-slate-800 font-semibold">
                Synchronize
              </div>
              <div className="text-slate-400 text-[10px]">↓</div>
              <div className="p-1.5 rounded bg-white border border-slate-200 text-slate-800 font-semibold">
                Align
              </div>
              <div className="text-slate-400 text-[10px]">↓</div>
              <div className="p-1.5 rounded bg-white border border-slate-200 text-slate-800 font-semibold">
                Extract Features
              </div>
              <div className="text-slate-400 text-[10px]">↓</div>
              <div className="p-1.5 rounded bg-cyan-600 text-white font-bold">
                Fuse
              </div>
            </div>

            <p className="text-[11px] text-slate-600 mt-4 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
              “Different observations are synchronized on the same spatial and temporal grid.”
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-center text-cyan-700 text-xs font-bold gap-1">
            <span>Inferring Step 3</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* STEP 3: NOWCASTING ENGINE */}
        <div className="flex flex-col rounded-xl bg-slate-50 border border-slate-200 p-4 justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                STEP 3
              </span>
              <span className="text-[11px] font-black text-slate-700 uppercase">
                NOWCASTING ENGINE
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 mb-3 text-center">
              <span className="text-xs font-black text-indigo-900 tracking-tight block">
                AI NOWCAST (0–2 HR)
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              4 primary model outputs:
            </p>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">01 Output</span>
                <span className="text-xs font-bold text-slate-900 block">
                  Thunderstorm Probability
                </span>
                <span className="text-[10px] text-slate-500">Convective rain/hail likelihood</span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">02 Output</span>
                <span className="text-xs font-bold text-slate-900 block">
                  Lightning Probability
                </span>
                <span className="text-[10px] text-slate-500">Separate dielectric breakdown</span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">03 Output</span>
                <span className="text-xs font-bold text-slate-900 block">
                  Storm Movement
                </span>
                <span className="text-[10px] text-slate-500">Speed (km/h) & bearing vector</span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">04 Output</span>
                <span className="text-xs font-bold text-slate-900 block">
                  Storm Intensity
                </span>
                <span className="text-[10px] text-slate-500">Reflectivity dBZ & VIL density</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-center text-indigo-700 text-xs font-bold gap-1">
            <span>Evaluating Step 4</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* STEP 4: RISK ANALYSIS */}
        <div className="flex flex-col rounded-xl bg-slate-50 border border-slate-200 p-4 justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                STEP 4
              </span>
              <span className="text-[11px] font-black text-slate-700 uppercase">
                RISK ANALYSIS
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 mb-3 text-center">
              <span className="text-xs font-black text-amber-900 tracking-tight block">
                SPATIAL & CONFIDENCE
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              Triangulating risk context:
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-bold text-slate-900">Risk Map</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Geospatial contouring across Indian districts with Low, Moderate, High, Severe grading.
                </p>
              </div>

              <div className="text-center font-bold text-slate-400 text-xs">+</div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Confidence</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Multi-signal sensor agreement percentage so decision makers know data certainty.
                </p>
              </div>

              <div className="text-center font-bold text-slate-400 text-xs">+</div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">Explainable Factors</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Explains exactly WHY the model raised the alarm (cooling rates, CAPE, flash rate jumps).
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-center text-amber-700 text-xs font-bold gap-1">
            <span>Triggering Step 5</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* STEP 5: ACTIONABLE ALERT */}
        <div className="flex flex-col rounded-xl bg-slate-50 border border-slate-200 p-4 justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                STEP 5
              </span>
              <span className="text-[11px] font-black text-slate-700 uppercase">
                ACTIONABLE ALERT
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 mb-3 text-center">
              <span className="text-xs font-black text-emerald-900 tracking-tight block">
                TARGETED PROTOCOLS
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              Sector-specific directives:
            </p>

            <div className="space-y-1.5 text-xs font-semibold">
              <div className="p-2 rounded bg-white border border-slate-200 text-slate-800 flex items-center justify-between">
                <span>PUBLIC</span>
                <span className="text-[10px] text-slate-500 font-normal">Shelter & safety</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200 text-slate-800 flex items-center justify-between">
                <span>DISASTER MGMT</span>
                <span className="text-[10px] text-slate-500 font-normal">DDMA readiness</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200 text-slate-800 flex items-center justify-between">
                <span>AGRICULTURE</span>
                <span className="text-[10px] text-slate-500 font-normal">Open field exit</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200 text-slate-800 flex items-center justify-between">
                <span>AVIATION</span>
                <span className="text-[10px] text-slate-500 font-normal">Terminal routing</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200 text-slate-800 flex items-center justify-between">
                <span>INFRASTRUCTURE</span>
                <span className="text-[10px] text-slate-500 font-normal">Grid surge arrest</span>
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-lg bg-emerald-600 text-white text-center font-bold text-xs shadow-2xs">
              “Prediction → Understanding → Action”
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-center text-slate-400 text-[10px] font-mono">
            Life-critical warning latency &lt; 30 sec
          </div>
        </div>
      </div>
    </section>
  );
};
