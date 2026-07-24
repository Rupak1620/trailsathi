"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";

type Tilt3DProps = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees */
  maxTilt?: number;
  style?: CSSProperties;
};

/**
 * Lightweight CSS-perspective tilt. No animation libraries —
 * pointer tracking + transform3d only. Disabled for reduced motion / touch.
 */
export function Tilt3D({
  children,
  className = "",
  maxTilt = 8,
  style,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [tilting, setTilting] = useState(false);
  const [transform, setTransform] = useState(
    "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)"
  );

  useEffect(() => {
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqFine = window.matchMedia("(pointer: fine)");

    const sync = () => setEnabled(!mqReduce.matches && mqFine.matches);
    sync();

    mqReduce.addEventListener("change", sync);
    mqFine.addEventListener("change", sync);
    return () => {
      mqReduce.removeEventListener("change", sync);
      mqFine.removeEventListener("change", sync);
    };
  }, []);

  const onMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!enabled || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - y) * maxTilt * 2;

      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        setTilting(true);
        setTransform(
          `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px)`
        );
      });
    },
    [enabled, maxTilt]
  );

  const onLeave = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current);
    setTransform("perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)");
    // Allow CSS enter animations to own transform until next hover
    window.setTimeout(() => setTilting(false), 180);
  }, []);

  return (
    <div
      ref={ref}
      className={`tilt-3d ${className}`.trim()}
      style={{
        ...style,
        ...(tilting ? { transform } : null),
      }}
      onMouseMove={enabled ? onMove : undefined}
      onMouseLeave={enabled ? onLeave : undefined}
    >
      {children}
    </div>
  );
}
