import { useSyncExternalStore } from 'react';
import {
  DEMO_SCENARIOS,
  PRESET_LOCATIONS,
} from '../data/demoDatasets';
import {
  LocationPoint,
  NowcastPredictionResult,
  ScenarioDefinition,
  ScenarioId,
  SimulationState,
  TimeHorizon,
  UserSector,
} from '../types/nowcast';
import {
  buildAtmosphericInput,
  predictNowcast,
} from './nowcastEngine';

type Listener = (state: SimulationState) => void;

const HORIZON_STEPS: TimeHorizon[] = ['NOW', '+30m', '+60m', '+120m'];

/**
 * SimulationService
 *
 * Centralized state manager for the five Smart India Hackathon 2026 demo scenarios:
 * 1. Low Risk (low-risk)
 * 2. Moderate Storm (moderate-storm)
 * 3. Severe Thunderstorm (severe-thunderstorm)
 * 4. Lightning Intensive (lightning-intensive)
 * 5. Storm Intensification (storm-intensification)
 *
 * Coordinates multi-sensor input construction, AI/ML nowcasting inference,
 * playback timelines, stakeholder decision roles, and reactive notification
 * to all subscriber components.
 */
class SimulationService {
  private state: SimulationState;
  private listeners: Set<Listener> = new Set();
  private playbackTimer: number | null = null;
  private pipelineTimer: number | null = null;

  constructor() {
    const initialLocation = PRESET_LOCATIONS[0]; // Ghaziabad, Uttar Pradesh
    const initialScenario: ScenarioId = 'severe-thunderstorm';
    const initialHorizon: TimeHorizon = 'NOW';
    const initialSector: UserSector = 'Public';

    const inputData = buildAtmosphericInput(
      initialLocation,
      initialScenario,
      initialHorizon
    );
    const initialNowcast = predictNowcast(inputData);

    this.state = {
      demoModeEnabled: true,
      selectedScenario: initialScenario,
      selectedScenarioObj: DEMO_SCENARIOS[initialScenario],
      selectedHorizon: initialHorizon,
      selectedLocation: initialLocation,
      selectedSector: initialSector,
      activeTrajectoryStep: 1, // +30m waypoint focus
      isPlayingForecast: false,
      pipelineStepIndex: null,
      simulatedClock: '27 Sep 2026 · 16:45 IST',
      nowcast: initialNowcast,
    };
  }

  /**
   * Return all available scenarios
   */
  public getScenarios(): ScenarioDefinition[] {
    return Object.values(DEMO_SCENARIOS);
  }

  /**
   * Return a specific scenario definition by ID
   */
  public getScenario(id: ScenarioId): ScenarioDefinition {
    return DEMO_SCENARIOS[id] || DEMO_SCENARIOS['severe-thunderstorm'];
  }

  /**
   * Get the current snapshot of global simulation state
   */
  public getState(): SimulationState {
    return this.state;
  }

  /**
   * Subscribe to global simulation state changes
   * @returns Unsubscribe function
   */
  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.state);
      } catch (err) {
        console.error('SimulationService listener notification error:', err);
      }
    });
  }

  private recomputeNowcast() {
    const inputData = buildAtmosphericInput(
      this.state.selectedLocation,
      this.state.selectedScenario,
      this.state.selectedHorizon
    );
    const nowcast = predictNowcast(inputData);

    this.state = {
      ...this.state,
      selectedScenarioObj: DEMO_SCENARIOS[this.state.selectedScenario],
      nowcast,
    };

    // Keep backend /api/nowcast in sync if online
    if (typeof window !== 'undefined' && window.fetch) {
      window
        .fetch(
          `/api/nowcast?scenario=${this.state.selectedScenario}&horizon=${encodeURIComponent(
            this.state.selectedHorizon
          )}&locationId=${this.state.selectedLocation.id}`
        )
        .catch(() => {
          // Silent local fallback
        });
    }

    this.notify();
  }

  /**
   * Updates the active scenario and synchronizes global state across
   * map layers, risk scores, trajectories, lightning markers, charts & alerts.
   */
  public selectScenario(scenarioId: ScenarioId): void {
    if (this.state.selectedScenario === scenarioId && this.state.demoModeEnabled) {
      return;
    }
    this.state = {
      ...this.state,
      demoModeEnabled: true,
      selectedScenario: scenarioId,
      selectedScenarioObj: DEMO_SCENARIOS[scenarioId] || DEMO_SCENARIOS['severe-thunderstorm'],
    };
    this.recomputeNowcast();
  }

  /**
   * Updates the forecast time horizon (NOW -> +30m -> +60m -> +120m)
   */
  public selectHorizon(horizon: TimeHorizon): void {
    const stepIdx = HORIZON_STEPS.indexOf(horizon);
    this.state = {
      ...this.state,
      selectedHorizon: horizon,
      activeTrajectoryStep: stepIdx !== -1 ? stepIdx : this.state.activeTrajectoryStep,
    };
    this.recomputeNowcast();
  }

  /**
   * Updates target geographic location
   */
  public selectLocation(location: LocationPoint): void {
    this.state = {
      ...this.state,
      selectedLocation: location,
    };
    this.recomputeNowcast();
  }

  /**
   * Updates active stakeholder decision sector
   */
  public selectSector(sector: UserSector): void {
    this.state = {
      ...this.state,
      selectedSector: sector,
    };
    this.notify();
  }

  /**
   * Sets the trajectory waypoint step index (0..3)
   */
  public setTrajectoryStep(stepIndex: number): void {
    const boundedIndex = Math.max(0, Math.min(3, stepIndex));
    this.state = {
      ...this.state,
      activeTrajectoryStep: boundedIndex,
      selectedHorizon: HORIZON_STEPS[boundedIndex],
    };
    this.recomputeNowcast();
  }

  /**
   * Starts automatic animated forecast trajectory playback
   */
  public playForecast(): void {
    if (this.state.isPlayingForecast) return;

    this.state = {
      ...this.state,
      isPlayingForecast: true,
    };
    this.notify();

    if (this.playbackTimer !== null) {
      clearInterval(this.playbackTimer);
    }

    this.playbackTimer = window.setInterval(() => {
      const nextStep = (this.state.activeTrajectoryStep + 1) % 4;
      this.setTrajectoryStep(nextStep);
    }, 1400);
  }

  /**
   * Pauses trajectory playback
   */
  public pauseForecast(): void {
    if (this.playbackTimer !== null) {
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }
    this.state = {
      ...this.state,
      isPlayingForecast: false,
    };
    this.notify();
  }

  /**
   * Resets trajectory playback and rewinds to NOW
   */
  public resetForecast(): void {
    this.pauseForecast();
    this.setTrajectoryStep(0);
  }

  /**
   * Triggers the 5-stage Nowcast fusion pipeline animation:
   * 01. Ingestion -> 02. Alignment -> 03. AI Inference -> 04. Risk Gen -> 05. Alert Gen
   */
  public runNowcast(): void {
    if (this.state.pipelineStepIndex !== null) return;

    this.state = {
      ...this.state,
      pipelineStepIndex: 0,
    };
    this.notify();

    const advanceStep = (step: number) => {
      this.pipelineTimer = window.setTimeout(() => {
        if (step < 5) {
          this.state = {
            ...this.state,
            pipelineStepIndex: step,
          };
          this.notify();
          advanceStep(step + 1);
        } else {
          const mins = Math.floor(40 + Math.random() * 19);
          this.state = {
            ...this.state,
            pipelineStepIndex: null,
            simulatedClock: `27 Sep 2026 · 16:${mins} IST`,
          };
          this.recomputeNowcast();
        }
      }, 320);
    };

    advanceStep(1);
  }

  /**
   * Toggles Demo Mode on/off
   */
  public toggleDemoMode(): void {
    this.state = {
      ...this.state,
      demoModeEnabled: !this.state.demoModeEnabled,
    };
    this.notify();
  }
}

// Export singleton instance
export const simulationService = new SimulationService();

/**
 * Custom React Hook to subscribe to SimulationService state using useSyncExternalStore
 */
export function useSimulation(): SimulationState {
  return useSyncExternalStore(
    (callback) => simulationService.subscribe(callback),
    () => simulationService.getState(),
    () => simulationService.getState()
  );
}
