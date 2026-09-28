import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Cpu,
  MapPin,
  Sliders,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { DEMO_SCENARIOS, PRESET_LOCATIONS } from '../data/demoDatasets';
import {
  LocationPoint,
  ScenarioId,
  TimeHorizon,
  UserSector,
} from '../types/nowcast';

interface ScenarioSelectorProps {
  demoModeEnabled: boolean;
  onToggleDemoMode: () => void;
  selectedScenario: ScenarioId;
  onSelectScenario: (scenario: ScenarioId) => void;
  selectedHorizon: TimeHorizon;
  onSelectHorizon: (horizon: TimeHorizon) => void;
  selectedLocation: LocationPoint;
  onSelectLocation: (loc: LocationPoint) => void;
  selectedSector: UserSector;
  onSelectSector: (sector: UserSector) => void;
  isPlayingForecast: boolean;
  onPlayForecast: () => void;
  onPauseForecast: () => void;
  onResetForecast: () => void;
  onRunNowcast: () => void;
  pipelineStepIndex: number | null;
}

const PIPELINE_STEPS = [
  { id: 'ingest', label: '01. Data Ingestion', detail: 'Multi-Radar + Satellite + Lightning + AWS + NWP' },
  { id: 'fusion', label: '02. Spatio-Temporal Fusion', detail: '1 km × 1 km Grid Alignment' },
  { id: 'inference', label: '03. AI/ML Inference', detail: 'predictNowcast(inputData) Execution' },
  { id: 'risk', label: '04. Risk Generation', detail: 'Thunderstorm & Lightning Hazard Scoring' },
  { id: 'alerts', label: '05. Alert Generation', detail: 'Sector-Specific Actionable Advisories' },
];

const TIME_HORIZONS: { id: TimeHorizon; label: string }[] = [
  { id: 'NOW', label: 'NOW' },
  { id: '+30m', label: '+30 min' },
  { id: '+60m', label: '+60 min' },
  { id: '+120m', label: '+120 min' },
];

const USER_SECTORS: UserSector[] = [
  'Public',
  'Disaster Management',
  'Agriculture',
  'Aviation',
  'Infrastructure',
];

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  demoModeEnabled,
  onToggleDemoMode,
  selectedScenario,
  onSelectScenario,
  selectedHorizon,
  onSelectHorizon,
  selectedLocation,
  onSelectLocation,
  selectedSector,
  onSelectSector,
  isPlayingForecast,
  onPlayForecast,
  onPauseForecast,
  onResetForecast,
  onRunNowcast,
  pipelineStepIndex,
}) => {
  const scenarios = Object.values(DEMO_SCENARIOS);
  const currentScenarioObj = DEMO_SCENARIOS[selectedScenario];

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <Sliders className="w-4 h-4 text-sky-600 shrink-0" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Interactive Simulation &amp; Nowcast Controls
            </h2>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              SIMULATED DEMO DATA
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            <strong>Active Scenario:</strong> {currentScenarioObj.title} — {currentScenarioObj.subtitle}
          </p>
        </div>

        {/* Action Buttons: Demo Mode Toggle, Run Nowcast, Play / Pause / Reset Forecast */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={onToggleDemoMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
              demoModeEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {demoModeEnabled ? '● DEMO MODE: ACTIVE' : '○ DEMO MODE: PAUSED'}
          </button>

          <button
            type="button"
            onClick={onRunNowcast}
            disabled={pipelineStepIndex !== null}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white transition-all whitespace-nowrap shadow-2xs disabled:opacity-60 cursor-pointer"
          >
            {pipelineStepIndex !== null ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Cpu className="w-3.5 h-3.5" />
            )}
            <span>Run Nowcast</span>
          </button>

          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
            {!isPlayingForecast ? (
              <button
                type="button"
                onClick={onPlayForecast}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-sky-700 hover:bg-white hover:shadow-2xs transition-all whitespace-nowrap cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Forecast</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onPauseForecast}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-all whitespace-nowrap cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </button>
            )}
            <button
              type="button"
              onClick={onResetForecast}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-white transition-all whitespace-nowrap cursor-pointer"
              title="Reset trajectory & time slider to NOW"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Processing Animation Bar when Run Nowcast is clicked */}
      {pipelineStepIndex !== null && (
        <div className="my-4 p-3.5 rounded-lg bg-sky-50/70 border border-sky-200">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono font-bold text-sky-900">
              EXECUTING MULTI-SENSOR NOWCAST FUSION PIPELINE...
            </span>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              Step {pipelineStepIndex + 1} of {PIPELINE_STEPS.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {PIPELINE_STEPS.map((step, idx) => {
              const isDone = idx < pipelineStepIndex;
              const isCurrent = idx === pipelineStepIndex;
              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isCurrent
                      ? 'bg-white border-sky-400 text-sky-900 shadow-2xs font-bold'
                      : isDone
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white/60 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 text-xs font-mono font-semibold">
                    <span className="truncate">{step.label}</span>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    {isCurrent && <Loader2 className="w-3.5 h-3.5 text-sky-600 animate-spin shrink-0" />}
                  </div>
                  <p className="text-[11px] opacity-80 mt-0.5 truncate">{step.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3-Column Control Matrix: 1) 5 Demo Scenarios, 2) Time Horizon Slider, 3) Location & User Sector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 pt-4">
        {/* Scenario Selector (5 scenarios) */}
        <div className="xl:col-span-6">
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            Demonstration Atmospheric Scenarios
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {scenarios.map((sc) => {
              const active = sc.id === selectedScenario;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => onSelectScenario(sc.id)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-sky-50 border-sky-400 text-sky-900 font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="truncate whitespace-nowrap">{sc.shortLabel}</div>
                  <div className="text-[10px] font-mono opacity-75 mt-0.5 tabular-nums">
                    TS {sc.baseThunderstormProb}% · LTG {sc.baseLightningProb}%
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Horizon Slider: NOW -> +30 -> +60 -> +120 min */}
        <div className="xl:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Forecast Time Horizon
            </label>
            <span className="text-xs font-mono font-bold text-sky-700 tabular-nums">
              {selectedHorizon}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {TIME_HORIZONS.map((h) => {
              const active = h.id === selectedHorizon;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => onSelectHorizon(h.id)}
                  className={`py-2 px-2 rounded-md text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {h.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Station Selector & User Sector Selector */}
        <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label
              htmlFor="station-select"
              className="block text-xs font-bold text-slate-700 uppercase mb-2"
            >
              Target District / City
            </label>
            <div className="relative">
              <select
                id="station-select"
                value={selectedLocation.id}
                onChange={(e) => {
                  const found = PRESET_LOCATIONS.find((l) => l.id === e.target.value);
                  if (found) onSelectLocation(found);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                {PRESET_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}, {loc.state}
                  </option>
                ))}
                {!PRESET_LOCATIONS.some((l) => l.id === selectedLocation.id) && (
                  <option value={selectedLocation.id}>
                    {selectedLocation.name} ({selectedLocation.lat.toFixed(2)}°N)
                  </option>
                )}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="sector-select"
              className="block text-xs font-bold text-slate-700 uppercase mb-2"
            >
              User Sector View
            </label>
            <select
              id="sector-select"
              value={selectedSector}
              onChange={(e) => onSelectSector(e.target.value as UserSector)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              {USER_SECTORS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Synoptic summary bar */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span>
            Active Target:{' '}
            <strong className="text-slate-800">
              {selectedLocation.name}, {selectedLocation.state}
            </strong>{' '}
            <span className="font-mono text-slate-400">
              ({selectedLocation.lat.toFixed(2)}°N, {selectedLocation.lng.toFixed(2)}°E ·{' '}
              {selectedLocation.radarStation})
            </span>
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">
          Click any point on the India map to dynamically relocate the target.
        </span>
      </div>
    </section>
  );
};
