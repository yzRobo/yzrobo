// app/components/LoadingStates.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Recipe Card Skeleton
export const RecipeCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="relative h-full bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      <div className="aspect-[4/3] bg-white/5" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-white/10 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-white/5 rounded" />
          <div className="h-4 bg-white/5 rounded w-5/6" />
        </div>
        <div className="flex justify-between">
          <div className="flex gap-4">
            <div className="h-4 bg-white/5 rounded w-16" />
            <div className="h-4 bg-white/5 rounded w-16" />
          </div>
          <div className="h-4 bg-white/5 rounded w-20" />
        </div>
      </div>
    </div>
  </div>
);

// Recipe Grid Skeleton
export const RecipeGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <RecipeCardSkeleton key={i} />
    ))}
  </div>
);

// Page Loading Spinner
export const PageLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-3 border-white/20 border-t-[var(--accent-primary)] rounded-full"
    />
  </div>
);

// Inline Loading Spinner
export const InlineLoadingSpinner = ({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizeClasses[size]} border-white/20 border-t-[var(--accent-primary)] rounded-full inline-block`}
    />
  );
};

// Full Page Loading
export const FullPageLoading = ({ message = "Loading..." }: { message?: string }) => (
  <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white/20 border-t-[var(--accent-primary)] rounded-full mx-auto"
        />
      </div>
      <p className="text-xl text-gray-400">{message}</p>
    </motion.div>
  </div>
);