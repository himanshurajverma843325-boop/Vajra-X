import {
  DEMO_SCENARIOS,
  PRESET_LOCATIONS,
  SECTOR_ADVISORY_GUIDANCE,
} from '../data/demoDatasets';
import {
  AlertItem,
  AtmosphericInputData,
  ExplanationFactor,
  LightningStrikePoint,
  LightningTimeSeriesPoint,
  LocationPoint,
  NowcastPredictionResult,
  RiskLevel,
  ScenarioId,
  StormCellFeature,
  TimeHorizon,
  TimelineSlot,
  TrajectoryWaypoint,
} from '../types/nowcast';

export function classifyRiskLevel(probability: number): RiskLevel {
  if (probability >= 88) return 'SEVERE';
  if (probability >= 65) return 'HIGH';
  if (probability >= 38) return 'MODERATE';
  return 'LOW';
}

function computeLocationModulation(location: LocationPoint): {
  probDelta: number;
  speedDelta: number;
  tempDelta: number;
} {
  if (location.id === 'ghaziabad-up') {
    return { probDelta: 0, speedDelta: 0, tempDelta: 0 };
  }
  const seed = Math.abs(Math.sin(location.lat * 12.9898 + location.lng * 78.233) * 43758.5453);
  const frac = seed - Math.floor(seed);
  const probDelta = Math.round((frac - 0.45) * 14);
  const speedDelta = Math.round((frac - 0.5) * 8);
  const tempDelta = Number(((frac - 0.5) * 4).toFixed(1));
  return { probDelta, speedDelta, tempDelta };
}

export function buildAtmosphericInput(
  location: LocationPoint = PRESET_LOCATIONS[0],
  scenarioId: ScenarioId = 'severe-thunderstorm',
  timeHorizon: TimeHorizon = 'NOW'
): AtmosphericInputData {
  const scenario = DEMO_SCENARIOS[scenarioId] || DEMO_SCENARIOS['severe-thunderstorm'];
  const mod = computeLocationModulation(location);

  const horizonMultipliers: Record<TimeHorizon, { dbz: number; flash: number; cape: number }> = {
    NOW: { dbz: 1.0, flash: 1.0, cape: 1.0 },
    '+30m': { dbz: 1.05, flash: 1.15, cape: 1.04 },
    '+60m': { dbz: 0.96, flash: 0.92, cape: 0.94 },
    '+120m': { dbz: 0.82, flash: 0.65, cape: 0.8 },
  };

  const mult = horizonMultipliers[timeHorizon];

  const radarReflectivityDbz = Number(
    Math.min(66, Math.max(15, scenario.radarReflectivityDbz * mult.dbz + mod.probDelta * 0.35)).toFixed(1)
  );
  const totalFlashRatePerMin = Math.max(
    1,
    Math.round(scenario.totalFlashRatePerMin * mult.flash + mod.probDelta * 0.8)
  );

  return {
    location,
    scenarioId,
    timeHorizon,
    radarReflectivityDbz,
    verticallyIntegratedLiquid: Number((radarReflectivityDbz * 0.72 - 1.2).toFixed(1)),
    echoTopHeightKm: Number((radarReflectivityDbz * 0.23 + 0.8).toFixed(1)),
    cloudTopTempC: Number((scenario.cloudTopTempC + mod.tempDelta).toFixed(1)),
    cloudCoolingRateCPer15m: Number(
      (scenarioId === 'storm-intensification'
        ? -14.2
        : scenarioId === 'severe-thunderstorm'
        ? -9.8
        : scenarioId === 'lightning-intensive'
        ? -11.4
        : scenarioId === 'moderate-storm'
        ? -5.6
        : -1.8).toFixed(1)
    ),
    opticalDepth: Number((radarReflectivityDbz * 1.15).toFixed(1)),
    totalFlashRatePerMin,
    cloudToGroundStrikeDensity: Number((totalFlashRatePerMin * 0.042).toFixed(2)),
    positiveCgRatioPercent: scenarioId === 'lightning-intensive' ? 24 : scenarioId === 'severe-thunderstorm' ? 18 : 12,
    temperatureC: Number((33.8 + mod.tempDelta).toFixed(1)),
    relativeHumidityPercent: Math.min(98, Math.max(30, scenario.relativeHumidityPercent + Math.round(mod.probDelta * 0.5))),
    surfacePressureHpa: scenario.surfacePressureHpa,
    windSpeedKmh: Math.max(10, scenario.stormSpeedKmh + mod.speedDelta),
    windDirectionDeg: scenario.stormDirection,
    capeJPerKg: Math.round(scenario.capeJPerKg * mult.cape + mod.probDelta * 25),
    liftedIndex: Number((-scenario.capeJPerKg / 420).toFixed(1)),
    bulkWindShearKt: scenario.bulkWindShearKt,
  };
}

export function predictNowcast(inputData: AtmosphericInputData): NowcastPredictionResult {
  const scenario = DEMO_SCENARIOS[inputData.scenarioId] || DEMO_SCENARIOS['severe-thunderstorm'];
  const mod = computeLocationModulation(inputData.location);

  const horizonOffset: Record<TimeHorizon, { tsDelta: number; ltgDelta: number; confDelta: number }> = {
    NOW: { tsDelta: 0, ltgDelta: 0, confDelta: 0 },
    '+30m': { tsDelta: 4, ltgDelta: 5, confDelta: -2 },
    '+60m': { tsDelta: -8, ltgDelta: -9, confDelta: -5 },
    '+120m': { tsDelta: -21, ltgDelta: -22, confDelta: -11 },
  };
  const hAdj = horizonOffset[inputData.timeHorizon];

  const clampProb = (v: number) => Math.min(98, Math.max(5, Math.round(v)));

  const peakThunderstormProb = clampProb(scenario.baseThunderstormProb + mod.probDelta + hAdj.tsDelta);
  const peakLightningProb = clampProb(scenario.baseLightningProb + mod.probDelta + hAdj.ltgDelta);
  const confidence = clampProb(scenario.confidence + hAdj.confDelta);

  const isDefaultSevere =
    inputData.scenarioId === 'severe-thunderstorm' &&
    inputData.location.id === 'ghaziabad-up' &&
    inputData.timeHorizon === 'NOW';

  const timeline: TimelineSlot[] = isDefaultSevere
    ? [
        {
          id: 'now',
          windowLabel: 'NOW',
          shortLabel: 'NOW',
          thunderstormProbability: 72,
          lightningProbability: 68,
          riskLevel: 'HIGH',
          confidence: 91,
          expectedReflectivityDbz: 51.5,
          expectedFlashRate: 46,
        },
        {
          id: '0-30m',
          windowLabel: '0–30 min',
          shortLabel: '0–30m',
          thunderstormProbability: 79,
          lightningProbability: 75,
          riskLevel: 'HIGH',
          confidence: 89,
          expectedReflectivityDbz: 53.2,
          expectedFlashRate: 52,
        },
        {
          id: '30-60m',
          windowLabel: '30–60 min',
          shortLabel: '30–60m',
          thunderstormProbability: 84,
          lightningProbability: 81,
          riskLevel: 'HIGH',
          confidence: 87,
          expectedReflectivityDbz: 54.5,
          expectedFlashRate: 58,
        },
        {
          id: '60-120m',
          windowLabel: '60–120 min',
          shortLabel: '60–120m',
          thunderstormProbability: 63,
          lightningProbability: 59,
          riskLevel: 'MODERATE',
          confidence: 79,
          expectedReflectivityDbz: 45.0,
          expectedFlashRate: 34,
        },
        {
          id: '2-6h',
          windowLabel: '2–6 hours',
          shortLabel: '2–6h',
          thunderstormProbability: 42,
          lightningProbability: 35,
          riskLevel: 'MODERATE',
          confidence: 68,
          expectedReflectivityDbz: 36.5,
          expectedFlashRate: 16,
        },
      ]
    : [
        {
          id: 'now',
          windowLabel: 'NOW',
          shortLabel: 'NOW',
          thunderstormProbability: clampProb(peakThunderstormProb * 0.86),
          lightningProbability: clampProb(peakLightningProb * 0.84),
          riskLevel: classifyRiskLevel(clampProb(Math.max(peakThunderstormProb, peakLightningProb) * 0.86)),
          confidence: clampProb(confidence + 4),
          expectedReflectivityDbz: Number((inputData.radarReflectivityDbz * 0.94).toFixed(1)),
          expectedFlashRate: Math.max(1, Math.round(inputData.totalFlashRatePerMin * 0.82)),
        },
        {
          id: '0-30m',
          windowLabel: '0–30 min',
          shortLabel: '0–30m',
          thunderstormProbability: clampProb(peakThunderstormProb * 0.94),
          lightningProbability: clampProb(peakLightningProb * 0.93),
          riskLevel: classifyRiskLevel(clampProb(Math.max(peakThunderstormProb, peakLightningProb) * 0.94)),
          confidence: clampProb(confidence + 2),
          expectedReflectivityDbz: Number((inputData.radarReflectivityDbz * 0.98).toFixed(1)),
          expectedFlashRate: Math.max(1, Math.round(inputData.totalFlashRatePerMin * 0.92)),
        },
        {
          id: '30-60m',
          windowLabel: '30–60 min',
          shortLabel: '30–60m',
          thunderstormProbability: peakThunderstormProb,
          lightningProbability: peakLightningProb,
          riskLevel: classifyRiskLevel(Math.max(peakThunderstormProb, peakLightningProb)),
          confidence,
          expectedReflectivityDbz: inputData.radarReflectivityDbz,
          expectedFlashRate: inputData.totalFlashRatePerMin,
        },
        {
          id: '60-120m',
          windowLabel: '60–120 min',
          shortLabel: '60–120m',
          thunderstormProbability: clampProb(peakThunderstormProb * 0.75),
          lightningProbability: clampProb(peakLightningProb * 0.73),
          riskLevel: classifyRiskLevel(clampProb(Math.max(peakThunderstormProb, peakLightningProb) * 0.75)),
          confidence: clampProb(confidence - 8),
          expectedReflectivityDbz: Number((inputData.radarReflectivityDbz * 0.83).toFixed(1)),
          expectedFlashRate: Math.max(1, Math.round(inputData.totalFlashRatePerMin * 0.6)),
        },
        {
          id: '2-6h',
          windowLabel: '2–6 hours',
          shortLabel: '2–6h',
          thunderstormProbability: clampProb(peakThunderstormProb * 0.5),
          lightningProbability: clampProb(peakLightningProb * 0.43),
          riskLevel: classifyRiskLevel(clampProb(Math.max(peakThunderstormProb, peakLightningProb) * 0.5)),
          confidence: clampProb(confidence - 19),
          expectedReflectivityDbz: Number((inputData.radarReflectivityDbz * 0.66).toFixed(1)),
          expectedFlashRate: Math.max(1, Math.round(inputData.totalFlashRatePerMin * 0.3)),
        },
      ];

  const radarScore = Math.min(98, Math.max(22, Math.round((inputData.radarReflectivityDbz / 60) * 96)));
  const lightningScore = Math.min(98, Math.max(18, Math.round((peakLightningProb / 95) * 92)));
  const satelliteScore = Math.min(96, Math.max(20, Math.round((Math.abs(inputData.cloudTopTempC) / 72) * 88)));
  const instabilityScore = Math.min(95, Math.max(20, Math.round((inputData.capeJPerKg / 3500) * 86)));
  const modelScore = Math.min(92, Math.max(24, Math.round((inputData.bulkWindShearKt / 48) * 82)));

  const explanation: ExplanationFactor[] = [
    {
      id: 'exp-radar',
      factor: 'Strong radar reflectivity',
      category: 'Radar',
      contributionScore: inputData.scenarioId === 'severe-thunderstorm' ? 94 : radarScore,
      observedValue: `${inputData.radarReflectivityDbz} dBZ · VIL ${inputData.verticallyIntegratedLiquid} kg/m²`,
      description: 'Multi-radar composite shows dense precipitation & graupel core above freezing level.',
    },
    {
      id: 'exp-lightning',
      factor: 'Increasing lightning density',
      category: 'Lightning',
      contributionScore: inputData.scenarioId === 'severe-thunderstorm' ? 88 : lightningScore,
      observedValue: `${inputData.totalFlashRatePerMin} flashes/min · ${scenario.lightningTrendLabel}`,
      description: 'Rapid intra-cloud and cloud-to-ground flash rate surge indicates strong updraft electrification.',
    },
    {
      id: 'exp-cloud',
      factor: 'Rapid cloud development',
      category: 'Satellite',
      contributionScore: inputData.scenarioId === 'severe-thunderstorm' ? 81 : satelliteScore,
      observedValue: `Cloud Top ${inputData.cloudTopTempC} °C (${inputData.cloudCoolingRateCPer15m} °C/15m)`,
      description: 'Thermal IR satellite channels detect rapid cloud-top cooling and glaciation near tropopause.',
    },
    {
      id: 'exp-instability',
      factor: 'High atmospheric instability',
      category: 'Atmospheric',
      contributionScore: inputData.scenarioId === 'severe-thunderstorm' ? 74 : instabilityScore,
      observedValue: `CAPE ${inputData.capeJPerKg} J/kg · RH ${inputData.relativeHumidityPercent}%`,
      description: 'High boundary-layer moisture and low surface pressure (999.2 hPa) sustain buoyant updrafts.',
    },
    {
      id: 'exp-model',
      factor: 'Supporting model conditions',
      category: 'Model',
      contributionScore: inputData.scenarioId === 'severe-thunderstorm' ? 66 : modelScore,
      observedValue: `0–6 km Shear ${inputData.bulkWindShearKt} kt · LI ${inputData.liftedIndex}`,
      description: 'Mesoscale NWP guidance confirms organized SW → NE steering flow and low convective inhibition.',
    },
  ];

  const baseLat = inputData.location.lat;
  const baseLng = inputData.location.lng;
  const speedKmh = inputData.windSpeedKmh;

  const primaryTrajectory: TrajectoryWaypoint[] = [
    {
      step: 'NOW',
      offsetMinutes: 0,
      lat: Number((baseLat - 0.14).toFixed(4)),
      lng: Number((baseLng - 0.18).toFixed(4)),
      radiusKm: 24,
      riskLevel: classifyRiskLevel(timeline[0].thunderstormProbability),
      intensityLabel: inputData.scenarioId === 'low-risk' ? 'Weak Cell' : 'Developing Core',
      reflectivityDbz: timeline[0].expectedReflectivityDbz,
      speedKmh,
    },
    {
      step: '+30 min',
      offsetMinutes: 30,
      lat: Number(baseLat.toFixed(4)),
      lng: Number(baseLng.toFixed(4)),
      radiusKm: 30,
      riskLevel: classifyRiskLevel(peakThunderstormProb),
      intensityLabel: scenario.intensityLabel,
      reflectivityDbz: inputData.radarReflectivityDbz,
      speedKmh,
    },
    {
      step: '+60 min',
      offsetMinutes: 60,
      lat: Number((baseLat + 0.16).toFixed(4)),
      lng: Number((baseLng + 0.22).toFixed(4)),
      radiusKm: 34,
      riskLevel: classifyRiskLevel(peakThunderstormProb),
      intensityLabel: inputData.scenarioId === 'low-risk' ? 'Dissipating' : 'Mature Convective Core',
      reflectivityDbz: Number((inputData.radarReflectivityDbz + 1.2).toFixed(1)),
      speedKmh: speedKmh + 2,
    },
    {
      step: '+120 min',
      offsetMinutes: 120,
      lat: Number((baseLat + 0.42).toFixed(4)),
      lng: Number((baseLng + 0.64).toFixed(4)),
      radiusKm: 28,
      riskLevel: classifyRiskLevel(timeline[3].thunderstormProbability),
      intensityLabel: 'Gradual Weakening / Outflow',
      reflectivityDbz: timeline[3].expectedReflectivityDbz,
      speedKmh: Math.max(12, speedKmh - 4),
    },
  ];

  const activeStormCells: StormCellFeature[] = [
    {
      id: 'cell-primary',
      name: `${inputData.location.name} Convective Core #A1`,
      lat: baseLat,
      lng: baseLng,
      radiusKm: 35,
      riskLevel: classifyRiskLevel(Math.max(peakThunderstormProb, peakLightningProb)),
      thunderstormProb: peakThunderstormProb,
      lightningProb: peakLightningProb,
      movementDir: scenario.stormDirection,
      speedKmh,
      maxDbz: inputData.radarReflectivityDbz,
      cloudTopTempC: inputData.cloudTopTempC,
      trajectory: primaryTrajectory,
    },
    {
      id: 'cell-east-india',
      name: 'Chota Nagpur / Gangetic Norwester Cell #B4',
      lat: 23.15,
      lng: 86.45,
      radiusKm: 48,
      riskLevel: inputData.scenarioId === 'low-risk' ? 'MODERATE' : 'SEVERE',
      thunderstormProb: inputData.scenarioId === 'low-risk' ? 46 : 89,
      lightningProb: inputData.scenarioId === 'low-risk' ? 42 : 92,
      movementDir: 'NW → SE',
      speedKmh: 38,
      maxDbz: inputData.scenarioId === 'low-risk' ? 38.5 : 58.4,
      cloudTopTempC: -68.0,
      trajectory: [
        { step: 'NOW', offsetMinutes: 0, lat: 23.35, lng: 86.1, radiusKm: 40, riskLevel: 'HIGH', intensityLabel: 'Strong', reflectivityDbz: 55.2, speedKmh: 38 },
        { step: '+30 min', offsetMinutes: 30, lat: 23.15, lng: 86.45, radiusKm: 48, riskLevel: 'SEVERE', intensityLabel: 'Severe Kalbaisakhi', reflectivityDbz: 58.4, speedKmh: 40 },
        { step: '+60 min', offsetMinutes: 60, lat: 22.85, lng: 86.95, radiusKm: 46, riskLevel: 'SEVERE', intensityLabel: 'Severe Squall', reflectivityDbz: 57.0, speedKmh: 38 },
        { step: '+120 min', offsetMinutes: 120, lat: 22.45, lng: 87.65, radiusKm: 38, riskLevel: 'HIGH', intensityLabel: 'Moderate → Strong', reflectivityDbz: 49.5, speedKmh: 34 },
      ],
    },
    {
      id: 'cell-assam',
      name: 'Brahmaputra Valley Mesoscale Cluster #C2',
      lat: 26.05,
      lng: 91.45,
      radiusKm: 42,
      riskLevel: inputData.scenarioId === 'low-risk' ? 'LOW' : 'HIGH',
      thunderstormProb: inputData.scenarioId === 'low-risk' ? 29 : 78,
      lightningProb: inputData.scenarioId === 'low-risk' ? 24 : 82,
      movementDir: 'SW → NE',
      speedKmh: 26,
      maxDbz: 51.0,
      cloudTopTempC: -59.2,
      trajectory: [
        { step: 'NOW', offsetMinutes: 0, lat: 25.9, lng: 91.2, radiusKm: 36, riskLevel: 'HIGH', intensityLabel: 'Moderate', reflectivityDbz: 48.0, speedKmh: 26 },
        { step: '+30 min', offsetMinutes: 30, lat: 26.05, lng: 91.45, radiusKm: 42, riskLevel: 'HIGH', intensityLabel: 'Strong', reflectivityDbz: 51.0, speedKmh: 26 },
        { step: '+60 min', offsetMinutes: 60, lat: 26.22, lng: 91.75, radiusKm: 40, riskLevel: 'HIGH', intensityLabel: 'Strong', reflectivityDbz: 50.2, speedKmh: 25 },
        { step: '+120 min', offsetMinutes: 120, lat: 26.5, lng: 92.2, radiusKm: 32, riskLevel: 'MODERATE', intensityLabel: 'Moderate', reflectivityDbz: 43.0, speedKmh: 22 },
      ],
    },
    {
      id: 'cell-central',
      name: 'Vidarbha / Central India Trough Cell #D1',
      lat: 21.05,
      lng: 78.95,
      radiusKm: 38,
      riskLevel: inputData.scenarioId === 'low-risk' ? 'LOW' : 'MODERATE',
      thunderstormProb: inputData.scenarioId === 'low-risk' ? 22 : 61,
      lightningProb: inputData.scenarioId === 'low-risk' ? 19 : 66,
      movementDir: 'W → E',
      speedKmh: 22,
      maxDbz: 44.2,
      cloudTopTempC: -49.5,
      trajectory: [
        { step: 'NOW', offsetMinutes: 0, lat: 21.02, lng: 78.75, radiusKm: 32, riskLevel: 'MODERATE', intensityLabel: 'Moderate', reflectivityDbz: 42.0, speedKmh: 22 },
        { step: '+30 min', offsetMinutes: 30, lat: 21.05, lng: 78.95, radiusKm: 38, riskLevel: 'MODERATE', intensityLabel: 'Moderate', reflectivityDbz: 44.2, speedKmh: 22 },
        { step: '+60 min', offsetMinutes: 60, lat: 21.08, lng: 79.2, radiusKm: 36, riskLevel: 'MODERATE', intensityLabel: 'Moderate', reflectivityDbz: 43.0, speedKmh: 20 },
        { step: '+120 min', offsetMinutes: 120, lat: 21.12, lng: 79.55, radiusKm: 28, riskLevel: 'LOW', intensityLabel: 'Weakening', reflectivityDbz: 34.0, speedKmh: 18 },
      ],
    },
    {
      id: 'cell-south',
      name: 'Peninsular Pre-Monsoon Convergence Cell #E3',
      lat: 13.05,
      lng: 77.65,
      radiusKm: 32,
      riskLevel: inputData.scenarioId === 'storm-intensification' ? 'HIGH' : 'MODERATE',
      thunderstormProb: inputData.scenarioId === 'low-risk' ? 24 : 54,
      lightningProb: inputData.scenarioId === 'low-risk' ? 20 : 58,
      movementDir: 'SE → NW',
      speedKmh: 18,
      maxDbz: 41.8,
      cloudTopTempC: -45.0,
      trajectory: [
        { step: 'NOW', offsetMinutes: 0, lat: 12.95, lng: 77.75, radiusKm: 28, riskLevel: 'MODERATE', intensityLabel: 'Moderate', reflectivityDbz: 40.2, speedKmh: 18 },
        { step: '+30 min', offsetMinutes: 30, lat: 13.05, lng: 77.65, radiusKm: 32, riskLevel: 'MODERATE', intensityLabel: 'Moderate', reflectivityDbz: 41.8, speedKmh: 18 },
        { step: '+60 min', offsetMinutes: 60, lat: 13.18, lng: 77.52, radiusKm: 30, riskLevel: 'MODERATE', intensityLabel: 'Moderate', reflectivityDbz: 39.5, speedKmh: 16 },
        { step: '+120 min', offsetMinutes: 120, lat: 13.35, lng: 77.32, radiusKm: 24, riskLevel: 'LOW', intensityLabel: 'Light', reflectivityDbz: 31.0, speedKmh: 15 },
      ],
    },
  ];

  const strikeOffsets = [
    { dLat: -0.04, dLng: -0.05, pol: '-CG' as const, ka: -34.2, min: 2 },
    { dLat: 0.03, dLng: 0.04, pol: '+CG' as const, ka: 68.5, min: 4 },
    { dLat: 0.08, dLng: 0.11, pol: 'IC' as const, ka: 18.4, min: 1 },
    { dLat: -0.09, dLng: -0.12, pol: '-CG' as const, ka: -41.0, min: 7 },
    { dLat: 0.01, dLng: -0.03, pol: '-CG' as const, ka: -29.8, min: 3 },
    { dLat: 0.12, dLng: 0.15, pol: '+CG' as const, ka: 74.1, min: 5 },
    { dLat: -0.02, dLng: 0.07, pol: 'IC' as const, ka: 22.0, min: 6 },
    { dLat: 0.06, dLng: 0.02, pol: '-CG' as const, ka: -38.6, min: 9 },
  ];

  const activeStrikeCount =
    inputData.scenarioId === 'low-risk'
      ? 2
      : inputData.scenarioId === 'moderate-storm'
      ? 5
      : 8;

  const lightningStrikes: LightningStrikePoint[] = [
    ...strikeOffsets.slice(0, activeStrikeCount).map((s, idx) => ({
      id: `ltg-local-${idx}`,
      lat: Number((baseLat + s.dLat).toFixed(4)),
      lng: Number((baseLng + s.dLng).toFixed(4)),
      polarity: s.pol,
      peakCurrentKa: s.ka,
      minutesAgo: s.min,
      regionName: `${inputData.location.name}, ${inputData.location.state}`,
    })),
    { id: 'ltg-reg-1', lat: 23.18, lng: 86.42, polarity: '+CG', peakCurrentKa: 81.2, minutesAgo: 2, regionName: 'Purulia / Ranchi Sector' },
    { id: 'ltg-reg-2', lat: 22.95, lng: 86.78, polarity: '-CG', peakCurrentKa: -44.5, minutesAgo: 4, regionName: 'West Bengal Corridor' },
    { id: 'ltg-reg-3', lat: 26.08, lng: 91.52, polarity: '-CG', peakCurrentKa: -36.0, minutesAgo: 3, regionName: 'Kamrup / Guwahati' },
    { id: 'ltg-reg-4', lat: 21.09, lng: 79.02, polarity: 'IC', peakCurrentKa: 24.8, minutesAgo: 6, regionName: 'Nagpur Vidarbha' },
  ];

  const baseFlashes = inputData.totalFlashRatePerMin;
  const lightningTimeSeries: LightningTimeSeriesPoint[] = [
    {
      timeLabel: '-60 min',
      totalFlashes: Math.max(1, Math.round(baseFlashes * 0.38)),
      cloudToGround: Math.max(1, Math.round(baseFlashes * 0.09)),
      intraCloud: Math.max(1, Math.round(baseFlashes * 0.29)),
      thunderstormProb: clampProb(peakThunderstormProb * 0.55),
      lightningProb: clampProb(peakLightningProb * 0.48),
    },
    {
      timeLabel: '-45 min',
      totalFlashes: Math.max(1, Math.round(baseFlashes * 0.52)),
      cloudToGround: Math.max(1, Math.round(baseFlashes * 0.13)),
      intraCloud: Math.max(1, Math.round(baseFlashes * 0.39)),
      thunderstormProb: clampProb(peakThunderstormProb * 0.66),
      lightningProb: clampProb(peakLightningProb * 0.62),
    },
    {
      timeLabel: '-30 min',
      totalFlashes: Math.max(1, Math.round(baseFlashes * 0.68)),
      cloudToGround: Math.max(1, Math.round(baseFlashes * 0.17)),
      intraCloud: Math.max(1, Math.round(baseFlashes * 0.51)),
      thunderstormProb: clampProb(peakThunderstormProb * 0.78),
      lightningProb: clampProb(peakLightningProb * 0.74),
    },
    {
      timeLabel: '-15 min',
      totalFlashes: Math.max(1, Math.round(baseFlashes * 0.84)),
      cloudToGround: Math.max(1, Math.round(baseFlashes * 0.21)),
      intraCloud: Math.max(1, Math.round(baseFlashes * 0.63)),
      thunderstormProb: timeline[0].thunderstormProbability,
      lightningProb: timeline[0].lightningProbability,
    },
    {
      timeLabel: 'NOW',
      totalFlashes: Math.max(1, Math.round(baseFlashes * 0.92)),
      cloudToGround: Math.max(1, Math.round(baseFlashes * 0.24)),
      intraCloud: Math.max(1, Math.round(baseFlashes * 0.68)),
      thunderstormProb: timeline[1].thunderstormProbability,
      lightningProb: timeline[1].lightningProbability,
    },
    {
      timeLabel: '+30 min (Fcst)',
      totalFlashes: baseFlashes,
      cloudToGround: Math.max(1, Math.round(baseFlashes * 0.28)),
      intraCloud: Math.max(1, Math.round(baseFlashes * 0.72)),
      thunderstormProb: timeline[2].thunderstormProbability,
      lightningProb: timeline[2].lightningProbability,
    },
    {
      timeLabel: '+60 min (Fcst)',
      totalFlashes: Math.max(1, Math.round(baseFlashes * 0.86)),
      cloudToGround: Math.max(1, Math.round(baseFlashes * 0.25)),
      intraCloud: Math.max(1, Math.round(baseFlashes * 0.61)),
      thunderstormProb: clampProb(peakThunderstormProb * 0.88),
      lightningProb: clampProb(peakLightningProb * 0.85),
    },
    {
      timeLabel: '+120 min (Fcst)',
      totalFlashes: Math.max(1, Math.round(baseFlashes * 0.54)),
      cloudToGround: Math.max(1, Math.round(baseFlashes * 0.15)),
      intraCloud: Math.max(1, Math.round(baseFlashes * 0.39)),
      thunderstormProb: timeline[3].thunderstormProbability,
      lightningProb: timeline[3].lightningProbability,
    },
  ];

  const tsRisk = classifyRiskLevel(peakThunderstormProb);
  const ltgRisk = classifyRiskLevel(peakLightningProb);
  const combinedRisk = classifyRiskLevel(Math.max(peakThunderstormProb, peakLightningProb));

  const locationLabel = `${inputData.location.name}, ${inputData.location.state}`;
  const alerts: AlertItem[] = [
    {
      id: 'alert-thunderstorm-primary',
      type: 'HIGH RISK',
      riskLevel: tsRisk,
      title:
        tsRisk === 'LOW'
          ? 'Low Convective Thunderstorm Activity'
          : 'Thunderstorm Activity Intensification Advisory',
      location: locationLabel,
      forecastWindow: scenario.forecastWindow,
      reason: `Thunderstorm activity may intensify in ${locationLabel} within the ${scenario.forecastWindow.toLowerCase()} window (${peakThunderstormProb}% probability; radar core ${inputData.radarReflectivityDbz} dBZ, cloud top ${inputData.cloudTopTempC} °C).`,
      confidence,
      recommendedActions: {
        Public: SECTOR_ADVISORY_GUIDANCE.Public.primaryProtocol,
        'Disaster Management': SECTOR_ADVISORY_GUIDANCE['Disaster Management'].primaryProtocol,
        Agriculture: SECTOR_ADVISORY_GUIDANCE.Agriculture.primaryProtocol,
        Aviation: SECTOR_ADVISORY_GUIDANCE.Aviation.primaryProtocol,
        Infrastructure: SECTOR_ADVISORY_GUIDANCE.Infrastructure.primaryProtocol,
      },
    },
    {
      id: 'alert-lightning-primary',
      type: 'LIGHTNING ALERT',
      riskLevel: ltgRisk,
      title: 'Elevated Cloud-to-Ground & Intra-Cloud Lightning Hazard',
      location: locationLabel,
      forecastWindow: 'Next 0–60 min',
      reason: `Elevated lightning probability (${peakLightningProb}%) and ${scenario.lightningDensityLabel.toLowerCase()} strike density (${inputData.totalFlashRatePerMin} flashes/min, ${scenario.lightningTrendLabel}) detected in ${locationLabel}.`,
      confidence: Math.min(96, confidence + 2),
      recommendedActions: {
        Public: 'Avoid open areas and isolated trees. Seek grounded indoor shelter immediately.',
        'Disaster Management': 'Issue localized lightning safety broadcasts and alert outdoor public gathering venues.',
        Agriculture: 'Consider postponing exposed field operations and move farm personnel indoors.',
        Aviation: 'Suspend ramp ground-handling and refueling during active CG lightning proximity.',
        Infrastructure: 'Monitor grid distribution feeders and surge arresters for high-current +CG strikes.',
      },
    },
    {
      id: 'alert-movement-vector',
      type: 'MOVEMENT ALERT',
      riskLevel: combinedRisk === 'LOW' ? 'LOW' : 'HIGH',
      title: `Storm Cell Tracking Vector (${scenario.stormDirection} at ${speedKmh} km/h)`,
      location: `${inputData.location.name} Sector → NE Corridor`,
      forecastWindow: 'Next 30–120 min',
      reason: `Storm cell moving towards the ${scenario.stormDirection.split('→')[1]?.trim() || 'NE'} at an estimated ${speedKmh} km/h with ${scenario.intensityLabel.toLowerCase()} intensity and outflow gusts.`,
      confidence: Math.max(70, confidence - 3),
      recommendedActions: {
        Public: 'Secure loose outdoor objects and avoid transit along tree-lined corridors.',
        'Disaster Management': 'Pre-alert downstream blocks along the projected +30 to +60 minute trajectory cone.',
        Agriculture: 'Protect standing horticultural crops and secure storage sheds against outflow gusts.',
        Aviation: 'Monitor convective weather conditions and low-level wind shear before route decisions.',
        Infrastructure: 'Halt elevated tower/crane maintenance along the downstream storm path.',
      },
    },
  ];

  return {
    thunderstorm_probability: peakThunderstormProb,
    lightning_probability: peakLightningProb,
    storm_location: {
      name: inputData.location.name,
      state: inputData.location.state,
      lat: inputData.location.lat,
      lng: inputData.location.lng,
    },
    storm_direction: scenario.stormDirection,
    storm_speed: `${speedKmh} km/h`,
    intensity: scenario.intensityLabel,
    forecast_window: scenario.forecastWindow,
    confidence,
    explanation,
    thunderstormRiskLevel: tsRisk,
    lightningRiskLevel: ltgRisk,
    combinedRiskLevel: combinedRisk,
    lightningStrikeDensity: scenario.lightningDensityLabel,
    lightningTrend: scenario.lightningTrendLabel,
    simulatedTimestamp: '2026-09-27 · 16:45 IST (UTC+5:30)',
    scenarioName: scenario.title,
    timeline,
    primaryTrajectory,
    activeStormCells,
    lightningStrikes,
    lightningTimeSeries,
    alerts,
    inputTelemetry: inputData,
  };
}
