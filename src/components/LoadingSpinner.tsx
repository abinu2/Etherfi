'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'blue',
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-4 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue} border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
  );
}

export function ValidationResultSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonLoader className="h-6 w-40" />
        <SkeletonLoader className="h-8 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <SkeletonLoader className="h-4 w-20 mb-2" />
          <SkeletonLoader className="h-6 w-32" />
        </div>
        <div>
          <SkeletonLoader className="h-4 w-24 mb-2" />
          <SkeletonLoader className="h-10 w-16" />
        </div>
      </div>
      <SkeletonLoader className="h-32 w-full" />
    </div>
  );
}
