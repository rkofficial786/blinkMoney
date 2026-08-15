import React, { useEffect, useRef, useState } from 'react';
import { Text, TextStyle } from 'react-native';

type Props = {
  toValue: number;
  formatter: (n: number) => string;
  style?: TextStyle | TextStyle[];
  delay?: number;
  duration?: number;
};

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function AnimatedNumber({ toValue, formatter, style, delay = 0, duration = 1200 }: Props) {
  const [display, setDisplay] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    let startTime: number | null = null;
    const timeoutId = setTimeout(() => {
      const tick = (now: number) => {
        if (startTime === null) startTime = now;
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        setDisplay(toValue * easeOutCubic(t));
        if (t < 1) {
          rafId.current = requestAnimationFrame(tick);
        }
      };
      rafId.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [toValue, delay, duration]);

  return <Text style={style}>{formatter(display)}</Text>;
}
