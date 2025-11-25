import React, { useState, useRef, useEffect, useCallback } from 'react';
import { db } from '../../services/db';
import { Button } from '../../components/ui/Button';
import { Check, Upload, Image as ImageIcon, Plus, Trash2, Loader2, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Project, ProfileData } from '../../types';
import Cropper from 'react-easy-crop';
import { FadeIn } from '../../components/ui/FadeIn';

// --- Image Utils ---
const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Set canvas size to the crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg', 0.9);
}

// --- Reusable Image Uploader Component ---
interface ImageUploaderProps {
  currentImage?: string;
  onImageSelected: (base64: string) => void;
  label?: string;
  aspectRatio?: number; // e.g., 1 for square, 16/9 for project
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  currentImage, 
  onImageSelected, 
  label = "Upload Image",
  aspectRatio = 1 
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile(reader.result as string);
      setIsCropping(true);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
    // Reset input
    e.target.value = '';
  };

  const handleSaveCrop = async () => {
    if (!selectedFile || !croppedAreaPixels) return;
    
    setUploading(true);
    try {
      const croppedImage = await getCroppedImg(selectedFile, croppedAreaPixels);
      if (croppedImage) {
        onImageSelected(croppedImage);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to crop image');
    } finally {
      setUploading(false);
      setIsCropping(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      
      <div className="flex gap-4 items-start">
        {/* Image Preview Box */}
        <div className="w-32 h-24 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-50 flex items-center justify-center relative shadow-sm group">
          {currentImage ? (
            <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="text-slate-300 w-8 h-8" />
          )}
          {uploadSuccess && (
            <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center animate-fade-in-up">
              <Check className="text-white w-8 h-8" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-col gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/png, image/jpeg, image/webp"
            />
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isCropping}
              className="w-fit"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
            
            <p className="text-xs text-slate-400">Supported: JPG, PNG, WebP (Max 5MB)</p>
          </div>
        </div>
      </div>

      {/* Cropping Modal */}
      {isCropping && selectedFile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
              <h3 className="text-lg font-bold text-slate-800">Crop Image</h3>
              <button 
                onClick={() => setIsCropping(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="relative w-full h-[400px] bg-slate-900">
              <Cropper
                image={selectedFile}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-6 space-y-4 bg-white">
               <div className="flex items-center gap-4">
                 <ZoomOut size={16} className="text-slate-400" />
                 <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <ZoomIn size={16} className="text-slate-400" />
               </div>

               <div className="flex justify-end gap-3 pt-2">
                 <Button variant="ghost" onClick={() => setIsCropping(false)}>Cancel</Button>
                 <Button onClick={handleSaveCrop} disabled={uploading}>
                   {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                   {uploading ? 'Processing...' : 'Save Image'}
                 </Button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// --- Main Content Page ---
export const Content: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(db.getProfile());
  const [success, setSuccess] = useState(false);
  
  // Project editing state
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  useEffect(() => {
    // Ensure all array/obj properties exist
    setProfile(p => ({
       ...p,
       projects: p.projects || [],
       personalInfo: p.personalInfo || { dob: '', pob: '', gender: '', maritalStatus: '', nationality: '' },
       reference: p.reference || { name: '', role: '', email: '', phone: '', location: '' }
    }));
  }, []);

  const handleSave = () => {
    db.saveProfile(profile);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleExpChange = (idx: number, field: string, value: any) => {
    const newExp = [...profile.experience];
    newExp[idx] = { ...newExp[idx], [field]: value };
    setProfile({ ...profile, experience: newExp });
  };

  // --- Project Handlers ---
  const handleAddProject = () => {
    setEditingProject({
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      category: '',
      shortDescription: '',
      longDescription: '',
      tags: [],
      imageUrl: ''
    });
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject({ ...project });
    setIsProjectModalOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const updatedProjects = profile.projects.filter(p => p.id !== id);
      setProfile({ ...profile, projects: updatedProjects });
    }
  };

  const saveProject = () => {
    if (!editingProject || !editingProject.title) return;
    
    let updatedProjects = [...(profile.projects || [])];
    const index = updatedProjects.findIndex(p => p.id === editingProject.id);
    
    if (index >= 0) {
      updatedProjects[index] = editingProject as Project;
    } else {
      updatedProjects.push(editingProject as Project);
    }
    
    setProfile({ ...profile, projects: updatedProjects });
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-20">
      <div className="flex justify-between items-center sticky top-0 bg-gray-100 py-4 z-10">
        <h1 className="text-2xl font-bold text-slate-800">Portfolio Content</h1>
        <Button onClick={handleSave} className="flex items-center gap-2 shadow-lg transition-all hover:scale-105">
          {success ? <Check size={18} /> : null}
          {success ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      {/* --- Basic Info Section --- */}
      <FadeIn delay={100}>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold mb-6 pb-2 border-b border-slate-100">Personal Information</h2>
          
          {/* Profile Image Upload */}
          <div className="mb-6">
            <ImageUploader 
              label="Profile Picture (Square Crop)"
              currentImage={profile.imageUrl}
              aspectRatio={1}
              onImageSelected={(url) => setProfile(prev => ({ ...prev, imageUrl: url }))} 
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Full Name</label>
              <input 
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Job Title</label>
              <input 
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={profile.title}
                onChange={e => setProfile({...profile, title: e.target.value})}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1 text-slate-700">Professional Summary</label>
            <textarea 
              rows={4}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={profile.summary}
              onChange={e => setProfile({...profile, summary: e.target.value})}
            />
          </div>
        </div>
      </FadeIn>
      
      {/* --- Extended Personal Info & Reference --- */}
      <FadeIn delay={200}>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h2 className="text-lg font-bold mb-6 pb-2 border-b border-slate-100">PDF Details (Resume)</h2>
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                 <h3 className="font-semibold text-slate-700">Personal Info</h3>
                 <input className="w-full p-2 border rounded text-sm" placeholder="DOB" value={profile.personalInfo?.dob || ''} onChange={e => setProfile({...profile, personalInfo: {...profile.personalInfo, dob: e.target.value}})} />
                 <input className="w-full p-2 border rounded text-sm" placeholder="Place of Birth" value={profile.personalInfo?.pob || ''} onChange={e => setProfile({...profile, personalInfo: {...profile.personalInfo, pob: e.target.value}})} />
                 <input className="w-full p-2 border rounded text-sm" placeholder="Nationality" value={profile.personalInfo?.nationality || ''} onChange={e => setProfile({...profile, personalInfo: {...profile.personalInfo, nationality: e.target.value}})} />
              </div>
              <div className="space-y-3">
                 <h3 className="font-semibold text-slate-700">Reference</h3>
                 <input className="w-full p-2 border rounded text-sm" placeholder="Reference Name" value={profile.reference?.name || ''} onChange={e => setProfile({...profile, reference: {...profile.reference, name: e.target.value}})} />
                 <input className="w-full p-2 border rounded text-sm" placeholder="Reference Role" value={profile.reference?.role || ''} onChange={e => setProfile({...profile, reference: {...profile.reference, role: e.target.value}})} />
                 <input className="w-full p-2 border rounded text-sm" placeholder="Reference Email" value={profile.reference?.email || ''} onChange={e => setProfile({...profile, reference: {...profile.reference, email: e.target.value}})} />
              </div>
           </div>
        </div>
      </FadeIn>

      {/* --- Featured Projects Section --- */}
      <FadeIn delay={300}>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold">Featured Projects</h2>
              <p className="text-xs text-slate-500">Manage IT & Multimedia case studies</p>
            </div>
            <Button size="sm" onClick={handleAddProject} variant="secondary">
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {profile.projects?.map((project) => (
              <div key={project.id} className="border border-slate-200 rounded-lg overflow-hidden group hover:border-blue-400 transition-colors bg-slate-50">
                <div className="h-32 bg-slate-200 overflow-hidden relative">
                   {project.imageUrl ? (
                     <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                        <ImageIcon className="w-8 h-8 opacity-50" />
                     </div>
                   )}
                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEditProject(project)}>Edit</Button>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-800 truncate pr-2">{project.title}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">{project.category}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{project.shortDescription}</p>
                </div>
              </div>
            ))}
            {(!profile.projects || profile.projects.length === 0) && (
              <div className="col-span-2 text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                No projects added yet. Click "Add Project" to showcase your IT work.
              </div>
            )}
          </div>
        </div>
      </FadeIn>

      {/* --- Experience Editor --- */}
      <FadeIn delay={400}>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-slate-100">Experience</h2>
          <div className="space-y-4">
            {profile.experience.map((job, idx) => (
              <div key={job.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 hover:border-blue-300 transition-colors">
                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <input 
                    className="p-2 border rounded text-sm font-bold"
                    value={job.role}
                    onChange={e => handleExpChange(idx, 'role', e.target.value)}
                    placeholder="Role"
                  />
                   <input 
                    className="p-2 border rounded text-sm"
                    value={job.company}
                    onChange={e => handleExpChange(idx, 'company', e.target.value)}
                    placeholder="Company"
                  />
                </div>
                <input 
                    className="w-full p-2 border rounded text-sm text-slate-600"
                    value={job.duration}
                    onChange={e => handleExpChange(idx, 'duration', e.target.value)}
                    placeholder="Duration"
                  />
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* --- Project Edit Modal --- */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-800">
                {editingProject.title ? 'Edit Project' : 'New Project'}
              </h3>
              <button 
                onClick={() => setIsProjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Project Image Upload with 16/9 aspect ratio */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                 <ImageUploader 
                   label="Project Cover Image (16:9 Landscape)"
                   aspectRatio={16/9}
                   currentImage={editingProject.imageUrl}
                   onImageSelected={(url) => setEditingProject(prev => ({ ...prev!, imageUrl: url }))}
                 />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Title</label>
                  <input 
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editingProject.title}
                    onChange={e => setEditingProject({...editingProject!, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input 
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editingProject.category}
                    onChange={e => setEditingProject({...editingProject!, category: e.target.value})}
                    placeholder="e.g. Web Dev, Multimedia"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Short Description (Card)</label>
                <input 
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editingProject.shortDescription}
                  onChange={e => setEditingProject({...editingProject!, shortDescription: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Long Description (Modal)</label>
                <textarea 
                  rows={5}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editingProject.longDescription}
                  onChange={e => setEditingProject({...editingProject!, longDescription: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input 
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editingProject.tags?.join(', ')}
                  onChange={e => setEditingProject({...editingProject!, tags: e.target.value.split(',').map(t => t.trim())})}
                  placeholder="React, Node.js, Design"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl sticky bottom-0">
              <Button variant="ghost" onClick={() => setIsProjectModalOpen(false)}>Cancel</Button>
              <Button onClick={saveProject}>Save Project</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};