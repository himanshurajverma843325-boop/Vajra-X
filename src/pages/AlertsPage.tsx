import React from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { SECTOR_ADVISORY_GUIDANCE } from '../data/demoDatasets';
import {
  NowcastPredictionResult,
  UserSector,
} from '../types/nowcast';
import { AlertCard } from '../components/AlertCard';

interface AlertsPageProps {
  nowcast: NowcastPredictionResult;
  selectedSector: UserSector;
  onSelectSector: (sector: UserSector) => void;
}

const ALL_SECTORS: UserSector[] = [
  'Public',
  'Disaster Management',
  'Agriculture',
  'Aviation',
  'Infrastructure',
];

export const AlertsPage: React.FC<AlertsPageProps> = ({
  nowcast,
  selectedSector,
  onSelectSector,
}) => {
  const activeGuidance = SECTOR_ADVISORY_GUIDANCE[selectedSector];

  return (
    <div className="space-y-6">
      <section className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>DECISION-SUPPORT ADVISORY &amp; ALERT CENTER</span>
              <span>·</span>
              <span className="text-amber-400">SIMULATED DEMO DATA</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
              Location-Specific &amp; Stakeholder-Specific Alert System
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Active Target:{' '}
              <strong className="text-sky-400">
                {nowcast.storm_location.name}, {nowcast.storm_location.state}
              </strong>{' '}
              · Forecast Window: <strong className="font-mono text-slate-100">{nowcast.forecast_window}</strong>
            </p>
          </div>

          <div className="bg-slate-900 border border-amber-500/40 rounded-lg p-3 max-w-md">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <span>PROTOTYPE ADVISORY DISCLAIMER</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              These are prototype advisory examples, not official warnings. Generated from simulated/historical-style demonstration datasets.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <Users className="w-4 h-4 text-sky-400" />
            <span>Select Stakeholder Profile to Customize Actions:</span>
          </div>

          <div className="flex items-center flex-wrap gap-1.5">
            {ALL_SECTORS.map((sec) => {
              const active = sec === selectedSector;
              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onSelectSector(sec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-sky-500 border-sky-400 text-slate-950 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {sec}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {nowcast.alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            selectedSector={selectedSector}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-[#0F172A] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-mono text-sky-400 font-semibold">
                ACTIVE STAKEHOLDER PLAYBOOK
              </span>
              <h2 className="text-base font-bold text-slate-100 mt-0.5">
                {selectedSector} Standard Operating Guidance
              </h2>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-sky-500/30 mb-4">
              <p className="text-sm font-semibold text-sky-300">
                &ldquo;{activeGuidance.headline}&rdquo;
              </p>
              <p className="text-xs text-slate-300 mt-1">
                {activeGuidance.primaryProtocol}
              </p>
            </div>

            <h3 className="text-xs font-semibold text-slate-300 mb-2">
              Recommended Action Checklist:
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {activeGuidance.secondaryActions.map((act) => (
                <li key={act} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            {activeGuidance.thresholdTrigger}
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <div className="pb-3 border-b border-slate-800 mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Cross-Sector Action Matrix (All 5 User Types)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                How VAJRA-X translates identical atmospheric telemetry into role-specific advisories
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400">
              PROTOTYPE EXAMPLES
            </span>
          </div>

          <div className="space-y-2.5">
            {ALL_SECTORS.map((sec) => {
              const g = SECTOR_ADVISORY_GUIDANCE[sec];
              const isSelected = sec === selectedSector;
              return (
                <div
                  key={sec}
                  onClick={() => onSelectSector(sec)}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-400'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-sky-400 uppercase">
                      {sec}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {isSelected ? '● Active View' : 'Click to select'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-100 mt-1">
                    {g.headline}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {g.primaryProtocol}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
