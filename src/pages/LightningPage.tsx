import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Zap, TrendingUp, CloudRain } from 'lucide-react';
import {
  LocationPoint,
  NowcastPredictionResult,
} from '../types/nowcast';
import { LightningChart } from '../components/LightningChart';
import { MapView } from '../components/MapView';
import { RISK_STYLES } from '../components/RiskCard';

interface LightningPageProps {
  nowcast: NowcastPredictionResult;
  selectedLocation: LocationPoint;
  onSelectLocation: (loc: LocationPoint) => void;
}

export const LightningPage: React.FC<LightningPageProps> = ({
  nowcast,
  selectedLocation,
  onSelectLocation,
}) => {
  const ltgStyle = RISK_STYLES[nowcast.lightningRiskLevel];
  const tsStyle = RISK_STYLES[nowcast.thunderstormRiskLevel];

  return (
    <div className="space-y-6">
      <section className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <Zap className="w-4 h-4" />
              <span>ATMOSPHERIC ELECTRIFICATION &amp; FLASH DENSITY</span>
              <span>·</span>
              <span>SIMULATED DEMO DATA</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
              Dedicated Lightning Nowcasting &amp; Strike Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Target Sector: <strong className="text-sky-400">{selectedLocation.name}, {selectedLocation.state}</strong> · Tracking total flash rate, IC/CG polarity, and decoupled lightning hazard.
            </p>
          </div>

          <div className="bg-slate-900 border border-amber-500/40 rounded-lg p-3 text-xs font-mono">
            <div className="text-amber-400 font-bold">
              Lightning Risk ≠ Thunderstorm Risk
            </div>
            <div className="text-slate-300 mt-0.5">
              Separate neural/ensemble heads for precipitation core vs. electrical discharge
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 block">Lightning Probability</span>
            <span className="text-2xl font-mono font-bold text-amber-400 tabular-nums mt-1 block">
              {nowcast.lightning_probability}%
            </span>
            <span className="text-[11px] font-mono text-slate-400 mt-2 block">
              SIMULATED DEMO DATA
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 block">Strike Density</span>
            <span className="text-2xl font-mono font-bold text-orange-400 mt-1 block">
              {nowcast.lightningStrikeDensity}
            </span>
            <span className="text-[11px] font-mono text-slate-400 mt-2 block tabular-nums">
              {nowcast.inputTelemetry.cloudToGroundStrikeDensity} CG flashes/km²/15m
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 block">Trend</span>
            <span className="text-xl font-mono font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5" />
              <span>{nowcast.lightningTrend}</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400 mt-2 block tabular-nums">
              Total Rate: {nowcast.inputTelemetry.totalFlashRatePerMin} flashes/min
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 block">Risk Classification</span>
            <span className={`text-2xl font-mono font-bold ${ltgStyle.text} mt-1 block`}>
              {nowcast.lightningRiskLevel}
            </span>
            <span className="text-[11px] font-mono text-slate-400 mt-2 block tabular-nums">
              +CG High-Current Ratio: {nowcast.inputTelemetry.positiveCgRatioPercent}%
            </span>
          </div>
        </div>
      </section>

      <section className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <div className="pb-3 border-b border-slate-800 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Decoupled Hazard Estimation: Why Lightning Risk ≠ Thunderstorm Risk
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              VAJRA-X models electrical charge separation independently from rainfall reflectivity
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400">
            SIMULATED DEMO DATA
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-orange-500/30">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400 mb-2">
                <CloudRain className="w-4 h-4" />
                <span>THUNDERSTORM RISK ({nowcast.thunderstorm_probability}%)</span>
              </div>
              <div className={`text-lg font-mono font-bold ${tsStyle.text} mb-2`}>
                Classification: {nowcast.thunderstormRiskLevel}
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>• Driven by lower/mid-level radar reflectivity ({nowcast.inputTelemetry.radarReflectivityDbz} dBZ) &amp; VIL ({nowcast.inputTelemetry.verticallyIntegratedLiquid} kg/m²).</li>
                <li>• Governs heavy downpours, localized flash flooding, and convective downdraft gusts.</li>
                <li>• Spatially concentrated inside the 35–55 dBZ precipitation core.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-2">
                <Zap className="w-4 h-4" />
                <span>LIGHTNING RISK ({nowcast.lightning_probability}%)</span>
              </div>
              <div className={`text-lg font-mono font-bold ${ltgStyle.text} mb-2`}>
                Classification: {nowcast.lightningRiskLevel}
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>• Driven by non-inductive graupel–ice crystal collisions in the -10 °C to -30 °C charging zone.</li>
                <li>• Positive Cloud-to-Ground (+CG) &ldquo;bolts from the blue&rdquo; can strike 15–25 km ahead via upper anvil overhang.</li>
                <li>• Try selecting <strong>Scenario 4 (Lightning Intensive)</strong> above to observe 93% Lightning vs 74% Thunderstorm risk.</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-6 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={nowcast.lightningTimeSeries}
                margin={{ top: 8, right: 16, left: -12, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="timeLabel" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 100]} unit="%" />
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
                <Line
                  type="monotone"
                  dataKey="lightningProb"
                  name="Lightning Risk Probability (%)"
                  stroke="#FACC15"
                  strokeWidth={2.5}
                  dot={{ r: 3.5 }}
                />
                <Line
                  type="monotone"
                  dataKey="thunderstormProb"
                  name="Thunderstorm Risk Probability (%)"
                  stroke="#F97316"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-6">
          <LightningChart nowcast={nowcast} />
        </div>
        <div className="xl:col-span-6">
          <MapView
            nowcast={nowcast}
            selectedLocation={selectedLocation}
            onSelectLocation={onSelectLocation}
            hazardLayerMode="lightning"
            heightClass="h-[460px]"
          />
        </div>
      </div>
    </div>
  );
};
