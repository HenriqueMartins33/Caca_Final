/**
 * @file Frontend data hook for fetching and normalizing real-time news feeds.
 * Connects to Google News RSS via a third-party XML-to-JSON parser proxy, managing asynchronous 
 * network requests, loading states, error structures, and operational lifecycle cancellations.
 */

import { useEffect, useState } from 'react';

/**
 * Builds a structured API endpoint URL by combining a localized Google News RSS query 
 * parameter string with an external RSS-to-JSON serialization service gateway.
 *
 * @param {string} topic - The search keyword query string used to filter news articles.
 * @returns {string} The fully compiled and URL-encoded endpoint target address.
 */
function buildNewsUrl(topic) {
  const rssUrl = `https://news.google.com/rss/search?q=${topic}&hl=pt-PT&gl=PT&ceid=PT:pt`;
  return `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
}

/**
 * Normalizes a raw, polymorphic third-party article payload entry into a standardized frontend data object.
 *
 * @param {Object} article - The unformatted article object node returned from the external proxy service.
 * @returns {Object} A clean, predictable data layout containing title, link, and publishedAt elements.
 */
function normalizeArticle(article) {
  return {
    title: article.title,
    link: article.link,
    publishedAt: article.pubDate,
  };
}

/**
 * Custom React side-effect hook designed to fetch, slice, and normalize remote news articles dynamically.
 * Deploys native browser AbortControllers internally to suppress asynchronous race conditions, memory leaks,
 * and state updates on unmounted interface component trees during rapid parameter transitions.
 *
 * @param {string} topic - The reactive topic keyword string that triggers a fresh network fetch loop when updated.
 * @param {number} [limit=3] - The maximum bounds constraint parameter defining how many article nodes to slice.
 * @returns {Object} The current execution lifecycle state of the news fetch loop.
 * @returns {Array<Object>} return.articles - Collection array of clean, normalized news metadata parameters.
 * @returns {boolean} return.loading - Boolean indicator flag signaling if a network stream loop is actively in flight.
 * @returns {Error|null} return.error - Encapsulated runtime exception object context caught during execution, if any.
 */
export function useNews(topic, limit = 3) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    /**
     * Executes the asynchronous processing pipeline loop required to pull, validate, and serialize incoming article lists.
     * Evaluates transaction responses manually and catches system errors cleanly to isolate unexpected failures.
     *
     * @async
     * @function loadNews
     * @returns {Promise<void>} Resolves once state triggers catch raw payloads or capture structural error metadata.
     */
    async function loadNews() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(buildNewsUrl(topic), { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Erro ao carregar notícias (${response.status})`);
        }

        const data = await response.json();
        const nextArticles = (data.items || []).slice(0, limit).map(normalizeArticle);

        setArticles(nextArticles);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadNews();

    // Cleanup hook deploying standard browser abort signals to safely collapse running threads on component unmounts.
    return () => controller.abort();
  }, [topic, limit]);

  return { articles, loading, error };
}