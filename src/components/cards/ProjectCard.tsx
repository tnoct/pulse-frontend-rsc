import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import type { ProjectMetric } from "../../types/metrics";
import { StatusBadge } from "../ui/StatusBadge";
import { cardItem } from "../../lib/variants";

interface Props {
    project: ProjectMetric;
    isList: boolean;
    onClick: () => void;
}

export function ProjectCard({ project, isList, onClick }: Props) {
    const cardRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const el = cardRef.current;
        const glow = glowRef.current;
        if (!el || !glow) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Magnet tilt
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -5;
        const rotY = ((x - cx) / cx) * 5;
        gsap.to(el, {
            rotateX: rotX,
            rotateY: rotY,
            duration: 0.25,
            ease: "power2.out",
            transformPerspective: 800,
        });

        // Follow glow
        gsap.to(glow, {
            x: x - 60,
            y: y - 60,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
        });
    }

    function handleMouseLeave() {
        const el = cardRef.current;
        const glow = glowRef.current;
        if (el)
            gsap.to(el, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: "power2.out",
            });
        if (glow) gsap.to(glow, { opacity: 0, duration: 0.3 });
    }

    return (
        <motion.div
            variants={cardItem}
            layout
            layoutId={`card-${project._id}`}
            onClick={onClick}
            className={`group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md ${
                isList
                    ? "flex items-center gap-5 px-5 py-4"
                    : "flex flex-col p-5"
            }`}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: "preserve-3d" }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Cursor glow — lighter for light theme */}
            <div
                ref={glowRef}
                className="pointer-events-none absolute h-30 w-30 rounded-full blur-2xl"
                style={{
                    background:
                        "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
                    opacity: 0,
                    transform: "translate(0,0)",
                }}
            />

            {/* Card header */}
            <div
                className={`flex items-start justify-between gap-3 ${isList ? "flex-1" : "mb-4"}`}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                        style={{
                            background: `hsl(${(project.name.charCodeAt(0) * 17) % 360}, 55%, 52%)`,
                        }}
                    >
                        {project.name[0]}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                            {project.name}
                        </p>
                        <p className="text-xs text-gray-400">
                            {new Date(project.timestamp).toLocaleDateString(
                                "en-US",
                                { month: "short", year: "numeric" },
                            )}
                        </p>
                    </div>
                </div>
                <StatusBadge status={project.status} />
            </div>

            {/* Stats */}
            <div
                className={`flex gap-6 ${isList ? "shrink-0" : "mt-auto pt-3 border-t border-slate-100"}`}
            >
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">
                        Completion
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                        {project.completionRate}%
                    </p>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">
                        Active Users
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                        {project.activeUsers}
                    </p>
                </div>
            </div>

            {/* Progress bar (grid only) */}
            {!isList && (
                <div className="mt-3">
                    <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                            className="h-full rounded-full bg-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${project.completionRate}%` }}
                            transition={{
                                duration: 1,
                                delay: 0.3,
                                ease: "easeOut",
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Arrow indicator */}
            <div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-4 w-4 text-gray-400"
                >
                    <path
                        d="M3 8h10M9 4l4 4-4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </motion.div>
    );
}
