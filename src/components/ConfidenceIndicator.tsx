import React from 'react';

interface ConfidenceIndicatorProps {
  confidence: number;
  forecastWindow: string;
  compact?: boolean;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  forecastWindow,
  compact = false,
}) => {
  const tierLabel =
    confidence >= 85
      ? 'High Multi-Sensor Agreement'
      : confidence >= 70
      ? 'Moderate Ingestion Consensus'
      : 'Extended Horizon Uncertainty';

  const barColor =
    confidence >= 85
      ? 'bg-sky-600'
      : confidence >= 70
      ? 'bg-amber-500'
      : 'bg-orange-500';

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-slate-700 uppercase">Confidence</span>
          <span className="text-lg font-mono font-bold tabular-nums text-sky-700">
            {confidence}%
          </span>
        </div>
        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className={`h-full ${barColor} transition-transform duration-200 origin-left`}
            style={{ transform: `scaleX(${confidence / 100})` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-bold text-slate-700 tracking-wider uppercase">
            CONFIDENCE
          </span>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
            {forecastWindow}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 mb-2 leading-tight">
          How strongly the available signals support the prediction
        </p>

        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl font-black font-mono tabular-nums text-sky-700">
            {confidence}%
          </span>
          <span className="text-xs font-semibold text-slate-600">
            {tierLabel}
          </span>
        </div>

        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3 border border-slate-200">
          <div
            className={`h-full ${barColor} transition-transform duration-200 origin-left`}
            style={{ transform: `scaleX(${confidence / 100})` }}
          />
        </div>
      </div>

      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span className="text-[10px] text-slate-400">SIMULATED DEMO DATA</span>
        <span className="text-emerald-700 font-semibold">5-Feed Sensor Agreement</span>
      </div>
    </div>
  );
};
