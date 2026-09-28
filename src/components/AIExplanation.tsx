import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { ExplanationFactor, RiskLevel } from '../types/nowcast';
import { RISK_STYLES } from './RiskCard';

interface AIExplanationProps {
  explanation: ExplanationFactor[];
  riskLevel: RiskLevel;
  confidence: number;
}

export const AIExplanation: React.FC<AIExplanationProps> = ({
  explanation,
  riskLevel,
  confidence,
}) => {
  const style = RISK_STYLES[riskLevel];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Why is the system predicting{' '}
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${style.badgeBg}`}>
                  {riskLevel}
                </span>{' '}
                risk?
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Explainable AI (XAI) multi-sensor feature attribution &amp; atmospheric drivers
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 shrink-0 tabular-nums">
            Conf: {confidence}%
          </span>
        </div>

        <div className="space-y-3.5 my-4">
          {explanation.map((item) => {
            const barColor =
              item.contributionScore >= 85
                ? 'bg-orange-500'
                : item.contributionScore >= 75
                ? 'bg-amber-500'
                : 'bg-sky-600';

            return (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="font-bold text-slate-900">
                    + {item.factor}
                  </span>
                  <span className="font-mono text-slate-600 text-[11px] tabular-nums">
                    {item.observedValue} ·{' '}
                    <strong className="text-sky-700">{item.contributionScore}% impact</strong>
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`h-full ${barColor} transition-transform duration-200 origin-left`}
                    style={{ transform: `scaleX(${item.contributionScore / 100})` }}
                  />
                </div>

                <p className="text-[11px] text-slate-600 leading-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Verified via gradient saliency</span>
        <span className="text-slate-700 font-semibold">Normalized SHAP weights</span>
      </div>
    </div>
  );
};
