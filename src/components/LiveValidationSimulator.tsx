'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { simulateValidation, generateSimulatedOperators, DEMO_SCENARIOS, type SimulatedOperator } from '@/lib/simulatedEigenLayer';

interface ValidationProgress {
  stage: 'idle' | 'broadcasting' | 'validating' | 'aggregating' | 'complete';
  currentOperator?: string;
  message: string;
  progress: number;
}

export default function LiveValidationSimulator() {
  const [operators, setOperators] = useState<SimulatedOperator[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [progress, setProgress] = useState<ValidationProgress>({
    stage: 'idle',
    message: 'Ready to validate',
    progress: 0,
  });
  const [result, setResult] = useState<any>(null);
  const [selectedScenario, setSelectedScenario] = useState(DEMO_SCENARIOS[0]);

  useEffect(() => {
    setOperators(generateSimulatedOperators(8));
  }, []);

  const startValidation = async () => {
    setIsValidating(true);
    setResult(null);
    setProgress({ stage: 'idle', message: 'Initializing...', progress: 0 });

    const taskId = Math.floor(Math.random() * 10000);

    try {
      const validationResult = await simulateValidation(
        taskId,
        operators,
        (stage: string, operator?: string) => {
          if (stage === 'task_received') {
            setProgress({
              stage: 'broadcasting',
              message: 'Broadcasting task to operator network...',
              progress: 10,
            });
          } else if (stage === 'validating') {
            setProgress({
              stage: 'validating',
              currentOperator: operator,
              message: `${operator} is analyzing with Claude AI...`,
              progress: 20 + Math.random() * 40,
            });
          } else if (stage === 'signature_received') {
            setProgress(prev => ({
              ...prev,
              message: `Signature received from ${operator}`,
              progress: Math.min(prev.progress + 10, 70),
            }));
          } else if (stage === 'aggregating') {
            setProgress({
              stage: 'aggregating',
              message: 'Aggregating operator signatures...',
              progress: 80,
            });
          } else if (stage === 'complete') {
            setProgress({
              stage: 'complete',
              message: 'Validation complete!',
              progress: 100,
            });
          }
        }
      );

      setResult(validationResult);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setTimeout(() => setIsValidating(false), 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Demo Scenarios */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Demo Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario)}
              className={`
                p-4 rounded-lg border-2 text-left transition-all
                ${selectedScenario.id === scenario.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }
              `}
            >
              <div className="font-semibold mb-1">{scenario.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {scenario.description}
              </div>
              <div className="text-xs text-gray-500">
                Expected: {scenario.expectedConfidence}% confidence
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Strategy Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Strategy Details</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Portfolio</div>
            <div className="space-y-1 mt-2">
              <div className="text-sm">
                <span className="font-medium">eETH:</span> {selectedScenario.portfolio.eethBalance}
              </div>
              <div className="text-sm">
                <span className="font-medium">weETH:</span> {selectedScenario.portfolio.weethBalance}
              </div>
              <div className="text-sm">
                <span className="font-medium">APY:</span> {selectedScenario.portfolio.currentAPY}%
              </div>
              <div className="text-sm">
                <span className="font-medium">Gas:</span> {selectedScenario.portfolio.gasPrice} gwei
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Proposed Action</div>
            <div className="space-y-1 mt-2">
              <div className="text-sm">
                <span className="font-medium">Action:</span> {selectedScenario.strategy.action}
              </div>
              <div className="text-sm">
                <span className="font-medium">Amount:</span> {selectedScenario.strategy.amount} ETH
              </div>
              <div className="text-sm">
                <span className="font-medium">Protocol:</span> {selectedScenario.strategy.protocol}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reasoning</div>
          <div className="text-sm italic">{selectedScenario.strategy.reasoning}</div>
        </div>
      </div>

      {/* Validation Control */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Live Validation</h3>
          {operators.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {operators.filter(op => op.isActive).length} operators ready
            </div>
          )}
        </div>

        <button
          onClick={startValidation}
          disabled={isValidating || operators.length === 0}
          className={`
            w-full py-4 rounded-lg font-semibold text-lg transition-all
            ${isValidating || operators.length === 0
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isValidating ? 'Validating...' : 'Start AI Validation'}
        </button>

        {/* Progress Indicator */}
        {(isValidating || result) && (
          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {progress.message}
                </span>
                <span className="text-sm font-semibold">{Math.round(progress.progress)}%</span>
              </div>
            </div>

            {/* Operator Activity Feed */}
            {progress.stage === 'validating' && progress.currentOperator && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                  <span className="text-sm font-medium">
                    {progress.currentOperator} processing with Claude Sonnet 4...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Validation Result */}
      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Validation Result</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Completed in {(result.processingTime / 1000).toFixed(2)}s
              </span>
            </div>
          </div>

          {/* Confidence Score Visualization */}
          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Confidence Score</span>
              <span className="text-3xl font-bold">
                {result.confidenceScore}
                <span className="text-lg text-gray-500">/100</span>
              </span>
            </div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-out ${
                  result.confidenceScore >= 80
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : result.confidenceScore >= 60
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                    : 'bg-gradient-to-r from-red-400 to-red-600'
                }`}
                style={{ width: `${result.confidenceScore}%` }}
              />
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <span className={`
              px-4 py-2 rounded-full font-semibold inline-flex items-center gap-2
              ${result.isValid
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }
            `}>
              {result.isValid ? '✓' : '✗'}
              {result.isValid ? 'Strategy Approved' : 'Strategy Rejected'}
            </span>
          </div>

          {/* Risks */}
          {result.risks.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-yellow-500">⚠</span>
                Identified Risks
              </h4>
              <div className="space-y-2">
                {result.risks.map((risk: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                  >
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span className="text-sm">{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternative Strategy */}
          {result.alternativeStrategy && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-blue-500">💡</span>
                AI Recommendation
              </h4>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm">{result.alternativeStrategy}</p>
              </div>
            </div>
          )}

          {/* Participating Operators */}
          <div>
            <h4 className="font-semibold mb-3">
              Participating Operators ({result.participatingOperators.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {result.participatingOperators.map((address: string, idx: number) => {
                const operator = operators.find(op => op.address === address);
                return (
                  <div
                    key={idx}
                    className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"
                  >
                    {operator ? (
                      <div className="flex items-center gap-2">
                        <Image src={operator.avatar} alt={operator.name} width={24} height={24} className="w-6 h-6 rounded-full" />
                        <span className="text-xs font-medium truncate">{operator.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs font-mono">
                        {address.slice(0, 6)}...{address.slice(-4)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
