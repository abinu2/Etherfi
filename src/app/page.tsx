import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mb-4">
              EigenLayer AVS
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            EtherFi Strategy Validator
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12">
            AI-powered staking strategy validation using EigenLayer&apos;s restaking infrastructure
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">Claude AI Validation</h3>
              <p className="text-gray-600">
                Operators use Claude Sonnet 4 to analyze and validate your staking strategies
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-2">On-Chain Attestations</h3>
              <p className="text-gray-600">
                Cryptographically signed operator validations stored permanently on-chain
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">AVS Architecture</h3>
              <p className="text-gray-600">
                Built on EigenLayer&apos;s AVS framework with decentralized operator network
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            Launch Validator
          </Link>

          {/* How It Works */}
          <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6 text-left">
              <div>
                <div className="text-blue-600 font-bold text-2xl mb-2">1</div>
                <h3 className="font-semibold mb-1">Submit Strategy</h3>
                <p className="text-sm text-gray-600">Submit your eETH/weETH strategy for validation</p>
              </div>
              <div>
                <div className="text-blue-600 font-bold text-2xl mb-2">2</div>
                <h3 className="font-semibold mb-1">AI Analysis</h3>
                <p className="text-sm text-gray-600">Operators analyze with Claude AI</p>
              </div>
              <div>
                <div className="text-blue-600 font-bold text-2xl mb-2">3</div>
                <h3 className="font-semibold mb-1">Sign Attestation</h3>
                <p className="text-sm text-gray-600">Operators sign validations on-chain</p>
              </div>
              <div>
                <div className="text-blue-600 font-bold text-2xl mb-2">4</div>
                <h3 className="font-semibold mb-1">Get Results</h3>
                <p className="text-sm text-gray-600">View validated strategy with confidence scores</p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Built With</p>
            <div className="flex flex-wrap justify-center gap-6 text-gray-600">
              <span className="font-semibold">EigenLayer AVS</span>
              <span className="font-semibold">Claude Sonnet 4</span>
              <span className="font-semibold">EtherFi</span>
              <span className="font-semibold">Solidity</span>
              <span className="font-semibold">Next.js 14</span>
              <span className="font-semibold">Go</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
