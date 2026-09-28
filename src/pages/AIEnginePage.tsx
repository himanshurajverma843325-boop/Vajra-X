import React from 'react';
import {
  Cpu,
  ArrowDown,
  Code2,
  Layers,
  CheckCircle2,
  AlertOctagon,
} from 'lucide-react';
import { NowcastPredictionResult } from '../types/nowcast';
import { AIExplanation } from '../components/AIExplanation';
import { MultiSourceFusionSection } from '../components/DataSourceCard';
import { ForecastTimeline } from '../components/ForecastTimeline';

interface AIEnginePageProps {
  nowcast: NowcastPredictionResult;
  onRunNowcast: () => void;
}

const ARCHITECTURE_STAGES = [
  {
    step: '01',
    title: 'Data Ingestion',
    detail: 'Multi-Radar (DWR reflectivity & radial velocity), Geostationary Satellite (TIR/WV), Lightning Detection Network (IC/CG flashes), Surface AWS, and NWP model grids.',
  },
  {
    step: '02',
    title: 'Data Cleaning & Synchronization',
    detail: 'Radar clutter removal, beam-blockage correction, satellite parallax adjustment, and outlier rejection on surface AWS readings.',
  },
  {
    step: '03',
    title: 'Spatial / Temporal Alignment',
    detail: 'Re-projection of heterogeneous sensors onto a unified 1 km × 1 km Cartesian grid synchronized at Δt = 5-minute intervals.',
  },
  {
    step: '04',
    title: 'Feature Engineering',
    detail: 'Extraction of Vertically Integrated Liquid (VIL), cloud-top cooling rate (ΔTb/15m), lightning jump (df/dt), CAPE, and 0–6 km bulk wind shear.',
  },
  {
    step: '05',
    title: 'Multi-Source Data Fusion',
    detail: 'Cross-channel feature tensor concatenation combining 3D radar structure, 2D satellite cloud evolution, lightning density grids, and thermodynamic vectors.',
  },
  {
    step: '06',
    title: 'AI/ML Nowcasting Model',
    detail: 'Spatio-temporal inference generating decoupled probabilities for convective thunderstorm cores and electrical discharge risk.',
  },
  {
    step: '07',
    title: 'Prediction (0–120 min & 2–6 hr)',
    detail: 'Outputs thunderstorm_probability, lightning_probability, storm_direction, storm_speed, intensity, and trajectory waypoints.',
  },
  {
    step: '08',
    title: 'Confidence & Explainability',
    detail: 'Computes sensor-agreement confidence score and relative feature attribution bars explaining why risk is classified as LOW / MODERATE / HIGH / SEVERE.',
  },
  {
    step: '09',
    title: 'Risk Map / Alerts',
    detail: 'Renders geospatial hazard contours and triggers sector-specific advisories for Public, Disaster Management, Agriculture, Aviation, and Infrastructure.',
  },
];

const PROPOSED_MODELS = [
  {
    name: 'CNN (Convolutional Neural Network)',
    status: 'Proposed / Possible Model Architecture',
    modality: 'Spatial Feature Extraction (Radar & Satellite Grids)',
    description:
      'Extracts localized spatial morphological signatures such as hook echoes, bow echoes, high-dBZ graupel cores, and overshooting cloud tops from 2D/3D gridded imagery.',
  },
  {
    name: 'ConvLSTM (Convolutional Long Short-Term Memory)',
    status: 'Proposed / Possible Model Architecture',
    modality: 'Spatio-Temporal Sequence Nowcasting (0–120 min)',
    description:
      'Models non-linear storm cell advection, growth, and decay across sequential radar and satellite frames while preserving spatial topology.',
  },
  {
    name: 'LSTM / Bi-LSTM Networks',
    status: 'Proposed / Possible Model Architecture',
    modality: 'Temporal Time-Series (AWS & Lightning Flash Rates)',
    description:
      'Captures rapid temporal trends in surface pressure drops, humidity surges, and intra-cloud lightning jump precursors.',
  },
  {
    name: 'Spatio-Temporal Transformer',
    status: 'Proposed / Possible Model Architecture',
    modality: 'Multi-Modal Cross-Attention Fusion',
    description:
      'Uses multi-head cross-attention to dynamically weight radar, satellite, lightning, and NWP features depending on storm lifecycle stage.',
  },
  {
    name: 'Ensemble Models (Gradient Boosted + Deep Ensemble)',
    status: 'Proposed / Possible Model Architecture',
    modality: 'Calibrated Probability & Confidence Estimation',
    description:
      'Combines spatial deep-learning outputs with thermodynamic tabular classifiers to calibrate thunderstorm vs. lightning probabilities and quantify uncertainty.',
  },
];

export const AIEnginePage: React.FC<AIEnginePageProps> = ({
  nowcast,
  onRunNowcast,
}) => {
  const jsonPreview = {
    thunderstorm_probability: nowcast.thunderstorm_probability,
    lightning_probability: nowcast.lightning_probability,
    storm_location: nowcast.storm_location,
    storm_direction: nowcast.storm_direction,
    storm_speed: nowcast.storm_speed,
    intensity: nowcast.intensity,
    forecast_window: nowcast.forecast_window,
    confidence: nowcast.confidence,
    explanation: nowcast.explanation.map((e) => ({
      factor: e.factor,
      contributionScore: e.contributionScore,
      observedValue: e.observedValue,
    })),
  };

  return (
    <div className="space-y-6">
      <section className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-1">
              <Cpu className="w-4 h-4" />
              <span>AI / ML NOWCASTING ENGINE &amp; ARCHITECTURE</span>
              <span>·</span>
              <span className="text-amber-400">PROTOTYPE DEMONSTRATION</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
              Multi-Source Fusion Pipeline &amp; Model Architecture
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Demonstrating end-to-end data ingestion, spatio-temporal alignment, proposed ML model architectures, and modular <code className="font-mono text-sky-300">predictNowcast(inputData)</code> inference.
            </p>
          </div>

          <button
            type="button"
            onClick={onRunNowcast}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors whitespace-nowrap self-start lg:self-center cursor-pointer"
          >
            Trigger Inference Pipeline
          </button>
        </div>
      </section>

      <MultiSourceFusionSection
        telemetry={nowcast.inputTelemetry}
        thunderstormProb={nowcast.thunderstorm_probability}
        lightningProb={nowcast.lightning_probability}
        confidence={nowcast.confidence}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <div className="pb-3 border-b border-slate-800 mb-4">
            <h2 className="text-sm font-semibold text-slate-100">
              End-to-End Nowcasting Processing Pipeline
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              9-stage operational data flow from raw atmospheric sensors to actionable alerts
            </p>
          </div>

          <div className="space-y-1.5">
            {ARCHITECTURE_STAGES.map((st, idx) => (
              <React.Fragment key={st.step}>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 rounded px-2 py-0.5 shrink-0 mt-0.5">
                    {st.step}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-semibold text-slate-100">
                        {st.title}
                      </h3>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {st.detail}
                    </p>
                  </div>
                </div>
                {idx < ARCHITECTURE_STAGES.length - 1 && (
                  <div className="flex justify-center py-0.5 text-slate-600">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
            <div className="pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <h2 className="text-sm font-semibold text-slate-100">
                    Proposed / Possible Model Architectures
                  </h2>
                </div>
                <span className="text-xs font-mono text-amber-400">
                  Proposed / possible model architectures
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Candidate neural and ensemble blocks designed for multi-modal atmospheric nowcasting. For this SIH prototype, inference is executed by a deterministic modular engine using simulated datasets.
              </p>
            </div>

            <div className="space-y-2.5">
              {PROPOSED_MODELS.map((m) => (
                <div
                  key={m.name}
                  className="p-3 rounded-lg bg-slate-900/70 border border-slate-800"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="text-xs font-semibold text-slate-100">
                      {m.name}
                    </h3>
                    <span className="text-[11px] font-mono text-sky-400">
                      {m.modality}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {m.description}
                  </p>
                  <div className="mt-1.5 text-[10px] font-mono text-amber-400/90">
                    Status: {m.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-slate-100">
                  Live <code className="font-mono text-sky-300">predictNowcast(inputData)</code> Output
                </h2>
              </div>
              <span className="text-xs font-mono text-amber-400">
                MOCK INFERENCE ENGINE
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-80">
              <pre>{JSON.stringify(jsonPreview, null, 2)}</pre>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2 text-xs text-slate-400">
              <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Transparency Note: This prototype uses a deterministic multi-sensor fusion engine (<code className="font-mono text-slate-200">/src/services/nowcastEngine.ts</code> &amp; <code className="font-mono text-slate-200">/api/nowcast</code>) ready for drop-in connection to a Python FastAPI / PyTorch inference backend.
              </span>
            </div>
          </div>
        </div>
      </div>

      <AIExplanation
        explanation={nowcast.explanation}
        riskLevel={nowcast.combinedRiskLevel}
        confidence={nowcast.confidence}
      />

      <ForecastTimeline
        timeline={nowcast.timeline}
        locationName={`${nowcast.storm_location.name}, ${nowcast.storm_location.state}`}
      />
    </div>
  );
};
