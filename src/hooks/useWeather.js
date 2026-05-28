/**
 * @file Frontend data hook for fetching and caching dynamic localized meteorological data.
 * Interacts with the custom backend API proxy endpoint to retrieve current atmospheric conditions,
 * orchestrating network lifecycle loops, side-effect dependencies, and asynchronous cancellations.
 */

import { useEffect, useState } from 'react';

/**
 * Access token signature allocated for direct OpenWeather API mapping queries.
 * Extracted securely straight out of Vite meta client-side environment configurations.
 * @type {string|undefined}
 */
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

/**
 * Custom React side-effect hook that manages telemetry query sequences targeting the backend weather proxy.
 * Implements strict conditional execution guards and native thread-abort parameters to safely isolate 
 * asynchronous updates away from unmounted DOM layout nodes during viewport state shifts.
 *
 * @param {string} city - The name string of the geographical location targeted for weather lookup checks.
 * @param {boolean} enabled - Activation toggle flag used to completely suppress or permit network fetch loops.
 * @returns {Object} The complete operational lifecycle state structure of the weather lookup pipeline.
 * @returns {Object|null} return.weather - Standard data payload object containing processed temperature and description details.
 * @returns {boolean} return.loading - Evaluation flag signaling if a proxy server HTTP request stream is actively running.
 * @returns {Error|null} return.error - Encapsulated execution exception object context thrown during runtime fetch handshakes.
 */
export function useWeather(city, enabled) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Evaluation guard clause halting resource allocation if the hook instance is disabled or lacks a valid location parameter.
    if (!enabled || !city) return;

    const controller = new AbortController();

    /**
     * Executes the asynchronous processing pipeline sequence required to extract and serialize localized weather states.
     * Evaluates fallback connection addresses dynamically and transforms raw JSON structures into state storage nodes.
     *
     * @async
     * @function loadWeather
     * @returns {Promise<void>} Resolves once state hooks capture valid data representations or catch structural errors.
     */
    async function loadWeather() {
      setLoading(true);
      setError(null);

      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(
          `${API_BASE_URL}/api/weather/${encodeURIComponent(city)}`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error('Local indisponível');

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadWeather();
    
    // Cleanup hook deploying standard browser abort signals to securely dismantle pending data streams when dependencies switch.
    return () => controller.abort();
  }, [city, enabled]);

  return { weather, loading, error };
}