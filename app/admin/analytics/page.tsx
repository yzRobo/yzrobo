// app/admin/analytics/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartLine, 
  FaEye, 
  FaFire, 
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaGlobeAmericas,
  FaDesktop,
  FaMobileAlt,
  FaTabletAlt
} from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import Link from 'next/link';
import { 
  LineChart, 
  Line,
  Bar,
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

interface AnalyticsData {
      period: string;
      totalPageViews: number;
      uniquePages: number;
      topPages: Array<{ path: string; _count: number }>;
      topRecipes: Array<{ slug: string; _count: number }>;
      topProjects: Array<{ slug: string; _count: number }>;
      topVehiclePosts: Array<{ slug: string; _count: number }>;
      dailyViews?: Array<{ date: string; views: number }>;
      deviceStats?: Array<{ device: string; count: number }>;
      referrerStats?: Array<{ referrer: string; count: number }>;
    }
    
    // Define a type for the comparison metric
    type ComparisonMetric = {
      current: number;
      previous: number;
      change: string;
      type: 'positive' | 'negative' | 'neutral';
    };

// Stat Card Component
const StatCard = ({ 
  icon, 
  title, 
  value, 
  change, 
  changeType 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string | number; 
  change?: string; 
  changeType?: 'positive' | 'negative' | 'neutral';
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-6 bg-[var(--surface)] rounded-xl border border-white/10"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-white/5 rounded-lg text-[var(--accent-primary)]">
        {icon}
      </div>
      {change && (
        <div className={`flex items-center gap-1 text-sm ${
          changeType === 'positive' ? 'text-green-400' : 
          changeType === 'negative' ? 'text-red-400' : 
          'text-gray-400'
        }`}>
          {changeType === 'positive' ? <FaArrowUp /> : 
           changeType === 'negative' ? <FaArrowDown /> : null}
          <span>{change}</span>
        </div>
      )}
    </div>
    <h3 className="text-3xl font-bold mb-1">{value}</h3>
    <p className="text-sm text-gray-400">{title}</p>
  </motion.div>
);

// Content Table Component
const ContentTable = ({ 
  title, 
  data, 
  type 
}: { 
  title: string; 
  data: Array<{ slug: string; _count: number }>; 
  type: 'recipe' | 'project' | 'vehicle';
}) => {
  const getLink = (slug: string) => {
    switch (type) {
      case 'recipe': return `/cooking/${slug}`;
      case 'project': return `/coding/${slug}`;
      case 'vehicle': return `/auto/${slug}`;
      default: return '#';
    }
  };

  return (
    <div className="p-6 bg-[var(--surface)] rounded-xl border border-white/10">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="space-y-3">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={item.slug} className="flex justify-between items-center">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl font-bold text-gray-600">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <Link 
                  href={getLink(item.slug)}
                  className="text-sm hover:text-[var(--accent-primary)] transition-colors truncate flex-1"
                >
                  {item.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Link>
              </div>
              <span className="text-sm font-medium text-[var(--accent-primary)] flex-shrink-0">
                {item._count} views
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No data available yet</p>
        )}
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
      const [authenticated, setAuthenticated] = useState(false);
      const [password, setPassword] = useState('');
      const [data, setData] = useState<AnalyticsData | null>(null);
      const [period, setPeriod] = useState('7d');
      const [loading, setLoading] = useState(true);
      const [comparison, setComparison] = useState<{
        pageViews: ComparisonMetric;
        uniquePages: ComparisonMetric;
      }>({
        pageViews: { current: 0, previous: 0, change: '0%', type: 'neutral' },
        uniquePages: { current: 0, previous: 0, change: '0%', type: 'neutral' }
      });

  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth');
    if (isAuth === 'true') {
      setAuthenticated(true);
      fetchAnalytics();
    } else {
      setLoading(false);
    }
  }, [period]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setAuthenticated(true);
        sessionStorage.setItem('adminAuth', 'true');
        fetchAnalytics();
      } else {
        alert('Invalid password');
      }
    } catch (error) {
      alert('Authentication error');
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch current period data
      const response = await fetch(`/api/analytics/stats?period=${period}`);
      const analytics = await response.json();
      setData(analytics);
      
      // Fetch comparison data (previous period)
      const prevResponse = await fetch(`/api/analytics/stats?period=${period}&previous=true`);
      if (prevResponse.ok) {
        const prevData = await prevResponse.json();
        calculateComparison(analytics, prevData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateComparison = (current: AnalyticsData, previous: AnalyticsData) => {
    const pageViewChange = ((current.totalPageViews - previous.totalPageViews) / previous.totalPageViews * 100).toFixed(1);
    const uniquePageChange = ((current.uniquePages - previous.uniquePages) / previous.uniquePages * 100).toFixed(1);
    
    setComparison({
      pageViews: {
        current: current.totalPageViews,
        previous: previous.totalPageViews,
        change: `${pageViewChange}%`,
        type: parseFloat(pageViewChange) > 0 ? 'positive' : parseFloat(pageViewChange) < 0 ? 'negative' : 'neutral'
      },
      uniquePages: {
        current: current.uniquePages,
        previous: previous.uniquePages,
        change: `${uniquePageChange}%`,
        type: parseFloat(uniquePageChange) > 0 ? 'positive' : parseFloat(uniquePageChange) < 0 ? 'negative' : 'neutral'
      }
    });
  };

  const periodOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
  ];

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-[var(--surface)] rounded-2xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
          <form onSubmit={handleAuth}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-3 bg-[var(--accent-primary)] rounded-lg font-medium hover:bg-opacity-80 transition-colors"
            >
              Access Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-gray-400">Track your site's performance and content engagement</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Back to Admin
                </motion.button>
              </Link>
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
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-pulse text-2xl">Loading analytics...</div>
            </div>
          ) : data ? (
            <div className="space-y-8">
              {/* Main Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={<FaEye className="text-2xl" />}
                  title="Total Page Views"
                  value={data.totalPageViews.toLocaleString()}
                  change={comparison.pageViews.change}
                  changeType={comparison.pageViews.type}
                />
                <StatCard
                  icon={<FaChartLine className="text-2xl" />}
                  title="Unique Pages"
                  value={data.uniquePages}
                  change={comparison.uniquePages.change}
                  changeType={comparison.uniquePages.type}
                />
                <StatCard
                  icon={<FaFire className="text-2xl" />}
                  title="Most Popular Page"
                  value={data.topPages[0]?._count || 0}
                />
                <StatCard
                  icon={<FaClock className="text-2xl" />}
                  title="Active Period"
                  value={periodOptions.find(o => o.value === period)?.label || ''}
                />
              </div>

              {/* Top Pages Chart */}
              <div className="p-6 bg-[var(--surface)] rounded-xl border border-white/10">
                <h3 className="text-xl font-bold mb-6">Top Pages by Views</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.topPages.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="path" 
                      stroke="#999"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis stroke="#999" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#111', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="_count" 
                      fill="#0038b8" 
                      name="Views"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Content Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ContentTable
                  title="Top Recipes"
                  data={data.topRecipes || []}
                  type="recipe"
                />
                <ContentTable
                  title="Top Projects"
                  data={data.topProjects || []}
                  type="project"
                />
                <ContentTable
                  title="Top Vehicle Posts"
                  data={data.topVehiclePosts || []}
                  type="vehicle"
                />
              </div>

              {/* Page Performance Table */}
              <div className="p-6 bg-[var(--surface)] rounded-xl border border-white/10">
                <h3 className="text-xl font-bold mb-4">All Page Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4">Page</th>
                        <th className="text-right py-3 px-4">Views</th>
                        <th className="text-right py-3 px-4">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topPages.map((page, index) => (
                        <tr key={page.path} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-4">
                            <Link 
                              href={page.path}
                              className="hover:text-[var(--accent-primary)] transition-colors"
                            >
                              {page.path}
                            </Link>
                          </td>
                          <td className="text-right py-3 px-4">{page._count}</td>
                          <td className="text-right py-3 px-4">
                            {((page._count / data.totalPageViews) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">No analytics data available</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}