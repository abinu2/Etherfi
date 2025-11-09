'use client';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = '📭'
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Animated Icon */}
      <div className="text-6xl mb-4 animate-bounce">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        {description}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
        >
          {actionLabel}
        </button>
      )}

      {/* Decorative Elements */}
      <div className="mt-8 flex gap-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

// Specific empty state variants
export function NoTasksFound({ onSubmit }: { onSubmit?: () => void }) {
  return (
    <EmptyState
      icon="🔍"
      title="No Validation Tasks Found"
      description="You haven&apos;t submitted any strategies for validation yet. Create your first task to get AI-powered insights from our operator network."
      actionLabel="Submit First Task"
      onAction={onSubmit}
    />
  );
}

export function NoResultsYet() {
  return (
    <EmptyState
      icon="⏳"
      title="Validation in Progress"
      description="Operators are analyzing your strategy using Claude AI. Results will appear here once validation is complete."
    />
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon="🔌"
      title="Connection Error"
      description="Unable to connect to the network. Please check your internet connection and try again."
      actionLabel="Retry Connection"
      onAction={onRetry}
    />
  );
}
