'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ABI = [
  "function getValidationResult(uint256) external view returns (tuple(uint256 taskId, bool isValid, uint256 confidenceScore, string[] risks, string alternativeStrategy, address[] operators, bytes aggregatedSignature, uint256 validatedAt))"
];

export default function ValidationResults() {
  const [taskId, setTaskId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchResult = async () => {
    if (!taskId) return;

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contractAddress = process.env.NEXT_PUBLIC_AVS_CONTRACT_ADDRESS || '';
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
    } catch (error) {
      console.error('Error fetching result:', error);
      alert('No validation result found for this task ID');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Check Validation Result</h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          placeholder="Enter Task ID"
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchResult}
          disabled={isLoading || !taskId}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {isLoading ? 'Loading...' : 'Check'}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">Validation Result</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {result.isValid ? '✅ Valid' : '❌ Not Recommended'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-600">Task ID</p>
                <p className="font-mono font-semibold">{result.taskId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Confidence Score</p>
                <p className="font-semibold text-2xl">{result.confidenceScore}%</p>
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
