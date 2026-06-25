import type { ProjectMetric } from "../types/metrics";

export async function fetchMetrics(): Promise<ProjectMetric[]> {
    const res = await fetch("/api/metrics");
    if (!res.ok) throw new Error(`Failed to fetch metrics: ${res.status}`);
    const json = await res.json();
    return json.data ?? json;
}
