import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Clock, ArrowRight } from 'lucide-react';
import { TimelineSlot } from '../types/nowcast';
import { RISK_STYLES } from './RiskCard';

interface ForecastTimelineProps {
  timeline: TimelineSlot[];
  locationName: string;
}

export const ForecastTimeline: React.FC<ForecastTimelineProps> = ({
  timeline,
  locationName,
}) => {
  return (
    <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600 shrink-0" />
            <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase">
              Short-Term Nowcast Horizon Timeline (NOW → 6 Hours)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Target: <strong className="text-slate-800">{locationName}</strong> · Separate Thunderstorm &amp; Lightning progression
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
          SIMULATED DEMO DATA
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
        {timeline.map((slot, index) => {
          const style = RISK_STYLES[slot.riskLevel];
          const isPeakWindow = slot.windowLabel === '30–60 min';

          return (
            <div
              key={slot.id}
              className={`relative rounded-xl p-3.5 border transition-all ${
                isPeakWindow
                  ? 'bg-sky-50/70 border-sky-300 shadow-xs'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2.5">
                <span className="text-xs font-mono font-bold text-slate-900">
                  {slot.windowLabel}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${style.badgeBg}`}>
                  {slot.riskLevel}
                </span>
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Thunderstorm</span>
                  <span className="font-mono font-bold tabular-nums text-orange-700">
                    {slot.thunderstormProbability}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-600 origin-left"
                    style={{ transform: `scaleX(${slot.thunderstormProbability / 100})` }}
                  />
                </div>
              </div>

              <div className="mb-2.5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Lightning</span>
                  <span className="font-mono font-bold tabular-nums text-amber-700">
                    {slot.lightningProbability}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 origin-left"
                    style={{ transform: `scaleX(${slot.lightningProbability / 100})` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500 tabular-nums">
                <span>Conf: <strong className="text-sky-700">{slot.confidence}%</strong></span>
                <span>{slot.expectedReflectivityDbz} dBZ</span>
              </div>

              {index < timeline.length - 1 && (
                <div className="hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-white border border-slate-300 items-center justify-center text-slate-400 shadow-2xs">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700">
            Probability Decay Curve &amp; Calibration Spread
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            Peak Convective Window: 30–60 min
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timeline}
              margin={{ top: 8, right: 16, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EA580C" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EA580C" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="ltgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D97706" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="windowLabel"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  borderRadius: '10px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#0F172A',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area
                type="monotone"
                dataKey="thunderstormProbability"
                name="Thunderstorm Probability (%)"
                stroke="#EA580C"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#tsGrad)"
              />
              <Area
                type="monotone"
                dataKey="lightningProbability"
                name="Lightning Probability (%)"
                stroke="#D97706"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#ltgGrad)"
              />
              <Area
                type="monotone"
                dataKey="confidence"
                name="Prediction Confidence (%)"
                stroke="#0284C7"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};
