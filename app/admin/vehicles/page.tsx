// app/admin/vehicles/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaImage, FaUpload, FaCar, FaMotorcycle, FaTruck } from 'react-icons/fa';
import Navigation from '../../components/Navigation';

// Type definitions (since we're importing from a file that doesn't exist yet)
interface VehicleTag {
  id: string;
  name: string;
  slug: string;
}

interface VehicleBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  heroImage?: string | null;
  heroImageAlt?: string | null;
  published: boolean;
  featured: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  vehicleId: string;
  tags?: VehicleTag[];
}

interface Vehicle {
  id: string;
  slug: string;
  name: string;
  category: string;
  heroImage?: string | null;
  gallery?: string[];
  story?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Blog Post Form Component
const BlogPostForm = ({ 
  onClose, 
  vehicleSlug, 
  editingPost 
}: { 
  onClose: () => void; 
  vehicleSlug: string; 
  editingPost?: VehicleBlogPost | null;
}) => {
  const [formData, setFormData] = useState({
    title: editingPost?.title || '',
    excerpt: editingPost?.excerpt || '',
    content: editingPost?.content || '',
    tags: editingPost?.tags?.map(t => t.name) || [],
    featured: editingPost?.featured || false,
    published: editingPost?.published || false,
  });
  
  const [saving, setSaving] = useState(false);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(editingPost?.heroImage || null);
  const [availableTags, setAvailableTags] = useState<VehicleTag[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/vehicles/tags');
      if (res.ok) {
        const data = await res.json();
        setAvailableTags(data);
      }
    } catch (error) {
      console.error("Failed to fetch tags", error);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = {
        ...formData,
        heroImage: heroImagePreview,
      };
      
      const url = editingPost 
        ? `/api/vehicles/${vehicleSlug}/posts/${editingPost.slug}`
        : `/api/vehicles/${vehicleSlug}/posts`;
      const method = editingPost ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        alert(editingPost ? 'Post updated successfully!' : 'Post created successfully!');
        onClose();
      } else {
        const error = await response.json();
        alert(`Failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error handling post:', error);
      alert('Error: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    const tagName = newTag.trim();
    if (tagName && !formData.tags.includes(tagName)) {
      setFormData({ ...formData, tags: [...formData.tags, tagName] });
      if (!availableTags.find(t => t.name === tagName)) {
        setAvailableTags([...availableTags, { 
          id: tagName, 
          name: tagName, 
          slug: tagName.toLowerCase().replace(/\s+/g, '-') 
        }]);
      }
    }
    setNewTag('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" 
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-4xl bg-[var(--surface)] rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-3xl font-bold mb-6">
          {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hero Image */}
          <div>
            <label className="block text-sm font-medium mb-2">Hero Image</label>
            <div className="space-y-4">
              {heroImagePreview ? (
                <div className="relative">
                  <img 
                    src={heroImagePreview} 
                    alt="Post preview" 
                    className="w-full max-h-64 object-cover rounded-lg" 
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      setHeroImagePreview(null);
                      const fileInput = document.getElementById('hero-image') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }} 
                    className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-[var(--accent-primary)]/50 transition-colors">
                  <FaImage className="mx-auto text-4xl text-gray-500 mb-2" />
                  <p className="text-gray-400 mb-2">No image selected</p>
                  <label 
                    htmlFor="hero-image" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                  >
                    <FaUpload /> Choose Image
                  </label>
                </div>
              )}
              <input 
                id="hero-image" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input 
              type="text" 
              required 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" 
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium mb-2">Excerpt (Optional)</label>
            <p className="text-xs text-gray-500 mb-2">A short summary that appears in blog listings</p>
            <textarea 
              value={formData.excerpt} 
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} 
              rows={2}
              className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" 
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <p className="text-xs text-gray-500 mb-2">Markdown is supported</p>
            <textarea 
              required
              value={formData.content} 
              onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
              rows={10}
              className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none font-mono text-sm" 
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-white/10 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => setFormData({ 
                      ...formData, 
                      tags: formData.tags.filter((_, i) => i !== index) 
                    })}
                    className="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => { 
                  if (e.key === 'Enter') { 
                    e.preventDefault(); 
                    handleAddTag(); 
                  } 
                }}
                placeholder="Add a tag"
                className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none text-sm"
              />
              <button 
                type="button" 
                onClick={handleAddTag} 
                className="px-4 py-2 bg-white/10 text-sm rounded-lg hover:bg-white/20 transition-colors"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={formData.featured} 
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} 
                className="w-4 h-4" 
              />
              <span className="text-sm">Featured Post</span>
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={formData.published} 
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })} 
                className="w-4 h-4" 
              />
              <span className="text-sm">Publish Immediately</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-4 border-t border-white/10">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving} 
              className="px-6 py-2 bg-[var(--accent-primary)] rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Vehicle icon helper
const getVehicleIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'motorcycle': return <FaMotorcycle />;
    case 'car': return <FaCar />;
    case 'obs truck': return <FaTruck />;
    default: return <FaCar />;
  }
};

export default function VehicleAdminPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [posts, setPosts] = useState<VehicleBlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<VehicleBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth');
    if (isAuth === 'true') {
      setAuthenticated(true);
      fetchVehicles();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedVehicle) {
      fetchPosts(selectedVehicle.slug);
    }
  }, [selectedVehicle]);

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
        fetchVehicles();
      } else {
        alert('Invalid password');
      }
    } catch (error) {
      alert('Authentication error');
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/vehicles');
      const data = await response.json();
      setVehicles(data);
      if (data.length > 0) {
        setSelectedVehicle(data[0]);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (vehicleSlug: string) => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleSlug}/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPost(null);
    if (selectedVehicle) {
      fetchPosts(selectedVehicle.slug);
    }
  };

  const handleEdit = (post: VehicleBlogPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = async (post: VehicleBlogPost) => {
    if (!selectedVehicle) return;
    
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/vehicles/${selectedVehicle.slug}/posts/${post.slug}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('Post deleted successfully!');
        fetchPosts(selectedVehicle.slug);
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  const handleTogglePublish = async (post: VehicleBlogPost) => {
    if (!selectedVehicle) return;
    
    try {
      const response = await fetch(`/api/vehicles/${selectedVehicle.slug}/posts/${post.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          published: !post.published,
          tags: post.tags?.map(t => t.name)
        }),
      });

      if (response.ok) {
        alert(`Post ${post.published ? 'unpublished' : 'published'} successfully!`);
        fetchPosts(selectedVehicle.slug);
      } else {
        const error = await response.json();
        alert(`Failed to update post: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post');
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Vehicle Blog Admin</h1>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-pulse text-2xl">Loading vehicles...</div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Vehicle Selector */}
              <div className="lg:col-span-1">
                <h2 className="text-xl font-semibold mb-4">Select Vehicle</h2>
                <div className="space-y-2">
                  {vehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle)}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        selectedVehicle?.id === vehicle.id
                          ? 'bg-[var(--accent-primary)] text-white'
                          : 'bg-[var(--surface)] hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getVehicleIcon(vehicle.category)}</span>
                        <div>
                          <div className="font-medium">{vehicle.name}</div>
                          <div className="text-sm opacity-75">{vehicle.category}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts List */}
              <div className="lg:col-span-3">
                {selectedVehicle && (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">
                        Blog Posts for {selectedVehicle.name}
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingPost(null);
                          setShowForm(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] rounded-full font-medium"
                      >
                        <FaPlus /> New Post
                      </motion.button>
                    </div>

                    <div className="grid gap-4">
                      {posts.length === 0 ? (
                        <div className="text-center py-12 bg-[var(--surface)] rounded-xl">
                          <p className="text-gray-400">No blog posts yet for this vehicle.</p>
                        </div>
                      ) : (
                        posts.map((post) => (
                          <div
                            key={post.id}
                            className="flex items-center justify-between p-4 bg-[var(--surface)] rounded-xl border border-white/10"
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              {post.heroImage && (
                                <img
                                  src={post.heroImage}
                                  alt={post.title}
                                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                />
                              )}
                              <div className="min-w-0">
                                <h3 className="text-lg font-semibold truncate">{post.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  {post.featured && (
                                    <span className="px-2 py-0.5 bg-[var(--accent-primary)] text-xs rounded-full">
                                      FEATURED
                                    </span>
                                  )}
                                  <span className="text-sm text-gray-400">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                              <button 
                                onClick={() => handleEdit(post)} 
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                                title="Edit post"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleTogglePublish(post)} 
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                                title={post.published ? 'Unpublish post' : 'Publish post'}
                              >
                                {post.published ? <FaEyeSlash /> : <FaEye />}
                              </button>
                              <button 
                                onClick={() => handleDelete(post)} 
                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" 
                                title="Delete post"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {showForm && selectedVehicle && (
        <BlogPostForm
          onClose={handleCloseForm}
          vehicleSlug={selectedVehicle.slug}
          editingPost={editingPost}
        />
      )}
    </div>
  );
}