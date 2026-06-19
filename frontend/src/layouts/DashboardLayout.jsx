import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Database, 
  BarChart3, 
  FileSearch, 
  LogOut, 
  User, 
  Sun, 
  Moon, 
  Sparkles,
  ClipboardList,
  Menu,
  X
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Safe checks for user role
  const userRole = user?.role?.toUpperCase() || 'CANDIDATE';

  // Navigation config based on role
  const recruiterNav = [
    { name: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { name: 'Assessments', path: '/recruiter/assessments', icon: FileSpreadsheet },
    { name: 'Question Bank', path: '/recruiter/questions', icon: Database },
    { name: 'Analytics', path: '/recruiter/analytics', icon: BarChart3 },
  ];

  const candidateNav = [
    { name: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
    { name: 'AI Resume Analyzer', path: '/candidate/resume-analyzer', icon: FileSearch },
  ];

  const navigation = userRole === 'RECRUITER' ? recruiterNav : candidateNav;

  return (
    <div className="flex min-h-screen w-screen bg-[#030303] light:bg-[#fcfcfc] dark-grid-bg transition-colors duration-200">
      
      {/* Mobile Sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/95 light:bg-white/95 backdrop-blur-xl flex flex-col justify-between p-6 transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col space-y-8">
          
          {/* Logo & Mobile Close Trigger */}
          <div className="flex items-center justify-between">
            <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center space-x-2.5 px-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm shadow-md">
                IQ
              </div>
              <span className="text-lg font-bold tracking-tight text-white light:text-black font-sans">
                Hire<span className="text-brand-500">IQ</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-950/40 border border-brand-900/40 text-brand-400 font-semibold uppercase tracking-wider">
                SaaS
              </span>
            </Link>

            <button 
              onClick={() => setSidebarOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a] light:bg-white text-zinc-400 light:text-zinc-600 md:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col space-y-1">
            <p className="text-[10px] font-bold text-zinc-600 light:text-zinc-400 uppercase tracking-widest px-2.5 mb-2">
              Navigation
            </p>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-brand-600/10 text-brand-400 border border-brand-500/20 shadow-sm shadow-brand-500/5'
                      : 'text-zinc-400 light:text-zinc-500 hover:text-white light:hover:text-black hover:bg-[#161616] light:hover:bg-zinc-100 border border-transparent'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-brand-400' : 'text-zinc-500'} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & controls */}
        <div className="flex flex-col space-y-4 pt-6 border-t border-[#1a1a1a] light:border-zinc-200">
          <div className="flex items-center space-x-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 light:bg-zinc-100 border border-zinc-800 light:border-zinc-300 text-zinc-300 light:text-zinc-700">
              <User size={18} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white light:text-black truncate">
                {user?.email || 'user@hireiq.com'}
              </span>
              <span className="text-[10px] text-zinc-500 capitalize">
                {userRole.toLowerCase()} Mode
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-950/10 light:hover:bg-red-50 border border-transparent hover:border-red-900/20 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN WRAPPER */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-y-auto">
        
        {/* TOP BAR */}
        <header className="h-16 border-b border-[#1a1a1a] light:border-zinc-200 bg-[#030303]/40 light:bg-white/40 backdrop-blur-md flex items-center justify-between px-6 md:px-8 z-10 sticky top-0">
          <div className="flex items-center space-x-2">
            {/* Hamburger menu for mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a] light:bg-white text-zinc-400 light:text-zinc-600 hover:text-white light:hover:text-black md:hidden cursor-pointer mr-1.5"
              aria-label="Toggle Navigation"
            >
              <Menu size={18} />
            </button>

            <h1 className="text-xs font-semibold text-zinc-400 light:text-zinc-500 uppercase tracking-wider">
              {userRole} Portal
            </h1>
            <span className="text-zinc-800 light:text-zinc-300">/</span>
            <span className="text-sm font-medium text-white light:text-black">
              {navigation.find((item) => location.pathname.startsWith(item.path))?.name || 'Dashboard'}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a] light:bg-white text-zinc-400 light:text-zinc-600 hover:text-white light:hover:text-black transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            {/* Active Platform indicator */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-emerald-950/30 light:border-emerald-200/50 bg-emerald-950/20 light:bg-emerald-100/50 text-emerald-400 text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Backend Connected</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 md:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
