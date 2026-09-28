import React from 'react';
import { AlertTriangle, ShieldAlert, Zap, Navigation } from 'lucide-react';
import { AlertItem, UserSector } from '../types/nowcast';
import { RISK_STYLES } from './RiskCard';

interface AlertCardProps {
  alert: AlertItem;
  selectedSector: UserSector;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  selectedSector,
}) => {
  const style = RISK_STYLES[alert.riskLevel];

  const getAlertIcon = () => {
    if (alert.type === 'LIGHTNING ALERT') {
      return <Zap className="w-4 h-4 text-amber-400 shrink-0" />;
    }
    if (alert.type === 'MOVEMENT ALERT') {
      return <Navigation className="w-4 h-4 text-sky-400 shrink-0" />;
    }
    return <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />;
  };

  return (
    <div
      className={`bg-[#0F172A] border ${style.border} rounded-xl p-4 flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {getAlertIcon()}
            <span className="text-xs font-mono font-bold text-slate-100">
              {alert.type}
            </span>
            <span className="text-slate-600">·</span>
            <span className={`text-xs font-mono font-bold ${style.text}`}>
              {alert.riskLevel}
            </span>
          </div>
          <span className="text-xs font-mono text-sky-400 tabular-nums">
            {alert.forecastWindow}
          </span>
        </div>

        <div className="mt-2.5">
          <div className="text-xs font-mono text-slate-400">
            Location: <strong className="text-slate-200">{alert.location}</strong>
          </div>
          <h4 className="text-sm font-semibold text-slate-100 mt-1">
            {alert.title}
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            <strong className="text-slate-200">Reason:</strong> {alert.reason}
          </p>
        </div>

        <div className="mt-3 p-3 rounded-lg bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-sky-400 mb-1">
            <span className="flex items-center gap-1.5 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>RECOMMENDED ACTION ({selectedSector.toUpperCase()})</span>
            </span>
            <span className="tabular-nums">Conf: {alert.confidence}%</span>
          </div>
          <p className="text-xs text-slate-200 font-medium">
            {alert.recommendedActions[selectedSector]}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] font-mono text-amber-400/90">
        <span>Prototype advisory example — not an official warning</span>
        <span>SIMULATED</span>
      </div>
    </div>
  );
};
