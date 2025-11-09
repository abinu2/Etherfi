'use client';

import { useState } from 'react';
import Link from 'next/link';
import DemoModeToggle from '@/components/DemoModeToggle';
import SimulatedOperatorNetwork from '@/components/SimulatedOperatorNetwork';
import LiveValidationSimulator from '@/components/LiveValidationSimulator';
import TVLChart from '@/components/TVLChart';
import WalletConnect from '@/components/WalletConnect';

export default function DemoPage() {
  const [connectedAddress, setConnectedAddress] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'validation' | 'operators'>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <DemoModeToggle />

      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">V</span>
                </div>
                <div>
                  <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Veritas AVS
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    AI-Powered Strategy Validation
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>EigenLayer Mainnet</span>
              </div>
              <WalletConnect onConnect={setConnectedAddress} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Decentralized AI Strategy Validation
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Powered by EigenLayer AVS • Secured by Restaked ETH • Validated by Claude Sonnet 4
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="text-sm text-blue-100">Validation Speed</div>
                  <div className="font-bold">~3 seconds</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-2xl">🛡️</span>
                <div>
                  <div className="text-sm text-blue-100">Security Model</div>
                  <div className="font-bold">Restaked ETH</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-2xl">🤖</span>
                <div>
                  <div className="text-sm text-blue-100">AI Model</div>
                  <div className="font-bold">Claude Sonnet 4</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-[73px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'overview' as const, label: 'Overview', icon: '📊' },
              { id: 'validation' as const, label: 'Live Validation', icon: '🔍' },
              { id: 'operators' as const, label: 'Operator Network', icon: '🌐' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 font-medium transition-all border-b-2
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* TVL Chart */}
            <TVLChart />

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">⚡</span>
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full font-semibold">
                    +12.5%
                  </span>
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Validations</div>
                <div className="text-3xl font-bold">12,847</div>
                <div className="text-xs text-gray-500 mt-2">Last 30 days</div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">✓</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-semibold">
                    High
                  </span>
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Success Rate</div>
                <div className="text-3xl font-bold">97.8%</div>
                <div className="text-xs text-gray-500 mt-2">Industry leading</div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">⏱️</span>
                  <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full font-semibold">
                    Fast
                  </span>
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Avg Response Time</div>
                <div className="text-3xl font-bold">2.8s</div>
                <div className="text-xs text-gray-500 mt-2">Real-time validation</div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">How Veritas AVS Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    step: '1',
                    title: 'Submit Strategy',
                    description: 'User proposes a DeFi strategy through the dashboard',
                    icon: '📝',
                    color: 'blue',
                  },
                  {
                    step: '2',
                    title: 'Broadcast to Operators',
                    description: 'Task is broadcast to registered EigenLayer operators',
                    icon: '📡',
                    color: 'purple',
                  },
                  {
                    step: '3',
                    title: 'AI Validation',
                    description: 'Operators analyze with Claude AI and sign results',
                    icon: '🤖',
                    color: 'green',
                  },
                  {
                    step: '4',
                    title: 'On-Chain Attestation',
                    description: 'Aggregated results stored permanently on blockchain',
                    icon: '⛓️',
                    color: 'yellow',
                  },
                ].map((item) => (
                  <div key={item.step} className="relative">
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-16 h-16 rounded-full bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center mb-3`}>
                        <span className="text-3xl">{item.icon}</span>
                      </div>
                      <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>🛡️</span>
                  Economic Security
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Operators stake ETH to participate in validation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Malicious behavior results in stake slashing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Quorum-based consensus ensures accuracy</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>🤖</span>
                  AI-Powered Analysis
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Claude Sonnet 4 analyzes strategy safety and profitability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Considers gas costs, market conditions, and risks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Provides alternative recommendations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'validation' && (
          <div>
            <LiveValidationSimulator />
          </div>
        )}

        {activeTab === 'operators' && (
          <div>
            <SimulatedOperatorNetwork />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-3">Veritas AVS</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Decentralized AI-powered strategy validation secured by EigenLayer restaking.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Powered By</h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div>• EigenLayer AVS Framework</div>
                <div>• Anthropic Claude Sonnet 4</div>
                <div>• EtherFi Liquid Staking</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3">Resources</h4>
              <div className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                <div><Link href="/">Documentation</Link></div>
                <div><Link href="/">GitHub</Link></div>
                <div><Link href="/">Discord</Link></div>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p>Built for hackathon demonstration • Not audited • Use at your own risk</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
