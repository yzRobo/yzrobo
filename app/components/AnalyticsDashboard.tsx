// app/admin/components/AnalyticsDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaEye, FaFire, FaClock } from 'react-icons/fa';

interface AnalyticsData {
  period: string;
  totalPageViews: number;
  uniquePages: number;
  topPages: Array<{ path: string; _count: number }>;
  topRecipes: Array<{ slug: string; _count: number }>;
  topProjects: Array<{ slug: string; _count: number }>;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/stats?period=${period}`);
      const analytics = await response.json();
      setData(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const periodOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
  ];

  if (loading) {
    return <div className="animate-pulse">Loading analytics...</div>;
  }

  if (!data) {
    return <div>No analytics data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
        >
          {periodOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-[var(--surface)] rounded-xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <FaEye className="text-2xl text-[var(--accent-primary)]" />
            <span className="text-3xl font-bold">{data.totalPageViews.toLocaleString()}</span>
          </div>
          <h3 className="text-lg font-semibold">Total Page Views</h3>
          <p className="text-sm text-gray-400">{periodOptions.find(o => o.value === period)?.label}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-[var(--surface)] rounded-xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <FaChartLine className="text-2xl text-[var(--accent-primary)]" />
            <span className="text-3xl font-bold">{data.uniquePages}</span>
          </div>
          <h3 className="text-lg font-semibold">Unique Pages Viewed</h3>
          <p className="text-sm text-gray-400">Different pages visited</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-[var(--surface)] rounded-xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <FaFire className="text-2xl text-[var(--accent-primary)]" />
            <span className="text-3xl font-bold">
              {data.topPages[0]?._count || 0}
            </span>
          </div>
          <h3 className="text-lg font-semibold">Top Page Views</h3>
          <p className="text-sm text-gray-400 truncate">
            {data.topPages[0]?.path || 'No data'}
          </p>
        </motion.div>
      </div>

      {/* Top Content Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="p-6 bg-[var(--surface)] rounded-xl border border-white/10">
          <h3 className="text-xl font-bold mb-4">Top Pages</h3>
          <div className="space-y-2">
            {data.topPages.map((page, index) => (
              <div key={page.path} className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm truncate flex-1">{page.path}</span>
                <span className="text-sm font-medium text-[var(--accent-primary)]">
                  {page._count} views
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Recipes */}
        <div className="p-6 bg-[var(--surface)] rounded-xl border border-white/10">
          <h3 className="text-xl font-bold mb-4">Top Recipes</h3>
          <div className="space-y-2">
            {data.topRecipes.length > 0 ? (
              data.topRecipes.map((recipe, index) => (
                <div key={recipe.slug} className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm truncate flex-1">{recipe.slug}</span>
                  <span className="text-sm font-medium text-[var(--accent-primary)]">
                    {recipe._count} views
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No recipe views yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}