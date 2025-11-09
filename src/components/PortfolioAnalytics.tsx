'use client';

import { useEffect, useRef, useState } from 'react';
import Sparkline from './Sparkline';

interface AnalyticsData {
  apyHistory: number[];
  balanceHistory: number[];
  gasSavings: number;
  totalValidations: number;
  avgConfidence: number;
}

export default function PortfolioAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    // Simulate fetching analytics data
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const apyBase = 3.8;
    const balanceBase = 5.2;

    const apyHistory = Array.from({ length: days }, (_, i) =>
      apyBase + (Math.random() - 0.5) * 0.5
    );

    const balanceHistory = Array.from({ length: days }, (_, i) =>
      balanceBase * (1 + (i / days) * 0.05) + (Math.random() - 0.5) * 0.1
    );

    setAnalytics({
      apyHistory,
      balanceHistory,
      gasSavings: parseFloat((Math.random() * 50 + 20).toFixed(2)),
      totalValidations: Math.floor(Math.random() * 50) + 10,
      avgConfidence: Math.floor(Math.random() * 20) + 75
    });
  }, [timeRange]);

  if (!analytics) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Portfolio Analytics
        </h3>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Gas Savings</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            ${analytics.gasSavings}
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Validations</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {analytics.totalValidations}
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg Confidence</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {analytics.avgConfidence}%
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ROI</p>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
            +{((analytics.balanceHistory[analytics.balanceHistory.length - 1] - analytics.balanceHistory[0]) / analytics.balanceHistory[0] * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* APY History Chart */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          APY Over Time
        </h4>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <APYChart data={analytics.apyHistory} />
        </div>
      </div>

      {/* Balance Growth Chart */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Balance Growth (eETH)
        </h4>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <Sparkline
            data={analytics.balanceHistory}
            width={600}
            height={120}
            lineColor="#10b981"
            fillColor="rgba(16, 185, 129, 0.1)"
            strokeWidth={2}
            showDots
          />
        </div>
      </div>

      {/* Comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Current APY vs Market
          </h5>
          <div className="flex items-end gap-4">
            <div>
              <p className="text-xs text-blue-700 dark:text-blue-400">Your APY</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                {analytics.apyHistory[analytics.apyHistory.length - 1].toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-700 dark:text-blue-400">Market Avg</p>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                3.2%
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <h5 className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2">
            Projected Annual Earnings
          </h5>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
            ${(analytics.balanceHistory[analytics.balanceHistory.length - 1] * 2000 * 0.038).toFixed(2)}
          </p>
          <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
            Based on current APY
          </p>
        </div>
      </div>
    </div>
  );
}

function APYChart({ data }: { data: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 600;
    const height = 120;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 0.1;

    const points = data.map((value, index) => ({
      x: (index / (data.length - 1)) * width,
      y: height - ((value - min) / range) * (height - 20)
    }));

    // Fill
    ctx.beginPath();
    ctx.moveTo(0, height);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

  }, [data]);

  return <canvas ref={canvasRef} style={{ width: '600px', height: '120px' }} />;
}
