import React from 'react';
import { Navigation, Radar, Wind } from 'lucide-react';
import {
  LocationPoint,
  NowcastPredictionResult,
} from '../types/nowcast';
import { MapView } from '../components/MapView';
import { StormTrajectory } from '../components/StormTrajectory';
import { RISK_STYLES } from '../components/RiskCard';

interface StormTrackingPageProps {
  nowcast: NowcastPredictionResult;
  selectedLocation: LocationPoint;
  onSelectLocation: (loc: LocationPoint) => void;
  activeTrajectoryStep: number;
  onSelectTrajectoryStep: (idx: number) => void;
  isPlayingForecast: boolean;
  onPlayForecast: () => void;
  onPauseForecast: () => void;
  onResetForecast: () => void;
}

export const StormTrackingPage: React.FC<StormTrackingPageProps> = ({
  nowcast,
  selectedLocation,
  onSelectLocation,
  activeTrajectoryStep,
  onSelectTrajectoryStep,
  isPlayingForecast,
  onPlayForecast,
  onPauseForecast,
  onResetForecast,
}) => {
  return (
    <div className="space-y-6">
      <section className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-1">
              <Navigation className="w-4 h-4" />
              <span>CONVECTIVE CELL ADVECTION &amp; TRAJECTORY TRACKING</span>
              <span>·</span>
              <span className="text-amber-400">SIMULATED DEMO DATA</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
              Storm Trajectory &amp; Multi-Cell Tracking Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Tracking cell centroids across NOW → +30 min → +60 min → +120 min using simulated radar optical flow and 700–500 hPa steering winds.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg p-3">
            <div>
              <span className="text-slate-400 block">Primary Vector</span>
              <strong className="text-sky-400 text-sm">{nowcast.storm_direction}</strong>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <span className="text-slate-400 block">Translation Speed</span>
              <strong className="text-slate-100 text-sm tabular-nums">{nowcast.storm_speed}</strong>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <span className="text-slate-400 block">Intensity Evolution</span>
              <strong className="text-orange-400 text-sm">{nowcast.intensity}</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <MapView
            nowcast={nowcast}
            selectedLocation={selectedLocation}
            onSelectLocation={onSelectLocation}
            activeTrajectoryStepIndex={activeTrajectoryStep}
            heightClass="h-[500px]"
          />
        </div>
        <div className="xl:col-span-4">
          <StormTrajectory
            nowcast={nowcast}
            activeStepIndex={activeTrajectoryStep}
            onSelectStepIndex={onSelectTrajectoryStep}
            isPlaying={isPlayingForecast}
            onPlay={onPlayForecast}
            onPause={onPauseForecast}
            onReset={onResetForecast}
          />
        </div>
      </div>

      <section className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-semibold text-slate-100">
              Active Tracked Storm Cells (All-India Radar Mosaic — Simulated)
            </h2>
          </div>
          <span className="text-xs font-mono text-amber-400">
            SIMULATED DEMO DATA
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Storm Cell ID &amp; Sector</th>
                <th className="py-2.5 px-3">Centroid Coords</th>
                <th className="py-2.5 px-3">Movement Vector</th>
                <th className="py-2.5 px-3 text-right">Speed</th>
                <th className="py-2.5 px-3 text-right">Max Reflectivity</th>
                <th className="py-2.5 px-3 text-right">Cloud-Top Temp</th>
                <th className="py-2.5 px-3 text-right">Risk Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-mono tabular-nums">
              {nowcast.activeStormCells.map((cell) => {
                const rStyle = RISK_STYLES[cell.riskLevel];
                return (
                  <tr key={cell.id} className="hover:bg-slate-900/70 text-slate-200">
                    <td className="py-3 px-3 font-sans font-medium">
                      {cell.name}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {cell.lat.toFixed(2)}°N, {cell.lng.toFixed(2)}°E
                    </td>
                    <td className="py-3 px-3 text-sky-400 font-semibold flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5" />
                      <span>{cell.movementDir}</span>
                    </td>
                    <td className="py-3 px-3 text-right">{cell.speedKmh} km/h</td>
                    <td className="py-3 px-3 text-right text-orange-400 font-semibold">
                      {cell.maxDbz} dBZ
                    </td>
                    <td className="py-3 px-3 text-right text-cyan-300">
                      {cell.cloudTopTempC} °C
                    </td>
                    <td className={`py-3 px-3 text-right font-bold ${rStyle.text}`}>
                      {cell.riskLevel} (TS {cell.thunderstormProb}% / LTG {cell.lightningProb}%)
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
