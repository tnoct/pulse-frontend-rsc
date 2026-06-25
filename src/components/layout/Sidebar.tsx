import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeSlideUp } from "../../lib/variants";

const navItems = [
    { label: "Dashboard", icon: "grid", active: true },
    { label: "Projects", icon: "folder", active: false },
    { label: "Analytics", icon: "bar-chart", active: false },
    { label: "Team", icon: "users", active: false },
    { label: "Settings", icon: "settings", active: false },
];

const icons: Record<string, ReactNode> = {
    grid: (
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
    folder: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
        >
            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
        </svg>
    ),
    "bar-chart": (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
        >
            <rect x="3" y="12" width="4" height="9" rx="1" />
            <rect x="10" y="7" width="4" height="14" rx="1" />
            <rect x="17" y="3" width="4" height="18" rx="1" />
        </svg>
    ),
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
    settings: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
        >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
    ),
};

export function Sidebar() {
    return (
        <motion.aside
            variants={fadeSlideUp}
            custom={0}
            initial="hidden"
            animate="visible"
            className="flex h-full w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6"
        >
            {/* Logo */}
            <div className="mb-8 flex items-center gap-3 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4 text-white"
                    >
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                </div>
                <span className="text-base font-semibold tracking-tight text-gray-900">
                    Pulse
                </span>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1">
                {navItems.map((item, i) => (
                    <motion.button
                        key={item.label}
                        variants={fadeSlideUp}
                        custom={i + 1}
                        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                            item.active
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        }`}
                    >
                        <span
                            className={
                                item.active
                                    ? "text-indigo-600"
                                    : "text-gray-400 group-hover:text-gray-500"
                            }
                        >
                            {icons[item.icon]}
                        </span>
                        {item.label}
                        {item.active && (
                            <motion.span
                                layoutId="sidebar-active"
                                className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500"
                            />
                        )}
                    </motion.button>
                ))}
            </nav>

            {/* Footer */}
            <div className="mt-auto border-t border-slate-200 pt-4">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
                        TN
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-gray-700">
                            Operator
                        </p>
                        <p className="truncate text-xs text-gray-400">
                            pulse.dev
                        </p>
                    </div>
                </div>
            </div>
        </motion.aside>
    );
}
