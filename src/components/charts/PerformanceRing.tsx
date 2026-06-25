import { useEffect, useRef } from "react";
import { gsap } from "gsap";

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
const CIRCUMFERENCE = 2 * Math.PI * R;

export function PerformanceRing({ segments }: Props) {
    const ringsRef = useRef<(SVGCircleElement | null)[]>([]);

    useEffect(() => {
        if (segments.length === 0) return;

        const tweens = ringsRef.current.map((el, i) => {
            if (!el) return null;
            const pct = segments[i]?.value ?? 0;
            const offset = CIRCUMFERENCE * (1 - pct / 100);
            gsap.set(el, { strokeDashoffset: CIRCUMFERENCE });
            return gsap.to(el, {
                strokeDashoffset: offset,
                duration: 1.6,
                delay: 0.3 + i * 0.2,
                ease: "power2.out",
            });
        });

        return () => {
            tweens.forEach((t) => t?.kill());
        };
    }, [segments]);

    const avgCompletion = segments.length
        ? Math.round(
              segments.reduce((s, seg) => s + seg.value, 0) / segments.length,
          )
        : 0;

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative" style={{ width: SIZE, height: SIZE }}>
                <svg
                    width={SIZE}
                    height={SIZE}
                    viewBox={`0 0 ${SIZE} ${SIZE}`}
                    style={{ transform: "rotate(-90deg)" }}
                >
                    {segments.map((seg, i) => {
                        const innerR = R - i * (STROKE + 4);
                        const circ = 2 * Math.PI * innerR;
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
                    <span className="text-2xl font-bold text-gray-900">
                        {avgCompletion}%
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
