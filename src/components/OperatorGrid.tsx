'use client';

import { useEffect, useState } from 'react';

interface Operator {
  address: string;
  status: 'available' | 'validating' | 'offline';
  activeValidations: number;
  totalValidations: number;
  responseTime: number; // in ms
  lastSeen: Date;
}

interface OperatorGridProps {
  maxOperators?: number;
}

export default function OperatorGrid({ maxOperators = 6 }: OperatorGridProps) {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch operators from API
    const fetchOperators = async () => {
      try {
        const response = await fetch('/api/operators');
        const data = await response.json();
        if (data.success) {
          setOperators(data.data.slice(0, maxOperators));
        }
      } catch (error) {
        console.error('Error fetching operators:', error);
        // Use mock data for demo
        setOperators(generateMockOperators(maxOperators));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOperators();
    // Refresh every 10 seconds
    const interval = setInterval(fetchOperators, 10000);

    return () => clearInterval(interval);
  }, [maxOperators]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Operator Network
        </h3>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Operator Network
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {operators.filter(o => o.status !== 'offline').length} / {operators.length} active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {operators.map((operator) => (
          <OperatorCard key={operator.address} operator={operator} />
        ))}
      </div>
    </div>
  );
}

function OperatorCard({ operator }: { operator: Operator }) {
  const statusConfig = {
    available: {
      color: 'bg-green-500',
      text: 'Available',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      pulse: false
    },
    validating: {
      color: 'bg-blue-500',
      text: 'Validating',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      pulse: true
    },
    offline: {
      color: 'bg-gray-400',
      text: 'Offline',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50',
      pulse: false
    }
  };

  const config = statusConfig[operator.status];

  return (
    <div className={`${config.bgColor} dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${config.color}`} />
            {config.pulse && (
              <>
                <div className={`absolute inset-0 w-3 h-3 rounded-full ${config.color} animate-ping opacity-75`} />
                <div className={`absolute inset-0 w-3 h-3 rounded-full ${config.color} animate-pulse`} />
              </>
            )}
          </div>
          <span className={`text-xs font-semibold ${config.textColor} dark:text-gray-300`}>
            {config.text}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {operator.responseTime}ms
        </span>
      </div>

      <div className="font-mono text-sm text-gray-900 dark:text-white mb-3">
        {operator.address.slice(0, 6)}...{operator.address.slice(-4)}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="text-gray-500 dark:text-gray-400">Active</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {operator.activeValidations}
          </div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Total</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {operator.totalValidations}
          </div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Last seen: {formatTimestamp(operator.lastSeen)}
        </div>
      </div>
    </div>
  );
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function generateMockOperators(count: number): Operator[] {
  const statuses: Array<'available' | 'validating' | 'offline'> = ['available', 'validating', 'offline'];
  const operators: Operator[] = [];

  for (let i = 0; i < count; i++) {
    const randomStatus = statuses[Math.floor(Math.random() * 3)];
    operators.push({
      address: `0x${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}`,
      status: randomStatus,
      activeValidations: randomStatus === 'validating' ? Math.floor(Math.random() * 5) + 1 : 0,
      totalValidations: Math.floor(Math.random() * 1000) + 50,
      responseTime: Math.floor(Math.random() * 500) + 100,
      lastSeen: new Date(Date.now() - Math.random() * 3600000)
    });
  }

  return operators;
}
