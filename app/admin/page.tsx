// app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUtensils, 
  FaCar, 
  FaCode, 
  FaChartBar,
  FaUsers,
  FaClock,
  FaEye,
  FaFileAlt
} from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Link from 'next/link';

// Stats Card Component
const StatsCard = ({ icon, title, value, subtitle, href }: any) => (
  <Link href={href}>
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="p-6 bg-[var(--surface)] rounded-xl border border-white/10 hover:border-[var(--accent-primary)]/50 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white/5 rounded-lg text-[var(--accent-primary)]">
          {icon}
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </motion.div>
  </Link>
);

// Quick Action Component
const QuickAction = ({ icon, label, href }: any) => (
  <Link href={href}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
    >
      <span className="text-2xl text-[var(--accent-primary)]">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </motion.div>
  </Link>
);

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState({
    recipes: { total: 0, published: 0 },
    vehicles: { total: 0, posts: 0 },
    projects: { total: 0, published: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth');
    if (isAuth === 'true') {
      setAuthenticated(true);
      fetchStats();
    } else {
      setLoading(false);
    }
  }, []);

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
        fetchStats();
      } else {
        alert('Invalid password');
      }
    } catch (error) {
      alert('Authentication error');
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch recipe stats
      const recipesRes = await fetch('/api/recipes?all=true');
      const recipes = await recipesRes.json();
      
      // Fetch vehicle stats
      const vehiclesRes = await fetch('/api/vehicles');
      const vehicles = await vehiclesRes.json();
      
      // Fetch project stats
      const projectsRes = await fetch('/api/projects?all=true');
      const projects = await projectsRes.json();
      
      setStats({
        recipes: {
          total: recipes.length,
          published: recipes.filter((r: any) => r.published).length
        },
        vehicles: {
          total: vehicles.length,
          posts: vehicles.reduce((acc: number, v: any) => acc + (v.blogPosts?.length || 0), 0)
        },
        projects: {
          total: projects.length,
          published: projects.filter((p: any) => p.published).length
        }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your content across all sections</p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-pulse text-2xl">Loading stats...</div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <StatsCard
                  icon={<FaUtensils className="text-2xl" />}
                  title="Recipes"
                  value={stats.recipes.total}
                  subtitle={`${stats.recipes.published} published`}
                  href="/admin/recipes"
                />
                <StatsCard
                  icon={<FaCar className="text-2xl" />}
                  title="Vehicles"
                  value={stats.vehicles.total}
                  subtitle={`${stats.vehicles.posts} blog posts`}
                  href="/admin/vehicles"
                />
                <StatsCard
                  icon={<FaCode className="text-2xl" />}
                  title="Projects"
                  value={stats.projects.total}
                  subtitle={`${stats.projects.published} published`}
                  href="/admin/projects"
                />
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <QuickAction
                    icon={<FaUtensils />}
                    label="New Recipe"
                    href="/admin/recipes"
                  />
                  <QuickAction
                    icon={<FaFileAlt />}
                    label="New Blog Post"
                    href="/admin/vehicles"
                  />
                  <QuickAction
                    icon={<FaCode />}
                    label="New Project"
                    href="/admin/projects"
                  />
                  <QuickAction
                    icon={<FaChartBar />}
                    label="Analytics"
                    href="#"
                  />
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6">Content Sections</h2>
                <div className="grid gap-4">
                  <Link href="/admin/recipes">
                    <div className="p-6 bg-[var(--surface)] rounded-xl border border-white/10 hover:border-[var(--accent-primary)]/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FaUtensils className="text-2xl text-[var(--accent-primary)]" />
                          <div>
                            <h3 className="text-xl font-semibold">Recipe Management</h3>
                            <p className="text-sm text-gray-400">Create and manage cooking recipes</p>
                          </div>
                        </div>
                        <span className="text-gray-500">→</span>
                      </div>
                    </div>
                  </Link>

                  <Link href="/admin/vehicles">
                    <div className="p-6 bg-[var(--surface)] rounded-xl border border-white/10 hover:border-[var(--accent-primary)]/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FaCar className="text-2xl text-[var(--accent-primary)]" />
                          <div>
                            <h3 className="text-xl font-semibold">Vehicle & Blog Management</h3>
                            <p className="text-sm text-gray-400">Manage vehicles and automotive blog posts</p>
                          </div>
                        </div>
                        <span className="text-gray-500">→</span>
                      </div>
                    </div>
                  </Link>

                  <Link href="/admin/projects">
                    <div className="p-6 bg-[var(--surface)] rounded-xl border border-white/10 hover:border-[var(--accent-primary)]/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FaCode className="text-2xl text-[var(--accent-primary)]" />
                          <div>
                            <h3 className="text-xl font-semibold">Project Management</h3>
                            <p className="text-sm text-gray-400">Showcase coding projects and updates</p>
                          </div>
                        </div>
                        <span className="text-gray-500">→</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}