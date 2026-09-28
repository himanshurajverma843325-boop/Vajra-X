import React from 'react';
import {
  CloudLightning,
  Zap,
  Clock,
  Navigation,
  ShieldCheck,
  AlertOctagon,
  Users,
  ArrowRight,
  Radio,
  Sliders,
} from 'lucide-react';
import { SECTOR_ADVISORY_GUIDANCE } from '../data/demoDatasets';
import {
  LocationPoint,
  NavigationTab,
  NowcastPredictionResult,
  UserSector,
} from '../types/nowcast';

// Storytelling Components
import { HeroSection } from '../components/HeroSection';
import { HowItWorksPipeline } from '../components/HowItWorksPipeline';
import { DataToDecisionStrip } from '../components/DataToDecisionStrip';
import { ThreeAnswersSection } from '../components/ThreeAnswersSection';
import { ExampleNowcastCard } from '../components/ExampleNowcastCard';
import { WhyItMattersSection } from '../components/WhyItMattersSection';
import { WhyVajraSection } from '../components/WhyVajraSection';
import { PredictionToActionSection } from '../components/PredictionToActionSection';
import { EndToEndFlowDiagram } from '../components/EndToEndFlowDiagram';

// Interactive Nowcast Components
import { RiskCard } from '../components/RiskCard';
import { MapView } from '../components/MapView';
import { StormTrajectory } from '../components/StormTrajectory';
import { ForecastTimeline } from '../components/ForecastTimeline';
import { MultiSourceFusionSection } from '../components/DataSourceCard';
import { AIExplanation } from '../components/AIExplanation';
import { LightningChart } from '../components/LightningChart';
import { AlertCard } from '../components/AlertCard';
import { MapsGroundingView } from '../components/MapsGroundingView';

interface DashboardPageProps {
  nowcast: NowcastPredictionResult;
  selectedLocation: LocationPoint;
  onSelectLocation: (loc: LocationPoint) => void;
  selectedSector: UserSector;
  onSelectSector: (sector: UserSector) => void;
  activeTrajectoryStep: number;
  onSelectTrajectoryStep: (idx: number) => void;
  isPlayingForecast: boolean;
  onPlayForecast: () => void;
  onPauseForecast: () => void;
  onResetForecast: () => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  nowcast,
  selectedLocation,
  onSelectLocation,
  selectedSector,
  onSelectSector,
  activeTrajectoryStep,
  onSelectTrajectoryStep,
  isPlayingForecast,
  onPlayForecast,
  onPauseForecast,
  onResetForecast,
  onNavigateTab,
}) => {
  const scrollToNowcast = () => {
    const el = document.getElementById('live-nowcast-workspace');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* 1. HERO SECTION: 10-Second Executive Summary */}
      <HeroSection
        onExploreNowcast={scrollToNowcast}
        onHowItWorks={scrollToHowItWorks}
      />

      {/* 2. HOW IT WORKS: 5-Step Visual Pipeline */}
      <HowItWorksPipeline />

      {/* 3. FROM DATA TO DECISION: 6-Stage Strip */}
      <DataToDecisionStrip />

      {/* 4. THREE THINGS VAJRA-X ANSWERS */}
      <ThreeAnswersSection />

      {/* 5. EXAMPLE NOWCAST WALKTHROUGH */}
      <ExampleNowcastCard />

      {/* 6. LIVE INTERACTIVE NOWCAST WORKSPACE */}
      <div id="live-nowcast-workspace" className="space-y-6 pt-2 scroll-mt-20">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center flex-wrap gap-2 text-xs font-mono mb-1 text-slate-500">
                <span className="text-sky-700 font-bold">
                  SMART INDIA HACKATHON 2026
                </span>
                <span>·</span>
                <span>Problem ID: SIH26072</span>
                <span>·</span>
                <span>Team INNOVEXA_X</span>
                <span>·</span>
                <span className="text-amber-700 font-bold">
                  SIMULATED DEMO DATA
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Live Nowcast Assessment &amp; Model Workspace
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Active Observation Target:{' '}
                <strong className="text-slate-900">
                  {selectedLocation.name}, {selectedLocation.state}
                </strong>{' '}
                <span className="font-mono text-xs text-slate-500">
                  ({selectedLocation.lat.toFixed(2)}°N, {selectedLocation.lng.toFixed(2)}°E)
                </span>
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 max-w-md">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-800">
                <AlertOctagon className="w-4 h-4 shrink-0 text-amber-600" />
                <span>SIMULATED DEMO DATA — PROTOTYPE NOTICE</span>
              </div>
              <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                Prototype demonstration using simulated/historical-style data. Not an operational warning service.
              </p>
            </div>
          </div>

          {/* 5 Self-Explanatory Metric Cards with Requested Subtitles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-5">
            <RiskCard
              title="Thunderstorm Risk"
              subtitle="Estimated probability of thunderstorm activity"
              value={nowcast.thunderstormRiskLevel}
              probabilityPercent={nowcast.thunderstorm_probability}
              subValue={`Core Max: ${nowcast.inputTelemetry.radarReflectivityDbz} dBZ`}
              riskLevel={nowcast.thunderstormRiskLevel}
              icon={<CloudLightning className="w-4 h-4 text-orange-600" />}
            />

            <RiskCard
              title="Lightning Risk"
              subtitle="Estimated probability of lightning activity"
              value={nowcast.lightningRiskLevel}
              probabilityPercent={nowcast.lightning_probability}
              subValue={`Density: ${nowcast.lightningStrikeDensity} (${nowcast.inputTelemetry.totalFlashRatePerMin} fl/m)`}
              riskLevel={nowcast.lightningRiskLevel}
              icon={<Zap className="w-4 h-4 text-amber-600" />}
            />

            <RiskCard
              title="Forecast Window"
              subtitle="Short-term nowcast prediction horizon"
              value={nowcast.forecast_window}
              subValue="Peak Convective Window"
              footnote="SIMULATED DEMO DATA"
              icon={<Clock className="w-4 h-4 text-sky-600" />}
            />

            <RiskCard
              title="Storm Movement"
              subtitle="Estimated direction and movement of the storm"
              value={nowcast.storm_direction}
              subValue={`${nowcast.storm_speed} · ${nowcast.intensity}`}
              footnote="SIMULATED DEMO DATA"
              icon={<Navigation className="w-4 h-4 text-indigo-600" />}
            />

            <RiskCard
              title="Confidence"
              subtitle="How strongly available signals support prediction"
              value={`${nowcast.confidence}%`}
              probabilityPercent={nowcast.confidence}
              subValue="5-Source Consensus"
              riskLevel={nowcast.confidence >= 80 ? 'LOW' : 'MODERATE'}
              footnote="SIMULATED DEMO DATA"
              icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
            />
          </div>
        </div>

        {/* Map & Storm Trajectory Kinematics */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8">
            <MapView
              nowcast={nowcast}
              selectedLocation={selectedLocation}
              onSelectLocation={onSelectLocation}
              activeTrajectoryStepIndex={activeTrajectoryStep}
              heightClass="h-[480px]"
            />
          </div>
          <div className="xl:col-span-4">
            <StormTrajectory
              nowcast={nowcast}
              activeStepIndex={activeTrajectoryStep}
              onSelectStepIndex={onSelectTrajectoryStep}
              isPlaying={isPlayingForecast}
              onPlay={onPlayForecast}
              onPause={onPauseForecast}
              onReset={onResetForecast}
            />
          </div>
        </div>

        {/* Forecast Timeline Decay Curve */}
        <ForecastTimeline
          timeline={nowcast.timeline}
          locationName={`${selectedLocation.name}, ${selectedLocation.state}`}
        />

        {/* Explainable AI Factors & Lightning Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <AIExplanation
              explanation={nowcast.explanation}
              riskLevel={nowcast.combinedRiskLevel}
              confidence={nowcast.confidence}
            />
          </div>
          <div className="lg:col-span-6">
            <LightningChart nowcast={nowcast} compact />
          </div>
        </div>

        {/* Multi-Source Sensor Fusion Architecture */}
        <MultiSourceFusionSection
          telemetry={nowcast.inputTelemetry}
          thunderstormProb={nowcast.thunderstorm_probability}
          lightningProb={nowcast.lightning_probability}
          confidence={nowcast.confidence}
        />

        {/* Google Maps Grounded Emergency & Infrastructure Intelligence */}
        <MapsGroundingView currentLocation={selectedLocation} />
      </div>

      {/* 7. FROM PREDICTION TO ACTION: Sector Tabs */}
      <PredictionToActionSection
        selectedSector={selectedSector}
        onSelectSector={onSelectSector}
      />

      {/* 8. WHY EARLY NOWCASTING MATTERS */}
      <WhyItMattersSection />

      {/* 9. WHY VAJRA-X? 6 Core Differentiators */}
      <WhyVajraSection />

      {/* 10. END-TO-END SYSTEM FLOW DIAGRAM */}
      <EndToEndFlowDiagram />
    </div>
  );
};
