'use client';

import { useEffect, useState } from 'react';
import { GasData } from '@/types';
import { GAS_THRESHOLDS } from '@/lib/constants';

export default function GasMonitor() {
  const [gasData, setGasData] = useState<GasData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGasData = async () => {
      try {
        const response = await fetch('/api/gas');
        const data = await response.json();
        if (data.success) {
          setGasData(data.data);
        }
      } catch (error) {
        console.error('Error fetching gas data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGasData();
    const interval = setInterval(fetchGasData, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getGasColor = (price: number) => {
    if (price < GAS_THRESHOLDS.CHEAP) return 'text-green-500';
    if (price < GAS_THRESHOLDS.MODERATE) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getGasStatus = (price: number) => {
    if (price < GAS_THRESHOLDS.CHEAP) return 'Low';
    if (price < GAS_THRESHOLDS.MODERATE) return 'Moderate';
    return 'High';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Gas Monitor</h2>
        <p className="text-gray-500">Loading gas data...</p>
      </div>
    );
  }

  if (!gasData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Gas Monitor</h2>
        <p className="text-red-500">Failed to load gas data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gas Monitor</h2>
        <span className="text-xs text-gray-500">
          Updated: {new Date(gasData.timestamp).toLocaleTimeString()}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Current Gas</p>
            <p className={`text-3xl font-bold ${getGasColor(gasData.current)}`}>
              {gasData.current} <span className="text-lg">gwei</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Status: {getGasStatus(gasData.current)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-600">Slow</p>
            <p className="text-lg font-bold text-green-600">{gasData.slow}</p>
            <p className="text-xs text-gray-500">gwei</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-gray-600">Average</p>
            <p className="text-lg font-bold text-yellow-600">{gasData.average}</p>
            <p className="text-xs text-gray-500">gwei</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600">Fast</p>
            <p className="text-lg font-bold text-blue-600">{gasData.fast}</p>
            <p className="text-xs text-gray-500">gwei</p>
          </div>
        </div>
      </div>
    </div>
  );
}
