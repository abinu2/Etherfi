'use client';

import { useState } from 'react';
import Link from 'next/link';
import WalletConnect from '@/components/WalletConnect';
import ValidationTaskSubmitter from '@/components/ValidationTaskSubmitter';
import ValidationResults from '@/components/ValidationResults';
import GasMonitor from '@/components/GasMonitor';

export default function Dashboard() {
  const [connectedAddress, setConnectedAddress] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              EtherFi AVS Validator
            </Link>
            <WalletConnect onConnect={setConnectedAddress} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!connectedAddress ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-8">
              Connect to submit strategies for AI-powered validation via AVS
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Submit Task */}
            <div className="space-y-6">
              <ValidationTaskSubmitter />
              <GasMonitor />
            </div>

            {/* Right Column - View Results */}
            <div className="space-y-6">
              <ValidationResults />

              {/* Info Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-2">How It Works</h3>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Submit your strategy for validation</li>
                  <li>Operators run Claude AI to analyze it</li>
                  <li>Operators sign attestations on-chain</li>
                  <li>View validated results with confidence scores</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>EtherFi AVS - AI-Powered Strategy Validation via EigenLayer</p>
        </div>
      </footer>
    </div>
  );
}
