import { motion } from "framer-motion";
import { fadeSlideUp } from "../../lib/variants";
import type { ViewMode } from "../ui/ViewToggle";
import { ViewToggle } from "../ui/ViewToggle";

interface Props {
    viewMode: ViewMode;
    onViewChange: (mode: ViewMode) => void;
}

export function TopNav({ viewMode, onViewChange }: Props) {
    return (
        <motion.header
            variants={fadeSlideUp}
            custom={0.5}
            initial="hidden"
            animate="visible"
            className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-sm"
        >
            <div className="flex flex-col">
                <h1 className="text-base font-semibold text-gray-900">
                    Project Metrics
                </h1>
                <p className="text-xs text-gray-400">
                    Real-time analytics overview
                </p>
            </div>

            <div className="flex items-center gap-4">
                <ViewToggle mode={viewMode} onChange={onViewChange} />

                {/* Notification bell */}
                <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                    >
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                </button>

                {/* Search */}
                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </button>
            </div>
        </motion.header>
    );
}
