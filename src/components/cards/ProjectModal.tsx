import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import type { ProjectMetric } from "../../types/metrics";
import { StatusBadge } from "../ui/StatusBadge";
import {
    overlayVariant,
    modalVariant,
    modalContent,
    modalContentItem,
} from "../../lib/variants";
import { useMagnetic } from "../../hooks/useMagnetic";
import { prefersReducedMotion } from "../../lib/motion";

interface Props {
    project: ProjectMetric | null;
    onClose: () => void;
}

const RING_SIZE = 120;
const RING_STROKE = 10;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_R;

export function ProjectModal({ project, onClose }: Props) {
    const ringRef = useRef<SVGCircleElement>(null);
    const reportBtnRef = useMagnetic<HTMLButtonElement>(0.5);

    useEffect(() => {
        const el = ringRef.current;
        if (!project || !el) return;
        const offset = RING_CIRC * (1 - project.completionRate / 100);

        if (prefersReducedMotion()) {
            gsap.set(el, { strokeDashoffset: offset });
            return;
        }

        gsap.set(el, { strokeDashoffset: RING_CIRC });
        const ctx = gsap.context(() => {
            gsap.to(el, {
                strokeDashoffset: offset,
                duration: 1.2,
                delay: 0.35,
                ease: "power2.out",
            });
        });
        return () => ctx.revert();
    }, [project]);

    return (
        <AnimatePresence>
            {project && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="overlay"
                        variants={overlayVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        key={`modal-${project._id}`}
                        layoutId={`card-${project._id}`}
                        variants={modalVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                            <div className="flex items-center gap-4">
                                <div
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white"
                                    style={{
                                        background: `hsl(${(project.name.charCodeAt(0) * 17) % 360}, 55%, 52%)`,
                                    }}
                                >
                                    {project.name[0]}
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">
                                        {project.name}
                                    </h2>
                                    <p className="text-sm text-gray-400">
                                        Project Diagnostics
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    className="h-4 w-4"
                                >
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <motion.div
                            className="p-6"
                            variants={modalContent}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className="flex items-center gap-6">
                                {/* SVG Ring */}
                                <motion.div
                                    variants={modalContentItem}
                                    className="relative shrink-0"
                                    style={{
                                        width: RING_SIZE,
                                        height: RING_SIZE,
                                    }}
                                >
                                    <svg
                                        width={RING_SIZE}
                                        height={RING_SIZE}
                                        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                                        style={{ transform: "rotate(-90deg)" }}
                                    >
                                        <circle
                                            cx={RING_SIZE / 2}
                                            cy={RING_SIZE / 2}
                                            r={RING_R}
                                            fill="none"
                                            stroke="#e2e8f0"
                                            strokeWidth={RING_STROKE}
                                        />
                                        <circle
                                            ref={ringRef}
                                            cx={RING_SIZE / 2}
                                            cy={RING_SIZE / 2}
                                            r={RING_R}
                                            fill="none"
                                            stroke="#6366f1"
                                            strokeWidth={RING_STROKE}
                                            strokeDasharray={RING_CIRC}
                                            strokeDashoffset={RING_CIRC}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-xl font-bold text-gray-900">
                                            {project.completionRate}%
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            complete
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Stats grid */}
                                <div className="flex flex-1 flex-col gap-4">
                                    <motion.div
                                        variants={modalContentItem}
                                        className="grid grid-cols-2 gap-3"
                                    >
                                        <Stat
                                            label="Status"
                                            value={
                                                <StatusBadge
                                                    status={project.status}
                                                />
                                            }
                                        />
                                        <Stat
                                            label="Active Users"
                                            value={project.activeUsers.toString()}
                                        />
                                        <Stat
                                            label="Created"
                                            value={new Date(
                                                project.timestamp,
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        />
                                        <Stat
                                            label="Completion"
                                            value={`${project.completionRate}%`}
                                        />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <motion.div
                                variants={modalContentItem}
                                className="mt-5"
                            >
                                <div className="mb-1.5 flex items-center justify-between text-xs">
                                    <span className="text-gray-400">
                                        Overall Progress
                                    </span>
                                    <span className="font-medium text-gray-700">
                                        {project.completionRate}%
                                    </span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                    <motion.div
                                        className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-500"
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${project.completionRate}%`,
                                        }}
                                        transition={{
                                            duration: 1,
                                            delay: 0.45,
                                            ease: "easeOut",
                                        }}
                                    />
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
                            <button
                                onClick={onClose}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                            >
                                Close
                            </button>
                            <button
                                ref={reportBtnRef}
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                            >
                                View Full Report
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="rounded-lg bg-slate-50 px-3 py-2.5">
            <p className="mb-0.5 text-[10px] uppercase tracking-wider text-gray-400">
                {label}
            </p>
            <div className="text-sm font-medium text-gray-700">{value}</div>
        </div>
    );
}
