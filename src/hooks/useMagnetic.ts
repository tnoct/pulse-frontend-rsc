import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "../lib/motion";

/**
 * Attaches a "magnetic" pull to an element: it eases toward the cursor while
 * hovered and springs back on leave. Listeners and quickTo setters are created
 * once per mount and torn down on unmount, so no tweens leak between renders.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.4) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || prefersReducedMotion()) return;

        // Cached setters reuse a single internal tween instead of spawning one
        // per mousemove event.
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

        const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            xTo(relX * strength);
            yTo(relY * strength);
        };
        const onLeave = () => {
            xTo(0);
            yTo(0);
        };

        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        return () => {
            el.removeEventListener("mousemove", onMove);
            el.removeEventListener("mouseleave", onLeave);
            gsap.killTweensOf(el);
        };
    }, [strength]);

    return ref;
}
