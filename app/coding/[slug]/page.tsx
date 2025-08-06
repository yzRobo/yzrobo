// app/coding/[slug]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaGithub, 
  FaExternalLinkAlt, 
  FaPlay,
  FaCode,
  FaClock,
  FaCalendarAlt,
  FaTools,
  FaRocket,
  FaLightbulb,
  FaShare,
  FaPrint,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import { PageLoadingSpinner } from '../../components/LoadingStates';
import { useParams, useRouter, notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import type { Project } from '@/types/project';

// Tech icon mapping (same as main page)
const techIcons: { [key: string]: React.ReactNode } = {
  'Next.js': '⚡',
  'React': '⚛️',
  'TypeScript': '🔷',
  'Tailwind CSS': '🎨',
  'Node.js': '🟢',
  'Python': '🐍',
  'Solidity': '⟠'
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    'planning': { color: 'bg-gray-500', text: 'Planning' },
    'in-progress': { color: 'bg-yellow-500', text: 'In Progress' },
    'completed': { color: 'bg-green-500', text: 'Completed' },
    'on-hold': { color: 'bg-orange-500', text: 'On Hold' },
    'archived': { color: 'bg-red-500', text: 'Archived' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['in-progress'];

  return (
    <span className={`px-3 py-1 ${config.color} text-white text-sm font-medium rounded-full`}>
      {config.text}
    </span>
  );
};

// Image Gallery Component
const ImageGallery = ({ images }: { images: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative aspect-video rounded-xl overflow-hidden bg-[var(--surface)]"
        >
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            className="w-full h-full object-cover"
          />
          {images[currentIndex].caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="text-sm text-white">
                <ReactMarkdown>{images[currentIndex].caption}</ReactMarkdown>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <FaChevronRight />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Code Block Component with syntax highlighting
const CodeBlock = ({ language, value }: { language?: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-black/50 border border-white/10 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm text-gray-300">{value}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.slug) {
      fetchProject(params.slug as string);
    }
  }, [params.slug]);

  const fetchProject = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/projects/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          notFound();
        }
        throw new Error('Failed to load project');
      }
      
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Unable to load project details.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!project) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <PageLoadingSpinner />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <p className="text-xl text-red-400 mb-4">{error || 'Project not found'}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[var(--accent-primary)] rounded-full font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16">
        {project.heroImage && (
          <div className="absolute inset-0 z-0">
            <img 
              src={project.heroImage} 
              alt={project.heroImageAlt || project.title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />
          </div>
        )}
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.a
            href="/coding"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </motion.a>

          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap items-center gap-4 mb-4"
            >
              <h1 className="text-4xl md:text-6xl font-bold">{project.title}</h1>
              <StatusBadge status={project.status} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 mb-6 prose prose-invert max-w-none"
            >
              <ReactMarkdown>{project.description}</ReactMarkdown>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  <FaGithub />
                  View Code
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] rounded-full text-sm font-medium hover:bg-opacity-80 transition-colors"
                >
                  <FaExternalLinkAlt />
                  Live Demo
                </a>
              )}
              {project.videoUrl && (
                <a
                  href={project.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  <FaPlay />
                  Watch Video
                </a>
              )}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
              >
                <FaShare />
                Share
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-12">
              {/* Hero Image */}
              {project.heroImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={project.heroImage}
                    alt={project.heroImageAlt || project.title}
                    className="w-full aspect-video object-cover"
                  />
                </motion.div>
              )}

              {/* Long Description */}
              {project.longDescription && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="prose prose-invert prose-lg max-w-none"
                >
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FaLightbulb className="text-[var(--accent-primary)]" />
                    About This Project
                  </h2>
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-3xl font-bold mt-6 mb-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-2xl font-bold mt-4 mb-2">{children}</h3>,
                      p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="mb-4 space-y-2 list-disc list-inside">{children}</ul>,
                      ol: ({ children }) => <ol className="mb-4 space-y-2 list-decimal list-inside">{children}</ol>,
                      li: ({ children }) => <li className="ml-4">{children}</li>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-[var(--accent-primary)] pl-4 my-4 italic text-gray-300">
                          {children}
                        </blockquote>
                      ),
                      code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                          <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                        ) : (
                          <code {...props} className="px-1.5 py-0.5 bg-white/10 rounded text-sm">
                            {children}
                          </code>
                        );
                      },
                      a: ({ children, href }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">
                          {children}
                        </a>
                      ),
                      strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                    }}
                  >
                    {project.longDescription}
                  </ReactMarkdown>
                </motion.div>
              )}

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FaRocket className="text-[var(--accent-primary)]" />
                    Key Features
                  </h2>
                  <div className="space-y-4">
                    {project.features.map((feature, index) => (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                      >
                        <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                        <div className="text-gray-300 prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{feature.description}</ReactMarkdown>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Image Gallery */}
              {project.images && project.images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Gallery</h2>
                  <ImageGallery images={project.images} />
                </motion.div>
              )}

              {/* Updates */}
              {project.updates && project.updates.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FaClock className="text-[var(--accent-primary)]" />
                    Project Updates
                  </h2>
                  <div className="space-y-4">
                    {project.updates.map((update, index) => (
                      <motion.div
                        key={update.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="p-6 bg-[var(--surface)] rounded-xl border border-[var(--border)]"
                      >
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                          <FaCalendarAlt />
                          {new Date(update.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{update.title}</h3>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              h1: ({ children }) => <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-xl font-bold mt-3 mb-2">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-lg font-bold mt-2 mb-1">{children}</h3>,
                              p: ({ children }) => <p className="mb-3">{children}</p>,
                              ul: ({ children }) => <ul className="mb-3 space-y-1 list-disc list-inside">{children}</ul>,
                              ol: ({ children }) => <ol className="mb-3 space-y-1 list-decimal list-inside">{children}</ol>,
                              li: ({ children }) => <li className="ml-4">{children}</li>,
                              code: ({ className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '');
                                return !match ? (
                                  <code {...props} className="px-1 py-0.5 bg-white/10 rounded text-sm">
                                    {children}
                                  </code>
                                ) : (
                                  <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                                );
                              },
                              a: ({ children, href }) => (
                                <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">
                                  {children}
                                </a>
                              ),
                              strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                            }}
                          >
                            {update.content}
                          </ReactMarkdown>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Tech Stack */}
              {project.technologies && project.technologies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-6 bg-[var(--surface)] rounded-xl border border-[var(--border)]"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FaTools className="text-[var(--accent-primary)]" />
                    Tech Stack
                  </h3>
                  <div className="space-y-3">
                    {project.technologies.map((tech) => (
                      <div key={tech.id} className="flex items-center gap-3">
                        <span className="text-2xl">{techIcons[tech.name] || <FaCode />}</span>
                        <span className="text-gray-300">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Project Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-6 bg-[var(--surface)] rounded-xl border border-[var(--border)]"
              >
                <h3 className="text-xl font-bold mb-4">Project Info</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-400">Category</dt>
                    <dd className="text-white capitalize">{project.category.replace('-', ' ')}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400">Status</dt>
                    <dd><StatusBadge status={project.status} /></dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400">Created</dt>
                    <dd className="text-white">
                      {new Date(project.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </dd>
                  </div>
                  {project.publishedAt && (
                    <div>
                      <dt className="text-sm text-gray-400">Published</dt>
                      <dd className="text-white">
                        {new Date(project.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                  )}
                </dl>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}