// app/admin/vehicles/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaImage, FaUpload, FaCar, FaMotorcycle, FaTruckPickup, FaTimes } from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import type { Vehicle, VehicleBlogPost, VehicleTag, Spec, Modification } from '@/types/vehicle';

// --- Reusable Form Input Component ---
const FormInput = ({ label, value, onChange, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
      {...props}
    />
  </div>
);

// --- Reusable Textarea Component ---
const FormTextarea = ({ label, value, onChange, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
      {...props}
    />
  </div>
);

// --- Component for Editing Vehicle Overview ---
const VehicleOverviewForm = ({
  vehicle,
  onUpdate,
}: {
  vehicle: Vehicle;
  onUpdate: () => void;
}) => {
  const [formData, setFormData] = useState(vehicle);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(vehicle);
  }, [vehicle]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'heroImage' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (field === 'heroImage') {
        setFormData(prev => ({ ...prev, heroImage: base64String }));
      } else {
        setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), base64String] }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  
  const handleSpecChange = (index: number, field: 'label' | 'value', value: string) => {
      const newSpecs = [...(formData.specs || [])];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      setFormData(prev => ({ ...prev, specs: newSpecs }));
  };

  const handleModChange = (index: number, field: 'category' | 'items', value: string | string[]) => {
      const newMods = [...(formData.modifications || [])];
      newMods[index] = { ...newMods[index], [field]: value };
      setFormData(prev => ({ ...prev, modifications: newMods }));
  };

  const addSpec = () => setFormData(prev => ({ ...prev, specs: [...(prev.specs || []), { id: `new-${Date.now()}`, label: '', value: '', order: 0, vehicleId: vehicle.id }] }));
  const removeSpec = (index: number) => setFormData(prev => ({ ...prev, specs: (prev.specs || []).filter((_, i) => i !== index) }));
  
  const addMod = () => setFormData(prev => ({ ...prev, modifications: [...(prev.modifications || []), { id: `new-${Date.now()}`, category: '', items: [], order: 0, vehicleId: vehicle.id }] }));
  const removeMod = (index: number) => setFormData(prev => ({ ...prev, modifications: (prev.modifications || []).filter((_, i) => i !== index) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/vehicles/${vehicle.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...formData,
            story: Array.isArray(formData.story) ? formData.story : (formData.story as unknown as string).split('\n').filter(Boolean),
            modifications: (formData.modifications || []).map(mod => ({
                ...mod,
                items: typeof mod.items === 'string' ? (mod.items as string).split('\n').filter(Boolean) : mod.items,
            }))
        }),
      });

      if (response.ok) {
        alert('Vehicle updated successfully!');
        onUpdate();
      } else {
        const error = await response.json();
        alert(`Failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form 
        key={vehicle.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit} 
        className="space-y-8"
    >
        <FormInput label="Vehicle Name" value={formData.name} onChange={(e: any) => setFormData(p => ({...p, name: e.target.value}))} />
        <FormInput label="Category" value={formData.category} onChange={(e: any) => setFormData(p => ({...p, category: e.target.value}))} />
        <FormTextarea label="Story (one paragraph per line)" value={(formData.story || []).join('\n')} onChange={(e: any) => setFormData(p => ({...p, story: e.target.value.split('\n')}))} rows={5} />
        
        <div>
            <label className="block text-sm font-medium mb-2">Hero Image</label>
            {formData.heroImage && <img src={formData.heroImage} alt="Hero" className="w-48 h-auto rounded-lg mb-2" />}
            <input type="file" accept="image/*" onChange={e => handleImageChange(e, 'heroImage')} className="text-sm" />
        </div>

        <div>
            <label className="block text-sm font-medium mb-2">Gallery</label>
            <div className="flex flex-wrap gap-4">
                {(formData.gallery || []).map((img, i) => (
                    <div key={i} className="relative">
                        <img src={img} alt="Gallery" className="w-32 h-32 object-cover rounded-lg" />
                        <button type="button" onClick={() => setFormData(p => ({...p, gallery: p.gallery?.filter((_, idx) => idx !== i)}))} className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-full"><FaTimes size={12}/></button>
                    </div>
                ))}
                <label className="w-32 h-32 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center cursor-pointer hover:border-[var(--accent-primary)]">
                    <FaPlus />
                    <input type="file" accept="image/*" onChange={e => handleImageChange(e, 'gallery')} className="hidden" />
                </label>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Specifications</h3>
            {(formData.specs || []).map((spec, i) => (
                <div key={spec.id} className="flex gap-2 items-end">
                    <div className="flex-1"><FormInput label="Label" value={spec.label} onChange={(e: any) => handleSpecChange(i, 'label', e.target.value)} /></div>
                    <div className="flex-1"><FormInput label="Value" value={spec.value} onChange={(e: any) => handleSpecChange(i, 'value', e.target.value)} /></div>
                    <button type="button" onClick={() => removeSpec(i)} className="p-3 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/40"><FaTrash /></button>
                </div>
            ))}
            <button type="button" onClick={addSpec} className="text-sm text-[var(--accent-primary)] hover:underline">+ Add Specification</button>
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Modifications</h3>
            {(formData.modifications || []).map((mod, i) => (
                <div key={mod.id} className="flex gap-2 items-start p-4 bg-black/30 rounded-lg">
                    <div className="flex-1 space-y-2">
                       <FormInput label="Mod Category" value={mod.category} onChange={(e: any) => handleModChange(i, 'category', e.target.value)} />
                       <FormTextarea label="Items (one per line)" value={Array.isArray(mod.items) ? mod.items.join('\n') : ''} onChange={(e: any) => handleModChange(i, 'items', e.target.value.split('\n'))} rows={4} />
                    </div>
                    <button type="button" onClick={() => removeMod(i)} className="p-3 mt-8 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/40"><FaTrash /></button>
                </div>
            ))}
            <button type="button" onClick={addMod} className="text-sm text-[var(--accent-primary)] hover:underline">+ Add Modification Section</button>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
            <button type="submit" disabled={saving} className="px-8 py-3 bg-[var(--accent-primary)] rounded-full font-medium hover:bg-opacity-80 transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    </motion.form>
  );
};


// --- Component for Creating/Editing Blog Posts ---
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
    fetchTags();
  }, []);

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
          <div>
            <label className="block text-sm font-medium mb-2">Hero Image</label>
            <div className="space-y-4">
              {heroImagePreview ? (
                <div className="relative">
                  <img src={heroImagePreview} alt="Post preview" className="w-full max-h-64 object-cover rounded-lg" />
                  <button type="button" onClick={() => { setHeroImagePreview(null); const input = document.getElementById('hero-image-post') as HTMLInputElement; if(input) input.value = ''; }} className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500"><FaTrash /></button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-[var(--accent-primary)]/50">
                  <FaImage className="mx-auto text-4xl text-gray-500 mb-2" />
                  <p className="text-gray-400 mb-2">No image selected</p>
                  <label htmlFor="hero-image-post" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20"><FaUpload /> Choose Image</label>
                </div>
              )}
              <input id="hero-image-post" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </div>

          <FormInput label="Title" required value={formData.title} onChange={(e: any) => setFormData({ ...formData, title: e.target.value })} />
          <FormTextarea label="Excerpt (Optional)" value={formData.excerpt} onChange={(e: any) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} placeholder="A short summary that appears in blog listings" />
          <FormTextarea label="Content (Markdown supported)" required value={formData.content} onChange={(e: any) => setFormData({ ...formData, content: e.target.value })} rows={10} />

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm flex items-center gap-2">
                  {tag}
                  <button type="button" onClick={() => setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) })} className="text-red-400 hover:text-red-300">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }} placeholder="Add a tag" className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm" />
              <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-white/10 text-sm rounded-lg hover:bg-white/20">Add Tag</button>
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4" /> <span className="text-sm">Featured Post</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="w-4 h-4" /> <span className="text-sm">Publish Immediately</span></label>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-[var(--accent-primary)] rounded-lg hover:bg-opacity-80 disabled:opacity-50">{saving ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// --- Helper to get vehicle icon ---
const getVehicleIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'motorcycle': return <FaMotorcycle />;
    case 'car': return <FaCar />;
    case 'obs truck': return <FaTruckPickup />;
    default: return <FaCar />;
  }
};

// --- Main Page Component ---
export default function VehicleAdminPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [posts, setPosts] = useState<VehicleBlogPost[]>([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<VehicleBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [view, setView] = useState<'posts' | 'overview'>('posts');

  const fetchVehicles = useCallback(async (slugToSelect?: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/vehicles');
      const data = await response.json();
      setVehicles(data);
      if (data.length > 0) {
        const vehicleToSelect = data.find((v: Vehicle) => v.slug === slugToSelect) || data[0];
        setSelectedVehicle(vehicleToSelect);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth');
    if (isAuth === 'true') {
      setAuthenticated(true);
      fetchVehicles();
    } else {
      setLoading(false);
    }
  }, [fetchVehicles]);

  const fetchPosts = useCallback(async (vehicleSlug: string) => {
    try {
        const response = await fetch(`/api/vehicles/${vehicleSlug}/posts`);
        if (!response.ok) {
            console.error("Failed to fetch posts, status:", response.status);
            setPosts([]);
            return;
        }
        const data = await response.json();
        if (Array.isArray(data)) {
            setPosts(data);
        } else {
            console.error("API did not return an array for posts:", data);
            setPosts([]);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
    }
  }, []);

  useEffect(() => {
    if (selectedVehicle) {
      fetchPosts(selectedVehicle.slug);
    }
  }, [selectedVehicle, fetchPosts]);

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

  const handleClosePostForm = () => {
    setShowPostForm(false);
    setEditingPost(null);
    if (selectedVehicle) {
      fetchPosts(selectedVehicle.slug);
    }
  };

  const handleEditPost = (post: VehicleBlogPost) => {
    setEditingPost(post);
    setShowPostForm(true);
  };

  const handleDeletePost = async (post: VehicleBlogPost) => {
    if (!selectedVehicle || !confirm(`Are you sure you want to delete "${post.title}"?`)) return;
    try {
      await fetch(`/api/vehicles/${selectedVehicle.slug}/posts/${post.slug}`, { method: 'DELETE' });
      alert('Post deleted!');
      fetchPosts(selectedVehicle.slug);
    } catch (error) {
      alert('Error deleting post');
    }
  };

  const handleTogglePublish = async (post: VehicleBlogPost) => {
    if (!selectedVehicle) return;
    try {
      await fetch(`/api/vehicles/${selectedVehicle.slug}/posts/${post.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, published: !post.published, tags: post.tags?.map(t => t.name) }),
      });
      alert(`Post ${post.published ? 'unpublished' : 'published'}!`);
      fetchPosts(selectedVehicle.slug);
    } catch (error) {
      alert('Error updating post');
    }
  };

  if (!authenticated) {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="w-full max-w-md p-8 bg-[var(--surface)] rounded-2xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
                <form onSubmit={handleAuth}>
                    <input type="password" placeholder="Enter admin password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none mb-4" autoFocus />
                    <button type="submit" className="w-full py-3 bg-[var(--accent-primary)] rounded-lg font-medium hover:bg-opacity-80 transition-colors">Access Admin</button>
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
          <h1 className="text-4xl font-bold mb-8">Vehicle Admin</h1>
          {loading ? (
            <div className="text-center py-20"><div className="animate-pulse text-2xl">Loading vehicles...</div></div>
          ) : (
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <h2 className="text-xl font-semibold mb-4">Select Vehicle</h2>
                <div className="space-y-2">
                  {vehicles.map((vehicle) => (
                    <button key={vehicle.id} onClick={() => { setSelectedVehicle(vehicle); setView('posts'); }} className={`w-full p-4 rounded-lg text-left transition-all ${selectedVehicle?.id === vehicle.id ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--surface)] hover:bg-white/10'}`}>
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

              <div className="lg:col-span-3">
                {selectedVehicle ? (
                  <>
                    <div className="flex border-b border-white/10 mb-6">
                        <button onClick={() => setView('posts')} className={`py-3 px-5 font-medium transition-colors ${view === 'posts' ? 'text-white border-b-2 border-[var(--accent-primary)]' : 'text-gray-400 hover:text-white'}`}>Blog Posts</button>
                        <button onClick={() => setView('overview')} className={`py-3 px-5 font-medium transition-colors ${view === 'overview' ? 'text-white border-b-2 border-[var(--accent-primary)]' : 'text-gray-400 hover:text-white'}`}>Edit Overview</button>
                    </div>

                    <AnimatePresence mode="wait">
                        {view === 'posts' ? (
                            <motion.div key="posts" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                                <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Blog Posts for {selectedVehicle.name}</h2>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setEditingPost(null); setShowPostForm(true); }} className="flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] rounded-full font-medium"><FaPlus /> New Post</motion.button>
                                </div>
                                <div className="grid gap-4">
                                  {posts.length === 0 ? (<div className="text-center py-12 bg-[var(--surface)] rounded-xl"><p className="text-gray-400">No blog posts yet.</p></div>) : (
                                    posts.map((post) => (
                                      <div key={post.id} className="flex items-center justify-between p-4 bg-[var(--surface)] rounded-xl border border-white/10">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                          {post.heroImage && <img src={post.heroImage} alt={post.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />}
                                          <div className="min-w-0"><h3 className="text-lg font-semibold truncate">{post.title}</h3><div className="flex items-center gap-2 mt-1">{post.featured && <span className="px-2 py-0.5 bg-[var(--accent-primary)] text-xs rounded-full">FEATURED</span>}<span className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span></div></div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                          <button onClick={() => handleEditPost(post)} className="p-2 hover:bg-white/10 rounded-lg" title="Edit"><FaEdit /></button>
                                          <button onClick={() => handleTogglePublish(post)} className="p-2 hover:bg-white/10 rounded-lg" title={post.published ? 'Unpublish' : 'Publish'}>{post.published ? <FaEyeSlash /> : <FaEye />}</button>
                                          <button onClick={() => handleDeletePost(post)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg" title="Delete"><FaTrash /></button>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="overview" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                                <VehicleOverviewForm vehicle={selectedVehicle} onUpdate={() => fetchVehicles(selectedVehicle.slug)} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </>
                ) : (
                    <div className="text-center py-20"><p className="text-gray-400">Select a vehicle to manage its content.</p></div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {showPostForm && selectedVehicle && (
          <BlogPostForm onClose={handleClosePostForm} vehicleSlug={selectedVehicle.slug} editingPost={editingPost}/>
        )}
      </AnimatePresence>
    </div>
  );
}