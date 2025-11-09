import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      {/* Organic Background Elements */}
      <div className="absolute inset-0 organic-mesh pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl blob" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl blob" style={{animationDelay: '2s'}} />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <nav className="flex justify-between items-center mb-16 animate-reveal">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center soft-glow">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-violet-600 bg-clip-text text-transparent">
                Lumina Finance
              </span>
            </div>
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all soft-glow-hover"
            >
              Launch App
            </Link>
          </nav>

          {/* Hero Section */}
          <div className="text-center mb-20 animate-reveal" style={{animationDelay: '0.1s'}}>
            <div className="inline-block mb-6">
              <span className="px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Powered by EigenLayer AVS & Claude AI
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              <span className="relative inline-block">
                <span className="hand-underline bg-gradient-to-r from-emerald-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent">
                  Intelligent DeFi
                </span>
              </span>
              <br />
              Secured by Decentralized Validation
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              AI-powered strategy analysis with <strong>Strategy DNA™</strong> profiling, validated by a
              decentralized operator network through <strong>EigenLayer AVS</strong> for trust-minimized DeFi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="group px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all soft-glow-hover flex items-center gap-2"
              >
                <span>Analyze Your Portfolio</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#features"
                className="px-8 py-4 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all magnetic-hover border border-gray-200 dark:border-gray-700"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="mb-20 animate-reveal" style={{animationDelay: '0.2s'}}>
            <div className="relative">
              <div className="handcrafted-card rounded-3xl p-8 soft-glow">
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { icon: '🧬', title: 'Strategy DNA™', desc: 'Multi-dimensional profiling', color: 'emerald' },
                    { icon: '🔐', title: 'AVS Security', desc: 'Decentralized validators', color: 'blue' },
                    { icon: '🤖', title: 'AI Assistant', desc: 'Claude-powered insights', color: 'violet' },
                    { icon: '⚡', title: 'Gas Optimized', desc: 'Cost-efficient execution', color: 'amber' }
                  ].map((item, i) => (
                    <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:scale-105 transition-transform magnetic-hover">
                      <div className="text-5xl mb-4 liquid-shape inline-block">{item.icon}</div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="mb-20">
            <div className="text-center mb-12 animate-reveal">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Intelligent Features, Secure Infrastructure
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                AI-powered analysis meets decentralized validation through EigenLayer AVS
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Strategy DNA™ Profiling',
                  description: 'Multi-dimensional analysis scoring strategies across yield potential, risk-adjusted returns, gas efficiency, and time alignment',
                  icon: '🧬',
                  gradient: 'from-emerald-500 to-teal-500'
                },
                {
                  title: 'EigenLayer AVS Security',
                  description: 'Decentralized operator network validates strategies with on-chain attestations, slashing protection, and cryptographic proofs',
                  icon: '🔐',
                  gradient: 'from-blue-500 to-indigo-500'
                },
                {
                  title: 'Portfolio Genome Analysis',
                  description: 'Visual DNA-style representation of your asset allocation with composition analysis and compatibility scoring',
                  icon: '📊',
                  gradient: 'from-cyan-500 to-blue-500'
                },
                {
                  title: 'Adaptive AI Chatbot',
                  description: 'Tiered explanations adapting to your experience level - beginner, intermediate, or advanced with personalized guidance',
                  icon: '🤖',
                  gradient: 'from-violet-500 to-purple-500'
                },
                {
                  title: 'Gas Optimization Engine',
                  description: 'Cost-benefit analysis for every strategy with optimal execution timing and multi-RPC intelligent routing',
                  icon: '⚡',
                  gradient: 'from-amber-500 to-orange-500'
                },
                {
                  title: 'Multi-Operator Consensus',
                  description: 'Independent validators aggregate results for high-confidence recommendations with transparent consensus scoring',
                  icon: '🎯',
                  gradient: 'from-indigo-500 to-violet-500'
                }
              ].map((feature, i) => (
                <div
                  key={i}
                  className="handcrafted-card rounded-2xl p-6 soft-glow-hover magnetic-hover animate-reveal"
                  style={{animationDelay: `${0.1 * i}s`}}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 text-2xl soft-glow`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* How Lumina Works */}
          <div className="mb-20">
            <div className="handcrafted-card rounded-3xl p-12 soft-glow animate-reveal">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                How Lumina Works
              </h2>

              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { step: '01', title: 'Portfolio Analysis', desc: 'AI analyzes your portfolio with Strategy DNA™ profiling', icon: '🧬' },
                  { step: '02', title: 'Strategy Generation', desc: 'Claude AI generates personalized DeFi strategies', icon: '🤖' },
                  { step: '03', title: 'AVS Validation', desc: 'Decentralized operators validate and sign attestations', icon: '🔐' },
                  { step: '04', title: 'Execute & Monitor', desc: 'Gas-optimized execution with real-time monitoring', icon: '⚡' }
                ].map((item, i) => (
                  <div key={i} className="text-center group">
                    <div className="relative mb-6">
                      <div className="text-6xl mb-2 liquid-shape inline-block group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div className="font-handwritten text-5xl text-emerald-500 dark:text-emerald-400 absolute -top-4 -right-4">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* EigenLayer AVS Architecture Section */}
          <div id="avs-architecture" className="mb-20">
            <div className="handcrafted-card rounded-3xl p-12 soft-glow accent-line animate-reveal">
              <div className="ml-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-3xl soft-glow">
                    🔐
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Secured by EigenLayer AVS
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Decentralized trust for your DeFi strategies
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <h3 className="font-bold text-lg mb-3 text-blue-900 dark:text-blue-300 flex items-center gap-2">
                      <span className="text-2xl">🛡️</span>
                      Trust-Minimized Validation
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-400">
                      Decentralized operator network validates AI-generated strategies, ensuring safety without centralized control. Each strategy is analyzed by multiple independent validators.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <h3 className="font-bold text-lg mb-3 text-blue-900 dark:text-blue-300 flex items-center gap-2">
                      <span className="text-2xl">📝</span>
                      On-Chain Attestations
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-400">
                      Cryptographically signed validations stored permanently on-chain. Every strategy recommendation comes with verifiable proof from staked operators.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <h3 className="font-bold text-lg mb-3 text-blue-900 dark:text-blue-300 flex items-center gap-2">
                      <span className="text-2xl">⚖️</span>
                      Slashing Protection
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-400">
                      Malicious validators lose staked ETH, creating strong economic incentives for honest validation. Your strategies are protected by aligned incentives.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <h3 className="font-bold text-lg mb-3 text-blue-900 dark:text-blue-300 flex items-center gap-2">
                      <span className="text-2xl">🔄</span>
                      Restaking Security
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-400">
                      Built on EigenLayer&apos;s restaking infrastructure, leveraging Ethereum&apos;s security for DeFi strategy validation with programmable trust.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-400 text-center flex items-center justify-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 font-medium">
                      Powered by EigenLayer
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 font-medium">
                      AVS Architecture
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 font-medium">
                      Decentralized Operators
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 font-medium">
                      Cryptographic Proofs
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mb-20 animate-reveal">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-violet-500/20 rounded-3xl blur-xl"></div>
              <div className="relative handcrafted-card rounded-3xl p-12 soft-glow">
                <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Ready for Intelligent DeFi?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Experience AI-powered strategy analysis with Strategy DNA™ profiling, secured by decentralized validation
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 text-white font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all soft-glow-hover"
                >
                  <span>Launch Dashboard</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="pt-12 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Lumina Finance
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Strategy DNA™ • EigenLayer AVS • Claude AI • Built on EtherFi
              </p>

              <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
                <a href="#" className="hover:text-emerald-500 transition-colors hand-underline">Docs</a>
                <a href="#" className="hover:text-emerald-500 transition-colors hand-underline">About</a>
                <a href="#" className="hover:text-emerald-500 transition-colors hand-underline">Support</a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                © 2025 Lumina Finance. Intelligent DeFi Strategy Platform.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
