/**
 * @file Core Express application configuration factory module for the CACA API.
 * Orchestrates the pipeline order for global security headers, CORS resource sharing bounds,
 * JSON payloads ingestion, rate limiting guards, health check reporting, router mounting, 
 * proxy configurations, and final structural error capture layers.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

/**
 * The core Express application framework server instance container.
 * Manages configuration routing registers, payload filters, and middleware sequence stacks.
 * @type {Object}
 */
const app = express();

// Sets secure HTTP response headers immediately to insulate the web platform against structural sniff or cross-site scripting vulnerabilities.
app.use(helmet());

// Evaluates inbound communication requests to authorize credentials parsing and filter operations to explicit frontend origins.
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Globally registers the incoming content-type body parser pipeline to interpret incoming streaming sequences as native JavaScript objects.
app.use(express.json());

/**
 * Brute-force restriction guard configuration monitoring connection instances arriving from a common source IP.
 * Restricts unauthenticated route validation execution loops within a designated sequential interval.
 * @type {Object}
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Demasiadas tentativas. Tente novamente em 15 minutos.' }
});

// Binds the localized request execution limiters defensively onto the authentication routing junctions.
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

/**
 * Core application heartbeat health check interface executing a diagnostic reporting fallback.
 * Confirms live infrastructure listening conditions without introducing external execution delays or querying storage engines.
 *
 * @name get/api/health
 * @function
 * @memberof app
 * @param {Object} req - Express inbound communication request stream tracking device metadata.
 * @param {Object} res - Express payload execution response returning the current system health verification status.
 */
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CACA API operacional' });
});

// Mounts domain-isolated sub-routing networks underneath specific system runtime path prefix hierarchies.
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

/**
 * Proxy routing endpoint interface orchestrating server-side fetch requests to the external third-party OpenWeather API maps.
 * Insulates secret authentication keys away from client-side network exposure panels, handling data structural filtering patterns.
 *
 * @name get/api/weather/:city
 * @async
 * @function
 * @memberof app
 * @param {Object} req - Express request stream containing targeted parameter inputs extracted from the relative endpoint mapping path.
 * @param {Object} res - Express response target dispatching structured metric temperatures and descriptions to client interfaces.
 * @returns {Promise<void>} Resolves once weather payloads clear processing buffers or exception blocks execute code status updates.
 */
app.get('/api/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=pt`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    res.json({
      temperature: data.main.temp,
      description: data.weather[0].description,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Dados meteorológicos indisponíveis' });
  }
});

// Appends final defensive catch layers downstream to resolve unmapped endpoints or handle runtime application process failures.
app.use(notFound);
app.use(errorHandler);

/**
 * Compiled and orchestrated Express middleware processing pipeline instance package configurations exported to bootstrapping utilities.
 * @module app
 * @type {Object}
 */
export default app;