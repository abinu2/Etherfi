'use client';

import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import AnimatedNumber, { AnimatedCurrency } from './AnimatedNumber';

type WizardStep = 'intro' | 'requirements' | 'education' | 'configuration' | 'validation' | 'deployment';

interface AVSConfig {
  stakeAmount: number;
  validatorType: 'full' | 'light' | 'observer';
  autoRestake: boolean;
  slashingProtection: boolean;
  minimumAPY: number;
}

export default function AVSSetupWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('intro');
  const [config, setConfig] = useState<AVSConfig>({
    stakeAmount: 1.0,
    validatorType: 'light',
    autoRestake: true,
    slashingProtection: true,
    minimumAPY: 5.0
  });
  const [isDeploying, setIsDeploying] = useState(false);

  const steps: Record<WizardStep, { title: string; subtitle: string }> = {
    intro: {
      title: 'Welcome to AVS Setup',
      subtitle: 'Let\'s configure your Actively Validated Service'
    },
    requirements: {
      title: 'System Requirements',
      subtitle: 'Verify your setup meets the requirements'
    },
    education: {
      title: 'Understanding AVS',
      subtitle: 'Learn how AVS validation works'
    },
    configuration: {
      title: 'Configure Your AVS',
      subtitle: 'Customize your validation parameters'
    },
    validation: {
      title: 'Review & Validate',
      subtitle: 'Confirm your configuration'
    },
    deployment: {
      title: 'Deploy AVS',
      subtitle: 'Launch your validator'
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsDeploying(false);
    alert('AVS Deployed Successfully! You can now start validating strategies.');
  };

  const renderIntro = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center py-8">
        <div className="inline-block p-4 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full mb-4">
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Become an AVS Validator
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Earn rewards by validating DeFi strategies with AI-powered analysis
        </p>
      </div>

      {/* Key Benefits */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-6 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Earn Rewards</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            5-15% APY from validation fees + EtherFi rewards
          </p>
        </div>
        <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl">
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">AI-Powered</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Automated strategy validation with Claude AI
          </p>
        </div>
        <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl">
          <div className="text-3xl mb-3">🛡️</div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Low Risk</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Slashing protection & insurance options available
          </p>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">How AVS Validation Works</h3>
        <div className="space-y-3">
          {[
            { step: 1, title: 'Stake Assets', desc: 'Lock minimum 0.5 ETH to participate' },
            { step: 2, title: 'Run Validator', desc: 'Automated Claude AI validates incoming strategies' },
            { step: 3, title: 'Sign Attestations', desc: 'Cryptographically sign validation results' },
            { step: 4, title: 'Earn Rewards', desc: 'Receive fees for accurate validations' }
          ].map(item => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-bold flex items-center justify-center text-sm">
                {item.step}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setCurrentStep('requirements')}
        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02]"
      >
        Get Started →
      </button>
    </div>
  );

  const renderRequirements = () => {
    const requirements = [
      { name: 'Minimum Stake', met: true, value: '0.5 ETH', current: '2.5 ETH Available' },
      { name: 'Network Connection', met: true, value: 'Stable', current: 'Connected to Mainnet' },
      { name: 'Hardware', met: true, value: '4GB RAM, 100GB Storage', current: '8GB RAM, 500GB Available' },
      { name: 'API Access', met: true, value: 'Claude AI Key', current: 'Configured' }
    ];

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-3">
            <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            All Requirements Met!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your system is ready for AVS deployment
          </p>
        </div>

        <div className="space-y-3">
          {requirements.map((req, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  req.met ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {req.met ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{req.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Required: {req.value}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  {req.current}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep('intro')}
            className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            ← Back
          </button>
          <button
            onClick={() => setCurrentStep('education')}
            className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all"
          >
            Continue →
          </button>
        </div>
      </div>
    );
  };

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">Understanding AVS Roles</h3>
        <p className="opacity-90">Choose the validator type that matches your resources and commitment level</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            type: 'Observer',
            stake: '0.5 ETH',
            apy: '5-8%',
            desc: 'Monitor and report validation metrics without active participation',
            features: ['Low commitment', 'Minimal hardware', 'Basic rewards', 'No slashing risk']
          },
          {
            type: 'Light Validator',
            stake: '1 ETH',
            apy: '8-12%',
            desc: 'Validate strategies using automated AI analysis with periodic manual review',
            features: ['Moderate commitment', 'Standard hardware', 'Good rewards', 'Low slashing risk']
          },
          {
            type: 'Full Validator',
            stake: '5 ETH',
            apy: '12-15%',
            desc: 'Run full validation node with custom AI models and real-time attestation',
            features: ['High commitment', 'Powerful hardware', 'Maximum rewards', 'Slashing protection included']
          }
        ].map((option, idx) => (
          <div
            key={idx}
            onClick={() => setConfig({ ...config, validatorType: option.type.toLowerCase().split(' ')[0] as any })}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
              config.validatorType === option.type.toLowerCase().split(' ')[0]
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
            }`}
          >
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{option.type}</h4>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Stake:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{option.stake}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">APY:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{option.apy}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{option.desc}</p>
            <ul className="space-y-2">
              {option.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-emerald-500">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setCurrentStep('requirements')}
          className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={() => setCurrentStep('configuration')}
          className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all"
        >
          Continue →
        </button>
      </div>
    </div>
  );

  const renderConfiguration = () => {
    const minStake = config.validatorType === 'full' ? 5 : config.validatorType === 'light' ? 1 : 0.5;
    const estimatedAPY = config.validatorType === 'full' ? 13.5 : config.validatorType === 'light' ? 10 : 6.5;
    const yearlyEarnings = config.stakeAmount * (estimatedAPY / 100);

    return (
      <div className="space-y-6">
        {/* Stake Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stake Amount (ETH)
          </label>
          <input
            type="number"
            step="0.1"
            min={minStake}
            value={config.stakeAmount}
            onChange={(e) => setConfig({ ...config, stakeAmount: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Minimum: {minStake} ETH for {config.validatorType} validator
          </p>
        </div>

        {/* Projected Earnings */}
        <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Projected Earnings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated APY</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                <AnimatedNumber value={estimatedAPY} decimals={1} />%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Yearly Earnings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <AnimatedNumber value={yearlyEarnings} decimals={3} /> ETH
              </p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Auto-Restake Rewards</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Compound earnings automatically</p>
            </div>
            <input
              type="checkbox"
              checked={config.autoRestake}
              onChange={(e) => setConfig({ ...config, autoRestake: e.target.checked })}
              className="w-5 h-5"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Slashing Protection</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Insurance against slashing events (+0.5% fee)</p>
            </div>
            <input
              type="checkbox"
              checked={config.slashingProtection}
              onChange={(e) => setConfig({ ...config, slashingProtection: e.target.checked })}
              className="w-5 h-5"
            />
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep('education')}
            className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            ← Back
          </button>
          <button
            onClick={() => setCurrentStep('validation')}
            disabled={config.stakeAmount < minStake}
            className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Review →
          </button>
        </div>
      </div>
    );
  };

  const renderValidation = () => {
    const minStake = config.validatorType === 'full' ? 5 : config.validatorType === 'light' ? 1 : 0.5;
    const estimatedAPY = config.validatorType === 'full' ? 13.5 : config.validatorType === 'light' ? 10 : 6.5;
    const yearlyEarnings = config.stakeAmount * (estimatedAPY / 100);
    const fees = config.slashingProtection ? config.stakeAmount * 0.005 : 0;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">Review Your Configuration</h3>
          <p className="opacity-90">Verify all details before deployment</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Configuration Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Validator Type:</span>
              <span className="font-semibold text-gray-900 dark:text-white capitalize">{config.validatorType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Stake Amount:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{config.stakeAmount} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Estimated APY:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{estimatedAPY}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Yearly Earnings:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{yearlyEarnings.toFixed(3)} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Auto-Restake:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{config.autoRestake ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Slashing Protection:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{config.slashingProtection ? 'Yes' : 'No'}</span>
            </div>
            {fees > 0 && (
              <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Protection Fee:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{fees.toFixed(4)} ETH</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h5 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-1">Important</h5>
              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                Your staked ETH will be locked for a minimum of 7 days. Ensure you understand the risks before proceeding.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep('configuration')}
            className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            ← Back
          </button>
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all disabled:opacity-50"
          >
            {isDeploying ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" color="white" />
                Deploying...
              </span>
            ) : (
              'Deploy AVS →'
            )}
          </button>
        </div>
      </div>
    );
  };

  const currentStepInfo = steps[currentStep];

  return (
    <div className="handcrafted-card rounded-3xl p-8 soft-glow">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentStepInfo.title}
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Step {Object.keys(steps).indexOf(currentStep) + 1} of {Object.keys(steps).length}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{currentStepInfo.subtitle}</p>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${((Object.keys(steps).indexOf(currentStep) + 1) / Object.keys(steps).length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 'intro' && renderIntro()}
      {currentStep === 'requirements' && renderRequirements()}
      {currentStep === 'education' && renderEducation()}
      {currentStep === 'configuration' && renderConfiguration()}
      {currentStep === 'validation' && renderValidation()}
    </div>
  );
}
