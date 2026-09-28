import React, { useState } from 'react';
import {
  CloudLightning,
  Zap,
  Radio,
  Navigation,
  ShieldAlert,
  Database,
  Info,
  RefreshCw,
  Cpu,
  Layers,
  MapPin,
  Clock,
  Award,
  AlertTriangle,
  Menu,
  X,
  Sun,
  Moon,
  Mic,
  MessageSquare,
  Sparkles,
  Compass,
} from 'lucide-react';
import { simulationService, useSimulation } from './services/simulationService';
import { NavigationTab } from './types/nowcast';
import { ScenarioSelector } from './components/ScenarioSelector';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Components
import { GeminiChatbot } from './components/GeminiChatbot';
import { LiveVoiceAssistant } from './components/LiveVoiceAssistant';
import { FirebaseAuthPanel } from './components/FirebaseAuthPanel';
import { MapsGroundingView } from './components/MapsGroundingView';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { AIEnginePage } from './pages/AIEnginePage';
import { RiskMapPage } from './pages/RiskMapPage';
import { StormTrackingPage } from './pages/StormTrackingPage';
import { LightningPage } from './pages/LightningPage';
import { AlertsPage } from './pages/AlertsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { AboutPage } from './pages/AboutPage';

function AppContent() {
  const simState = useSimulation();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const {
    demoModeEnabled,
    selectedScenario,
    selectedHorizon,
    selectedLocation,
    selectedSector,
    activeTrajectoryStep,
    isPlayingForecast,
    pipelineStepIndex,
    simulatedClock,
    nowcast,
  } = simState;

  const handleNavClick = (tabId: NavigationTab) => {
    if (tabId === 'how-it-works') {
      if (activeTab !== 'overview') {
        setActiveTab('overview');
        setTimeout(() => {
          const el = document.getElementById('how-it-works-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById('how-it-works-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    setActiveTab(tabId);
  };

  const NAV_ITEMS: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Radio className="w-4 h-4" /> },
    { id: 'how-it-works', label: 'How It Works', icon: <Cpu className="w-4 h-4" /> },
    { id: 'nowcast', label: 'Nowcast', icon: <CloudLightning className="w-4 h-4" /> },
    { id: 'risk-map', label: 'Risk Map', icon: <Layers className="w-4 h-4" /> },
    { id: 'storm-tracking', label: 'Storm Tracking', icon: <Navigation className="w-4 h-4" /> },
    { id: 'lightning', label: 'Lightning', icon: <Zap className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'maps-grounding', label: 'Maps Grounding', icon: <Compass className="w-4 h-4" /> },
    { id: 'data-sources', label: 'Data Sources', icon: <Database className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-sky-500/20 selection:text-sky-700 ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0B1120] text-slate-100'
      }`}
    >
      {/* Top Banner / Hackathon Identity Bar */}
      <div
        className={`px-4 py-1.5 text-xs border-b transition-colors ${
          isLight
            ? 'bg-slate-100 border-slate-200 text-slate-700'
            : 'bg-[#080D1A] border-[#1E293B] text-slate-300'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 border border-amber-500/30 font-semibold text-[11px]">
              <Award className="w-3 h-3 text-amber-600" />
              SMART INDIA HACKATHON 2026
            </span>
            <span className="font-mono text-[11px]">
              Problem ID: <strong>SIH26072</strong>
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-[11px]">
              Team: <strong className="text-sky-600 font-semibold">INNOVEXA_X</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>{simulatedClock}</span>
            </div>
            <div className="h-3 w-px bg-slate-300 hidden sm:block" />
            <button
              onClick={() => simulationService.toggleDemoMode()}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                demoModeEnabled
                  ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
              }`}
              title="Toggle Demonstration Mode"
            >
              {demoModeEnabled ? '● DEMO MODE ACTIVE' : '○ LIVE FEED (OFFLINE)'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 backdrop-blur border-b transition-colors ${
          isLight
            ? 'bg-white/95 border-slate-200 shadow-xs'
            : 'bg-[#0F172A]/95 border-[#1E293B]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Logo and Brand */}
            <div
              className="flex items-center gap-3 cursor-pointer group shrink-0"
              onClick={() => handleNavClick('overview')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 p-0.5 shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform">
                <div
                  className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                    isLight ? 'bg-white' : 'bg-[#0B1120]'
                  }`}
                >
                  <CloudLightning className="w-5 h-5 text-sky-600 group-hover:text-amber-500 transition-colors" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xl font-black tracking-wider ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    VAJRA<span className="text-sky-600">-X</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-sky-500/10 border border-sky-500/30 text-sky-700 font-mono text-[10px] font-bold">
                    v1.0-SIH
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium tracking-tight line-clamp-1">
                  AI-Powered Thunderstorm & Lightning Nowcasting System
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden xl:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-sky-50 text-sky-700 border border-sky-300 shadow-xs'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]/60 border border-transparent'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Action Cluster: Live Voice, MetGPT Chat, Firebase Auth, Theme Toggle, Run Nowcast */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Gemini Live Voice Button */}
              <button
                onClick={() => setIsVoiceOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-gradient-to-r from-rose-500 via-amber-500 to-sky-500 hover:opacity-95 text-white shadow-xs cursor-pointer active:scale-95"
                title="Open Gemini 3.8 Live Voice Conversation"
              >
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">Live Voice</span>
              </button>

              {/* Gemini Chatbot Trigger Button */}
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  isChatOpen
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                    : isLight
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                    : 'bg-indigo-950/60 text-indigo-300 border-indigo-800 hover:bg-indigo-900'
                }`}
                title="Toggle Gemini Multi-Turn Chatbot"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">MetGPT</span>
              </button>

              {/* Firebase Authentication & Firestore Panel */}
              <FirebaseAuthPanel
                currentLocation={selectedLocation}
                onSelectLocation={(loc) => simulationService.selectLocation(loc)}
                currentScenarioTitle={selectedScenario}
                currentSeverity={nowcast.thunderstormRiskLevel}
              />

              {/* Theme Toggle Button (Light/Dark) */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-600'
                    : 'bg-[#1E293B] hover:bg-slate-700 border-slate-700 text-sky-400'
                }`}
                title={isLight ? 'Switch to Dark theme' : 'Switch to Light theme'}
                aria-label="Toggle theme"
              >
                {isLight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Run Nowcast Button */}
              <button
                onClick={() => simulationService.runNowcast()}
                disabled={pipelineStepIndex !== null}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  pipelineStepIndex !== null
                    ? 'bg-sky-600/50 text-slate-200 cursor-not-allowed border border-sky-400'
                    : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20 active:scale-95'
                }`}
                title="Trigger multi-sensor ingestion and AI nowcasting inference"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    pipelineStepIndex !== null ? 'animate-spin' : ''
                  }`}
                />
                <span className="hidden md:inline">
                  {pipelineStepIndex !== null ? 'Fusing Models...' : 'Run Nowcast'}
                </span>
              </button>

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            className={`xl:hidden px-4 pt-2 pb-4 space-y-1 border-b ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0F172A] border-[#1E293B]'
            }`}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavClick(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 border border-sky-300'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-[#1E293B]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Persistent Global Simulation & Scenario Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 w-full">
        <ScenarioSelector
          demoModeEnabled={demoModeEnabled}
          onToggleDemoMode={() => simulationService.toggleDemoMode()}
          selectedScenario={selectedScenario}
          onSelectScenario={(id) => simulationService.selectScenario(id)}
          selectedHorizon={selectedHorizon}
          onSelectHorizon={(h) => simulationService.selectHorizon(h)}
          selectedLocation={selectedLocation}
          onSelectLocation={(loc) => simulationService.selectLocation(loc)}
          selectedSector={selectedSector}
          onSelectSector={(s) => simulationService.selectSector(s)}
          isPlayingForecast={isPlayingForecast}
          onPlayForecast={() => simulationService.playForecast()}
          onPauseForecast={() => simulationService.pauseForecast()}
          onResetForecast={() => simulationService.resetForecast()}
          onRunNowcast={() => simulationService.runNowcast()}
          pipelineStepIndex={pipelineStepIndex}
        />
      </section>

      {/* Main Page Workspace */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
        {activeTab === 'overview' && (
          <DashboardPage
            nowcast={nowcast}
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => simulationService.selectLocation(loc)}
            selectedSector={selectedSector}
            onSelectSector={(sector) => simulationService.selectSector(sector)}
            activeTrajectoryStep={activeTrajectoryStep}
            onSelectTrajectoryStep={(idx) => simulationService.setTrajectoryStep(idx)}
            isPlayingForecast={isPlayingForecast}
            onPlayForecast={() => simulationService.playForecast()}
            onPauseForecast={() => simulationService.pauseForecast()}
            onResetForecast={() => simulationService.resetForecast()}
            onNavigateTab={(tab) => handleNavClick(tab)}
          />
        )}

        {activeTab === 'nowcast' && (
          <AIEnginePage
            nowcast={nowcast}
            onRunNowcast={() => simulationService.runNowcast()}
          />
        )}

        {activeTab === 'risk-map' && (
          <div className="space-y-6">
            <RiskMapPage
              nowcast={nowcast}
              selectedLocation={selectedLocation}
              onSelectLocation={(loc) => simulationService.selectLocation(loc)}
              selectedScenario={selectedScenario}
              selectedHorizon={selectedHorizon}
              onSelectHorizon={(h) => simulationService.selectHorizon(h)}
            />
            {/* Google Maps Grounded Infrastructure Intelligence */}
            <MapsGroundingView currentLocation={selectedLocation} />
          </div>
        )}

        {activeTab === 'storm-tracking' && (
          <StormTrackingPage
            nowcast={nowcast}
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => simulationService.selectLocation(loc)}
            activeTrajectoryStep={activeTrajectoryStep}
            onSelectTrajectoryStep={(idx) => simulationService.setTrajectoryStep(idx)}
            isPlayingForecast={isPlayingForecast}
            onPlayForecast={() => simulationService.playForecast()}
            onPauseForecast={() => simulationService.pauseForecast()}
            onResetForecast={() => simulationService.resetForecast()}
          />
        )}

        {activeTab === 'lightning' && (
          <LightningPage
            nowcast={nowcast}
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => simulationService.selectLocation(loc)}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsPage
            nowcast={nowcast}
            selectedSector={selectedSector}
            onSelectSector={(s) => simulationService.selectSector(s)}
          />
        )}

        {activeTab === 'maps-grounding' && (
          <div className="space-y-6">
            <div
              className={`p-5 rounded-xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#111C35] border-[#1E293B]'
              }`}
            >
              <h2 className="text-xl font-bold tracking-tight mb-1 flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                Google Maps Grounded Meteorological Operations
              </h2>
              <p className="text-xs text-slate-500">
                Live spatial grounding using Google Maps tool and Gemini 3.5 Flash for disaster shelters, hospitals, and hazard zones.
              </p>
            </div>
            <MapsGroundingView currentLocation={selectedLocation} />
          </div>
        )}

        {activeTab === 'data-sources' && (
          <DataSourcesPage nowcast={nowcast} />
        )}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Floating Gemini Chatbot Toggle Button in bottom-right */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-sky-600 via-indigo-600 to-indigo-700 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all cursor-pointer"
          title="Ask VAJRA MetGPT AI"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Ask MetGPT AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* Modals for Gemini Chat and Live Voice */}
      <GeminiChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentLocation={selectedLocation}
        stormIntensity={nowcast.intensity}
      />

      <LiveVoiceAssistant
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        currentLocation={selectedLocation}
        stormIntensity={nowcast.intensity}
      />

      {/* Global Operational Footer */}
      <footer
        className={`py-6 px-4 text-xs border-t transition-colors ${
          isLight
            ? 'bg-slate-100 border-slate-200 text-slate-600'
            : 'bg-[#080D1A] border-[#1E293B] text-slate-400'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-sky-600/10 text-sky-600 border border-sky-500/20 flex items-center justify-center font-bold text-xs">
              V
            </div>
            <div>
              <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                VAJRA-X
              </span>{' '}
              — AI-Powered Thunderstorm & Lightning Nowcasting System
              <span className="block text-[11px] text-slate-500">
                Smart India Hackathon 2026 • Problem ID: SIH26072 • Team INNOVEXA_X • Light Theme Active
              </span>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 text-center md:text-right text-[11px] px-3 py-1.5 rounded-lg border ${
              isLight
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-amber-500/5 text-amber-400 border-amber-500/20'
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              <strong>SIMULATED DEMO DATA:</strong> Prototype demonstration using synthesized historical-style meteorological data.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
