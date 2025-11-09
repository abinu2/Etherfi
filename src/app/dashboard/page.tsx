'use client';

import { useState } from 'react';
import Link from 'next/link';
import WalletConnect from '@/components/WalletConnect';
import GasMonitor from '@/components/GasMonitor';
import NetworkStatus from '@/components/NetworkStatus';
import EnhancedPortfolioCard from '@/components/EnhancedPortfolioCard';
import PortfolioAnalytics from '@/components/PortfolioAnalytics';
import AIStrategyAnalytics from '@/components/AIStrategyAnalytics';
import StrategyVerificationAVS from '@/components/StrategyVerificationAVS';
import AIAssistant from '@/components/AIAssistant';
import MobileNav from '@/components/MobileNav';

export default function Dashboard() {
  const [connectedAddress, setConnectedAddress] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">
      {/* Animated Background */}
      <div className="fixed inset-0 organic-mesh pointer-events-none opacity-50" />

      {/* Header */}
      <header className="glass-modern dark:glass-modern-dark shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center soft-glow group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-violet-600 bg-clip-text text-transparent">
                Lumina Finance
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <MobileNav connectedAddress={connectedAddress} />
              <div className="hidden md:flex items-center gap-4">
                <NetworkStatus showGasPrice={true} showEthPrice={true} />
                <WalletConnect onConnect={setConnectedAddress} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 relative z-10">
        {!connectedAddress ? (
          <div className="text-center py-8">
            <div className="max-w-2xl mx-auto handcrafted-card rounded-3xl p-8 soft-glow animate-reveal">
              <div className="text-6xl mb-6 liquid-shape inline-block">🔗</div>
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Connect Your Wallet</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Unlock intelligent DeFi strategies with our Strategy DNA™ profiling system
              </p>
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <strong>Strategy DNA Analysis</strong> - Multi-dimensional scoring
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
                  <p className="text-sm text-violet-800 dark:text-violet-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                    <strong>AI-Powered Insights</strong> - Personalized recommendations
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
                  <p className="text-sm text-cyan-800 dark:text-cyan-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                    <strong>Gas Optimization</strong> - Cost-efficient execution
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Portfolio Overview */}
            <div className="grid lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <EnhancedPortfolioCard address={connectedAddress} />
              </div>
              <div>
                <GasMonitor />
              </div>
            </div>

            {/* Core AVS - Strategy Verification & Execution */}
            <StrategyVerificationAVS />

            {/* Portfolio Analytics with Predictions */}
            <PortfolioAnalytics />

            {/* AI Strategy Recommendations */}
            <AIStrategyAnalytics />
          </div>
        )}

        {/* AI Assistant - Global */}
        <AIAssistant />
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 glass-modern dark:glass-modern-dark border-t border-gray-200 dark:border-gray-800 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Lumina Finance
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Intelligent DeFi Strategy Platform • Strategy DNA™
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
