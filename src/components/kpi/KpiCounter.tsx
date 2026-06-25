import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { fadeSlideUp } from "../../lib/variants";

interface Props {
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
    index: number;
    icon: ReactNode;
    accent: string;
}

export function KpiCounter({
    label,
    value,
    prefix = "",
    suffix = "",
    index,
    icon,
    accent,
}: Props) {
    const numRef = useRef<HTMLSpanElement>(null);
    const proxy = useRef({ val: 0 });

    useEffect(() => {
        if (!numRef.current) return;
        const tween = gsap.to(proxy.current, {
            val: value,
            duration: 1.8,
            delay: index * 0.15,
            ease: "power3.out",
            onUpdate() {
                if (numRef.current) {
                    numRef.current.textContent = Math.round(
                        proxy.current.val,
                    ).toLocaleString();
                }
            },
        });
        return () => {
            tween.kill();
        };
    }, [value, index]);

    return (
        <motion.div
            variants={fadeSlideUp}
            custom={index}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
            {/* Subtle gradient accent on hover */}
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(circle at 0% 0%, ${accent}0d 0%, transparent 60%)`,
                }}
            />

            <div className="flex items-start justify-between">
                <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                        {label}
                    </p>
                    <p className="text-2xl font-semibold tabular-nums text-gray-900">
                        {prefix}
                        <span ref={numRef}>0</span>
                        {suffix}
                    </p>
                </div>
                <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ background: `${accent}18`, color: accent }}
                >
                    {icon}
                </div>
            </div>
        </motion.div>
    );
}
