import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ExternalLink,
  ShieldAlert,
  Hospital,
  Compass,
  RefreshCw,
  Search,
  CheckCircle2,
  Building2,
  Navigation,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { LocationPoint } from '../types/nowcast';

interface GroundingPlace {
  title?: string;
  uri?: string;
  address?: string;
}

interface MapsGroundingViewProps {
  currentLocation: LocationPoint;
}

export const MapsGroundingView: React.FC<MapsGroundingViewProps> = ({ currentLocation }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [isLoading, setIsLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState<string>('');
  const [places, setPlaces] = useState<GroundingPlace[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastFetchedLocation, setLastFetchedLocation] = useState<string>('');

  const fetchMapsGrounding = async (queryOverride?: string) => {
    setIsLoading(true);
    try {
      const prompt =
        queryOverride ||
        `Locate emergency relief centers, civil defense shelters, major multi-speciality government hospitals, and high-risk flood or lightning vulnerability areas around ${currentLocation.name}, ${currentLocation.state} (lat: ${currentLocation.lat}, lng: ${currentLocation.lng}). Provide actionable points and direct Google Maps locations.`;

      const res = await fetch('/api/ai/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          locationName: `${currentLocation.name}, ${currentLocation.state}`,
        }),
      });

      if (!res.ok) throw new Error('Failed to retrieve Maps data');

      const data = await res.json();
      setAnalysisText(data.text || '');

      // Extract places from groundingChunks
      const extractedPlaces: GroundingPlace[] = [];
      if (Array.isArray(data.groundingChunks)) {
        data.groundingChunks.forEach((chunk: any) => {
          if (chunk.maps) {
            extractedPlaces.push({
              title: chunk.maps.title || 'Location Reference',
              uri: chunk.maps.uri || '#',
              address: chunk.maps.placeAnswerSources?.[0]?.reviewSnippets?.[0] || '',
            });
          }
        });
      }
      setPlaces(extractedPlaces);
      setLastFetchedLocation(currentLocation.name);
    } catch (err) {
      console.error('Maps grounding error:', err);
      setAnalysisText(
        `Unable to fetch live Google Maps grounding for ${currentLocation.name}. Please ensure internet connectivity and check your Gemini API key.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentLocation.name !== lastFetchedLocation) {
      fetchMapsGrounding();
    }
  }, [currentLocation]);

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchMapsGrounding(
      `Find ${searchQuery} near ${currentLocation.name}, ${currentLocation.state} (${currentLocation.lat}, ${currentLocation.lng}) for emergency weather preparedness. List verified Google Maps places.`
    );
  };

  return (
    <div
      className={`rounded-xl border p-5 transition-all shadow-sm ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800'
          : 'bg-[#111C35] border-[#1E293B] text-slate-100'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-inherit">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold tracking-tight">
                Google Maps Grounded Infrastructure Intelligence
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                gemini-3.5-flash + googleMaps
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Live geographic grounding for emergency hospitals, cyclone/lightning shelters, and civic staging zones
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchMapsGrounding()}
          disabled={isLoading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              : 'bg-[#1E293B] hover:bg-[#2A3B52] border-slate-700 text-slate-300'
          }`}
          title="Refresh Google Maps Grounding data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Retrieving Maps...' : 'Refresh Geo-Data'}</span>
        </button>
      </div>

      {/* Target Location Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2 my-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-500" />
          <span className="font-semibold">{currentLocation.name}, {currentLocation.state}</span>
          <span className="text-slate-400">({currentLocation.lat.toFixed(4)}°N, {currentLocation.lng.toFixed(4)}°E)</span>
        </div>

        {/* Custom Grounding Search Input */}
        <form onSubmit={handleCustomSearch} className="flex items-center gap-1.5 w-full sm:w-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. fire stations, trauma centers..."
            className={`text-xs px-3 py-1.5 rounded-lg border outline-none font-sans ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-slate-800 focus:bg-white focus:border-sky-500'
                : 'bg-[#0B1120] border-slate-700 text-slate-200 focus:border-sky-500'
            }`}
          />
          <button
            type="submit"
            disabled={isLoading || !searchQuery.trim()}
            className="p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white cursor-pointer disabled:opacity-40"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
          <span>Grounding live geographical assets with Google Maps API...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Formatted Analysis text */}
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed whitespace-pre-wrap ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-[#0B1120] border-[#1E293B] text-slate-300'
            }`}
          >
            {analysisText || 'Click "Refresh Geo-Data" to query Google Maps intelligence for this zone.'}
          </div>

          {/* Extracted Google Maps Links (Mandatory as per skill) */}
          {places.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-sky-500" />
                Verified Google Maps Points of Interest ({places.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {places.map((place, i) => (
                  <a
                    key={i}
                    href={place.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-lg border flex flex-col justify-between gap-2 transition-all hover:scale-[1.01] ${
                      isLight
                        ? 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-sm text-slate-800'
                        : 'bg-[#0F172A] border-[#1E293B] hover:border-emerald-500/50 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-semibold text-xs line-clamp-1">{place.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      </div>
                      {place.address && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                          {place.address}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-mono font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      View on Google Maps
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
