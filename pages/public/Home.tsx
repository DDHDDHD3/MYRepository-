
import React, { useState, useEffect } from 'react';
import { Download, Mail, MapPin, Phone, ExternalLink, Briefcase, GraduationCap, CheckCircle2, Send, X, Monitor, Camera, Server, ArrowRight, Loader2 } from 'lucide-react';
import { db } from '../../services/db';
import { Button } from '../../components/ui/Button';
import { FadeIn } from '../../components/ui/FadeIn';
import { Project } from '../../types';

export const Home: React.FC = () => {
  const profile = db.getProfile();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', body: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadCV = () => {
    setIsGeneratingPDF(true);
    
    // Scroll to top to ensure clean capture context (helps html2canvas)
    window.scrollTo(0, 0);

    // Allow React to render the CV structure in the visible overlay
    // Then trigger html2pdf
    setTimeout(async () => {
      const element = document.getElementById('cv-content');
      if (element && (window as any).html2pdf) {
        try {
          const opt = {
            margin: 0, // No margin, we handle padding in CSS
            filename: `${profile.name.replace(/\s+/g, '_')}_CV.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
              scale: 2, 
              useCORS: true, 
              logging: false,
              scrollY: 0, // CRITICAL: Forces capture from top of element, fixing blank pages on scrolled view
              scrollX: 0,
              windowWidth: document.documentElement.offsetWidth,
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };
          await (window as any).html2pdf().set(opt).from(element).save();
        } catch (error) {
          console.error("PDF Generation failed", error);
          alert("Failed to generate PDF. You can try printing the page.");
        }
      } else {
        alert("PDF generator not ready. Please try again.");
      }
      setIsGeneratingPDF(false);
    }, 1500); // Wait 1.5s to ensure all styles and images are fully applied
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await db.sendMessage(formData);
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({ name: '', email: '', subject: '', body: '' });
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  // Helper to get icon based on category
  const getProjectIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('video') || cat.includes('photo') || cat.includes('multimedia')) return <Camera className="w-6 h-6" />;
    if (cat.includes('system') || cat.includes('backend') || cat.includes('mean')) return <Server className="w-6 h-6" />;
    return <Monitor className="w-6 h-6" />;
  };

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      
      {/* Hero Section */}
      <section id="home" className="relative min-h-[90vh] flex items-center justify-center bg-white overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 animate-pulse-slow"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <FadeIn direction="up">
            <div className="inline-block mb-4 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold tracking-wide uppercase">
              Portfolio
            </div>
          </FadeIn>
          
          <FadeIn direction="up" delay={200}>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
              Hello, I'm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {profile.name}
              </span>
            </h1>
          </FadeIn>

          <FadeIn direction="up" delay={400}>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 font-light">
              {profile.title}
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})}>
                Contact Me
              </Button>
              <Button size="lg" variant="secondary" onClick={handleDownloadCV} disabled={isGeneratingPDF}>
                {isGeneratingPDF ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {isGeneratingPDF ? 'Preparing PDF...' : 'Download CV'}
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn direction="right" className="order-2 md:order-1">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">About Me</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                {profile.summary}
              </p>
              <div className="space-y-4">
                <div className="flex items-center text-slate-600 group">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <MapPin className="w-4 h-4" />
                  </div>
                  {profile.location}
                </div>
                <div className="flex items-center text-slate-600 group">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  {profile.email}
                </div>
                <div className="flex items-center text-slate-600 group">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  {profile.phone}
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn direction="left" className="order-1 md:order-2 flex justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 bg-slate-200 rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 border-4 border-white">
               <img 
                 src={profile.imageUrl || "https://picsum.photos/400/400?grayscale"} 
                 alt={profile.name} 
                 className="w-full h-full object-cover" 
                 crossOrigin="anonymous"
               />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="bg-slate-50 py-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Skills & Expertise</h2>
              <p className="text-slate-600 mt-2">Technical and professional capabilities</p>
            </div>
          </FadeIn>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {profile.skills.map((skillGroup, idx) => (
              <FadeIn key={idx} direction="up" delay={idx * 100} className="h-full">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300 h-full">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">{skillGroup.category}</h3>
                  <ul className="space-y-3">
                    {skillGroup.items.map((skill, sIdx) => (
                      <li key={sIdx} className="flex items-start text-slate-600">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                        <span className="text-sm">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Education */}
      <section id="experience" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="grid md:grid-cols-2 gap-16">
          
          {/* Experience */}
          <div>
            <FadeIn direction="up">
              <div className="flex items-center gap-3 mb-8">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Work Experience</h2>
              </div>
            </FadeIn>
            <div className="space-y-12 border-l-2 border-blue-100 pl-8 ml-3">
              {profile.experience.map((job, idx) => (
                <FadeIn key={job.id} direction="left" delay={idx * 200}>
                  <div className="relative group">
                    <div className="absolute -left-[41px] top-0 w-5 h-5 bg-blue-600 rounded-full ring-4 ring-white group-hover:scale-125 transition-transform duration-300"></div>
                    <h3 className="text-xl font-bold text-slate-900">{job.role}</h3>
                    <div className="flex justify-between items-center mt-1 mb-4 text-sm">
                      <span className="font-semibold text-blue-600">{job.company}</span>
                      <span className="text-slate-500">{job.duration}</span>
                    </div>
                    <ul className="space-y-2">
                      {job.description.map((desc, i) => (
                        <li key={i} className="text-slate-600 text-sm list-disc list-inside">{desc}</li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <FadeIn direction="up" delay={200}>
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Education</h2>
              </div>
            </FadeIn>
            <div className="space-y-8">
              {profile.education.map((edu, idx) => (
                <FadeIn key={edu.id} direction="right" delay={idx * 200 + 300}>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{edu.degree}</h3>
                      <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">{edu.year}</span>
                    </div>
                    <p className="text-slate-600">{edu.school}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="bg-slate-900 py-20 text-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
               <p className="text-slate-400">Showcasing multimedia and development capabilities</p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {profile.projects?.map((project, idx) => (
              <FadeIn key={project.id} direction="up" delay={idx * 150} className="h-full">
                <div className="group h-full flex flex-col relative overflow-hidden rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 transition-colors">
                  <div className="aspect-video bg-slate-700 overflow-hidden relative">
                    <img 
                      src={project.imageUrl || `https://picsum.photos/600/400?random=${idx}`} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 text-blue-400 text-sm font-medium">
                       {getProjectIcon(project.category)}
                       <span>{project.category}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                    <p className="text-slate-400 text-sm mb-4 flex-1">{project.shortDescription}</p>
                    
                    <button 
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium mt-auto"
                    >
                      View Details <ExternalLink className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
            {(!profile.projects || profile.projects.length === 0) && (
              <div className="col-span-3 text-center py-10 text-slate-500">
                <p>Projects are being updated. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setSelectedProject(null)}
          ></div>
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-[101] shadow-2xl animate-fade-in-up">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-slate-100 transition-colors z-10"
            >
              <X size={24} className="text-slate-600" />
            </button>
            
            <div className="h-64 md:h-80 w-full relative">
               <img 
                 src={selectedProject.imageUrl} 
                 alt={selectedProject.title} 
                 className="w-full h-full object-cover"
                 crossOrigin="anonymous"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                 <div>
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-2 uppercase tracking-wider">
                      {selectedProject.category}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">{selectedProject.title}</h2>
                 </div>
               </div>
            </div>

            <div className="p-8 space-y-8">
               <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Project Overview</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{selectedProject.longDescription || selectedProject.shortDescription}</p>
               </div>
               
               {selectedProject.tags && selectedProject.tags.length > 0 && (
                 <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-sm font-medium border border-slate-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                 </div>
               )}
               
               <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <Button onClick={() => setSelectedProject(null)}>
                     Close Details
                  </Button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className="max-w-3xl mx-auto px-4 scroll-mt-24">
        <FadeIn direction="up">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Get In Touch</h2>
              <p className="text-slate-600">Have a question or want to work together?</p>
            </div>
            
            {submitSuccess ? (
               <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center animate-fade-in-up">
                 <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
                 <p className="font-bold">Message Sent!</p>
                 <p className="text-sm">Thank you for reaching out. I'll get back to you soon.</p>
               </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      required
                      type="email"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    value={formData.body}
                    onChange={e => setFormData({...formData, body: e.target.value})}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : (
                    <span className="flex items-center">
                      Send Message <Send className="ml-2 w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </FadeIn>
      </section>

      {/* --- PDF GENERATION OVERLAY --- */}
      {/* 
         This overlay is temporarily visible during PDF generation.
         It covers the screen with the exact A4 layout we want to capture.
      */}
      {isGeneratingPDF && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-md flex justify-center items-start overflow-auto py-10">
          <div className="fixed top-5 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-2 z-[10000]">
             <Loader2 className="w-8 h-8 animate-spin" />
             <span className="font-medium bg-slate-900/50 px-4 py-1 rounded-full backdrop-blur">Generating Your Resume PDF...</span>
          </div>
          
          <div 
            id="cv-content" 
            className="bg-white text-slate-900 font-sans shadow-2xl relative mx-auto"
            style={{ width: '210mm', minHeight: '297mm', padding: '15mm' }}
          >
              {/* Header */}
              <div className="mb-6 border-b-2 border-blue-600 pb-4">
                <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tight">{profile.name}</h1>
                <p className="text-xl text-blue-600 font-semibold mt-1">{profile.title}</p>
                <div className="text-sm text-slate-600 mt-3 flex flex-wrap gap-4 font-medium">
                  <span className="flex items-center gap-1"><MapPin size={14}/> {profile.location}</span>
                  <span className="flex items-center gap-1"><Phone size={14}/> {profile.phone}</span>
                  <span className="flex items-center gap-1"><Mail size={14}/> {profile.email}</span>
                </div>
              </div>

              {/* Objective */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-blue-800 border-b border-slate-200 mb-3 flex items-center gap-2">
                   <div className="w-2 h-2 bg-blue-600 rounded-full"></div> OBJECTIVE
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed text-justify">
                  {profile.summary}
                </p>
              </div>

              {/* Skills */}
              <div className="mb-8">
                 <h2 className="text-lg font-bold text-blue-800 border-b border-slate-200 mb-3 flex items-center gap-2">
                   <div className="w-2 h-2 bg-blue-600 rounded-full"></div> SKILLS
                </h2>
                 <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                   {profile.skills.map((grp, i) => (
                     <div key={i} className="text-sm">
                       <span className="font-bold text-slate-900">{grp.category}:</span>
                       <span className="text-slate-700 ml-1">{grp.items.join(', ')}</span>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Experience */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-blue-800 border-b border-slate-200 mb-4 flex items-center gap-2">
                   <div className="w-2 h-2 bg-blue-600 rounded-full"></div> WORK EXPERIENCE
                </h2>
                <div className="space-y-6">
                  {profile.experience.map((job) => (
                    <div key={job.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-slate-900 text-base uppercase">{job.role}</h3>
                        <span className="text-sm font-semibold text-slate-500 italic">{job.duration}</span>
                      </div>
                      <div className="text-blue-700 font-medium text-sm mb-2">{job.company}</div>
                      <ul className="list-disc list-outside ml-4 space-y-1">
                        {job.description.map((desc, i) => (
                          <li key={i} className="text-sm text-slate-700">{desc}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-blue-800 border-b border-slate-200 mb-4 flex items-center gap-2">
                   <div className="w-2 h-2 bg-blue-600 rounded-full"></div> EDUCATION
                </h2>
                <div className="space-y-4">
                  {profile.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                        <span className="text-sm text-slate-500 font-medium">{edu.year}</span>
                      </div>
                      <div className="text-sm text-slate-600 italic">{edu.school}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 align-top">
                {/* Personal Information */}
                {profile.personalInfo && (
                  <div>
                    <h2 className="text-lg font-bold text-blue-800 border-b border-slate-200 mb-3 flex items-center gap-2">
                       <div className="w-2 h-2 bg-blue-600 rounded-full"></div> PERSONAL INFO
                    </h2>
                    <ul className="text-sm space-y-1 text-slate-700">
                      <li><span className="font-bold w-28 inline-block">Date of Birth:</span> {profile.personalInfo.dob}</li>
                      <li><span className="font-bold w-28 inline-block">Place of Birth:</span> {profile.personalInfo.pob}</li>
                      <li><span className="font-bold w-28 inline-block">Gender:</span> {profile.personalInfo.gender}</li>
                      <li><span className="font-bold w-28 inline-block">Marital Status:</span> {profile.personalInfo.maritalStatus}</li>
                      <li><span className="font-bold w-28 inline-block">Nationality:</span> {profile.personalInfo.nationality}</li>
                    </ul>
                  </div>
                )}

                {/* Reference */}
                {profile.reference && (
                   <div>
                    <h2 className="text-lg font-bold text-blue-800 border-b border-slate-200 mb-3 flex items-center gap-2">
                       <div className="w-2 h-2 bg-blue-600 rounded-full"></div> REFERENCE
                    </h2>
                    <div className="text-sm text-slate-700">
                      <p className="font-bold text-base text-slate-900">{profile.reference.name}</p>
                      <p className="italic text-slate-500 mb-1">{profile.reference.role}</p>
                      <p>{profile.reference.email}</p>
                      <p>{profile.reference.phone}</p>
                      <p>{profile.reference.location}</p>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>
      )}
    </div>
  );
};
