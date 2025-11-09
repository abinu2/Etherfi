'use client';

import { useEffect, useState } from 'react';
import { coreAVSService, LiveAVSData, AVSPerformanceMetrics } from '@/lib/avs/core-avs-service';
import { generateSimulatedOperators, SimulatedOperator } from '@/lib/simulatedEigenLayer';
import LoadingSpinner from './LoadingSpinner';
import AnimatedNumber, { AnimatedPercentage } from './AnimatedNumber';

export default function AVSDashboard() {
  const [liveData, setLiveData] = useState<LiveAVSData | null>(null);
  const [metrics, setMetrics] = useState<AVSPerformanceMetrics | null>(null);
  const [operators, setOperators] = useState<SimulatedOperator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAVS = async () => {
      const ops = generateSimulatedOperators(12);
      setOperators(ops);

      const [live, perf] = await Promise.all([
        coreAVSService.getLiveAVSData(ops),
        coreAVSService.getPerformanceMetrics(ops)
      ]);

      setLiveData(live);
      setMetrics(perf);
      setIsLoading(false);
    };

    initializeAVS();

    // Update every 10 seconds
    const interval = setInterval(async () => {
      if (operators.length > 0) {
        const [live, perf] = await Promise.all([
          coreAVSService.getLiveAVSData(operators),
          coreAVSService.getPerformanceMetrics(operators)
        ]);
        setLiveData(live);
        setMetrics(perf);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading || !liveData || !metrics) {
    return (
      <div className="handcrafted-card rounded-3xl p-8">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Initializing AVS network..." />
        </div>
      </div>
    );
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'good': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      case 'degraded': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'critical': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* AVS Network Status */}
      <div className="handcrafted-card rounded-3xl p-6 soft-glow accent-line">
        <div className="ml-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              <span className="hand-underline">AVS Network Status</span>
            </h3>
            <div className={`px-4 py-2 rounded-full font-semibold text-sm ${getHealthColor(liveData.networkHealth)}`}>
              {liveData.networkHealth.charAt(0).toUpperCase() + liveData.networkHealth.slice(1)}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Staked */}
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-lg">💰</span>
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Staked</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <AnimatedNumber value={parseFloat(liveData.totalStaked)} decimals={2} /> ETH
              </p>
            </div>

            {/* Active Operators */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <span className="text-lg">👥</span>
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Operators</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {liveData.activeOperators}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {operators.length} total nodes
              </p>
            </div>

            {/* Average APY */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <span className="text-lg">📈</span>
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Network APY</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <AnimatedPercentage value={liveData.averageAPY} />
              </p>
            </div>

            {/* Current Epoch */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-lg">⏱️</span>
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Epoch</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                #{liveData.currentEpoch}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                12s blocks
              </p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>🎯</span>
              Performance Metrics
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Validation Speed</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {metrics.validationSpeed}ms
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Success Rate</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  <AnimatedPercentage value={metrics.successRate} />
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Uptime</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  <AnimatedPercentage value={metrics.operatorUptime} />
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Validations</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {metrics.totalValidations.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>🏆</span>
              Top Performing Operators
            </h4>
            <div className="space-y-2">
              {liveData.topPerformers.map((performer, index) => (
                <div
                  key={performer.operator}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {performer.operator}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {performer.validations.toLocaleString()} validations
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {performer.score}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      reputation
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Validations */}
          {liveData.recentValidations.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🔍</span>
                Recent Validations
              </h4>
              <div className="space-y-2">
                {liveData.recentValidations.slice(0, 3).map((validation) => (
                  <div
                    key={validation.taskId}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
                  >
                    <div>
                      <p className="font-mono font-semibold text-gray-900 dark:text-white">
                        {validation.taskId}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(validation.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Consensus</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {validation.consensus.percentage.toFixed(0)}%
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        validation.status === 'validated' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        validation.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {validation.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AVS Features Info */}
      <div className="handcrafted-card rounded-3xl p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
          Enhanced AVS Features
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <p className="font-semibold text-emerald-900 dark:text-emerald-300 mb-2">
              ✓ Real-time Validation Tracking
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              Monitor strategy validations with live consensus tracking
            </p>
          </div>
          <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
            <p className="font-semibold text-violet-900 dark:text-violet-300 mb-2">
              ✓ Risk Assessment Engine
            </p>
            <p className="text-sm text-violet-700 dark:text-violet-400">
              Multi-factor risk analysis with slashing protection
            </p>
          </div>
          <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
            <p className="font-semibold text-cyan-900 dark:text-cyan-300 mb-2">
              ✓ Performance Analytics
            </p>
            <p className="text-sm text-cyan-700 dark:text-cyan-400">
              Track operator performance and network health metrics
            </p>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
            <p className="font-semibold text-amber-900 dark:text-amber-300 mb-2">
              ✓ Strategy Predictions
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              AI-powered APY forecasting and success probability
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
