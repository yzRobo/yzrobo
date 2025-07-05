// app/coding/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCode, 
  FaGithub, 
  FaExternalLinkAlt, 
  FaPlay,
  FaFolder,
  FaRocket,
  FaFilter,
  FaPlus
} from 'react-icons/fa';
import { 
  SiNextdotjs, 
  SiTailwindcss, 
  SiFramer, 
  SiTypescript,
  SiReact,
  SiNodedotjs,
  SiPython,
  SiSolidity
} from 'react-icons/si';
import Navigation from '../components/Navigation';
import { PageLoadingSpinner } from '../components/LoadingStates';
import ProjectSearch from '../components/ProjectSearch';
import type { Project, ProjectCategory } from '@/types/project';
import { useRouter } from 'next/navigation';

// Tech icon mapping
const techIcons: { [key: string]: React.ReactNode } = {
  'Next.js': <SiNextdotjs />,
  'React': <SiReact />,
  'TypeScript': <SiTypescript />,
  'Tailwind CSS': <SiTailwindcss />,
  'Framer Motion': <SiFramer />,
  'Node.js': <SiNodedotjs />,
  'Python': <SiPython />,
  'Solidity': <SiSolidity />
};

// Category icon mapping
const categoryIcons: { [key: string]: React.ReactNode } = {
  'web-app': <FaCode />,
  'tool': <FaRocket />,
  'automation': <FaFolder />,
};

// Status color mapping
const statusColors = {
  'planning': 'text-gray-400',
  'in-progress': 'text-yellow-400',
  'completed': 'text-green-400',
  'on-hold': 'text-orange-400',
  'archived': 'text-red-400'
};

// Filter Button Component
const FilterButton = ({ 
  category, 
  active, 
  onClick,
  count
}: { 
  category: { id: string; name: string; icon: React.ReactNode };
  active: boolean;
  onClick: () => void;
  count?: number;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
      active
        ? 'bg-[var(--accent-primary)] text-white'
        : 'bg-[var(--surface)] text-gray-400 hover:bg-white/10 hover:text-white border border-[var(--border)]'
    }`}
  >
    <span className="text-base">{category.icon}</span>
    <span>{category.name}</span>
    {count !== undefined && (
      <span className="text-xs opacity-75">({count})</span>
    )}
  </motion.button>
);

// Project Card Component
interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    router.push(`/coding/${project.slug}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative h-full cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-full bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-[var(--accent-primary)]/50 transition-all duration-300">
        {/* Hero Image or Icon */}
        <div className="relative aspect-video bg-gradient-to-br from-[var(--surface)] to-black/50 overflow-hidden">
          {project.heroImage ? (
            <img
              src={project.heroImage}
              alt={project.heroImageAlt || project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl text-[var(--accent-primary)]/30">
                {categoryIcons[project.category] || <FaCode />}
              </div>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 bg-black/80 backdrop-blur-sm text-xs font-medium rounded-full capitalize ${statusColors[project.status]}`}>
              {project.status.replace('-', ' ')}
            </span>
          </div>
          
          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-[var(--accent-primary)] text-white text-xs font-bold rounded-full">
              FEATURED
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[var(--accent-primary)] transition-colors">
            {project.title}
          </h3>
          
          <p className="text-gray-400 mb-6 line-clamp-2">
            {project.description}
          </p>

          {/* Tech Stack */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-300 mb-2">Tech Stack:</p>
              <div className="flex items-center gap-3 text-gray-400 text-xl">
                {project.technologies.slice(0, 5).map((tech) => (
                  <span key={tech.id} title={tech.name}>
                    {techIcons[tech.name] || <FaCode />}
                  </span>
                ))}
                {project.technologies.length > 5 && (
                  <span className="text-sm">+{project.technologies.length - 5}</span>
                )}
              </div>
            </div>
          )}

          {/* Action Links */}
          <motion.div 
            className="flex items-center gap-4 mt-auto"
            animate={{ opacity: isHovered ? 1 : 0.7 }}
          >
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FaGithub />
                <span>Code</span>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FaExternalLinkAlt />
                <span>Demo</span>
              </a>
            )}
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FaPlay />
                <span>Video</span>
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};

export default function CodingPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [activeCategory]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({ published: 'true' });
      if (activeCategory !== 'all') {
        params.append('category', activeCategory);
      }
      
      const response = await fetch(`/api/projects?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to load projects');
      }
      
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Unable to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate project counts by category
  const categoryCounts = projects.reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filterButtons = [
    { id: 'all', name: 'All Projects', icon: <FaCode /> },
    { id: 'web-app', name: 'Web Apps', icon: <FaCode /> },
    { id: 'tool', name: 'Tools', icon: <FaRocket /> },
    { id: 'automation', name: 'Automation', icon: <FaFolder /> },
  ];

  const featuredProjects = projects.filter(p => p.featured);
  const regularProjects = projects.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="pt-32 md:pt-40 pb-16 md:pb-20 text-center relative overflow-hidden"
      >
        {/* Background Effect */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[var(--accent-primary)]/20 to-transparent blur-3xl"
            animate={{ x: [-300, 0, -300], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--accent-primary)]/20 to-transparent blur-3xl"
            animate={{ x: [300, 0, 300], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 7.5 }}
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter mb-4">
              Coding
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Vibe coding my way through webapps, personal projects, and anything that sounds cool.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Filter Section */}
      <section className="py-8 border-y border-white/5 sticky top-[88px] z-30 bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {filterButtons.map((category) => (
                <FilterButton
                  key={category.id}
                  category={category}
                  active={activeCategory === category.id}
                  onClick={() => setActiveCategory(category.id)}
                  count={category.id === 'all' ? projects.length : categoryCounts[category.id]}
                />
              ))}
            </div>
            {/* Search button */}
            <div className="flex-shrink-0">
              <ProjectSearch />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          {loading ? (
            <PageLoadingSpinner />
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-xl text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchProjects}
                className="px-6 py-3 bg-[var(--accent-primary)] rounded-full font-medium"
              >
                Try Again
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <FaFolder className="text-6xl text-gray-600 mx-auto mb-4" />
              <p className="text-xl text-gray-400">No projects found.</p>
              <p className="text-gray-500 mt-2">Check back soon for updates!</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-16"
              >
                {/* Featured Projects */}
                {featuredProjects.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                      {featuredProjects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Projects */}
                {regularProjects.length > 0 && (
                  <div>
                    {featuredProjects.length > 0 && (
                      <h2 className="text-3xl font-bold mb-8 text-center">All Projects</h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {regularProjects.map((project, index) => (
                        <ProjectCard 
                          key={project.id} 
                          project={project} 
                          index={featuredProjects.length + index} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Want to Code Along?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join me on stream for live coding sessions where we build projects, debug issues, 
              and explore new technologies together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="https://twitch.tv/yzRobo"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-3 bg-[var(--accent-primary)] text-white font-bold rounded-full"
              >
                Watch Live Coding
              </motion.a>
              <motion.a
                href="https://github.com/yzRobo"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-colors"
              >
                View on GitHub
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}