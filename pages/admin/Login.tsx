import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { FadeIn } from '../../components/ui/FadeIn';

export const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock authentication
    if (credentials.username === 'admin' && credentials.password === 'Fikrad@Admin2025!') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <FadeIn>
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-8 text-center">
             {/* FikradPro Logo */}
             <div className="flex items-center gap-1 mb-6 transform scale-110">
               {/* Icon */}
               <div className="w-12 h-12 relative flex items-center justify-center">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform scale-110">
                     {/* Pencil (Blue) - Wiggle Animation */}
                     <g className="origin-center animate-wiggle-pencil">
                       <rect x="35" y="40" width="30" height="40" rx="4" fill="#1e3a8a" />
                       <path d="M35 80 L50 95 L65 80 Z" fill="#1e3a8a" />
                       <path d="M50 95 L50 95" stroke="#FCD34D" strokeWidth="2" /> {/* Tip hint */}
                     </g>
                     
                     {/* Bulb (Yellow) popping out/behind - PopIn Animation */}
                     <circle cx="50" cy="35" r="18" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" className="animate-pop-in" style={{animationDelay: '0.2s'}} />
                     
                     {/* Bulb filament/detail */}
                     <path d="M45 35 L50 28 L55 35" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeJoin="round" className="animate-pop-in" style={{animationDelay: '0.4s'}} />
                     
                     {/* Rays - PopIn with staggering */}
                     <path d="M50 8 L50 14" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" className="animate-pop-in" style={{animationDelay: '0.5s'}} />
                     <path d="M72 18 L68 22" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" className="animate-pop-in" style={{animationDelay: '0.6s'}} />
                     <path d="M28 18 L32 22" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" className="animate-pop-in" style={{animationDelay: '0.7s'}} />
                  </svg>
               </div>
               
               {/* Text */}
               <div className="relative flex flex-col justify-center h-full pt-2">
                  <span className="font-bold text-2xl tracking-tight leading-none text-slate-900 animate-fade-in-right">
                    Fikrad<span className="text-[#1e3a8a]">Pro</span>
                  </span>
                  {/* Swoosh arrow - Draw Animation */}
                  <svg className="w-24 h-8 -mt-2 ml-1 text-black" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 10 Q 60 25 110 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-draw-path" style={{strokeDasharray: 120, animationDelay: '0.8s'}} />
                      <path d="M105 2 L110 5 L106 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-pop-in" style={{animationDelay: '1.2s'}} />
                  </svg>
               </div>
             </div>

            <h2 className="text-2xl font-bold text-slate-900 animate-fade-in-up" style={{animationDelay: '0.3s'}}>Admin Login</h2>
            <p className="text-slate-500 animate-fade-in-up" style={{animationDelay: '0.4s'}}>Sign in to manage portfolio & students</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={credentials.username}
                onChange={e => setCredentials({...credentials, username: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={credentials.password}
                onChange={e => setCredentials({...credentials, password: e.target.value})}
              />
            </div>

            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </div>
      </FadeIn>
    </div>
  );
};