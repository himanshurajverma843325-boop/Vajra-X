export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';

export type ScenarioId =
  | 'low-risk'
  | 'moderate-storm'
  | 'severe-thunderstorm'
  | 'lightning-intensive'
  | 'storm-intensification';

export type TimeHorizon = 'NOW' | '+30m' | '+60m' | '+120m';

export type UserSector =
  | 'Public'
  | 'Disaster Management'
  | 'Agriculture'
  | 'Aviation'
  | 'Infrastructure';

export type NavigationTab =
  | 'overview'
  | 'how-it-works'
  | 'nowcast'
  | 'risk-map'
  | 'storm-tracking'
  | 'lightning'
  | 'alerts'
  | 'maps-grounding'
  | 'data-sources'
  | 'about';

export interface LocationPoint {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  radarStation: string;
  elevationM: number;
}

export interface AtmosphericInputData {
  location: LocationPoint;
  scenarioId: ScenarioId;
  timeHorizon: TimeHorizon;
  radarReflectivityDbz: number;
  verticallyIntegratedLiquid: number;
  echoTopHeightKm: number;
  cloudTopTempC: number;
  cloudCoolingRateCPer15m: number;
  opticalDepth: number;
  totalFlashRatePerMin: number;
  cloudToGroundStrikeDensity: number;
  positiveCgRatioPercent: number;
  temperatureC: number;
  relativeHumidityPercent: number;
  surfacePressureHpa: number;
  windSpeedKmh: number;
  windDirectionDeg: string;
  capeJPerKg: number;
  liftedIndex: number;
  bulkWindShearKt: number;
}

export interface ExplanationFactor {
  id: string;
  factor: string;
  category: 'Radar' | 'Lightning' | 'Satellite' | 'Atmospheric' | 'Model';
  contributionScore: number;
  observedValue: string;
  description: string;
}

export interface TimelineSlot {
  id: string;
  windowLabel: string;
  shortLabel: string;
  thunderstormProbability: number;
  lightningProbability: number;
  riskLevel: RiskLevel;
  confidence: number;
  expectedReflectivityDbz: number;
  expectedFlashRate: number;
}

export interface TrajectoryWaypoint {
  step: 'NOW' | '+30 min' | '+60 min' | '+120 min';
  offsetMinutes: number;
  lat: number;
  lng: number;
  radiusKm: number;
  riskLevel: RiskLevel;
  intensityLabel: string;
  reflectivityDbz: number;
  speedKmh: number;
}

export interface StormCellFeature {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusKm: number;
  riskLevel: RiskLevel;
  thunderstormProb: number;
  lightningProb: number;
  movementDir: string;
  speedKmh: number;
  maxDbz: number;
  cloudTopTempC: number;
  trajectory: TrajectoryWaypoint[];
}

export interface LightningStrikePoint {
  id: string;
  lat: number;
  lng: number;
  polarity: '+CG' | '-CG' | 'IC';
  peakCurrentKa: number;
  minutesAgo: number;
  regionName: string;
}

export interface LightningTimeSeriesPoint {
  timeLabel: string;
  totalFlashes: number;
  cloudToGround: number;
  intraCloud: number;
  thunderstormProb: number;
  lightningProb: number;
}

export interface AlertItem {
  id: string;
  type: 'HIGH RISK' | 'LIGHTNING ALERT' | 'MOVEMENT ALERT' | 'CONVECTIVE WATCH';
  riskLevel: RiskLevel;
  title: string;
  location: string;
  forecastWindow: string;
  reason: string;
  confidence: number;
  recommendedActions: Record<UserSector, string>;
}

export interface NowcastPredictionResult {
  thunderstorm_probability: number;
  lightning_probability: number;
  storm_location: {
    name: string;
    state: string;
    lat: number;
    lng: number;
  };
  storm_direction: string;
  storm_speed: string;
  intensity: string;
  forecast_window: string;
  confidence: number;
  explanation: ExplanationFactor[];
  thunderstormRiskLevel: RiskLevel;
  lightningRiskLevel: RiskLevel;
  combinedRiskLevel: RiskLevel;
  lightningStrikeDensity: 'Low' | 'Moderate' | 'High' | 'Extreme';
  lightningTrend: 'Stable →' | 'Increasing ↑' | 'Rapidly Increasing ↑↑' | 'Decreasing ↓';
  simulatedTimestamp: string;
  scenarioName: string;
  timeline: TimelineSlot[];
  primaryTrajectory: TrajectoryWaypoint[];
  activeStormCells: StormCellFeature[];
  lightningStrikes: LightningStrikePoint[];
  lightningTimeSeries: LightningTimeSeriesPoint[];
  alerts: AlertItem[];
  inputTelemetry: AtmosphericInputData;
}

export interface RadarStationInfo {
  id: string;
  name: string;
  band: 'S-Band' | 'C-Band' | 'X-Band';
  lat: number;
  lng: number;
  rangeKm: number;
  status: 'Simulated Active';
}

export interface DataSourceMetadata {
  id: string;
  name: string;
  shortTitle: string;
  dataType: string;
  updateFrequency: string;
  typicalVariables: string[];
  spatialResolution: string;
  roleInNowcasting: string;
  fusionWeightPercent: number;
  sampleSimulatedReading: string;
}

export interface ScenarioDefinition {
  id: ScenarioId;
  number: number;
  title: string;
  shortLabel: string;
  subtitle: string;
  synopticSummary: string;
  baseThunderstormProb: number;
  baseLightningProb: number;
  stormDirection: string;
  stormSpeedKmh: number;
  intensityLabel: string;
  forecastWindow: string;
  confidence: number;
  radarReflectivityDbz: number;
  cloudTopTempC: number;
  totalFlashRatePerMin: number;
  capeJPerKg: number;
  relativeHumidityPercent: number;
  surfacePressureHpa: number;
  bulkWindShearKt: number;
  lightningDensityLabel: 'Low' | 'Moderate' | 'High' | 'Extreme';
  lightningTrendLabel: 'Stable →' | 'Increasing ↑' | 'Rapidly Increasing ↑↑' | 'Decreasing ↓';
}

export interface SimulationState {
  demoModeEnabled: boolean;
  selectedScenario: ScenarioId;
  selectedScenarioObj: ScenarioDefinition;
  selectedHorizon: TimeHorizon;
  selectedLocation: LocationPoint;
  selectedSector: UserSector;
  activeTrajectoryStep: number;
  isPlayingForecast: boolean;
  pipelineStepIndex: number | null;
  simulatedClock: string;
  nowcast: NowcastPredictionResult;
}
