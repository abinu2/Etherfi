'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  maxHeight?: string;
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  maxHeight = '80vh'
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when sheet is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    const diff = currentY.current - startY.current;

    if (diff > 100) {
      // If dragged down more than 100px, close the sheet
      onClose();
    }

    // Reset transform
    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className={`
          absolute inset-0 bg-black transition-opacity duration-300
          ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'}
        `}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`
          absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{ maxHeight }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
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
        )}

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 100px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
