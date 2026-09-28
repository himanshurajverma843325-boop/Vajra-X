import React from 'react';
import {
  Radio,
  Satellite,
  Zap,
  Wind,
  Cpu,
  Layers,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Database,
  BarChart3,
} from 'lucide-react';
import { DATA_SOURCE_METADATA } from '../data/demoDatasets';
import { MultiSourceFusionSection } from '../components/DataSourceCard';
import { NowcastPredictionResult } from '../types/nowcast';

interface DataSourcesPageProps {
  nowcast: NowcastPredictionResult;
}

export const DataSourcesPage: React.FC<DataSourcesPageProps> = ({ nowcast }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111C35] border border-[#1E293B] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-5 h-5 text-sky-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Multi-Source Atmospheric Data Observation Architecture
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Synchronous heterogeneous data ingestion pipeline powering VAJRA-X’s short-term AI/ML nowcasting models (SIH26072).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All 5 Ingestion Feeds Synchronized
            </span>
          </div>
        </div>
      </div>

      {/* Primary 5-source cards */}
      <MultiSourceFusionSection
        telemetry={nowcast.inputTelemetry}
        thunderstormProb={nowcast.thunderstorm_probability}
        lightningProb={nowcast.lightning_probability}
        confidence={nowcast.confidence}
      />

      {/* Detailed Technical Specifications Table */}
      <div className="bg-[#111C35] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            Sensor Telemetry & Ingestion Parameters (IMD & INCOIS Reference Specs)
          </h3>
          <span className="text-xs text-slate-500 font-mono">SIMULATED DEMO TELEMETRY</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0B1120] text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="px-4 py-3">Data Stream</th>
                <th className="px-4 py-3">Network / Sensor</th>
                <th className="px-4 py-3">Primary Parameters</th>
                <th className="px-4 py-3">Cadence (Δt)</th>
                <th className="px-4 py-3">Spatial Resolution</th>
                <th className="px-4 py-3">Ingest Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-slate-300 font-mono text-xs">
              <tr className="hover:bg-[#1E293B]/40 transition-colors">
                <td className="px-4 py-3 font-sans font-semibold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-sky-400" />
                  Doppler Weather Radar (DWR)
                </td>
                <td className="px-4 py-3">IMD S/C/X-band Dual-Pol Radar Network</td>
                <td className="px-4 py-3">Reflectivity (Z), Radial Velocity (Vr), Differential Reflectivity (Zdr)</td>
                <td className="px-4 py-3 text-sky-400">5 – 10 min</td>
                <td className="px-4 py-3">250 m radial, 1° azimuthal</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">ONLINE</span>
                </td>
              </tr>
              <tr className="hover:bg-[#1E293B]/40 transition-colors">
                <td className="px-4 py-3 font-sans font-semibold text-white flex items-center gap-2">
                  <Satellite className="w-4 h-4 text-indigo-400" />
                  Geostationary Satellite
                </td>
                <td className="px-4 py-3">INSAT-3D / 3DR Imager & Sounder</td>
                <td className="px-4 py-3">TIR1 (10.8 µm), Water Vapor (6.7 µm), Cloud Top Brightness Temp</td>
                <td className="px-4 py-3 text-sky-400">15 min</td>
                <td className="px-4 py-3">4 km × 4 km (Infrared), 8 km (WV)</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">ONLINE</span>
                </td>
              </tr>
              <tr className="hover:bg-[#1E293B]/40 transition-colors">
                <td className="px-4 py-3 font-sans font-semibold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Lightning Detection Network
                </td>
                <td className="px-4 py-3">IITM Lightning Location Network (LLN) + ISRO GLIS</td>
                <td className="px-4 py-3">Total Flash Rate, Intra-Cloud (IC), Cloud-to-Ground (CG) polarity</td>
                <td className="px-4 py-3 text-emerald-400">Continuous (&lt; 1 sec)</td>
                <td className="px-4 py-3">Point coordinate (± 250 m accuracy)</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">ONLINE</span>
                </td>
              </tr>
              <tr className="hover:bg-[#1E293B]/40 transition-colors">
                <td className="px-4 py-3 font-sans font-semibold text-white flex items-center gap-2">
                  <Wind className="w-4 h-4 text-teal-400" />
                  Surface AWS & Radiosonde
                </td>
                <td className="px-4 py-3">Automatic Weather Stations + Upper-Air Soundings</td>
                <td className="px-4 py-3">Dry-bulb temp, dewpoint, gust speed, pressure tendency (ΔP/3h)</td>
                <td className="px-4 py-3 text-sky-400">15 min / 1 hour</td>
                <td className="px-4 py-3">In-situ point surface stations</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">ONLINE</span>
                </td>
              </tr>
              <tr className="hover:bg-[#1E293B]/40 transition-colors">
                <td className="px-4 py-3 font-sans font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  NWP Mesoscale Models
                </td>
                <td className="px-4 py-3">NCMRWF NCUM / WRF Operational 3 km Grid</td>
                <td className="px-4 py-3">CAPE, CIN, Lifted Index, 0-6 km Bulk Wind Shear, Helicity</td>
                <td className="px-4 py-3 text-slate-400">Hourly update (Cycle 00/06/12/18 UTC)</td>
                <td className="px-4 py-3">3 km × 3 km horizontal grid</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">ONLINE</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Resampling & Alignment Architecture Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111C35] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-3">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-400" />
            Spatial-Temporal Resampling Pipeline
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Radar polar coordinates (r, theta, phi) and geostationary satellite satellite-projection pixels are dynamically re-mapped to a standardized Lambert Conformal Conic (LCC) 1 km × 1 km grid covering Northern and Central India.
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li>Nearest-neighbor + Bilinear interpolation for Continuous fields</li>
            <li>Kernel density estimation (KDE) with Gaussian kernel (sigma = 2 km) for discrete lightning flash events</li>
            <li>Clutter filtering utilizing Dual-Pol correlation coefficient (Rho_hv &lt; 0.85) to purge non-meteorological echoes</li>
          </ul>
        </div>

        <div className="bg-[#111C35] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-3">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            AI/ML Ingestion Safety & Fallbacks
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            In operational meteorology, single-sensor outages (e.g. radar maintenance or satellite downlink glitch) must not halt disaster warning systems.
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li>Dynamic modality dropout training allows inference even if 1 or 2 streams are missing</li>
            <li>Cross-validation between satellite cloud-top cooling and lightning density for early cell initiation detection</li>
            <li>Automatic failover to satellite-only deep optical flow when local radar coverage is unavailable</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
