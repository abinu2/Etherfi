'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedNumber({
  value,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = ''
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef(0);

  useEffect(() => {
    startValueRef.current = displayValue;
    startTimeRef.current = undefined;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const currentValue = startValueRef.current + (value - startValueRef.current) * easeOut;

      setDisplayValue(currentValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
    // displayValue is intentionally not in deps - adding it would cause infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  const formattedValue = displayValue.toFixed(decimals);

  return (
    <span className={className}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
}

// Specialized component for currency
export function AnimatedCurrency({ value, className = '' }: { value: number; className?: string }) {
  return (
    <AnimatedNumber
      value={value}
      decimals={2}
      prefix="$"
      className={className}
    />
  );
}

// Specialized component for percentages
export function AnimatedPercentage({ value, className = '' }: { value: number; className?: string }) {
  return (
    <AnimatedNumber
      value={value}
      decimals={1}
      suffix="%"
      className={className}
    />
  );
}

// Counter with thousands separator
export function AnimatedCounter({ value, className = '' }: { value: number; className?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let currentValue = 0;
    const increment = value / 50;
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(currentValue));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [value]);

  const formatted = displayValue.toLocaleString();

  return <span className={className}>{formatted}</span>;
}
