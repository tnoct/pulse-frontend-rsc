import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMetrics } from "../hooks/useMetrics";
import { KpiCounter } from "../components/kpi/KpiCounter";
import { PerformanceRing } from "../components/charts/PerformanceRing";
import { ProjectCard } from "../components/cards/ProjectCard";
import { ProjectModal } from "../components/cards/ProjectModal";
import { staggerContainer, fadeSlideUp } from "../lib/variants";
import type { ViewMode } from "../components/ui/ViewToggle";
import type { ProjectMetric } from "../types/metrics";

interface Props {
    viewMode: ViewMode;
}

const kpiIcons = {
    users: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
        >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    projects: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
        >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    ),
    completion: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    active: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
        >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
    ),
};

export function Dashboard({ viewMode }: Props) {
    const { data, loading, error } = useMetrics();
    const [selected, setSelected] = useState<ProjectMetric | null>(null);

    const totalUsers = data.reduce((s, p) => s + p.activeUsers, 0);
    const avgCompletion = data.length
        ? Math.round(
              data.reduce((s, p) => s + p.completionRate, 0) / data.length,
          )
        : 0;
    const activeCount = data.filter((p) => p.status === "active").length;

    const ringSegments = data.slice(0, 4).map((p, i) => ({
        label: p.name.split(" ")[0],
        value: p.completionRate,
        color: ["#6366f1", "#8b5cf6", "#10b981", "#0ea5e9"][i],
    }));

    if (error) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
                    Failed to load metrics: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
            {/* KPI Row */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-4 lg:grid-cols-4"
            >
                <KpiCounter
                    label="Total Active Users"
                    value={totalUsers}
                    index={0}
                    accent="#6366f1"
                    icon={kpiIcons.users}
                />
                <KpiCounter
                    label="Total Projects"
                    value={data.length}
                    index={1}
                    accent="#8b5cf6"
                    icon={kpiIcons.projects}
                />
                <KpiCounter
                    label="Avg Completion"
                    value={avgCompletion}
                    suffix="%"
                    index={2}
                    accent="#10b981"
                    icon={kpiIcons.completion}
                />
                <KpiCounter
                    label="Active Projects"
                    value={activeCount}
                    index={3}
                    accent="#0ea5e9"
                    icon={kpiIcons.active}
                />
            </motion.div>

            {/* Main grid: project cards + performance ring */}
            <div className="flex flex-col gap-6 lg:flex-row">
                {/* Cards section */}
                <div className="min-w-0 flex-1">
                    <motion.div
                        variants={fadeSlideUp}
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        className="mb-4 flex items-center justify-between"
                    >
                        <h2 className="text-sm font-semibold text-gray-700">
                            Projects
                        </h2>
                        <span className="text-xs text-gray-400">
                            {data.length} total
                        </span>
                    </motion.div>

                    {loading ? (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-36 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
                                />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            layout
                            className={
                                viewMode === "grid"
                                    ? "grid grid-cols-1 gap-3 sm:grid-cols-2"
                                    : "flex flex-col gap-3"
                            }
                        >
                            <AnimatePresence>
                                {data.map((project) => (
                                    <ProjectCard
                                        key={project._id}
                                        project={project}
                                        isList={viewMode === "list"}
                                        onClick={() => setSelected(project)}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>

                {/* Performance Ring sidebar */}
                <motion.div
                    variants={fadeSlideUp}
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    className="w-full shrink-0 lg:w-56"
                >
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-gray-700">
                            Completion Rings
                        </h3>
                        {loading ? (
                            <div className="flex h-40 items-center justify-center">
                                <div className="h-24 w-24 animate-pulse rounded-full bg-slate-100" />
                            </div>
                        ) : (
                            <PerformanceRing segments={ringSegments} />
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Modal */}
            <ProjectModal
                project={selected}
                onClose={() => setSelected(null)}
            />
        </div>
    );
}
