// app/components/ErrorBoundary.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} reset={this.handleReset} />;
      }

      return <DefaultErrorFallback error={this.state.error} reset={this.handleReset} />;
    }

    return this.props.children;
  }
}

// Default error UI
export const DefaultErrorFallback = ({ error, reset }: { error: Error | null; reset: () => void }) => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full text-center"
    >
      <div className="mb-8">
        <FaExclamationTriangle className="text-6xl text-[var(--accent-primary)] mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Oops! Something went wrong</h1>
        <p className="text-gray-400">
          We're sorry, but something unexpected happened. Please try again.
        </p>
      </div>

      {error && process.env.NODE_ENV === 'development' && (
        <div className="mb-8 p-4 bg-red-900/20 border border-red-500/20 rounded-lg text-left">
          <p className="text-sm font-mono text-red-400">{error.message}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent-primary)] rounded-full font-medium"
        >
          <FaRedo />
          Try Again
        </motion.button>
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 rounded-full font-medium hover:bg-white/20 transition-colors"
        >
          <FaHome />
          Go Home
        </motion.a>
      </div>
    </motion.div>
  </div>
);

export default ErrorBoundary;