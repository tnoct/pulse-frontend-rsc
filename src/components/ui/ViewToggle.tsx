import { motion } from "framer-motion";

export type ViewMode = "grid" | "list";

interface Props {
    mode: ViewMode;
    onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ mode, onChange }: Props) {
    return (
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 ring-1 ring-gray-200">
            {(["grid", "list"] as ViewMode[]).map((m) => (
                <button
                    key={m}
                    onClick={() => onChange(m)}
                    className="relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                    style={{ color: mode === m ? "#111827" : "#9ca3af" }}
                >
                    {mode === m && (
                        <motion.span
                            layoutId="view-pill"
                            className="absolute inset-0 rounded-md bg-white shadow-sm"
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                            }}
                        />
                    )}
                    <span className="relative z-10 capitalize">{m}</span>
                </button>
            ))}
        </div>
    );
}
