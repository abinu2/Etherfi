'use client';

import { useState } from 'react';
import Link from 'next/link';
import WalletConnect from '@/components/WalletConnect';
import ValidationTaskSubmitter from '@/components/ValidationTaskSubmitter';
import ValidationResults from '@/components/ValidationResults';
import GasMonitor from '@/components/GasMonitor';
import NetworkStatus from '@/components/NetworkStatus';
import GasPriceChart from '@/components/GasPriceChart';
import PortfolioCard from '@/components/PortfolioCard';
import OperatorGrid from '@/components/OperatorGrid';
import OperatorMonitor from '@/components/OperatorMonitor';
import StrategySimulator from '@/components/StrategySimulator';
import PortfolioAnalytics from '@/components/PortfolioAnalytics';
import AIAssistant from '@/components/AIAssistant';
import MobileNav from '@/components/MobileNav';

export default function Dashboard() {
  const [connectedAddress, setConnectedAddress] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              EtherFi AVS Validator
            </Link>
            <div className="flex items-center gap-4">
              <MobileNav connectedAddress={connectedAddress} />
              <div className="hidden md:flex items-center gap-4">
                <NetworkStatus showGasPrice={true} />
                <WalletConnect onConnect={setConnectedAddress} />
              </div>
            </div>
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
          <div className="space-y-6">
            {/* Portfolio Overview */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PortfolioCard address={connectedAddress} />
              </div>
              <div>
                <GasMonitor />
              </div>
            </div>

            {/* Portfolio Analytics */}
            <PortfolioAnalytics />

            {/* Main Dashboard Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Submit Task & Simulator */}
              <div className="space-y-6">
                <ValidationTaskSubmitter />
                <StrategySimulator />
                <GasPriceChart />
              </div>

              {/* Right Column - Results & Monitor */}
              <div className="space-y-6">
                <ValidationResults />
                <OperatorMonitor />
              </div>
            </div>

            {/* Operator Grid */}
            <OperatorGrid maxOperators={6} />

            {/* Info Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">How It Works</h3>
              <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-2 list-decimal list-inside">
                <li>Submit your strategy for validation</li>
                <li>Operators run Claude AI to analyze it</li>
                <li>Operators sign attestations on-chain</li>
                <li>View validated results with confidence scores</li>
              </ol>
            </div>
          </div>
        )}

        {/* AI Assistant - Global */}
        <AIAssistant />
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
