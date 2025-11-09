'use client';

import { useEffect, useState } from 'react';
import type { Strategy, UserProfile, DNAProfile } from '@/types';

interface StrategyDNAProps {
  strategy: Strategy;
  userProfile: UserProfile;
}

/**
 * Default DNA Profile for loading state
 */
const defaultDNAProfile: DNAProfile = {
  yieldScore: 0,
  riskRating: 'C',
  gasTier: 3,
  timeHorizon: 'Medium',
  uniqueOpportunities: [],
  overallScore: 0,
  compatibilityScore: 0,
};

/**
 * Hook for Strategy DNA Analysis
 */
function useStrategyDNA(
  strategy: Strategy,
  userProfile: UserProfile
): DNAProfile | null {
  const [dnaProfile, setDnaProfile] = useState<DNAProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function analyzeStrategyDNA() {
      setLoading(true);
      try {
        const response = await fetch('/api/analyze/dna', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            strategy,
            userProfile,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze strategy DNA');
        }

        const data = await response.json();
        setDnaProfile(data.analysis?.dnaProfile || defaultDNAProfile);
      } catch (error) {
        console.error('Error analyzing strategy DNA:', error);
        setDnaProfile(defaultDNAProfile);
      } finally {
        setLoading(false);
      }
    }

    analyzeStrategyDNA();
  }, [strategy, userProfile]);

  return dnaProfile;
}

/**
 * Strategy DNA Visualizer Component
 * Unique visual representation of strategy analysis
 */
export function StrategyDNAVisualizer({ strategy, userProfile }: StrategyDNAProps) {
  const dnaProfile = useStrategyDNA(strategy, userProfile);

  if (!dnaProfile) {
    return (
      <div className="strategy-dna-visualizer p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const getRatingColor = (rating: string): string => {
    const colors: Record<string, string> = {
      A: 'text-green-600 dark:text-green-400',
      B: 'text-blue-600 dark:text-blue-400',
      C: 'text-yellow-600 dark:text-yellow-400',
      D: 'text-orange-600 dark:text-orange-400',
      F: 'text-red-600 dark:text-red-400',
    };
    return colors[rating] || colors.C;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="strategy-dna-visualizer p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Strategy DNA Analysis
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Comprehensive breakdown of strategy characteristics and compatibility
        </p>
      </div>

      {/* DNA Helix Visualization */}
      <div className="dna-helix space-y-4 mb-6">
        {/* Yield Strand */}
        <div className="helix-strand">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Yield Potential
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {dnaProfile.yieldScore}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${getScoreColor(dnaProfile.yieldScore)} transition-all duration-500`}
              style={{ width: `${dnaProfile.yieldScore}%` }}
            />
          </div>
        </div>

        {/* Risk Control Strand */}
        <div className="helix-strand">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Risk Control
            </span>
            <span
              className={`text-sm font-bold ${getRatingColor(dnaProfile.riskRating)}`}
            >
              Rating {dnaProfile.riskRating}
            </span>
          </div>
          <div className="flex space-x-1">
            {['A', 'B', 'C', 'D', 'F'].map((rating) => (
              <div
                key={rating}
                className={`flex-1 h-3 rounded ${
                  rating <= dnaProfile.riskRating
                    ? 'bg-gradient-to-r from-green-500 to-red-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Gas Efficiency Strand */}
        <div className="helix-strand">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Gas Efficiency
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              Tier {dnaProfile.gasTier}/5
            </span>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((tier) => (
              <div
                key={tier}
                className={`flex-1 h-3 rounded ${
                  tier <= dnaProfile.gasTier
                    ? 'bg-blue-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* DNA Metrics */}
      <div className="dna-metrics grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Strategy Fitness */}
        <div className="metric bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Strategy Fitness
          </span>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {dnaProfile.overallScore}
            </span>
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
              /100
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getScoreColor(dnaProfile.overallScore)} transition-all duration-500`}
              style={{ width: `${dnaProfile.overallScore}%` }}
            />
          </div>
        </div>

        {/* Compatibility Score */}
        <div className="metric bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Your Compatibility
          </span>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {dnaProfile.compatibilityScore}
            </span>
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
              /100
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getScoreColor(dnaProfile.compatibilityScore)} transition-all duration-500`}
              style={{ width: `${dnaProfile.compatibilityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Unique Opportunities */}
      {dnaProfile.uniqueOpportunities.length > 0 && (
        <div className="unique-opportunities">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Unique Opportunities
          </h4>
          <ul className="space-y-2">
            {dnaProfile.uniqueOpportunities.map((opportunity, index) => (
              <li
                key={index}
                className="flex items-start text-sm text-gray-700 dark:text-gray-300"
              >
                <svg
                  className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {opportunity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Time Horizon Badge */}
      <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
        Time Horizon: {dnaProfile.timeHorizon}
      </div>
    </div>
  );
}
