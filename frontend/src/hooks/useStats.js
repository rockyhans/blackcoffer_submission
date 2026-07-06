import { useState, useEffect } from "react";
import api from "../api/axios";

export function useStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/data/stats");
        if (!ignore) setStats(res?.data?.stats);
      } catch (err) {
        if (!ignore) setError(err.message || "Failed to load stats");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return { stats, loading, error };
}