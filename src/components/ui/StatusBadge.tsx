import type { ProjectStatus } from "../../types/metrics";

const config: Record<
    ProjectStatus,
    { label: string; className: string; dot: string }
> = {
    active: {
        label: "Active",
        className:
            "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
        dot: "bg-emerald-400",
    },
    completed: {
        label: "Completed",
        className: "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20",
        dot: "bg-sky-400",
    },
    "on-hold": {
        label: "On Hold",
        className: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
        dot: "bg-amber-400",
    },
    cancelled: {
        label: "Cancelled",
        className: "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20",
        dot: "bg-rose-400",
    },
};

interface Props {
    status: ProjectStatus;
}

export function StatusBadge({ status }: Props) {
    const { label, className, dot } = config[status];
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            {label}
        </span>
    );
}
