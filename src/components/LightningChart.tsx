import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Zap, TrendingUp } from 'lucide-react';
import { NowcastPredictionResult } from '../types/nowcast';

interface LightningChartProps {
  nowcast: NowcastPredictionResult;
  compact?: boolean;
}

export const LightningChart: React.FC<LightningChartProps> = ({
  nowcast,
  compact = false,
}) => {
  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <h3 className="text-sm font-semibold text-slate-100">
                Lightning Flash Density &amp; Electrification Analysis
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Intra-Cloud (IC) vs Cloud-to-Ground (CG) flash rates &amp; decoupled risk estimation
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400">
            SIMULATED DEMO DATA
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 my-3.5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
            <span className="text-xs text-slate-400 block">
              Lightning Probability
            </span>
            <span className="text-xl font-mono font-bold text-amber-400 tabular-nums mt-0.5 block">
              {nowcast.lightning_probability}%
            </span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
            <span className="text-xs text-slate-400 block">Strike Density</span>
            <span className="text-xl font-mono font-bold text-orange-400 mt-0.5 block">
              {nowcast.lightningStrikeDensity}
            </span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
            <span className="text-xs text-slate-400 block">Trend</span>
            <span className="text-sm sm:text-base font-mono font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>{nowcast.lightningTrend}</span>
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900 border border-amber-500/30 mb-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold text-amber-300">
              KEY SCIENTIFIC PRINCIPLE: Lightning Risk ≠ Thunderstorm Risk
            </span>
            <span className="text-xs font-mono text-slate-300 tabular-nums">
              TS: {nowcast.thunderstorm_probability}% vs LTG: {nowcast.lightning_probability}%
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            VAJRA-X separately estimates thunderstorm (precipitation/wind core) and lightning (mixed-phase graupel-ice collision charging) hazards. Anvil lightning strikes can occur 15–25 km outside the heavy rainfall core.
          </p>
        </div>

        <div className={compact ? 'h-52 w-full' : 'h-64 w-full'}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={nowcast.lightningTimeSeries}
              margin={{ top: 8, right: 12, left: -14, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis
                dataKey="timeLabel"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#38BDF8"
                fontSize={11}
                tickLine={false}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar
                yAxisId="left"
                dataKey="intraCloud"
                name="Intra-Cloud Flashes/min"
                stackId="a"
                fill="#38BDF8"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="cloudToGround"
                name="Cloud-to-Ground Strikes/min"
                stackId="a"
                fill="#FACC15"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="lightningProb"
                name="Lightning Prob (%)"
                stroke="#F97316"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 tabular-nums">
        <span>
          Flash Rate: {nowcast.inputTelemetry.totalFlashRatePerMin} fl/min · +CG Ratio: {nowcast.inputTelemetry.positiveCgRatioPercent}%
        </span>
        <span>SIMULATED DEMO DATA</span>
      </div>
    </div>
  );
};
