// app/admin/projects/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaImage, FaUpload, FaLink, FaGithub, FaPlay } from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import { Project, ProjectStatus, ProjectCategory } from '@/types/project';

// Project Form Component
const ProjectForm = ({ onClose, editingProject }: { onClose: () => void; editingProject?: Project | null }) => {
  const [formData, setFormData] = useState({
    title: editingProject?.title || '',
    description: editingProject?.description || '',
    longDescription: editingProject?.longDescription || '',
    category: editingProject?.category || ProjectCategory.WEB_APP,
    status: editingProject?.status || ProjectStatus.IN_PROGRESS,
    demoUrl: editingProject?.demoUrl || '',
    githubUrl: editingProject?.githubUrl || '',
    videoUrl: editingProject?.videoUrl || '',
    technologies: editingProject?.technologies?.map(t => ({ name: t.name, icon: t.icon || '', category: t.category || '' })) || [{ name: '', icon: '', category: '' }],
    features: editingProject?.features?.map(f => ({ title: f.title, description: f.description })) || [{ title: '', description: '' }],
    featured: editingProject?.featured || false,
    published: editingProject?.published || false,
    order: editingProject?.order || 0,
  });

  const [saving, setSaving] = useState(false);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(editingProject?.heroImage || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setHeroImagePreview(null);
    const fileInput = document.getElementById('hero-image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        ...formData,
        heroImage: heroImagePreview,
        technologies: formData.technologies.filter(t => t.name),
        features: formData.features.filter(f => f.title),
      };

      const url = editingProject ? `/api/projects/${editingProject.slug}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
        onClose();
      } else {
        const error = await response.json();
        alert(`Failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error handling project:', error);
      alert('Error: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const addTechnology = () => setFormData({ ...formData, technologies: [...formData.technologies, { name: '', icon: '', category: '' }] });
  const removeTechnology = (index: number) => setFormData({ ...formData, technologies: formData.technologies.filter((_, i) => i !== index) });

  const addFeature = () => setFormData({ ...formData, features: [...formData.features, { title: '', description: '' }] });
  const removeFeature = (index: number) => setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl bg-[var(--surface)] rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6">{editingProject ? 'Edit Project' : 'Create New Project'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hero Image */}
          <div>
            <label className="block text-sm font-medium mb-2">Project Image</label>
            <div className="space-y-4">
              {heroImagePreview ? (
                <div className="relative">
                  <img src={heroImagePreview} alt="Project preview" className="w-full max-h-64 object-cover rounded-lg" />
                  <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"><FaTrash /></button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-[var(--accent-primary)]/50 transition-colors">
                  <FaImage className="mx-auto text-4xl text-gray-500 mb-2" />
                  <p className="text-gray-400 mb-2">No image selected</p>
                  <label htmlFor="hero-image" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"><FaUpload /> Choose Image</label>
                </div>
              )}
              <input id="hero-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none">
                <option value={ProjectCategory.WEB_APP}>Web App</option>
                <option value={ProjectCategory.MOBILE_APP}>Mobile App</option>
                <option value={ProjectCategory.GAME}>Game</option>
                <option value={ProjectCategory.TOOL}>Tool</option>
                <option value={ProjectCategory.LIBRARY}>Library</option>
                <option value={ProjectCategory.AUTOMATION}>Automation</option>
                <option value={ProjectCategory.BLOCKCHAIN}>Blockchain</option>
                <option value={ProjectCategory.AI_ML}>AI/ML</option>
                <option value={ProjectCategory.OTHER}>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Short Description</label>
            <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Detailed Description (Optional)</label>
            <textarea value={formData.longDescription} onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })} rows={4} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" placeholder="Detailed project description, challenges faced, solutions implemented..." />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none">
              <option value={ProjectStatus.PLANNING}>Planning</option>
              <option value={ProjectStatus.IN_PROGRESS}>In Progress</option>
              <option value={ProjectStatus.COMPLETED}>Completed</option>
              <option value={ProjectStatus.ON_HOLD}>On Hold</option>
              <option value={ProjectStatus.ARCHIVED}>Archived</option>
            </select>
          </div>

          {/* Links */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Demo URL</label>
              <div className="relative">
                <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="url" value={formData.demoUrl} onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })} className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" placeholder="https://..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">GitHub URL</label>
              <div className="relative">
                <FaGithub className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="url" value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" placeholder="https://github.com/..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Video URL</label>
              <div className="relative">
                <FaPlay className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="url" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" placeholder="https://youtube.com/..." />
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium mb-2">Technologies</label>
            {formData.technologies.map((tech: any, index: number) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <input type="text" placeholder="Technology name" value={tech.name} onChange={(e) => { const newTech = [...formData.technologies]; newTech[index].name = e.target.value; setFormData({ ...formData, technologies: newTech }); }} className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" />
                <button type="button" onClick={() => removeTechnology(index)} className="p-2 text-red-500 hover:text-red-400 transition-colors rounded-full"><FaTrash /></button>
              </div>
            ))}
            <button type="button" onClick={addTechnology} className="text-sm text-[var(--accent-primary)] hover:underline mt-2">+ Add Technology</button>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium mb-2">Key Features</label>
            {formData.features.map((feature: any, index: number) => (
              <div key={index} className="mb-3 p-4 bg-black/30 rounded-lg">
                <input type="text" placeholder="Feature title" value={feature.title} onChange={(e) => { const newFeatures = [...formData.features]; newFeatures[index].title = e.target.value; setFormData({ ...formData, features: newFeatures }); }} className="w-full mb-2 px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" />
                <textarea placeholder="Feature description" value={feature.description} onChange={(e) => { const newFeatures = [...formData.features]; newFeatures[index].description = e.target.value; setFormData({ ...formData, features: newFeatures }); }} rows={2} className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" />
                <button type="button" onClick={() => removeFeature(index)} className="mt-2 p-2 text-red-500 hover:text-red-400 transition-colors rounded-full"><FaTrash /></button>
              </div>
            ))}
            <button type="button" onClick={addFeature} className="text-sm text-[var(--accent-primary)] hover:underline mt-2">+ Add Feature</button>
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium mb-2">Display Order</label>
            <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" placeholder="0 = default order" />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
          </div>

          {/* Publish Options */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4" /><span className="text-sm">Featured Project</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="w-4 h-4" /><span className="text-sm">Publish Immediately</span></label>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-[var(--accent-primary)] rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 flex items-center gap-2">{saving ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default function ProjectAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
    fetchProjects();
  };

  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth');
    if (isAuth === 'true') {
      setAuthenticated(true);
      fetchProjects();
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
        fetchProjects();
      } else {
        alert('Invalid password');
      }
    } catch (error) {
      alert('Authentication error');
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects?all=true');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"?`)) {
      return;
    }
    try {
      const response = await fetch(`/api/projects/${project.slug}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Project deleted successfully!');
        fetchProjects();
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  const handleTogglePublish = async (project: Project) => {
    try {
      const response = await fetch(`/api/projects/${project.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...project,
          published: !project.published,
        }),
      });

      if (response.ok) {
        alert(`Project ${project.published ? 'unpublished' : 'published'} successfully!`);
        fetchProjects();
      } else {
        const error = await response.json();
        alert(`Failed to update project: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project');
    }
  };

  const statusColors = {
    'planning': 'bg-gray-500',
    'in-progress': 'bg-yellow-500',
    'completed': 'bg-green-500',
    'on-hold': 'bg-orange-500',
    'archived': 'bg-red-500'
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Project Admin</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingProject(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] rounded-full font-medium"
            >
              <FaPlus /> New Project
            </motion.button>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-pulse text-2xl">Loading projects...</div>
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 bg-[var(--surface)] rounded-xl border border-white/10"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {project.heroImage && (
                      <img
                        src={project.heroImage}
                        alt={project.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold truncate">{project.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className={`px-2 py-0.5 ${statusColors[project.status]} text-white text-xs rounded-full capitalize`}>
                          {project.status.replace('-', ' ')}
                        </span>
                        <span className="px-2 py-0.5 bg-white/10 text-xs rounded-full capitalize">
                          {project.category.replace('-', ' ')}
                        </span>
                        {project.featured && (
                          <span className="px-2 py-0.5 bg-[var(--accent-primary)] text-white text-xs rounded-full">
                            FEATURED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <button onClick={() => handleEdit(project)} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Edit project">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleTogglePublish(project)} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title={project.published ? 'Unpublish project' : 'Publish project'}>
                      {project.published ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <button onClick={() => handleDelete(project)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Delete project">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showForm && (
        <ProjectForm
          onClose={handleCloseForm}
          editingProject={editingProject}
        />
      )}
    </div>
  );
}