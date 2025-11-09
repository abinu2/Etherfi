'use client';

import { useState } from 'react';
import Link from 'next/link';
import WalletConnect from '@/components/WalletConnect';
import ValidationResults from '@/components/ValidationResults';
import GasMonitor from '@/components/GasMonitor';
import NetworkStatus from '@/components/NetworkStatus';
import EnhancedPortfolioCard from '@/components/EnhancedPortfolioCard';
import WalletHoldings from '@/components/WalletHoldings';
import InteractiveAVSDashboard from '@/components/InteractiveAVSDashboard';
import EtherFiStakingDashboard from '@/components/EtherFiStakingDashboard';
import EtherFiDepositInterface from '@/components/EtherFiDepositInterface';
import EtherFiLendingProtocol from '@/components/EtherFiLendingProtocol';
import OperatorMonitor from '@/components/OperatorMonitor';
import StrategySimulator from '@/components/StrategySimulator';
import PortfolioAnalytics from '@/components/PortfolioAnalytics';
import AIStrategyAnalytics from '@/components/AIStrategyAnalytics';
import AIAssistant from '@/components/AIAssistant';
import MobileNav from '@/components/MobileNav';
import DeFiStrategyBuilder from '@/components/DeFiStrategyBuilder';

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
      <main className="container mx-auto px-4 py-8 relative z-10">
        {!connectedAddress ? (
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto handcrafted-card rounded-3xl p-12 soft-glow animate-reveal">
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
            {/* Portfolio Overview - Enhanced */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <EnhancedPortfolioCard address={connectedAddress} />
              </div>
              <div>
                <GasMonitor />
              </div>
            </div>

            {/* Wallet Holdings */}
            <WalletHoldings address={connectedAddress} />

            {/* Interactive AVS Yield Optimizer */}
            <InteractiveAVSDashboard />

            {/* AI-Powered Strategy Analytics */}
            <AIStrategyAnalytics />

            {/* EtherFi Fixed-Rate Lending Protocol */}
            <EtherFiLendingProtocol />

            {/* EtherFi Deposit & Staking Interface */}
            <EtherFiDepositInterface />

            {/* EtherFi Staking Dashboard */}
            <EtherFiStakingDashboard walletAddress={connectedAddress} />

            {/* Portfolio Analytics */}
            <PortfolioAnalytics />

            {/* Strategy Tools Grid */}
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

            {/* Lumina Features Card */}
            <div className="handcrafted-card rounded-3xl p-8 soft-glow accent-line">
              <div className="ml-8">
                <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-2xl flex items-center gap-3">
                  <span className="text-3xl">✨</span>
                  <span className="hand-underline">How Lumina Works</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Strategy DNA Analysis',
                      desc: 'Unique multi-dimensional profiling with yield, risk, and gas efficiency scoring',
                      icon: '🧬',
                      color: 'emerald'
                    },
                    {
                      title: 'AI-Powered Chatbot',
                      desc: 'Intelligent assistant with tiered explanations adapting to your experience',
                      icon: '🤖',
                      color: 'violet'
                    },
                    {
                      title: 'Portfolio Genome',
                      desc: 'Visual DNA-style representation of your asset allocation and composition',
                      icon: '📊',
                      color: 'cyan'
                    },
                    {
                      title: 'Gas Optimization',
                      desc: 'Cost-benefit analysis and optimal execution timing built into every recommendation',
                      icon: '⚡',
                      color: 'amber'
                    }
                  ].map((feature, i) => (
                    <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:scale-105 transition-transform magnetic-hover">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl liquid-shape">{feature.icon}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2 flex-wrap justify-center">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium">
                      Powered by Claude AI
                    </span>
                    <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium">
                      Built on EtherFi
                    </span>
                    <span className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 font-medium">
                      Strategy DNA™
                    </span>
                  </p>
                </div>
              </div>
            </div>
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
