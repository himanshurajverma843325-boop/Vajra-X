import React from 'react';
import {
  Radar,
  Satellite,
  Zap,
  Thermometer,
  Cpu,
  ArrowDown,
  ArrowRight,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import { AtmosphericInputData, DataSourceMetadata } from '../types/nowcast';

interface DataSourceCardProps {
  source: DataSourceMetadata;
}

export const DataSourceCard: React.FC<DataSourceCardProps> = ({ source }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            {source.name}
          </h3>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 tabular-nums">
            Fusion Weight: {source.fusionWeightPercent}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3.5 text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5 font-medium">Data Type</span>
            <span className="text-slate-800 font-bold">{source.dataType}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5 font-medium">Cadence &amp; Grid</span>
            <span className="text-slate-800 font-mono text-[11px]">
              {source.updateFrequency} · {source.spatialResolution}
            </span>
          </div>
        </div>

        <div className="mb-3.5">
          <span className="text-xs text-slate-500 font-semibold block mb-1.5">
            Typical Observed / Assimilated Variables:
          </span>
          <ul className="space-y-1 text-xs text-slate-700 font-mono">
            {source.typicalVariables.map((v) => (
              <li key={v} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900 block mb-0.5">Role in VAJRA-X Nowcasting:</strong>
          {source.roleInNowcasting}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span className="text-sky-700 font-semibold truncate max-w-[200px]">
          Sample: {source.sampleSimulatedReading}
        </span>
        <span className="text-[10px] text-slate-400">DEMO METADATA</span>
      </div>
    </div>
  );
};

interface MultiSourceFusionSectionProps {
  telemetry: AtmosphericInputData;
  thunderstormProb: number;
  lightningProb: number;
  confidence: number;
}

export const MultiSourceFusionSection: React.FC<MultiSourceFusionSectionProps> = ({
  telemetry,
  thunderstormProb,
  lightningProb,
  confidence,
}) => {
  const inputs = [
    {
      number: '01',
      title: 'MULTIPLE RADARS',
      icon: <Radar className="w-4 h-4 text-sky-600" />,
      items: ['Radar reflectivity', 'Storm structure', 'Movement'],
      liveReadout: `${telemetry.radarReflectivityDbz} dBZ · VIL ${telemetry.verticallyIntegratedLiquid} kg/m²`,
    },
    {
      number: '02',
      title: 'SATELLITE',
      icon: <Satellite className="w-4 h-4 text-indigo-600" />,
      items: ['Cloud-top information', 'Cloud growth', 'Infrared channels'],
      liveReadout: `Top ${telemetry.cloudTopTempC} °C · ΔT ${telemetry.cloudCoolingRateCPer15m} °C/15m`,
    },
    {
      number: '03',
      title: 'LIGHTNING',
      icon: <Zap className="w-4 h-4 text-amber-600" />,
      items: ['Lightning strikes', 'Strike density', 'Flash jump trend'],
      liveReadout: `${telemetry.totalFlashRatePerMin} fl/min · ${telemetry.cloudToGroundStrikeDensity} CG/km²`,
    },
    {
      number: '04',
      title: 'ATMOSPHERIC OBSERVATIONS',
      icon: <Thermometer className="w-4 h-4 text-teal-600" />,
      items: ['Temperature', 'Humidity', 'Surface pressure & wind'],
      liveReadout: `${telemetry.temperatureC} °C · RH ${telemetry.relativeHumidityPercent}% · ${telemetry.surfacePressureHpa} hPa`,
    },
    {
      number: '05',
      title: 'NWP / MODEL DATA',
      icon: <Layers className="w-4 h-4 text-purple-600" />,
      items: ['Forecast variables', 'CAPE / CIN index', '0-6km wind shear'],
      liveReadout: `CAPE ${telemetry.capeJPerKg} J/kg · Shear ${telemetry.bulkWindShearKt} kt`,
    },
  ];

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase">
            Multi-Source Atmospheric Data Fusion Architecture
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronously fusing 5 heterogeneous observational &amp; model streams into a unified spatio-temporal nowcast grid
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
          SIMULATED DEMO DATA
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
        {inputs.map((inp) => (
          <div
            key={inp.number}
            className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                  INPUT {inp.number}
                </span>
                {inp.icon}
              </div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight mb-2">
                {inp.title}
              </h4>
              <ul className="space-y-1 text-xs text-slate-600">
                {inp.items.map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] font-mono text-sky-700 font-semibold tabular-nums">
              {inp.liveReadout}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-3 py-2 text-sky-600">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center justify-center">
            <div className="h-3 w-px bg-sky-300" />
            <ArrowDown className="w-4 h-4" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-11 gap-3 items-center bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="lg:col-span-4 bg-white border border-sky-300 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-700">
            <Cpu className="w-4 h-4 shrink-0" />
            <span>AI / ML FUSION ENGINE</span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Spatio-temporal alignment (1 km × 1 km, Δt = 5 min) + Feature Engineering + Multi-Modal Ensemble Inference
          </p>
        </div>

        <div className="lg:col-span-1 flex justify-center text-sky-600">
          <ArrowRight className="w-5 h-5 hidden lg:block" />
          <ArrowDown className="w-5 h-5 lg:hidden" />
        </div>

        <div className="lg:col-span-3 bg-white border border-orange-300 rounded-xl p-3.5 shadow-2xs">
          <div className="text-xs font-mono font-bold text-orange-700">
            NOWCAST OUTPUT (0–120 MIN)
          </div>
          <p className="text-xs font-mono font-bold text-slate-800 mt-1 tabular-nums">
            Thunderstorm: {thunderstormProb}% · Lightning: {lightningProb}% · Conf: {confidence}%
          </p>
        </div>

        <div className="lg:col-span-1 flex justify-center text-sky-600">
          <ArrowRight className="w-5 h-5 hidden lg:block" />
          <ArrowDown className="w-5 h-5 lg:hidden" />
        </div>

        <div className="lg:col-span-2 bg-white border border-emerald-300 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>RISK MAP + ALERTS</span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Location-specific hazard polygons &amp; role advisories
          </p>
        </div>
      </div>
    </section>
  );
};
