import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "../../lib/motion";

interface RingSegment {
    label: string;
    value: number;
    color: string;
}

interface Props {
    segments: RingSegment[];
}

const SIZE = 160;
const STROKE = 14;
const R = (SIZE - STROKE) / 2;

const radiusFor = (i: number) => R - i * (STROKE + 4);
const circumferenceFor = (i: number) => 2 * Math.PI * radiusFor(i);

export function PerformanceRing({ segments }: Props) {
    const ringsRef = useRef<(SVGCircleElement | null)[]>([]);
    const centerRef = useRef<HTMLSpanElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    const avgCompletion = segments.length
        ? Math.round(
              segments.reduce((s, seg) => s + seg.value, 0) / segments.length,
          )
        : 0;

    useEffect(() => {
        if (segments.length === 0) return;
        const els = ringsRef.current;
        const center = centerRef.current;

        // Prime every arc to fully hidden before measuring/animating.
        els.forEach((el, i) => {
            if (el) gsap.set(el, { strokeDashoffset: circumferenceFor(i) });
        });

        if (prefersReducedMotion()) {
            els.forEach((el, i) => {
                if (!el) return;
                const pct = segments[i]?.value ?? 0;
                gsap.set(el, {
                    strokeDashoffset: circumferenceFor(i) * (1 - pct / 100),
                });
            });
            if (center) center.textContent = `${avgCompletion}%`;
            return;
        }

        const proxy = { val: 0 };
        const ctx = gsap.context(() => {
            // One timeline sequences the ring draws and the centre count so the
            // whole widget reads as a single choreographed reveal.
            const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

            if (wrapRef.current) {
                tl.from(wrapRef.current, {
                    scale: 0.85,
                    opacity: 0,
                    duration: 0.4,
                    ease: "back.out(1.7)",
                });
            }

            els.forEach((el, i) => {
                if (!el) return;
                const pct = segments[i]?.value ?? 0;
                const offset = circumferenceFor(i) * (1 - pct / 100);
                // Overlap each arc slightly for a cascading bloom.
                tl.to(el, { strokeDashoffset: offset, duration: 1.4 }, 0.2 + i * 0.15);
            });

            if (center) {
                tl.to(
                    proxy,
                    {
                        val: avgCompletion,
                        duration: 1.4,
                        snap: { val: 1 },
                        onUpdate() {
                            center.textContent = `${proxy.val}%`;
                        },
                    },
                    0.2,
                );
            }
        });

        return () => ctx.revert();
    }, [segments, avgCompletion]);

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div
                ref={wrapRef}
                className="relative"
                style={{ width: SIZE, height: SIZE }}
            >
                <svg
                    width={SIZE}
                    height={SIZE}
                    viewBox={`0 0 ${SIZE} ${SIZE}`}
                    style={{ transform: "rotate(-90deg)" }}
                >
                    {segments.map((seg, i) => {
                        const innerR = radiusFor(i);
                        const circ = circumferenceFor(i);
                        return (
                            <g key={seg.label}>
                                {/* Track */}
                                <circle
                                    cx={SIZE / 2}
                                    cy={SIZE / 2}
                                    r={innerR}
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth={STROKE}
                                />
                                {/* Animated arc */}
                                <circle
                                    ref={(el) => {
                                        ringsRef.current[i] = el;
                                    }}
                                    cx={SIZE / 2}
                                    cy={SIZE / 2}
                                    r={innerR}
                                    fill="none"
                                    stroke={seg.color}
                                    strokeWidth={STROKE}
                                    strokeDasharray={circ}
                                    strokeDashoffset={circ}
                                    strokeLinecap="round"
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                        ref={centerRef}
                        className="text-2xl font-bold text-gray-900"
                    >
                        0%
                    </span>
                    <span className="text-xs text-gray-400">avg rate</span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex w-full flex-col gap-1.5">
                {segments.map((seg) => (
                    <div
                        key={seg.label}
                        className="flex items-center justify-between text-xs"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{ background: seg.color }}
                            />
                            <span className="max-w-25 truncate text-gray-500">
                                {seg.label}
                            </span>
                        </div>
                        <span className="font-medium tabular-nums text-gray-700">
                            {seg.value}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
