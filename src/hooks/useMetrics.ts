import { useEffect, useState } from "react";
import { fetchMetrics } from "../api/metrics";
import type { ProjectMetric } from "../types/metrics";

interface UseMetricsResult {
    data: ProjectMetric[];
    loading: boolean;
    error: string | null;
}

export function useMetrics(): UseMetricsResult {
    const [data, setData] = useState<ProjectMetric[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchMetrics()
            .then((metrics) => {
                if (!cancelled) setData(metrics);
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return { data, loading, error };
}
