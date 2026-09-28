import React, { useState } from 'react';
import {
  Users,
  ShieldAlert,
  Wheat,
  Plane,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Info,
} from 'lucide-react';
import { UserSector } from '../types/nowcast';

interface SectorActionDetail {
  id: UserSector;
  label: string;
  icon: React.ReactNode;
  detection: string;
  monitor: string;
  action: string;
  criticalNotice: string;
}

const SECTOR_DETAILS: SectorActionDetail[] = [
  {
    id: 'Public',
    label: 'PUBLIC',
    icon: <Users className="w-4 h-4" />,
    detection: 'High lightning probability and rapidly developing convective storm cells.',
    monitor: 'Local lightning strike density, darkening skies, and 30-minute arrival warnings.',
    action: 'Avoid open areas, sports grounds, and isolated trees; immediately seek shelter in a substantial building or enclosed hardtop vehicle.',
    criticalNotice: 'Remember the 30/30 rule: if thunder is heard within 30 seconds of lightning flash, seek shelter immediately.',
  },
  {
    id: 'Disaster Management',
    label: 'DISASTER MANAGEMENT',
    icon: <ShieldAlert className="w-4 h-4" />,
    detection: 'Storm cell intensification, squall line trajectory, and potential flash flood or hail signatures.',
    monitor: 'Downwind district trajectory corridors, low-lying drainage choke points, and emergency communication relays.',
    action: 'Alert District Emergency Operation Centers (DEOCs), pre-position rescue teams, and broadcast targeted SMS alerts to vulnerable taluks.',
    criticalNotice: 'Activate District Disaster Management Authority (DDMA) incident response teams and review shelter capacities.',
  },
  {
    id: 'Agriculture',
    label: 'AGRICULTURE',
    icon: <Wheat className="w-4 h-4" />,
    detection: 'Increasing thunderstorm probability and high cloud-to-ground lightning flash rates over rural blocks.',
    monitor: 'Sudden surface wind direction shifts, approaching dark roll clouds, and lightning jump precursor alerts.',
    action: 'Halt all exposed field operations, move farm laborers and livestock away from metal fencing, open water bodies, and solitary field sheds.',
    criticalNotice: 'Ensure irrigation pumps and tractors are securely disconnected from overhead electrical lines.',
  },
  {
    id: 'Aviation',
    label: 'AVIATION',
    icon: <Plane className="w-4 h-4" />,
    detection: 'Convective weather development, severe core reflectivity aloft (>45 dBZ), and vertical wind shear.',
    monitor: 'Terminal Area (TMA) arrival & departure corridors, microburst signatures, and runway crosswind gusts.',
    action: 'Review relevant weather information before operational decisions, prepare holding patterns, and suspend apron ground refueling during lightning.',
    criticalNotice: 'Coordinate ATC terminal sequencing with Doppler weather radar radial velocity divergence zones.',
  },
  {
    id: 'Infrastructure',
    label: 'INFRASTRUCTURE',
    icon: <Building2 className="w-4 h-4" />,
    detection: 'High dielectric breakdown risk, intense CG strike density, and gale-force wind gust potential.',
    monitor: 'High-voltage grid transmission line corridors, telecom towers, metro transit lines, and urban power substations.',
    action: 'Inspect lightning surge arresters, safeguard sensitive transformer substations, and suspend outdoor crane and high-altitude tower maintenance.',
    criticalNotice: 'Ensure auxiliary power generators and critical telemetry sensors are grounded and protected.',
  },
];

export const PredictionToActionSection: React.FC<{
  selectedSector?: UserSector;
  onSelectSector?: (s: UserSector) => void;
}> = ({ selectedSector = 'Public', onSelectSector }) => {
  const [activeTab, setActiveTab] = useState<UserSector>(selectedSector);

  const current =
    SECTOR_DETAILS.find((s) => s.id === (onSelectSector ? selectedSector : activeTab)) ||
    SECTOR_DETAILS[0];

  const handleTabChange = (sector: UserSector) => {
    setActiveTab(sector);
    if (onSelectSector) onSelectSector(sector);
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold font-mono text-emerald-700 uppercase tracking-wider block mb-0.5">
            SECTOR-SPECIFIC PROTOCOLS
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            From Prediction to Action
          </h3>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-mono font-medium">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          Prototype advisory examples
        </span>
      </div>

      {/* Sector Selection Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 border-b border-slate-100">
        {SECTOR_DETAILS.map((sec) => {
          const isSelected = sec.id === current.id;
          return (
            <button
              key={sec.id}
              onClick={() => handleTabChange(sec.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {sec.icon}
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tri-Pane Action Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Detection */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-sky-700 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-wider">
              What VAJRA-X Detects
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900 mb-2">
            Automated Sensor Trigger
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            {current.detection}
          </p>
        </div>

        {/* What to Monitor */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-indigo-700 mb-2">
            <Eye className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-wider">
              What to Monitor
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900 mb-2">
            Operational Telemetry
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            {current.monitor}
          </p>
        </div>

        {/* Recommended Action */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-800 mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-wider">
              Recommended Action
            </span>
          </div>
          <p className="text-xs font-bold text-emerald-950 mb-2">
            Standard Operating Procedure (SOP)
          </p>
          <p className="text-xs text-emerald-900 font-medium leading-relaxed">
            {current.action}
          </p>
        </div>
      </div>

      {/* Protocol Directive Footnote */}
      <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong>Operational Note:</strong> {current.criticalNotice}
        </span>
      </div>
    </section>
  );
};
