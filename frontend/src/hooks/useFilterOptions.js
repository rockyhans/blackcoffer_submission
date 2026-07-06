import { useState, useEffect } from "react";
import api from "../api/axios";

export function useFilterOptions() {
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/data/filters");
        if (!ignore) setOptions(res.data.filters || res.data);
      } catch (err) {
        if (!ignore) setError(err.message || "Failed to load filter options");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return { options, loading, error };
}