'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { generateSimulatedOperators, generateAVSMetrics, type SimulatedOperator } from '@/lib/simulatedEigenLayer';

export default function SimulatedOperatorNetwork() {
  const [operators, setOperators] = useState<SimulatedOperator[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [selectedOperator, setSelectedOperator] = useState<SimulatedOperator | null>(null);

  useEffect(() => {
    // Initialize operators
    const initialOperators = generateSimulatedOperators(12);
    setOperators(initialOperators);
    setMetrics(generateAVSMetrics(initialOperators));

    // Simulate live updates every 10 seconds
    const interval = setInterval(() => {
      setOperators(prev => {
        // Randomly update one operator's stake
        const randomIndex = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        const change = (Math.random() - 0.5) * 5;
        const newStake = Math.max(100, parseFloat(updated[randomIndex].totalStake) + change);
        updated[randomIndex] = {
          ...updated[randomIndex],
          totalStake: newStake.toFixed(2),
        };
        return updated;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (operators.length > 0) {
      setMetrics(generateAVSMetrics(operators));
    }
  }, [operators]);

  const activeOperators = operators.filter(op => op.isActive);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Value Locked"
          value={`${metrics?.totalValueLocked || '0'} ETH`}
          subtitle={`$${metrics ? (parseFloat(metrics.totalValueLocked) * 2400).toLocaleString() : '0'}`}
          trend="+5.2%"
          trendUp={true}
        />
        <StatCard
          title="Active Operators"
          value={activeOperators.length.toString()}
          subtitle={`${operators.length} total registered`}
          trend="+2 this week"
          trendUp={true}
        />
        <StatCard
          title="Avg Confidence"
          value={`${metrics?.averageConfidenceScore || 0}%`}
          subtitle="Across all validations"
          trend="+1.5%"
          trendUp={true}
        />
        <StatCard
          title="Network Uptime"
          value={`${metrics?.uptimePercentage || 0}%`}
          subtitle="Past 30 days"
          trend="99.9% SLA"
          trendUp={true}
        />
      </div>

      {/* Operator Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Operator Network</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Live Updates</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {operators.map((operator) => (
            <OperatorCard
              key={operator.address}
              operator={operator}
              onClick={() => setSelectedOperator(operator)}
              isSelected={selectedOperator?.address === operator.address}
            />
          ))}
        </div>
      </div>

      {/* Operator Details Modal */}
      {selectedOperator && (
        <OperatorDetailsModal
          operator={selectedOperator}
          onClose={() => setSelectedOperator(null)}
        />
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendUp
}: {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</div>
      <div className={`text-xs mt-2 flex items-center gap-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
        <span>{trendUp ? '↗' : '↘'}</span>
        <span>{trend}</span>
      </div>
    </div>
  );
}

function OperatorCard({
  operator,
  onClick,
  isSelected
}: {
  operator: SimulatedOperator;
  onClick: () => void;
  isSelected: boolean;
}) {
  const successRate = (operator.successfulValidations / operator.totalValidations * 100).toFixed(1);

  return (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
        }
        ${operator.isActive ? '' : 'opacity-60'}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Image
            src={operator.avatar}
            alt={operator.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-semibold text-sm">{operator.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {operator.address.slice(0, 6)}...{operator.address.slice(-4)}
            </div>
          </div>
        </div>
        <div className={`
          px-2 py-1 rounded text-xs font-semibold
          ${operator.isActive
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }
        `}>
          {operator.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600 dark:text-gray-400">Total Stake</span>
          <span className="text-sm font-bold">{operator.totalStake} ETH</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600 dark:text-gray-400">Reputation</span>
          <div className="flex items-center gap-1">
            <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-green-500"
                style={{ width: `${operator.reputation}%` }}
              />
            </div>
            <span className="text-xs font-semibold">{operator.reputation}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600 dark:text-gray-400">Success Rate</span>
          <span className="text-sm font-semibold text-green-600">{successRate}%</span>
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {operator.totalValidations.toLocaleString()} validations
          </div>
        </div>
      </div>
    </div>
  );
}

function OperatorDetailsModal({
  operator,
  onClose
}: {
  operator: SimulatedOperator;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <Image
                src={operator.avatar}
                alt={operator.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-2xl font-bold">{operator.name}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  {operator.address}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Stake</div>
              <div className="text-2xl font-bold">{operator.totalStake} ETH</div>
              <div className="text-xs text-gray-500">
                ${(parseFloat(operator.totalStake) * 2400).toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Reputation</div>
              <div className="text-2xl font-bold">{operator.reputation}/100</div>
              <div className="text-xs text-green-600">Excellent</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Validations</div>
              <div className="text-2xl font-bold">{operator.totalValidations.toLocaleString()}</div>
              <div className="text-xs text-gray-500">
                {((operator.successfulValidations / operator.totalValidations) * 100).toFixed(1)}% success
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
              <div className="text-2xl font-bold">{operator.uptime.toFixed(2)}%</div>
              <div className="text-xs text-green-600">High availability</div>
            </div>
          </div>

          {/* Restaking Strategies */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Restaking Strategies</h4>
            <div className="space-y-2">
              {operator.restakingStrategies.map((strategy, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-sm">{strategy.name}</div>
                    <div className="text-xs text-gray-500">APY: {strategy.apy}%</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{strategy.stakedAmount} ETH</div>
                    <div className="text-xs text-gray-500">
                      {((parseFloat(strategy.stakedAmount) / parseFloat(operator.totalStake)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="font-semibold mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {operator.recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 text-sm border-l-2 border-blue-500 pl-3"
                >
                  <div>
                    <span className="font-medium capitalize">
                      {activity.type.replace('_', ' ')}
                    </span>
                    {activity.taskId && (
                      <span className="text-gray-500 ml-2">Task #{activity.taskId}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
