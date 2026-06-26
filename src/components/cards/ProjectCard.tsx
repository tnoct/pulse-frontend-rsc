import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import type { ProjectMetric } from "../../types/metrics";
import { StatusBadge } from "../ui/StatusBadge";
import { cardItem } from "../../lib/variants";
import { prefersReducedMotion } from "../../lib/motion";

interface Props {
    project: ProjectMetric;
    isList: boolean;
    onClick: () => void;
}

export function ProjectCard({ project, isList, onClick }: Props) {
    const cardRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    // Rect is read once on enter, never per mousemove, to avoid forced reflow.
    const rect = useRef<DOMRect | null>(null);
    // quickTo setters reuse one tween each instead of allocating per event.
    const setters = useRef<{
        rotX: gsap.QuickToFunc;
        rotY: gsap.QuickToFunc;
        glowX: gsap.QuickToFunc;
        glowY: gsap.QuickToFunc;
    } | null>(null);

    useEffect(() => {
        const el = cardRef.current;
        const glow = glowRef.current;
        if (!el || !glow || prefersReducedMotion()) return;

        gsap.set(el, { transformPerspective: 800 });
        setters.current = {
            rotX: gsap.quickTo(el, "rotateX", { duration: 0.4, ease: "power3" }),
            rotY: gsap.quickTo(el, "rotateY", { duration: 0.4, ease: "power3" }),
            glowX: gsap.quickTo(glow, "x", { duration: 0.5, ease: "power3" }),
            glowY: gsap.quickTo(glow, "y", { duration: 0.5, ease: "power3" }),
        };

        return () => {
            gsap.killTweensOf([el, glow]);
            setters.current = null;
        };
    }, []);

    function handleMouseEnter() {
        const el = cardRef.current;
        const glow = glowRef.current;
        if (!el) return;
        rect.current = el.getBoundingClientRect();
        if (glow) gsap.to(glow, { opacity: 1, duration: 0.3 });
    }

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const s = setters.current;
        const r = rect.current;
        if (!s || !r) return;
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;

        // Magnet tilt toward the cursor.
        s.rotX(((y - r.height / 2) / (r.height / 2)) * -5);
        s.rotY(((x - r.width / 2) / (r.width / 2)) * 5);

        // Glow trails the cursor (offset to centre the 120px blob).
        s.glowX(x - 60);
        s.glowY(y - 60);
    }

    function handleMouseLeave() {
        const s = setters.current;
        const glow = glowRef.current;
        if (s) {
            s.rotX(0);
            s.rotY(0);
        }
        if (glow) gsap.to(glow, { opacity: 0, duration: 0.4 });
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
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: "preserve-3d" }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
            {/* Diagonal sheen that sweeps across on hover (pure CSS transition). */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
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
