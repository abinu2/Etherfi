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
                <span className="hand-underline bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                  Trust-Minimized
                </span>
              </span>
              <br />
              DeFi Strategy Validation
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Decentralized operator network validates AI-generated DeFi strategies through <strong>EigenLayer AVS</strong>.
              On-chain attestations with cryptographic proof and slashing protection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="group px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all soft-glow-hover flex items-center gap-2"
              >
                <span>Launch Validator</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#avs-architecture"
                className="px-8 py-4 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all magnetic-hover border border-gray-200 dark:border-gray-700"
              >
                How AVS Works
              </a>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="mb-20 animate-reveal" style={{animationDelay: '0.2s'}}>
            <div className="relative">
              <div className="handcrafted-card rounded-3xl p-8 soft-glow">
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { icon: '🔐', title: 'Decentralized Operators', desc: 'Independent validator network', color: 'blue' },
                    { icon: '📝', title: 'On-Chain Proofs', desc: 'Cryptographic attestations', color: 'indigo' },
                    { icon: '⚖️', title: 'Slashing Protection', desc: 'Economic security', color: 'violet' },
                    { icon: '🤖', title: 'AI Validation', desc: 'Claude-powered analysis', color: 'purple' }
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
                EigenLayer AVS Architecture
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Decentralized validation infrastructure for trust-minimized DeFi
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Decentralized Operator Network',
                  description: 'Independent validators run the AVS infrastructure, analyzing strategies without centralized control or single points of failure',
                  icon: '🔐',
                  gradient: 'from-blue-500 to-indigo-500'
                },
                {
                  title: 'On-Chain Attestations',
                  description: 'Cryptographically signed validations stored permanently on-chain with verifiable proof from staked operators',
                  icon: '📝',
                  gradient: 'from-indigo-500 to-violet-500'
                },
                {
                  title: 'Slashing Mechanism',
                  description: 'Economic security through staked ETH - malicious validators lose their stake, ensuring honest validation',
                  icon: '⚖️',
                  gradient: 'from-violet-500 to-purple-500'
                },
                {
                  title: 'Restaking Infrastructure',
                  description: 'Built on EigenLayer\'s restaking protocol, leveraging Ethereum security for programmable trust',
                  icon: '🔄',
                  gradient: 'from-purple-500 to-pink-500'
                },
                {
                  title: 'AI-Powered Validation',
                  description: 'Claude Sonnet 4 analyzes strategy safety and profitability with advanced reasoning capabilities',
                  icon: '🤖',
                  gradient: 'from-emerald-500 to-teal-500'
                },
                {
                  title: 'Multi-Operator Consensus',
                  description: 'Strategies validated by multiple independent operators, aggregated for high-confidence recommendations',
                  icon: '🎯',
                  gradient: 'from-cyan-500 to-blue-500'
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

          {/* How AVS Works */}
          <div className="mb-20">
            <div className="handcrafted-card rounded-3xl p-12 soft-glow animate-reveal">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                How the AVS Works
              </h2>

              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { step: '01', title: 'Submit Strategy', desc: 'User submits DeFi strategy for validation', icon: '📤' },
                  { step: '02', title: 'Operator Analysis', desc: 'Decentralized operators run Claude AI validation', icon: '🤖' },
                  { step: '03', title: 'Sign Attestation', desc: 'Operators sign cryptographic proofs on-chain', icon: '✍️' },
                  { step: '04', title: 'Aggregate Results', desc: 'Multi-operator consensus with confidence scores', icon: '📊' }
                ].map((item, i) => (
                  <div key={i} className="text-center group">
                    <div className="relative mb-6">
                      <div className="text-6xl mb-2 liquid-shape inline-block group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div className="font-handwritten text-5xl text-blue-500 dark:text-blue-400 absolute -top-4 -right-4">
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
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-violet-500/20 rounded-3xl blur-xl"></div>
              <div className="relative handcrafted-card rounded-3xl p-12 soft-glow">
                <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Ready for trust-minimized DeFi validation?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join the decentralized network of validators securing DeFi strategies with EigenLayer AVS
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all soft-glow-hover"
                >
                  <span>Launch Validator Dashboard</span>
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
                Secured by EigenLayer AVS • Powered by Claude AI • Built on EtherFi
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
