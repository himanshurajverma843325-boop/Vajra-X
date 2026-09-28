import React, { useState } from 'react';
import { Layers, Clock, MapPin } from 'lucide-react';
import { PRESET_LOCATIONS } from '../data/demoDatasets';
import {
  LocationPoint,
  NowcastPredictionResult,
  ScenarioId,
  TimeHorizon,
} from '../types/nowcast';
import {
  buildAtmosphericInput,
  predictNowcast,
} from '../services/nowcastEngine';
import { MapView } from '../components/MapView';
import { RISK_STYLES } from '../components/RiskCard';

interface RiskMapPageProps {
  nowcast: NowcastPredictionResult;
  selectedLocation: LocationPoint;
  onSelectLocation: (loc: LocationPoint) => void;
  selectedScenario: ScenarioId;
  selectedHorizon: TimeHorizon;
  onSelectHorizon: (horizon: TimeHorizon) => void;
}

export const RiskMapPage: React.FC<RiskMapPageProps> = ({
  nowcast,
  selectedLocation,
  onSelectLocation,
  selectedScenario,
  selectedHorizon,
  onSelectHorizon,
}) => {
  const [mapMode, setMapMode] = useState<'combined' | 'thunderstorm' | 'lightning'>('combined');

  const timeFilters: { id: TimeHorizon; label: string }[] = [
    { id: 'NOW', label: '0–30 min (Immediate)' },
    { id: '+30m', label: '30–60 min (Peak Window)' },
    { id: '+60m', label: '60–120 min (Extended)' },
  ];

  const stationMatrix = PRESET_LOCATIONS.map((loc) => {
    const inp = buildAtmosphericInput(loc, selectedScenario, selectedHorizon);
    const pred = predictNowcast(inp);
    return {
      loc,
      tsProb: pred.thunderstorm_probability,
      ltgProb: pred.lightning_probability,
      tsRisk: pred.thunderstormRiskLevel,
      ltgRisk: pred.lightningRiskLevel,
      combRisk: pred.combinedRiskLevel,
      dbz: pred.inputTelemetry.radarReflectivityDbz,
      flashes: pred.inputTelemetry.totalFlashRatePerMin,
    };
  });

  return (
    <div className="space-y-6">
      <section className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-1">
              <Layers className="w-4 h-4" />
              <span>GEOSPATIAL HAZARD CLASSIFICATION</span>
              <span>·</span>
              <span className="text-amber-400">SIMULATED DEMO DATA</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
              Multi-Hazard Risk Map (Thunderstorm · Lightning · Combined)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Toggle between decoupled Thunderstorm Risk, Lightning Risk, and Combined Hazard layers across forecast windows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800">
              {(
                [
                  { id: 'thunderstorm', label: 'Thunderstorm Risk Map' },
                  { id: 'lightning', label: 'Lightning Risk Map' },
                  { id: 'combined', label: 'Combined Hazard Map' },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setMapMode(mode.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    mapMode === mode.id
                      ? 'bg-sky-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1 shrink-0" />
              {timeFilters.map((tf) => (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => onSelectHorizon(tf.id)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-mono font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedHorizon === tf.id
                      ? 'bg-orange-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MapView
        nowcast={nowcast}
        selectedLocation={selectedLocation}
        onSelectLocation={onSelectLocation}
        hazardLayerMode={mapMode}
        heightClass="h-[540px]"
      />

      <section className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              All-India Meteorological Sector Risk Matrix (Click any row to focus map)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparing separate Thunderstorm Probability, Lightning Probability, and Combined Risk across 12 monitored sectors
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400">
            SIMULATED DEMO DATA
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Station / Region</th>
                <th className="py-2.5 px-3">DWR Coverage</th>
                <th className="py-2.5 px-3 text-right">Thunderstorm Prob</th>
                <th className="py-2.5 px-3 text-right">Lightning Prob</th>
                <th className="py-2.5 px-3 text-right">Radar Core</th>
                <th className="py-2.5 px-3 text-right">Flash Rate</th>
                <th className="py-2.5 px-3 text-right">Combined Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-mono tabular-nums">
              {stationMatrix.map((row) => {
                const isSelected = row.loc.id === selectedLocation.id;
                const cStyle = RISK_STYLES[row.combRisk];
                return (
                  <tr
                    key={row.loc.id}
                    onClick={() => onSelectLocation(row.loc)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-sky-500/15 text-slate-100'
                        : 'hover:bg-slate-900/80 text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-sans font-medium flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>
                        {row.loc.name}, <span className="text-slate-400">{row.loc.state}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{row.loc.radarStation}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-orange-400">
                      {row.tsProb}% ({row.tsRisk})
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-amber-400">
                      {row.ltgProb}% ({row.ltgRisk})
                    </td>
                    <td className="py-2.5 px-3 text-right">{row.dbz} dBZ</td>
                    <td className="py-2.5 px-3 text-right">{row.flashes} fl/min</td>
                    <td className={`py-2.5 px-3 text-right font-bold ${cStyle.text}`}>
                      {row.combRisk}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
