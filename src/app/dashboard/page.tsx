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
import DeFiStrategyBuilder from '@/components/DeFiStrategyBuilder';
import OperatorStaking from '@/components/OperatorStaking';

export default function Dashboard() {
  const [connectedAddress, setConnectedAddress] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              Veritas AVS
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
              <div className="lg:col-span-3">
                <PortfolioCard address={connectedAddress} />
              </div>
            </div>

            {/* Portfolio Analytics */}
            <PortfolioAnalytics />

            {/* Core AVS Features - Operator Staking */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <OperatorStaking />
              </div>
              <div>
                <GasMonitor />
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Strategy Builder & Simulator */}
              <div className="space-y-6">
                <DeFiStrategyBuilder />
                <StrategySimulator />
              </div>

              {/* Right Column - Results & Monitor */}
              <div className="space-y-6">
                <ValidationResults />
                <OperatorMonitor />
              </div>
            </div>

            {/* Gas Price Analysis */}
            <GasPriceChart />

            {/* Operator Grid */}
            <OperatorGrid maxOperators={6} />

            {/* AVS Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3 text-lg">
                ⚡ How Veritas AVS Works
              </h3>
              <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-3 list-decimal list-inside">
                <li>
                  <strong>Build Strategy:</strong> Create cross-protocol DeFi strategies with our builder
                </li>
                <li>
                  <strong>AI Validation:</strong> Decentralized operators run Claude AI to analyze safety and profitability
                </li>
                <li>
                  <strong>On-Chain Attestation:</strong> Operators stake ETH and sign cryptographic attestations
                </li>
                <li>
                  <strong>Trustless Execution:</strong> Execute validated strategies with confidence scores
                </li>
                <li>
                  <strong>Slashing Protection:</strong> Malicious operators lose staked ETH, ensuring honest validation
                </li>
              </ol>
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Powered by EigenLayer AVS • Secured by EtherFi Restaking • Validated by Claude Sonnet 4
                </p>
              </div>
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
