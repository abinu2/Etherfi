'use client';

import { useEffect, useState, useRef } from 'react';

interface GasDataPoint {
  timestamp: number;
  price: number;
}

export default function GasPriceChart() {
  const [dataPoints, setDataPoints] = useState<GasDataPoint[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Fetch initial gas price
    const fetchGasPrice = async () => {
      try {
        const response = await fetch('/api/gas');
        const data = await response.json();
        if (data.success) {
          const newPoint = {
            timestamp: Date.now(),
            price: data.data.current
          };

          setDataPoints(prev => {
            const updated = [...prev, newPoint];
            // Keep last hour of data (60 points at 1 min intervals)
            return updated.slice(-60);
          });
        }
      } catch (error) {
        console.error('Error fetching gas price:', error);
      }
    };

    fetchGasPrice();
    const interval = setInterval(fetchGasPrice, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || dataPoints.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find min/max for scaling
    const prices = dataPoints.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * (height - 2 * padding)) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Price labels
      const price = maxPrice - (i * priceRange) / 4;
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${price.toFixed(0)}`, padding - 5, y + 4);
    }

    // Draw line chart
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';

    dataPoints.forEach((point, index) => {
      const x = padding + (index / Math.max(dataPoints.length - 1, 1)) * (width - 2 * padding);
      const y = height - padding - ((point.price - minPrice) / priceRange) * (height - 2 * padding);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw colored zones
    const drawZone = (startY: number, endY: number, color: string) => {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(padding, startY, width - 2 * padding, endY - startY);
      ctx.globalAlpha = 1;
    };

    // Green zone (< 30 gwei)
    const greenY = height - padding - ((30 - minPrice) / priceRange) * (height - 2 * padding);
    drawZone(Math.max(greenY, padding), height - padding, '#10b981');

    // Yellow zone (30-50 gwei)
    const yellowStartY = height - padding - ((30 - minPrice) / priceRange) * (height - 2 * padding);
    const yellowEndY = height - padding - ((50 - minPrice) / priceRange) * (height - 2 * padding);
    drawZone(yellowEndY, yellowStartY, '#f59e0b');

    // Red zone (> 50 gwei)
    const redY = height - padding - ((50 - minPrice) / priceRange) * (height - 2 * padding);
    drawZone(padding, Math.max(redY, padding), '#ef4444');

    // Draw current price indicator
    if (dataPoints.length > 0) {
      const lastPoint = dataPoints[dataPoints.length - 1];
      const lastX = width - padding;
      const lastY = height - padding - ((lastPoint.price - minPrice) / priceRange) * (height - 2 * padding);

      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${lastPoint.price.toFixed(0)} gwei`, lastX - 10, lastY - 10);
    }

    // Time axis label
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Last Hour', width / 2, height - 10);

  }, [dataPoints]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Gas Price History
        </h3>
        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 opacity-30 rounded" />
            <span className="text-gray-600 dark:text-gray-400">&lt;30</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 opacity-30 rounded" />
            <span className="text-gray-600 dark:text-gray-400">30-50</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 opacity-30 rounded" />
            <span className="text-gray-600 dark:text-gray-400">&gt;50</span>
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-64"
        style={{ width: '100%', height: '256px' }}
      />
    </div>
  );
}
