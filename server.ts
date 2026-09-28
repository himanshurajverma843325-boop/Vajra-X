import express from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { DEMO_SCENARIOS, PRESET_LOCATIONS, DATA_SOURCES_METADATA } from './src/data/demoDatasets';
import { buildAtmosphericInput, predictNowcast } from './src/services/nowcastEngine';
import { ScenarioId, TimeHorizon } from './src/types/nowcast';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  // Dev server must run on port 3000. Never bind to 8080 (Nginx reverse-proxy port).
  const portArgIndex = process.argv.indexOf('--port');
  const portFromArg = portArgIndex !== -1 ? parseInt(process.argv[portArgIndex + 1], 10) : NaN;
  const rawEnvPort = process.env.APP_PORT || (process.env.PORT && process.env.PORT !== '8080' ? process.env.PORT : undefined);
  const PORT = !isNaN(portFromArg) ? portFromArg : (rawEnvPort ? parseInt(rawEnvPort, 10) : 3000);
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Initialize Google Gen AI
  const ai = new GoogleGenAI();

  // Helper to extract scenario and horizon params
  function resolveParams(req: express.Request) {
    const scenarioQuery = (req.query.scenario as ScenarioId) || 'severe-thunderstorm';
    const horizonQuery = (req.query.horizon as TimeHorizon) || 'NOW';
    const locationId = (req.query.locationId as string) || 'ghaziabad-up';

    const location =
      PRESET_LOCATIONS.find((loc) => loc.id === locationId) || PRESET_LOCATIONS[0];
    const scenario = DEMO_SCENARIOS[scenarioQuery] || DEMO_SCENARIOS['severe-thunderstorm'];

    const inputData = buildAtmosphericInput(location, scenario.id, horizonQuery);
    const nowcast = predictNowcast(inputData);

    return { location, scenario, horizonQuery, nowcast };
  }

  // 1. /api/nowcast
  app.get('/api/nowcast', (req, res) => {
    const { nowcast } = resolveParams(req);
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      disclaimer: 'SIMULATED DEMO DATA for Smart India Hackathon 2026 (SIH26072).',
      data: nowcast,
    });
  });

  // 2. /api/risk
  app.get('/api/risk', (req, res) => {
    const { nowcast } = resolveParams(req);
    res.json({
      success: true,
      location: nowcast.storm_location,
      thunderstorm: {
        riskLevel: nowcast.thunderstormRiskLevel,
        probabilityPercent: nowcast.thunderstorm_probability,
        intensity: nowcast.intensity,
      },
      lightning: {
        riskLevel: nowcast.lightningRiskLevel,
        probabilityPercent: nowcast.lightning_probability,
        strikeDensity: nowcast.lightningStrikeDensity,
        trend: nowcast.lightningTrend,
      },
      forecastWindow: nowcast.forecast_window,
      confidence: nowcast.confidence,
    });
  });

  // 3. /api/lightning
  app.get('/api/lightning', (req, res) => {
    const { nowcast } = resolveParams(req);
    res.json({
      success: true,
      location: nowcast.storm_location,
      riskLevel: nowcast.lightningRiskLevel,
      probabilityPercent: nowcast.lightning_probability,
      strikeDensity: nowcast.lightningStrikeDensity,
      trend: nowcast.lightningTrend,
      recentStrikes: nowcast.lightningStrikes,
      timeSeries: nowcast.lightningTimeSeries,
      riskDifferentiationNote:
        'Atmospheric notice: Lightning Risk indicates charge accumulation & dielectric breakdown potential, which can peak prior to or independently of heavy convective storm precipitation.',
    });
  });

  // 4. /api/storm
  app.get('/api/storm', (req, res) => {
    const { nowcast } = resolveParams(req);
    res.json({
      success: true,
      stormCells: nowcast.activeStormCells,
      trajectoryWaypoints: nowcast.primaryTrajectory,
      movementDirection: nowcast.storm_direction,
      estimatedSpeed: nowcast.storm_speed,
      intensity: nowcast.intensity,
    });
  });

  // 5. /api/alerts
  app.get('/api/alerts', (req, res) => {
    const { nowcast } = resolveParams(req);
    res.json({
      success: true,
      location: nowcast.storm_location,
      alerts: nowcast.alerts,
      explanation: nowcast.explanation,
    });
  });

  // 6. /api/data-sources
  app.get('/api/data-sources', (req, res) => {
    res.json({
      success: true,
      dataSources: DATA_SOURCES_METADATA,
    });
  });

  // 7. Multi-Turn Gemini Chatbot Endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const {
        messages,
        model = 'gemini-3.5-flash',
        systemInstruction = 'You are the VAJRA-X Chief Meteorological AI Specialist.',
      } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      // Allowed models as specified: gemini-3.5-flash, gemini-3.1-flash-lite, gemini-3.1-pro-preview
      const validModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.1-pro-preview'];
      const chosenModel = validModels.includes(model) ? model : 'gemini-3.5-flash';

      // Transform history into contents format
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: chosenModel,
        contents,
        config: {
          systemInstruction,
        },
      });

      res.json({
        success: true,
        reply: response.text || 'No response generated.',
        model: chosenModel,
      });
    } catch (err: any) {
      console.error('Error in /api/ai/chat:', err);
      res.status(500).json({
        error: err.message || 'Failed to generate chat response',
      });
    }
  });

  // 8. Google Maps Grounding Endpoint (gemini-3.5-flash with googleMaps)
  app.post('/api/ai/maps-grounding', async (req, res) => {
    try {
      const { prompt, latitude = 28.6692, longitude = 77.4538, locationName = 'Ghaziabad, UP' } = req.body;

      const userPrompt =
        prompt ||
        `Identify emergency disaster shelters, major hospitals with trauma centers, emergency services, and high-risk flood/lightning vulnerable terrain or infrastructure around ${locationName} (approx coordinates ${latitude}, ${longitude}). Provide structured safety points and direct Google Maps locations.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userPrompt,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: Number(latitude),
                longitude: Number(longitude),
              },
            },
          },
        },
      });

      const groundingChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      res.json({
        success: true,
        text: response.text || '',
        groundingChunks,
        location: { latitude, longitude, locationName },
      });
    } catch (err: any) {
      console.error('Error in /api/ai/maps-grounding:', err);
      res.status(500).json({
        error: err.message || 'Failed to retrieve Maps Grounding analysis',
      });
    }
  });

  // 9. Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'VAJRA-X Nowcasting System',
      hackathon: 'Smart India Hackathon 2026',
      problemStatementId: 'SIH26072',
      team: 'INNOVEXA_X',
      mode: 'DEMO_SIMULATION',
      geminiCapabilities: ['gemini-3.8-live', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'googleMaps'],
    });
  });

  // 10. WebSocket Server for Gemini Live API (gemini-3.8-live)
  const wss = new WebSocketServer({ server, path: '/live' });

  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('Client connected to /live WebSocket');
    let session: any = null;

    try {
      session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction:
            'You are the VAJRA-X Meteorological AI Voice Assistant (SIH26072). You provide spoken short-term nowcast assessments, Doppler radar reflectivity briefings, cloud-to-ground lightning hazard alerts, and emergency directives for India. Keep your spoken responses concise, authoritative, calm, and direct.',
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audio =
              message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            const textPart =
              message.serverContent?.modelTurn?.parts?.[0]?.text;

            if (audio && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ audio }));
            }
            if (textPart && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ text: textPart }));
            }
            if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
        },
      });

      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            status: 'connected',
            message: 'Connected to Gemini 3.8 Live API Voice Engine',
          })
        );
      }

      clientWs.on('message', (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.audio && session) {
            session.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          } else if (parsed.text && session) {
            session.sendRealtimeInput({
              text: parsed.text,
            });
          }
        } catch (e) {
          console.error('Error parsing client WS message:', e);
        }
      });

      clientWs.on('close', () => {
        if (session && typeof session.close === 'function') {
          session.close();
        }
      });
    } catch (liveErr: any) {
      console.error('Failed to connect to Gemini Live session:', liveErr);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            status: 'error',
            error: liveErr.message || 'Gemini Live connection failed',
          })
        );
      }
    }
  });

  // Vite middleware in dev or static files in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // SPA fallback: render index.html through Vite transformation
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api') || url.startsWith('/live')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`VAJRA-X server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start VAJRA-X server:', err);
  process.exit(1);
});
