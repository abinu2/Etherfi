import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Hero Section */}
          <div className="mb-8 animate-fadeIn">
            <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm font-semibold rounded-full mb-4 animate-pulse-glow">
              EigenLayer AVS
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fadeIn" style={{animationDelay: '0.1s'}}>
            Veritas AVS: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Trust-Minimized</span> DeFi Strategies
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 animate-fadeIn" style={{animationDelay: '0.2s'}}>
            Decentralized operator network validates AI-generated strategies • Powered by EigenLayer AVS & Claude AI
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-2 animate-fadeIn border border-gray-200 dark:border-gray-700" style={{animationDelay: '0.3s'}}>
              <div className="text-5xl mb-4 animate-float">🤖</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Claude AI Validation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Operators use Claude Sonnet 4 to analyze and validate your staking strategies
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-2 animate-fadeIn border border-gray-200 dark:border-gray-700" style={{animationDelay: '0.4s'}}>
              <div className="text-5xl mb-4 animate-float" style={{animationDelay: '1s'}}>🔐</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">On-Chain Attestations</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Cryptographically signed operator validations stored permanently on-chain
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-2 animate-fadeIn border border-gray-200 dark:border-gray-700" style={{animationDelay: '0.5s'}}>
              <div className="text-5xl mb-4 animate-float" style={{animationDelay: '2s'}}>⚡</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">AVS Architecture</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Built on EigenLayer&apos;s AVS framework with decentralized operator network
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fadeIn" style={{animationDelay: '0.6s'}}>
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              Launch Validator →
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-lg rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-lg border border-gray-200 dark:border-gray-700"
            >
              How It Works
            </a>
          </div>

          {/* How It Works */}
          <div id="how-it-works" className="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700 animate-fadeIn" style={{animationDelay: '0.7s'}}>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6 text-left">
              <div className="group">
                <div className="text-blue-600 dark:text-blue-400 font-bold text-3xl mb-2 group-hover:scale-110 transition-transform">1</div>
                <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Submit Strategy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Submit your eETH/weETH strategy for validation</p>
              </div>
              <div className="group">
                <div className="text-blue-600 dark:text-blue-400 font-bold text-3xl mb-2 group-hover:scale-110 transition-transform">2</div>
                <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">AI Analysis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Operators analyze with Claude AI</p>
              </div>
              <div className="group">
                <div className="text-blue-600 dark:text-blue-400 font-bold text-3xl mb-2 group-hover:scale-110 transition-transform">3</div>
                <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Sign Attestation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Operators sign validations on-chain</p>
              </div>
              <div className="group">
                <div className="text-blue-600 dark:text-blue-400 font-bold text-3xl mb-2 group-hover:scale-110 transition-transform">4</div>
                <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Get Results</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">View validated strategy with confidence scores</p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 animate-fadeIn" style={{animationDelay: '0.8s'}}>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Built With</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['EigenLayer AVS', 'Claude Sonnet 4', 'EtherFi', 'Solidity', 'Next.js 14', 'Go'].map((tech) => (
                <span key={tech} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
