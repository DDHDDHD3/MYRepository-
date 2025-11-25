import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  LayoutTemplate, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu,
  X,
  PieChart
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuth = localStorage.getItem('isAdmin');
    if (!isAuth) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const navItems = [
    { to: '/admin', icon: PieChart, label: 'Dashboard', end: true },
    { to: '/admin/students', icon: Users, label: 'Students' },
    { to: '/admin/content', icon: LayoutTemplate, label: 'Portfolio Content' },
    { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out z-50 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          {/* FikradPro Logo Adapted for Dark Sidebar */}
           <div className="flex items-center gap-2">
             <div className="w-10 h-10 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform scale-110">
                   {/* Pencil (Lighter Blue for Dark Mode) */}
                   <g className="origin-center animate-wiggle-pencil">
                     <rect x="35" y="40" width="30" height="40" rx="4" fill="#3b82f6" />
                     <path d="M35 80 L50 95 L65 80 Z" fill="#3b82f6" />
                     <path d="M50 95 L50 95" stroke="#FCD34D" strokeWidth="2" />
                   </g>
                   
                   {/* Bulb (Yellow) */}
                   <circle cx="50" cy="35" r="18" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" className="animate-pop-in" />
                   
                   {/* Bulb filament (Dark on Yellow is fine) */}
                   <path d="M45 35 L50 28 L55 35" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeJoin="round" />
                   
                   {/* Rays (Lighter Blue for Dark Mode background) */}
                   <path d="M50 8 L50 14" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" className="animate-pulse-slow" />
                   <path d="M72 18 L68 22" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" className="animate-pulse-slow" style={{animationDelay: '0.5s'}} />
                   <path d="M28 18 L32 22" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" className="animate-pulse-slow" style={{animationDelay: '1s'}} />
                </svg>
             </div>
             
             <div className="relative flex flex-col justify-center h-full pt-1">
                <span className="font-bold text-xl tracking-tight leading-none text-white animate-fade-in-right">
                  Fikrad<span className="text-blue-400">Pro</span>
                </span>
                {/* Swoosh arrow (Light grey) */}
                <svg className="w-20 h-6 -mt-1 ml-1 text-slate-400" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10 Q 60 25 110 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-draw-path" style={{strokeDasharray: 120}} />
                    <path d="M105 2 L110 5 L106 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-pop-in" style={{animationDelay: '1s'}} />
                </svg>
             </div>
           </div>
           
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 w-full rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="bg-white border-b h-16 flex items-center px-6 justify-between lg:justify-end">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Menu size={24} />
          </button>
          <div className="text-sm text-gray-500">
             Welcome, Admin
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};