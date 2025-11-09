'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import LoadingSpinner, { ValidationResultSkeleton } from './LoadingSpinner';
import { NoTasksFound, NetworkError } from './EmptyState';
import ConfidenceScoreGauge from './ConfidenceScoreGauge';

const CONTRACT_ABI = [
  "function getValidationResult(uint256) external view returns (tuple(uint256 taskId, bool isValid, uint256 confidenceScore, string[] risks, string alternativeStrategy, address[] operators, bytes aggregatedSignature, uint256 validatedAt))"
];

export default function ValidationResults() {
  const [taskId, setTaskId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResult = async () => {
    if (!taskId) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to view validation results');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contractAddress = process.env.NEXT_PUBLIC_AVS_CONTRACT_ADDRESS || '';

      if (!contractAddress) {
        throw new Error('Contract address not configured');
      }

      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);

      const validationResult = await contract.getValidationResult(taskId);

      setResult({
        taskId: validationResult.taskId.toString(),
        isValid: validationResult.isValid,
        confidenceScore: Number(validationResult.confidenceScore),
        risks: validationResult.risks,
        alternativeStrategy: validationResult.alternativeStrategy,
        operators: validationResult.operators,
        validatedAt: Number(validationResult.validatedAt)
      });
    } catch (error: any) {
      console.error('Error fetching result:', error);
      setError(error.message || 'Failed to fetch validation result. Please check the task ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Check Validation Result
      </h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={taskId}
          onChange={(e) => {
            setTaskId(e.target.value);
            setError(null);
          }}
          placeholder="Enter Task ID"
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          onClick={fetchResult}
          disabled={isLoading || !taskId}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size="sm" color="white" />
              Checking...
            </span>
          ) : (
            'Check'
          )}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-red-800 dark:text-red-400 mb-1">
                Error
              </h4>
              <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            </div>
          </div>
          <button
            onClick={() => setError(null)}
            className="mt-3 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <ValidationResultSkeleton />}

      {/* No Result Yet */}
      {!isLoading && !error && !result && taskId && (
        <NoTasksFound />
      )}

      {/* Result Display */}
      {!isLoading && result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Success Animation */}
          {result.isValid && (
            <div className="text-center py-4">
              <div className="text-6xl animate-bounce">🎉</div>
              <p className="text-green-600 dark:text-green-400 font-semibold mt-2">
                Strategy Validated Successfully!
              </p>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
              {/* Confidence Gauge */}
              <div className="flex-shrink-0">
                <ConfidenceScoreGauge score={result.confidenceScore} animated={true} />
              </div>

              {/* Task Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                    Validation Result
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.isValid
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                  }`}>
                    {result.isValid ? '✅ Valid' : '❌ Not Recommended'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Task ID</p>
                    <p className="font-mono font-semibold text-gray-900 dark:text-white">
                      {result.taskId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Validated At</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {result.validatedAt > 0
                        ? new Date(result.validatedAt * 1000).toLocaleString()
                        : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {result.risks && result.risks.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">⚠️ Identified Risks:</p>
                <ul className="list-disc list-inside space-y-1">
                  {result.risks.map((risk: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700">{risk}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.alternativeStrategy && (
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm font-medium mb-1">💡 Alternative Strategy:</p>
                <p className="text-sm text-gray-700">{result.alternativeStrategy}</p>
              </div>
            )}

            {result.operators && result.operators.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-600 mb-2">Validated by {result.operators.length} operator(s)</p>
                {result.operators.map((op: string, i: number) => (
                  <p key={i} className="text-xs font-mono text-gray-500">
                    {op.slice(0, 6)}...{op.slice(-4)}
                  </p>
                ))}
              </div>
            )}

            {result.validatedAt > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Validated at: {new Date(result.validatedAt * 1000).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
