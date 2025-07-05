// app/components/ProjectSearch.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Project } from '@/types/project';
import { useRouter } from 'next/navigation';

interface ProjectSearchProps {
  className?: string;
}

export default function ProjectSearch({ className = '' }: ProjectSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        performSearch();
      } else {
        setResults([]);
        setError(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/projects/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setResults(data);
      
      if (data.length === 0) {
        setError('No projects found matching your search.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search projects. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    router.push(`/coding/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, slug?: string) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' && slug) {
      handleResultClick(slug);
    }
  };

  const statusColors = {
    'planning': 'text-gray-400',
    'in-progress': 'text-yellow-400',
    'completed': 'text-green-400',
    'on-hold': 'text-orange-400',
    'archived': 'text-red-400'
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-white transition-colors"
        aria-label="Search projects"
      >
        <FaSearch className="w-5 h-5" />
      </motion.button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Search Container */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-screen md:w-96 max-w-[calc(100vw-2rem)] bg-[var(--surface)] rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden"
            >
              {/* Search Input */}
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                  placeholder="Search projects..."
                  className="w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setResults([]);
                      setError(null);
                      inputRef.current?.focus();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              {/* Results */}
              {(loading || error || results.length > 0) && (
                <div className="border-t border-white/10 max-h-96 overflow-y-auto">
                  {loading && (
                    <div className="p-4 text-center text-gray-400">
                      <div className="animate-pulse">Searching...</div>
                    </div>
                  )}

                  {error && !loading && (
                    <div className="p-4 text-center text-gray-400">
                      <p>{error}</p>
                    </div>
                  )}

                  {!loading && !error && results.length > 0 && (
                    <div className="py-2">
                      {results.map((project, index) => (
                        <motion.button
                          key={project.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleResultClick(project.slug)}
                          onKeyDown={(e) => handleKeyDown(e, project.slug)}
                          className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-start gap-3 group"
                        >
                          {project.heroImage && (
                            <img
                              src={project.heroImage}
                              alt={project.title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium group-hover:text-[var(--accent-primary)] transition-colors truncate">
                              {project.title}
                            </h4>
                            <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                              {project.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span className="capitalize">{project.category.replace('-', ' ')}</span>
                              <span>•</span>
                              <span className={`capitalize ${statusColors[project.status]}`}>
                                {project.status.replace('-', ' ')}
                              </span>
                              {project.technologies && project.technologies.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{project.technologies.slice(0, 3).map(t => t.name).join(', ')}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Search Tips */}
              {!query && (
                <div className="p-4 text-xs text-gray-500 border-t border-white/10">
                  <p>Try searching for:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['react', 'nextjs', 'web app', 'tool', 'completed'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-2 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors capitalize"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}