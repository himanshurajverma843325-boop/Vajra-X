import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  LogOut,
  Bookmark,
  Plus,
  Trash2,
  BookmarkCheck,
  FileText,
  AlertTriangle,
  MapPin,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  signInWithGoogle,
  signOutUser,
  subscribeAuthState,
  subscribeSavedLocations,
  addSavedLocation,
  removeSavedLocation,
  subscribeWeatherNotes,
  addWeatherNote,
  removeWeatherNote,
  SavedLocationItem,
  WeatherNoteItem,
} from '../services/firebase';
import { useTheme } from '../context/ThemeContext';
import { LocationPoint } from '../types/nowcast';

interface FirebaseAuthPanelProps {
  currentLocation: LocationPoint;
  onSelectLocation?: (loc: LocationPoint) => void;
  currentScenarioTitle?: string;
  currentSeverity?: string;
}

export const FirebaseAuthPanel: React.FC<FirebaseAuthPanelProps> = ({
  currentLocation,
  onSelectLocation,
  currentScenarioTitle = 'Convective Storm',
  currentSeverity = 'MODERATE',
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [savedLocations, setSavedLocations] = useState<SavedLocationItem[]>([]);
  const [weatherNotes, setWeatherNotes] = useState<WeatherNoteItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subscribe to auth state
  useEffect(() => {
    const unsubscribe = subscribeAuthState((currUser) => {
      setUser(currUser);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to Firestore collections when user is logged in
  useEffect(() => {
    if (!user) {
      setSavedLocations([]);
      setWeatherNotes([]);
      return;
    }

    const unsubLocs = subscribeSavedLocations(user.uid, (locs) => {
      setSavedLocations(locs);
    });

    const unsubNotes = subscribeWeatherNotes(user.uid, (notes) => {
      setWeatherNotes(notes);
    });

    return () => {
      unsubLocs();
      unsubNotes();
    };
  }, [user]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setShowDropdown(false);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const isCurrentLocationSaved = savedLocations.some(
    (l) => l.locationId === currentLocation.id || l.name === currentLocation.name
  );

  const handleToggleSaveLocation = async () => {
    if (!user) {
      handleSignIn();
      return;
    }

    if (isCurrentLocationSaved) {
      const match = savedLocations.find(
        (l) => l.locationId === currentLocation.id || l.name === currentLocation.name
      );
      if (match) {
        await removeSavedLocation(user.uid, match.id);
      }
    } else {
      const newLocDocId = `loc_${Date.now()}`;
      await addSavedLocation(user.uid, {
        id: newLocDocId,
        locationId: currentLocation.id,
        name: currentLocation.name,
        state: currentLocation.state,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
        alertThreshold: 'MODERATE',
        notes: `Pinned during ${currentScenarioTitle} assessment.`,
      });
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !noteTitle.trim() || !noteBody.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const noteDocId = `note_${Date.now()}`;
      await addWeatherNote(user.uid, {
        id: noteDocId,
        title: noteTitle.trim(),
        scenarioId: currentScenarioTitle,
        locationName: `${currentLocation.name}, ${currentLocation.state}`,
        severity: currentSeverity,
        notes: noteBody.trim(),
      });
      setNoteTitle('');
      setNoteBody('');
      setShowNoteModal(false);
    } catch (err) {
      console.error('Save note error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* User Status / Sign In Button */}
      {user ? (
        <div className="flex items-center gap-2">
          {/* Quick Pin Location Button */}
          <button
            onClick={handleToggleSaveLocation}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isCurrentLocationSaved
                ? 'bg-amber-500/15 text-amber-600 border-amber-500/30 hover:bg-amber-500/25'
                : isLight
                ? 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                : 'bg-[#1E293B] text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
            title={isCurrentLocationSaved ? 'Pinned in your Firestore watchlist' : 'Pin to your Firestore watchlist'}
          >
            {isCurrentLocationSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Pinned</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pin Zone</span>
              </>
            )}
          </button>

          {/* User profile dropdown trigger */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                : 'bg-[#1E293B] hover:bg-[#2A3B52] border-slate-700 text-slate-200'
            }`}
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-6 h-6 rounded-full border border-sky-500"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                {user.displayName ? user.displayName[0] : 'U'}
              </div>
            )}
            <span className="text-xs font-semibold max-w-[90px] truncate hidden md:inline">
              {user.displayName || 'User'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleSignIn}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-xs transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.4 7.36 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.6 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span className="hidden sm:inline">Google Sign In</span>
        </button>
      )}

      {/* Dropdown Menu for Saved Data */}
      {showDropdown && user && (
        <div
          className={`absolute right-0 mt-2 w-80 rounded-xl shadow-xl border z-50 p-4 space-y-4 animate-in fade-in duration-100 ${
            isLight
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-[#0F172A] border-[#1E293B] text-slate-100'
          }`}
        >
          {/* User Info Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-inherit">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                {user.displayName ? user.displayName[0] : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{user.displayName || 'Signed In'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Section 1: Monitored Watch Locations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                Pinned Watch Zones ({savedLocations.length})
              </span>
              <span className="text-[9px] font-mono text-emerald-600">Firestore Sync</span>
            </div>

            {savedLocations.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic py-1">
                No pinned zones yet. Click "Pin Zone" on any location to monitor it.
              </p>
            ) : (
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {savedLocations.map((loc) => (
                  <div
                    key={loc.id}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                      loc.locationId === currentLocation.id
                        ? isLight
                          ? 'bg-sky-50 border-sky-300 text-sky-900'
                          : 'bg-sky-950/40 border-sky-800 text-sky-200'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        : 'bg-[#1E293B] border-slate-700 hover:bg-slate-800'
                    }`}
                    onClick={() => {
                      if (onSelectLocation) {
                        onSelectLocation({
                          id: loc.locationId,
                          name: loc.name,
                          state: loc.state,
                          lat: loc.latitude,
                          lng: loc.longitude,
                          radarStation: 'DWR Composite',
                          elevationM: 210,
                        });
                        setShowDropdown(false);
                      }
                    }}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="font-semibold truncate">{loc.name}</span>
                      <span className="text-[10px] text-slate-400 truncate">({loc.state})</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSavedLocation(user.uid, loc.id);
                      }}
                      className="text-slate-400 hover:text-rose-500 p-0.5"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Operational Weather Notes */}
          <div className="space-y-2 pt-2 border-t border-inherit">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-500" />
                Weather Logbook ({weatherNotes.length})
              </span>
              <button
                onClick={() => {
                  setShowNoteModal(true);
                  setShowDropdown(false);
                }}
                className="text-[11px] font-semibold text-sky-600 hover:underline flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" />
                New Note
              </button>
            </div>

            {weatherNotes.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic py-1">
                No incident logs saved. Record field notes or storm threat logs.
              </p>
            ) : (
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {weatherNotes.slice(0, 4).map((note) => (
                  <div
                    key={note.id}
                    className={`p-2 rounded-lg border text-xs space-y-1 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1E293B] border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold truncate text-[11px]">{note.title}</span>
                      <button
                        onClick={() => removeWeatherNote(user.uid, note.id)}
                        className="text-slate-400 hover:text-rose-500 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{note.notes}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Log Weather Note Modal */}
      {showNoteModal && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-2xl p-5 shadow-2xl border space-y-4 ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800'
                : 'bg-[#0F172A] border-[#1E293B] text-slate-100'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-inherit">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-500" />
                Log Operational Weather Incident Note
              </h3>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Incident Title / Headline
                </label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Squall line passage over Ghaziabad..."
                  className={`w-full text-xs px-3 py-2 rounded-lg border outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-sky-500'
                      : 'bg-[#111C35] border-slate-700 text-slate-100 focus:border-sky-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Location & Scenario Context
                </label>
                <div
                  className={`p-2 rounded-lg border text-[11px] font-mono ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0B1120] border-slate-800'
                  }`}
                >
                  {currentLocation.name}, {currentLocation.state} • {currentScenarioTitle} ({currentSeverity})
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Observation / Field Directive Notes
                </label>
                <textarea
                  required
                  rows={4}
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  placeholder="Record ground hail reports, peak wind gusts, electrical utility outages, or emergency alerts..."
                  className={`w-full text-xs px-3 py-2 rounded-lg border outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-sky-500'
                      : 'bg-[#111C35] border-slate-700 text-slate-100 focus:border-sky-500'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold disabled:opacity-40"
                >
                  {isSubmitting ? 'Saving to Firestore...' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
