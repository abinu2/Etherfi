'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import AnimatedNumber, { AnimatedCurrency, AnimatedPercentage } from './AnimatedNumber';

interface AVSService {
  id: string;
  name: string;
  description: string;
  category: string;
  totalStake: number;
  apy: number;
  validators: number;
  uptime: number;
  verified: boolean;
  icon: string;
}

const AVS_SERVICES: AVSService[] = [
  {
    id: 'eigenda',
    name: 'EigenDA',
    description: 'Decentralized data availability layer for rollups with high throughput',
    category: 'Data Availability',
    totalStake: 2500000,
    apy: 4.2,
    validators: 85,
    uptime: 99.98,
    verified: true,
    icon: '📊'
  },
  {
    id: 'hyperlane',
    name: 'Hyperlane',
    description: 'Permissionless interoperability layer for cross-chain messaging',
    category: 'Interoperability',
    totalStake: 1800000,
    apy: 3.8,
    validators: 62,
    uptime: 99.95,
    verified: true,
    icon: '🌉'
  },
  {
    id: 'lagrange',
    name: 'Lagrange',
    description: 'ZK-powered state committee network for cross-chain state verification',
    category: 'ZK Proofs',
    totalStake: 1500000,
    apy: 5.1,
    validators: 48,
    uptime: 99.92,
    verified: true,
    icon: '🔐'
  },
  {
    id: 'witnet',
    name: 'Witnet',
    description: 'Decentralized oracle network providing tamper-proof price feeds',
    category: 'Oracles',
    totalStake: 1200000,
    apy: 4.5,
    validators: 71,
    uptime: 99.97,
    verified: true,
    icon: '🔮'
  },
  {
    id: 'eoracle',
    name: 'eOracle',
    description: 'Modular oracle protocol secured by Ethereum validators',
    category: 'Oracles',
    totalStake: 980000,
    apy: 3.9,
    validators: 54,
    uptime: 99.94,
    verified: true,
    icon: '📡'
  },
  {
    id: 'brevis',
    name: 'Brevis',
    description: 'Smart ZK coprocessor for data-driven dApps and chain abstraction',
    category: 'ZK Proofs',
    totalStake: 850000,
    apy: 4.8,
    validators: 39,
    uptime: 99.89,
    verified: true,
    icon: '⚡'
  }
];

export default function AVSServicesDashboard() {
  const [services, setServices] = useState<AVSService[]>(AVS_SERVICES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 800);

    // Simulate live updates every 10 seconds
    const interval = setInterval(() => {
      setServices(prevServices =>
        prevServices.map(service => ({
          ...service,
          totalStake: service.totalStake * (1 + (Math.random() - 0.5) * 0.001),
          uptime: Math.min(100, service.uptime + (Math.random() - 0.5) * 0.02),
          validators: service.validators + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const categories = ['all', ...Array.from(new Set(services.map(s => s.category)))];
  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  const totalStakeAcrossAVS = services.reduce((sum, s) => sum + s.totalStake, 0);
  const averageAPY = services.reduce((sum, s) => sum + s.apy, 0) / services.length;
  const totalValidators = services.reduce((sum, s) => sum + s.validators, 0);

  if (isLoading) {
    return (
      <div className="handcrafted-card rounded-3xl p-8">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading AVS network..." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="handcrafted-card rounded-3xl p-6 soft-glow accent-line">
        <div className="ml-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            <span className="hand-underline">EigenLayer AVS Ecosystem</span>
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💰</span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Stake Securing AVS</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                $<AnimatedNumber value={totalStakeAcrossAVS * 3500} decimals={0} />
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                <AnimatedNumber value={totalStakeAcrossAVS} decimals={0} /> ETH
              </p>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏢</span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Active AVS Services</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {services.length}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                All verified ✓
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📈</span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Average Rewards APY</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <AnimatedPercentage value={averageAPY} />
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                On top of staking
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">👥</span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Node Operators</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalValidators}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Professional validators
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Your Stake Powers These Services
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  When you stake ETH with EtherFi, your deposited assets are used by professional node operators to secure these AVS services through EigenLayer&apos;s restaking mechanism. You earn additional rewards without any extra action required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category === 'all' ? 'All Services' : category}
          </button>
        ))}
      </div>

      {/* AVS Services Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="handcrafted-card rounded-2xl p-6 hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-2xl">
                  {service.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                      {service.name}
                    </h4>
                    {service.verified && (
                      <span className="text-blue-500" title="Verified AVS">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {service.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  +<AnimatedPercentage value={service.apy} />
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Extra APY</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              {service.description}
            </p>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Stake</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  <AnimatedNumber value={service.totalStake / 1000} decimals={0} />K ETH
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Operators</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {service.validators}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Uptime</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  <AnimatedPercentage value={service.uptime} />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How AVS Works */}
      <div className="handcrafted-card rounded-3xl p-6">
        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>🎓</span>
          Understanding Actively Validated Services (AVS)
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                What are AVS?
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AVS are decentralized services built on EigenLayer that leverage pooled ETH stake for cryptoeconomic security. Services like data availability layers, oracles, bridges, and ZK provers use your staked ETH to secure their networks.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                How Does Restaking Work?
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                When you stake with EtherFi, your ETH secures the Ethereum network. Through EigenLayer, this same stake is &ldquo;restaked&rdquo; to secure additional AVS services, earning you extra rewards without additional capital.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                Who Runs the Validators?
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Professional node operators registered with EtherFi run the actual validators using DVT (Distributed Validator Technology). As a depositor, you don&apos;t need to run any infrastructure - just stake and earn.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                What are the Risks?
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AVS services have their own slashing conditions. However, EtherFi&apos;s node operators maintain high performance standards and the protocol includes safeguards to minimize risk. Your rewards increase proportionally to risk taken.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
