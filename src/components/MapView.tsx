import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Crosshair,
  Layers,
  Navigation,
  Radar,
  Zap,
} from 'lucide-react';
import {
  INDIA_BOUNDARY_COORDS,
  PRESET_LOCATIONS,
  RADAR_STATIONS,
} from '../data/demoDatasets';
import {
  LocationPoint,
  NowcastPredictionResult,
  RiskLevel,
} from '../types/nowcast';
import { useTheme } from '../context/ThemeContext';

interface MapViewProps {
  nowcast: NowcastPredictionResult;
  selectedLocation: LocationPoint;
  onSelectLocation: (loc: LocationPoint) => void;
  hazardLayerMode?: 'combined' | 'thunderstorm' | 'lightning';
  activeTrajectoryStepIndex?: number;
  heightClass?: string;
}

const RISK_HEX: Record<RiskLevel, string> = {
  LOW: '#22C55E',
  MODERATE: '#EAB308',
  HIGH: '#F97316',
  SEVERE: '#EF4444',
};

export const MapView: React.FC<MapViewProps> = ({
  nowcast,
  selectedLocation,
  onSelectLocation,
  hazardLayerMode = 'combined',
  activeTrajectoryStepIndex = 1,
  heightClass = 'h-[480px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const dynamicLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [showRadarRings, setShowRadarRings] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showLightning, setShowLightning] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [viewMode, setViewMode] = useState<'india' | 'sector'>('india');

  const { theme } = useTheme();
  const isLight = theme === 'light';
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [23.5, 80.2],
      zoom: 5,
      minZoom: 4,
      maxZoom: 11,
      zoomControl: true,
    });

    const tileUrl = isLight
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    const tiles = L.tileLayer(tileUrl, {
      attribution:
        '&copy; OpenStreetMap contributors &copy; CARTO · VAJRA-X Simulated Nowcast Grid',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = tiles;

    L.polygon(INDIA_BOUNDARY_COORDS, {
      color: isLight ? '#0284C7' : '#38BDF8',
      weight: 1.5,
      opacity: isLight ? 0.6 : 0.45,
      fillColor: isLight ? '#38BDF8' : '#0EA5E9',
      fillOpacity: isLight ? 0.05 : 0.03,
      dashArray: '4 4',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    dynamicLayerGroupRef.current = layerGroup;

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      let closest: LocationPoint | null = null;
      let minDist = Infinity;
      for (const preset of PRESET_LOCATIONS) {
        const d = Math.hypot(preset.lat - lat, preset.lng - lng);
        if (d < minDist) {
          minDist = d;
          closest = preset;
        }
      }

      if (closest && minDist < 0.85) {
        onSelectLocation(closest);
      } else {
        const nearestRadar =
          RADAR_STATIONS.reduce((best, r) => {
            const d = Math.hypot(r.lat - lat, r.lng - lng);
            return d < best.dist ? { name: r.name, dist: d } : best;
          }, { name: 'DWR New Delhi Composite', dist: Infinity }).name;

        onSelectLocation({
          id: `custom-${lat.toFixed(2)}-${lng.toFixed(2)}`,
          name: `Sector (${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E)`,
          state: 'Custom Map Target',
          lat: Number(lat.toFixed(4)),
          lng: Number(lng.toFixed(4)),
          radarStation: nearestRadar,
          elevationM: 210,
        });
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (tileLayerRef.current) {
      const tileUrl = isLight
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      tileLayerRef.current.setUrl(tileUrl);
    }
  }, [isLight]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = dynamicLayerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (showRadarRings) {
      RADAR_STATIONS.forEach((radar) => {
        L.circle([radar.lat, radar.lng], {
          radius: radar.rangeKm * 1000,
          color: '#38BDF8',
          weight: 1,
          opacity: 0.35,
          fillColor: '#0284C7',
          fillOpacity: 0.04,
          dashArray: '3 5',
        })
          .bindPopup(
            `<div class="text-xs font-mono">
              <div class="font-bold text-sky-400">${radar.name} (${radar.band})</div>
              <div class="text-slate-300 mt-1">Range: ${radar.rangeKm} km · ${radar.status}</div>
              <div class="text-slate-400 text-[10px] mt-0.5">SIMULATED DEMO METADATA</div>
            </div>`
          )
          .addTo(group);
      });
    }

    PRESET_LOCATIONS.forEach((loc) => {
      const isSelected = loc.id === selectedLocation.id;
      const stationMarker = L.circleMarker([loc.lat, loc.lng], {
        radius: isSelected ? 7 : 4.5,
        color: isSelected ? '#38BDF8' : '#94A3B8',
        weight: isSelected ? 2.5 : 1,
        fillColor: isSelected ? '#0EA5E9' : '#1E293B',
        fillOpacity: 0.9,
      });

      stationMarker.on('click', (ev) => {
        L.DomEvent.stopPropagation(ev);
        onSelectLocation(loc);
      });

      stationMarker.bindTooltip(
        `${loc.name}, ${loc.state}`,
        {
          direction: 'top',
          offset: [0, -6],
          opacity: 0.9,
        }
      );

      stationMarker.addTo(group);
    });

    nowcast.activeStormCells.forEach((cell) => {
      const effectiveProb =
        hazardLayerMode === 'thunderstorm'
          ? cell.thunderstormProb
          : hazardLayerMode === 'lightning'
          ? cell.lightningProb
          : Math.max(cell.thunderstormProb, cell.lightningProb);

      const effectiveRisk: RiskLevel =
        effectiveProb >= 88
          ? 'SEVERE'
          : effectiveProb >= 65
          ? 'HIGH'
          : effectiveProb >= 38
          ? 'MODERATE'
          : 'LOW';

      const riskColor = RISK_HEX[effectiveRisk];

      if (showHeatmap) {
        L.circle([cell.lat, cell.lng], {
          radius: cell.radiusKm * 3200,
          color: riskColor,
          weight: 0,
          fillColor: riskColor,
          fillOpacity: 0.14,
        }).addTo(group);

        L.circle([cell.lat, cell.lng], {
          radius: cell.radiusKm * 2000,
          color: riskColor,
          weight: 1,
          opacity: 0.4,
          fillColor: riskColor,
          fillOpacity: 0.22,
        }).addTo(group);
      }

      L.circle([cell.lat, cell.lng], {
        radius: cell.radiusKm * 1000,
        color: riskColor,
        weight: 2,
        fillColor: riskColor,
        fillOpacity: 0.42,
      })
        .bindPopup(
          `<div class="text-xs space-y-1">
            <div class="font-bold text-slate-100">${cell.name}</div>
            <div class="font-mono text-[11px] text-amber-400">SIMULATED DEMO DATA</div>
            <div class="font-mono text-slate-200">Risk Level: <strong>${effectiveRisk}</strong></div>
            <div class="font-mono text-slate-300">Thunderstorm Prob: ${cell.thunderstormProb}%</div>
            <div class="font-mono text-slate-300">Lightning Prob: ${cell.lightningProb}%</div>
            <div class="font-mono text-slate-300">Max Reflectivity: ${cell.maxDbz} dBZ</div>
            <div class="font-mono text-slate-300">Cloud-Top Temp: ${cell.cloudTopTempC} °C</div>
            <div class="font-mono text-sky-300">Vector: ${cell.movementDir} at ${cell.speedKmh} km/h</div>
          </div>`
        )
        .addTo(group);
    });

    if (showTrajectory && nowcast.primaryTrajectory.length > 0) {
      const waypoints = nowcast.primaryTrajectory;
      const latlngs: [number, number][] = waypoints.map((w) => [w.lat, w.lng]);

      L.polyline(latlngs, {
        color: '#38BDF8',
        weight: 3,
        dashArray: '6 6',
        opacity: 0.95,
      }).addTo(group);

      waypoints.forEach((wp, idx) => {
        const isCurrentPlaybackStep = idx === activeTrajectoryStepIndex;
        const wpColor = RISK_HEX[wp.riskLevel];

        const iconHtml = `
          <div style="
            display:flex;
            align-items:center;
            gap:4px;
            background:${isCurrentPlaybackStep ? '#0284C7' : '#0F172A'};
            color:#F8FAFC;
            border:2px solid ${isCurrentPlaybackStep ? '#38BDF8' : wpColor};
            border-radius:6px;
            padding:2px 6px;
            font-family:'JetBrains Mono',monospace;
            font-size:10px;
            font-weight:700;
            white-space:nowrap;
            box-shadow:0 4px 12px rgba(0,0,0,0.6);
            transform:scale(${isCurrentPlaybackStep ? 1.12 : 0.95});
          ">
            <span style="width:7px;height:7px;border-radius:999px;background:${wpColor};display:inline-block;"></span>
            <span>${wp.step}</span>
          </div>
        `;

        const divIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-trajectory-node',
          iconSize: [74, 24],
          iconAnchor: [37, 12],
        });

        L.marker([wp.lat, wp.lng], { icon: divIcon })
          .bindPopup(
            `<div class="text-xs font-mono space-y-1">
              <div class="font-bold text-sky-400">Trajectory Waypoint: ${wp.step}</div>
              <div>Risk: <strong>${wp.riskLevel}</strong> (${wp.intensityLabel})</div>
              <div>Est. Reflectivity: ${wp.reflectivityDbz} dBZ</div>
              <div>Movement Speed: ${wp.speedKmh} km/h</div>
              <div class="text-slate-400 text-[10px]">SIMULATED TRAJECTORY</div>
            </div>`
          )
          .addTo(group);

        if (isCurrentPlaybackStep) {
          L.circle([wp.lat, wp.lng], {
            radius: wp.radiusKm * 850,
            color: '#38BDF8',
            weight: 2,
            fillColor: wpColor,
            fillOpacity: 0.28,
          }).addTo(group);
        }
      });
    }

    if (showLightning && hazardLayerMode !== 'thunderstorm') {
      nowcast.lightningStrikes.forEach((strike) => {
        const boltColor =
          strike.polarity === '+CG'
            ? '#EF4444'
            : strike.polarity === '-CG'
            ? '#FACC15'
            : '#38BDF8';

        const boltIcon = L.divIcon({
          html: `<div style="
            width:20px;
            height:20px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:rgba(15,23,42,0.9);
            border:1.5px solid ${boltColor};
            border-radius:999px;
            color:${boltColor};
            font-size:11px;
            font-weight:bold;
            box-shadow:0 0 8px ${boltColor}66;
          ">⚡</div>`,
          className: 'custom-lightning-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        L.marker([strike.lat, strike.lng], { icon: boltIcon })
          .bindPopup(
            `<div class="text-xs font-mono space-y-1">
              <div class="font-bold text-amber-400">Simulated Lightning Discharge (${strike.polarity})</div>
              <div>Region: ${strike.regionName}</div>
              <div>Peak Current: ${strike.peakCurrentKa} kA</div>
              <div>Observed: T-${strike.minutesAgo} min (Simulated)</div>
            </div>`
          )
          .addTo(group);
      });
    }

    const targetIcon = L.divIcon({
      html: `<div style="
        width:28px;
        height:28px;
        border-radius:999px;
        border:2px solid #38BDF8;
        background:rgba(14,165,233,0.22);
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 0 14px rgba(56,189,248,0.7);
      ">
        <div style="width:8px;height:8px;border-radius:999px;background:#38BDF8;"></div>
      </div>`,
      className: 'custom-user-target',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    L.marker([selectedLocation.lat, selectedLocation.lng], { icon: targetIcon })
      .bindPopup(
        `<div class="text-xs font-mono space-y-1">
          <div class="font-bold text-sky-400">Target: ${selectedLocation.name}, ${selectedLocation.state}</div>
          <div>Coords: ${selectedLocation.lat.toFixed(3)}°N, ${selectedLocation.lng.toFixed(3)}°E</div>
          <div>Thunderstorm Prob: ${nowcast.thunderstorm_probability}% (${nowcast.thunderstormRiskLevel})</div>
          <div>Lightning Prob: ${nowcast.lightning_probability}% (${nowcast.lightningRiskLevel})</div>
          <div class="text-amber-400 text-[10px]">SIMULATED DEMO DATA</div>
        </div>`
      )
      .addTo(group);
  }, [
    nowcast,
    selectedLocation,
    showRadarRings,
    showHeatmap,
    showLightning,
    showTrajectory,
    hazardLayerMode,
    activeTrajectoryStepIndex,
  ]);

  const handleFocusTarget = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([selectedLocation.lat, selectedLocation.lng], 8, {
      duration: 0.8,
    });
    setViewMode('sector');
  };

  const handleResetIndiaView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([23.5, 80.2], 5, {
      duration: 0.8,
    });
    setViewMode('india');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Where could the storm move next?
            </h3>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              SIMULATED DEMO DATA
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            VAJRA-X combines multiple observations to estimate storm location and movement.
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Target Focus: <strong className="text-slate-800">{selectedLocation.name}, {selectedLocation.state}</strong> · Click any location on map to recompute risk &amp; trajectory
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-1.5">
          <button
            type="button"
            onClick={handleFocusTarget}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
              viewMode === 'sector'
                ? 'bg-sky-50 border-sky-400 text-sky-700 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 text-sky-600" />
            <span>Focus {selectedLocation.name.split(' ')[0]}</span>
          </button>

          <button
            type="button"
            onClick={handleResetIndiaView}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
              viewMode === 'india'
                ? 'bg-sky-50 border-sky-400 text-sky-700 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All-India
          </button>

          <button
            type="button"
            onClick={() => setShowHeatmap((v) => !v)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
              showHeatmap
                ? 'bg-orange-50 border-orange-300 text-orange-800'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Heatmap</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLightning((v) => !v)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
              showLightning
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Lightning</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTrajectory((v) => !v)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
              showTrajectory
                ? 'bg-sky-50 border-sky-300 text-sky-800'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Trajectory</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRadarRings((v) => !v)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
              showRadarRings
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span>DWR Rings</span>
          </button>
        </div>
      </div>

      {/* Trajectory Timeline Sequence Strip */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="font-bold text-slate-700">Trajectory Horizon:</span>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-800 shadow-2xs">
            Current Storm (NOW)
          </span>
          <span className="text-slate-400">→</span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-800 shadow-2xs">
            +30 min
          </span>
          <span className="text-slate-400">→</span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-800 shadow-2xs">
            +60 min
          </span>
          <span className="text-slate-400">→</span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-800 shadow-2xs">
            +120 min
          </span>
        </div>
      </div>

      <div className={`relative w-full ${heightClass}`}>
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        <div className="absolute top-3 right-3 z-20 bg-white/95 border border-slate-200 rounded-lg p-3 text-xs font-mono space-y-1 pointer-events-none max-w-[240px] shadow-sm">
          <div className="text-[10px] text-amber-700 font-bold">
            SIMULATED NOWCAST VECTOR
          </div>
          <div className="text-slate-900 font-bold truncate">
            {selectedLocation.name}, {selectedLocation.state}
          </div>
          <div className="text-slate-500 tabular-nums text-[11px]">
            {selectedLocation.lat.toFixed(2)}°N · {selectedLocation.lng.toFixed(2)}°E
          </div>
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-3 text-[11px]">
            <span className="text-slate-500">Movement:</span>
            <span className="text-sky-700 font-bold">{nowcast.storm_direction} ({nowcast.storm_speed})</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center flex-wrap gap-4">
          <span className="font-bold text-slate-800">Risk Intensity Legend:</span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Low (Safe)</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
            <span>Moderate</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
            <span>High</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            <span>Severe</span>
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-4 text-slate-500 font-mono text-[11px]">
          <span>⚡ Lightning (+CG / -CG / IC)</span>
          <span>--- Trajectory Vectors</span>
          <span>◯ DWR Radar Rings</span>
        </div>
      </div>
    </div>
  );
};
