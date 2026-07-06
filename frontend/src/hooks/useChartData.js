import { useState, useEffect } from "react";
import api from "../api/axios";
import { buildParams } from "../utils/buildParams";

export function useChartData(filters) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { country, city, sector, topic, region, pestle, source, end_year, start_year, search } = filters;

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = buildParams(
          { country, city, sector, topic, region, pestle, source, end_year, start_year, search },
          { limit: 1000, page: 1 } // pull the full filtered set for aggregation
        );
        const res = await api.get("/data", { params });
        if (!ignore) setData(res.data.data || []);
      } catch (err) {
        if (!ignore) setError(err.message || "Failed to load chart data");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [country, city, sector, topic, region, pestle, source, end_year, start_year, search]);

  return { data, loading, error };
}