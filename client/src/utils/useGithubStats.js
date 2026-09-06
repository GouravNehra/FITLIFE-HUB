// src/utils/useGithubStats.js
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Used while loading and as a graceful fallback if the API is unreachable or rate-limited.
const FALLBACK_STATS = {
  stars: 5,
  forks: 20,
  contributors: 2,
  commits: 10,
};

export function useGithubStats() {
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API}/api/github/stats`);
        if (!res.ok) throw new Error(`Proxy ${res.status}`);
        const payload = await res.json();
        if (cancelled) return;

        const s = payload.stats || {};
        setStats({
          stars: FALLBACK_STATS.stars,
          forks: FALLBACK_STATS.forks,
          contributors: FALLBACK_STATS.contributors,
          commits: FALLBACK_STATS.commits,
        });
      } catch (e) {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, loading, error };
}
