import { useState, useEffect } from "react";
import api from "../api/axios";
import { buildParams } from "../utils/buildParams";

export function useTableData(filters) {
  const [result, setResult] = useState({ data: { data: [] }, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = buildParams(filters);
        const res = await api.get("/data", { params });
        // console.log("useTableData - API Response:", res.data);
        if (!ignore) {
          setResult({
            data: res.data.data || [],
            total: res.data.total ?? res.data.count ?? 0,
            pages: res.data.totalPages  ?? 1,
          });
        }
      } catch (err) {
        if (!ignore) setError(err.message || "Failed to load table data");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [JSON.stringify(filters)]);

  return { ...result, loading, error };
}