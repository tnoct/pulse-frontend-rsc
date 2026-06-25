export type ProjectStatus = "active" | "completed" | "on-hold" | "cancelled";

export interface ProjectMetric {
    _id: string;
    name: string;
    status: ProjectStatus;
    completionRate: number;
    activeUsers: number;
    timestamp: string;
}

export interface MetricsResponse {
    data: ProjectMetric[];
}
