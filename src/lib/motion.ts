/**
 * Single source of truth for the reduced-motion preference.
 * GSAP-driven effects read this to bail out before creating any tweens,
 * keeping the ticker idle for users who opt out of motion.
 */
export function prefersReducedMotion(): boolean {
    return (
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}
