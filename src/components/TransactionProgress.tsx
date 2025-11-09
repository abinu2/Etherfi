'use client';

import { useEffect, useState } from 'react';
import { getEtherscanTxUrl, formatTxHash } from '@/lib/ethereum';

export type TransactionStep = {
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  txHash?: string;
  error?: string;
};

interface TransactionProgressProps {
  steps: TransactionStep[];
  chainId?: number;
  onClose?: () => void;
  isOpen?: boolean;
}

export default function TransactionProgress({
  steps,
  chainId = 1,
  onClose,
  isOpen = true
}: TransactionProgressProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  const allCompleted = steps.every(step => step.status === 'completed');
  const anyFailed = steps.some(step => step.status === 'failed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {anyFailed ? 'Transaction Failed' : allCompleted ? 'Transaction Complete' : 'Processing Transaction'}
          </h2>
          {(allCompleted || anyFailed) && onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          )}
        </div>

        {/* Progress Steps */}
        <div className="p-6 space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                  ${step.status === 'completed' ? 'bg-green-500' :
                    step.status === 'in_progress' ? 'bg-blue-500' :
                    step.status === 'failed' ? 'bg-red-500' :
                    'bg-gray-300 dark:bg-gray-600'}
                `}>
                  {step.status === 'completed' && (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {step.status === 'in_progress' && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {step.status === 'failed' && (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {step.status === 'pending' && (
                    <div className="w-3 h-3 bg-gray-500 dark:bg-gray-400 rounded-full" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    step.status === 'failed' ? 'text-red-700 dark:text-red-400' :
                    'text-gray-900 dark:text-white'
                  }`}>
                    {step.label}
                  </h3>

                  {step.txHash && (
                    <a
                      href={getEtherscanTxUrl(step.txHash, chainId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
                    >
                      View on Etherscan: {formatTxHash(step.txHash)}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}

                  {step.error && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {step.error}
                    </p>
                  )}

                  {step.status === 'in_progress' && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Please wait...
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`
                  absolute left-4 top-8 w-0.5 h-8
                  ${step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        {allCompleted && (
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold">All transactions completed successfully!</p>
            </div>
          </div>
        )}

        {anyFailed && (
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold">Transaction failed. Please try again.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact version for inline display
export function TransactionProgressInline({ steps, chainId = 1 }: { steps: TransactionStep[]; chainId?: number }) {
  const currentStep = steps.find(s => s.status === 'in_progress') || steps[steps.length - 1];

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
            {currentStep.label}
          </p>
          {currentStep.txHash && (
            <a
              href={getEtherscanTxUrl(currentStep.txHash, chainId)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {formatTxHash(currentStep.txHash)}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
