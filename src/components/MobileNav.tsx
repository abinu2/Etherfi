'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MobileNavProps {
  connectedAddress?: string;
  onDisconnect?: () => void;
}

export default function MobileNav({ connectedAddress, onDisconnect }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-gray-900 dark:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Slide-out Menu */}
      <div
        className={`
          fixed inset-0 z-50 md:hidden transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`
            absolute top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-2xl
            transform transition-transform duration-300 ease-out
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </Link>

              <button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </button>

              <button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documentation
              </button>
            </nav>

            {/* Footer */}
            {connectedAddress && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="mb-3 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
                    Connected
                  </p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white">
                    {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
                  </p>
                </div>
                {onDisconnect && (
                  <button
                    onClick={() => {
                      onDisconnect();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
