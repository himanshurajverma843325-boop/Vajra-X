import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Navigation,
  ArrowDown,
} from 'lucide-react';
import { NowcastPredictionResult } from '../types/nowcast';
import { RISK_STYLES } from './RiskCard';

interface StormTrajectoryProps {
  nowcast: NowcastPredictionResult;
  activeStepIndex: number;
  onSelectStepIndex: (idx: number) => void;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const StormTrajectory: React.FC<StormTrajectoryProps> = ({
  nowcast,
  activeStepIndex,
  onSelectStepIndex,
  isPlaying,
  onPlay,
  onPause,
  onReset,
}) => {
  const waypoints = nowcast.primaryTrajectory;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-sky-600 shrink-0" />
              <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase">
                STORM TRAJECTORY
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Estimated direction and movement of the storm
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {!isPlaying ? (
              <button
                type="button"
                onClick={onPlay}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white transition-colors cursor-pointer shadow-2xs"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Play Forecast</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onPause}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer shadow-2xs"
              >
                <Pause className="w-3 h-3 fill-current" />
                <span>Pause</span>
              </button>
            )}
            <button
              type="button"
              onClick={onReset}
              className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Reset Trajectory"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 my-3.5">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Direction</span>
            <span className="text-sm font-mono font-black text-sky-700 mt-0.5 block">
              {nowcast.storm_direction}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Est. Movement</span>
            <span className="text-sm font-mono font-bold text-slate-900 tabular-nums mt-0.5 block">
              {nowcast.storm_speed}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Intensity</span>
            <span className="text-xs font-mono font-bold text-orange-700 mt-1 block truncate">
              {nowcast.intensity}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          {waypoints.map((wp, idx) => {
            const isSelected = idx === activeStepIndex;
            const rStyle = RISK_STYLES[wp.riskLevel];
            const stepTitle =
              idx === 0 ? 'Current Storm Position (NOW)' : wp.step;

            return (
              <React.Fragment key={wp.step}>
                <button
                  type="button"
                  onClick={() => onSelectStepIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 border-sky-400 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${rStyle.dot}`}
                      />
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {stepTitle}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5 tabular-nums">
                      {wp.lat.toFixed(2)}°N, {wp.lng.toFixed(2)}°E · {wp.intensityLabel}
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono">
                    <div className={`text-xs font-black ${rStyle.text}`}>
                      {wp.riskLevel}
                    </div>
                    <div className="text-[11px] text-slate-500 tabular-nums">
                      {wp.reflectivityDbz} dBZ · {wp.speedKmh} km/h
                    </div>
                  </div>
                </button>

                {idx < waypoints.length - 1 && (
                  <div className="flex justify-center py-0.5 text-slate-400">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Click any step to scrub trajectory</span>
        <span className="font-semibold text-slate-700">Step {activeStepIndex + 1}/4</span>
      </div>
    </div>
  );
};
