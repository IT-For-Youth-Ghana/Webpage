"use client";

import { useEffect, useState } from "react";

export function useCountUp(target: number, duration = 1200, start = true) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) {
      setValue(0);
      return;
    }

    const startedAt = performance.now();
    let frame = 0;

    const tick = (timestamp: number) => {
      const progress = Math.min((timestamp - startedAt) / duration, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [duration, start, target]);

  return value;
}
