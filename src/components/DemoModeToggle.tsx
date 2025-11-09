'use client';

import { useState, useEffect } from 'react';

export default function DemoModeToggle() {
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Store demo mode preference
    localStorage.setItem('demoMode', isDemoMode.toString());
  }, [isDemoMode]);

  if (!showBanner) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-2xl p-4 animate-slideInRight">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎪</span>
            <span className="font-bold">Demo Mode</span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>

        <p className="text-sm mb-3 text-white/90">
          You&apos;re viewing a simulated EigenLayer AVS demo with live animations and mock data.
        </p>

        <div className="flex items-center justify-between bg-white/10 rounded-lg p-2">
          <span className="text-sm font-medium">Simulation Active</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDemoMode}
              onChange={(e) => setIsDemoMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        {isDemoMode && (
          <div className="mt-3 text-xs bg-white/10 rounded p-2 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Live operator updates</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>AI validation simulation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Real-time metrics</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
