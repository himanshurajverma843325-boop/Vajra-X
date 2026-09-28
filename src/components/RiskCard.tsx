import React from 'react';
import { RiskLevel } from '../types/nowcast';

interface RiskCardProps {
  title: string;
  subtitle?: string;
  value: string;
  subValue?: string;
  riskLevel?: RiskLevel;
  probabilityPercent?: number;
  footnote?: string;
  icon?: React.ReactNode;
}

export const RISK_STYLES: Record<
  RiskLevel,
  {
    text: string;
    bg: string;
    border: string;
    bar: string;
    dot: string;
    label: string;
    badgeBg: string;
  }
> = {
  LOW: {
    text: 'text-emerald-700',
    bg: 'bg-white',
    border: 'border-emerald-200',
    bar: 'bg-emerald-600',
    dot: 'bg-emerald-500',
    label: 'LOW RISK',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  MODERATE: {
    text: 'text-amber-700',
    bg: 'bg-white',
    border: 'border-amber-200',
    bar: 'bg-amber-500',
    dot: 'bg-amber-500',
    label: 'MODERATE RISK',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  HIGH: {
    text: 'text-orange-700',
    bg: 'bg-white',
    border: 'border-orange-200',
    bar: 'bg-orange-600',
    dot: 'bg-orange-500',
    label: 'HIGH RISK',
    badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
  },
  SEVERE: {
    text: 'text-red-700',
    bg: 'bg-white',
    border: 'border-red-200',
    bar: 'bg-red-600',
    dot: 'bg-red-500',
    label: 'SEVERE RISK',
    badgeBg: 'bg-red-50 text-red-800 border-red-200',
  },
};

export const RiskCard: React.FC<RiskCardProps> = ({
  title,
  subtitle,
  value,
  subValue,
  riskLevel,
  probabilityPercent,
  footnote = 'SIMULATED DEMO DATA',
  icon,
}) => {
  const style = riskLevel ? RISK_STYLES[riskLevel] : null;

  return (
    <div
      className={`bg-white border ${
        style ? style.border : 'border-slate-200'
      } rounded-xl p-4 flex flex-col justify-between shadow-xs transition-colors duration-150`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-bold text-slate-700 tracking-wider uppercase">
            {title}
          </span>
          {icon && <span className="text-slate-500 shrink-0">{icon}</span>}
        </div>

        {subtitle && (
          <p className="text-[11px] text-slate-500 mb-2.5 leading-tight">
            {subtitle}
          </p>
        )}

        <div className="flex items-baseline justify-between gap-2">
          <span
            className={`text-2xl font-black font-mono tabular-nums tracking-tight ${
              style ? style.text : 'text-slate-900'
            }`}
          >
            {value}
          </span>
          {probabilityPercent !== undefined && (
            <span className="text-sm font-mono tabular-nums text-slate-700 font-bold">
              {probabilityPercent}%
            </span>
          )}
        </div>

        {subValue && (
          <p className="text-xs text-slate-600 mt-1 font-mono tabular-nums">
            {subValue}
          </p>
        )}

        {probabilityPercent !== undefined && style && (
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full ${style.bar} transition-transform duration-200 origin-left`}
              style={{ transform: `scaleX(${Math.min(100, Math.max(0, probabilityPercent)) / 100})` }}
            />
          </div>
        )}
      </div>

      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span className="text-[10px] text-slate-400">{footnote}</span>
        {riskLevel && (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1.5 ${
              style ? style.badgeBg : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${style?.dot}`} />
            {riskLevel}
          </span>
        )}
      </div>
    </div>
  );
};
