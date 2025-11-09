'use client';

import { useEffect, useState } from 'react';

interface OperatorActivity {
  id: string;
  operator: string;
  action: 'validation_started' | 'validation_completed' | 'attestation_signed';
  taskId: string;
  timestamp: Date;
  responseTime?: number;
}

export default function OperatorMonitor() {
  const [activities, setActivities] = useState<OperatorActivity[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Simulate real-time activity feed
    const interval = setInterval(() => {
      if (isLive && Math.random() > 0.7) {
        const actions: Array<'validation_started' | 'validation_completed' | 'attestation_signed'> = [
          'validation_started',
          'validation_completed',
          'attestation_signed'
        ];

        const newActivity: OperatorActivity = {
          id: Math.random().toString(36).substr(2, 9),
          operator: `0x${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}`,
          action: actions[Math.floor(Math.random() * actions.length)],
          taskId: `#${Math.floor(Math.random() * 10000)}`,
          timestamp: new Date(),
          responseTime: Math.floor(Math.random() * 3000) + 500
        };

        setActivities(prev => [newActivity, ...prev].slice(0, 10));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getActionDisplay = (action: OperatorActivity['action']) => {
    switch (action) {
      case 'validation_started':
        return { text: 'Started validation', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' };
      case 'validation_completed':
        return { text: 'Completed validation', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' };
      case 'attestation_signed':
        return { text: 'Signed attestation', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' };
    }
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Live Operator Activity
          </h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {isLive ? 'Live' : 'Paused'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsLive(!isLive)}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          {isLive ? 'Pause' : 'Resume'}
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-sm">Waiting for operator activity...</p>
          </div>
        ) : (
          activities.map((activity) => {
            const display = getActionDisplay(activity.action);
            return (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${display.bg} flex items-center justify-center`}>
                  <svg className={`w-5 h-5 ${display.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {activity.action === 'validation_started' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    )}
                    {activity.action === 'validation_completed' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                    {activity.action === 'attestation_signed' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    )}
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${display.color}`}>
                    {display.text}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    Operator {activity.operator.slice(0, 6)}...{activity.operator.slice(-4)} • Task {activity.taskId}
                  </p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                  {activity.responseTime && (
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {activity.responseTime}ms
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
