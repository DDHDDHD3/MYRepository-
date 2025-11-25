import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Facebook, Github } from 'lucide-react';
import { db } from '../services/db';
import { ChatAssistant } from './ChatAssistant';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const profile = db.getProfile();

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname !== '/') {
      // If we are on admin page and click a public link, go root then scroll (basic handling)
      window.location.hash = '/';
      setTimeout(() => {
        const el = document.querySelector(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <header className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
               {/* FikradPro Logo */}
               <div className="flex items-center gap-1 group cursor-pointer" onClick={() => scrollToSection('#home')}>
                 {/* Icon */}
                 <div className="w-12 h-12 relative flex items-center justify-center">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform scale-110">
                       {/* Pencil (Blue) */}
                       <g className="origin-center animate-wiggle-pencil">
                         <rect x="35" y="40" width="30" height="40" rx="4" fill="#1e3a8a" />
                         <path d="M35 80 L50 95 L65 80 Z" fill="#1e3a8a" />
                         <path d="M50 95 L50 95" stroke="#FCD34D" strokeWidth="2" /> {/* Tip hint */}
                       </g>
                       
                       {/* Bulb (Yellow) popping out/behind */}
                       <circle cx="50" cy="35" r="18" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" className="animate-pop-in" />
                       
                       {/* Bulb filament/detail */}
                       <path d="M45 35 L50 28 L55 35" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeJoin="round" />
                       
                       {/* Rays */}
                       <path d="M50 8 L50 14" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" className="animate-pulse-slow" />
                       <path d="M72 18 L68 22" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" className="animate-pulse-slow" style={{animationDelay: '0.5s'}} />
                       <path d="M28 18 L32 22" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" className="animate-pulse-slow" style={{animationDelay: '1s'}} />
                    </svg>
                 </div>
                 
                 {/* Text */}
                 <div className="relative flex flex-col justify-center h-full pt-2">
                    <span className="font-bold text-2xl tracking-tight leading-none text-slate-900">
                      Fikrad<span className="text-[#1e3a8a]">Pro</span>
                    </span>
                    {/* Swoosh arrow */}
                    <svg className="w-24 h-8 -mt-2 ml-1 text-black" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 10 Q 60 25 110 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-draw-path" style={{strokeDasharray: 120}} />
                        <path d="M105 2 L110 5 L106 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-pop-in" style={{animationDelay: '1s'}} />
                    </svg>
                 </div>
               </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center">
              <Link to="/admin" className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1">
                <LayoutDashboard size={16} /> Admin
              </Link>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 hover:text-slate-900 p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/admin"
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow pt-16">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-8">
            <a href="https://www.facebook.com/nasrudiin.nuur.313/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors" aria-label="Facebook">
              <Facebook size={24} />
            </a>
            <a href="https://github.com/DDHDDHD3" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="GitHub">
              <Github size={24} />
            </a>
            <a href="https://wa.me/message/4IOAGQLFIEKME1" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
          </div>
          <p>&copy; {new Date().getFullYear()} FikradPro. Created by {profile.name}. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Buttons */}
      <ChatAssistant />

      <a
        href="https://wa.me/message/4IOAGQLFIEKME1"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce-slow group"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute right-full mr-3 bg-white text-slate-800 px-2 py-1 rounded shadow-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium">
          Chat with us
        </span>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
};