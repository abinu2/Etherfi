'use client';

import { useEffect, useState } from 'react';
import { generateHistoricalTVL } from '@/lib/simulatedEigenLayer';

export default function TVLChart() {
  const [data, setData] = useState<{ date: Date; tvl: number }[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    setData(generateHistoricalTVL(days));
  }, [timeRange]);

  const maxTVL = Math.max(...data.map(d => d.tvl));
  const minTVL = Math.min(...data.map(d => d.tvl));
  const currentTVL = data[data.length - 1]?.tvl || 0;
  const previousTVL = data[0]?.tvl || 0;
  const change = ((currentTVL - previousTVL) / previousTVL) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Total Value Locked</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{currentTVL.toFixed(0)} ETH</span>
            <span className={`text-sm font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↗' : '↘'} {Math.abs(change).toFixed(2)}%
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            ${(currentTVL * 2400).toLocaleString()} USD
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`
                px-3 py-1 rounded text-sm font-medium transition-colors
                ${timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <svg className="w-full h-full" viewBox="0 0 800 256">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              y1={i * 64}
              x2="800"
              y2={i * 64}
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area under curve */}
          <defs>
            <linearGradient id="tvlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {data.length > 0 && (
            <>
              {/* Area path */}
              <path
                d={generateAreaPath(data, maxTVL, minTVL)}
                fill="url(#tvlGradient)"
              />

              {/* Line path */}
              <path
                d={generateLinePath(data, maxTVL, minTVL)}
                fill="none"
                stroke="rgb(59, 130, 246)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {data.map((point, i) => {
                const x = (i / (data.length - 1)) * 800;
                const y = 256 - ((point.tvl - minTVL) / (maxTVL - minTVL)) * 256;

                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="rgb(59, 130, 246)"
                    className="hover:r-6 transition-all cursor-pointer"
                  >
                    <title>
                      {point.date.toLocaleDateString()}: {point.tvl.toFixed(2)} ETH
                    </title>
                  </circle>
                );
              })}
            </>
          )}

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => {
            const value = maxTVL - (i * (maxTVL - minTVL) / 4);
            return (
              <text
                key={i}
                x="5"
                y={i * 64 + 4}
                className="text-xs fill-gray-500 dark:fill-gray-400"
              >
                {value.toFixed(0)}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">24h Change</div>
          <div className="text-lg font-bold text-green-600">+2.3%</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">All-time High</div>
          <div className="text-lg font-bold">{maxTVL.toFixed(0)} ETH</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Market Cap</div>
          <div className="text-lg font-bold">${(currentTVL * 2400 / 1000000).toFixed(2)}M</div>
        </div>
      </div>
    </div>
  );
}

function generateLinePath(data: { date: Date; tvl: number }[], maxTVL: number, minTVL: number): string {
  if (data.length === 0) return '';

  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * 800;
    const y = 256 - ((point.tvl - minTVL) / (maxTVL - minTVL)) * 256;
    return `${x},${y}`;
  });

  return `M ${points.join(' L ')}`;
}

function generateAreaPath(data: { date: Date; tvl: number }[], maxTVL: number, minTVL: number): string {
  if (data.length === 0) return '';

  const linePath = generateLinePath(data, maxTVL, minTVL);
  return `${linePath} L 800,256 L 0,256 Z`;
}
