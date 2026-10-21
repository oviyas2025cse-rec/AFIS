import React from 'react';
import { ActivePage, User } from '../types';
import { Plus, GraduationCap, Code2, LogOut } from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  currentUser: User | null;
  onOpenAddTask: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  currentUser,
  onOpenAddTask,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-900/40 bg-[#0d0519]/90 backdrop-blur-md px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element Brand wordmark */}
        <button
          onClick={() => setActivePage('dashboard')}
          className="flex items-center gap-2.5 text-left text-white whitespace-nowrap shrink-0 focus:outline-none group cursor-pointer"
          aria-label="AFIS Home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#0d0519] font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
            <GraduationCap className="w-4 h-4 text-[#0c0517]" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              AFIS
              <span className="text-xs font-semibold text-amber-400/90 tracking-normal font-mono">FLOW</span>
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 clean single-line nav links with subtle hover underlines */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActivePage('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activePage === 'dashboard'
                ? 'text-amber-300 font-semibold border-b-2 border-amber-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActivePage('tasks')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activePage === 'tasks'
                ? 'text-amber-300 font-semibold border-b-2 border-amber-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Tasks & Deadlines
          </button>

          <button
            onClick={() => setActivePage('calendar')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activePage === 'calendar'
                ? 'text-amber-300 font-semibold border-b-2 border-amber-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Calendar
          </button>

          <button
            onClick={() => setActivePage('analytics')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activePage === 'analytics'
                ? 'text-amber-300 font-semibold border-b-2 border-amber-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Analytics
          </button>

          <button
            onClick={() => setActivePage('backend-docs')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 cursor-pointer ${
              activePage === 'backend-docs'
                ? 'text-amber-300 font-semibold border-b-2 border-amber-400'
                : 'text-purple-300 hover:text-amber-200'
            }`}
          >
            <Code2 className="w-4 h-4 text-amber-400" />
            <span>Java 21 & MySQL Hub</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenAddTask}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm hover:shadow-amber-500/20 transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>

              <button
                onClick={() => setActivePage('profile')}
                className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-purple-800/50 bg-purple-950/30 hover:bg-purple-900/40 text-xs text-slate-200 transition-colors cursor-pointer"
                title="Student Profile & Courses"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-medium truncate max-w-[110px]">{currentUser.fullName}</span>
              </button>

              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-300 transition-colors rounded-lg hover:bg-purple-900/30 cursor-pointer"
                title="Logout session"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg hover:from-amber-300 hover:to-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
