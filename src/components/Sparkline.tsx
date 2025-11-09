'use client';

import { useEffect, useRef } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  lineColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  className?: string;
  showDots?: boolean;
}

export default function Sparkline({
  data,
  width = 200,
  height = 40,
  lineColor = '#3b82f6',
  fillColor = 'rgba(59, 130, 246, 0.1)',
  strokeWidth = 2,
  className = '',
  showDots = false
}: SparklineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find min and max values
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Calculate points
    const points: { x: number; y: number }[] = data.map((value, index) => ({
      x: (index / (data.length - 1)) * width,
      y: height - ((value - min) / range) * height
    }));

    // Draw filled area
    if (fillColor) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, height);
      points.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.lineTo(points[points.length - 1].x, height);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });

    ctx.stroke();

    // Draw dots at each point
    if (showDots) {
      points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, strokeWidth * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = lineColor;
        ctx.fill();
      });
    }

    // Draw current value dot (last point)
    const lastPoint = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, strokeWidth * 2, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();

    // Add white border to current dot
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, strokeWidth * 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = strokeWidth * 0.5;
    ctx.stroke();

  }, [data, width, height, lineColor, fillColor, strokeWidth, showDots]);

  if (data.length === 0) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}

// Mini sparkline for compact displays
export function MiniSparkline({ data, trend }: { data: number[]; trend?: 'up' | 'down' | 'neutral' }) {
  const trendColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280';

  return (
    <div className="flex items-center gap-2">
      <Sparkline
        data={data}
        width={60}
        height={20}
        lineColor={trendColor}
        fillColor={`${trendColor}20`}
        strokeWidth={1.5}
      />
      {trend && (
        <span className="text-xs font-semibold" style={{ color: trendColor }}>
          {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
        </span>
      )}
    </div>
  );
}
