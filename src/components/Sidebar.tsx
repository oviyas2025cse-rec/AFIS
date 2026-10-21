import React from 'react';
import { ActivePage, User } from '../types';
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  BarChart3,
  UserCircle,
  FileCode2,
  Sparkles,
  Download,
  BookOpen,
} from 'lucide-react';
import { downloadJavaMavenZip } from '../utils/zipExporter';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  currentUser: User | null;
  pendingCount: number;
  overdueCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  currentUser,
  pendingCount,
  overdueCount,
}) => {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadJavaMavenZip();
    } finally {
      setDownloading(false);
    }
  };

  const navItems: { id: ActivePage; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Student Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'tasks',
      label: 'Task Management',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingCount,
      badgeColor: overdueCount > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-400/20 text-amber-300',
    },
    {
      id: 'calendar',
      label: 'Calendar & Deadlines',
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      id: 'analytics',
      label: 'Productivity Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'profile',
      label: 'Profile & Courses',
      icon: <UserCircle className="w-4 h-4" />,
    },
    {
      id: 'backend-docs',
      label: 'Java 21 & MySQL Hub',
      icon: <FileCode2 className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'landing',
      label: 'About AFIS Platform',
      icon: <BookOpen className="w-4 h-4 text-purple-400" />,
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r border-purple-950/70 bg-[#100620]/95 min-h-[calc(100vh-61px)] p-4">
      <div className="space-y-6">
        
        {/* Student Workspace Card */}
        {currentUser && (
          <div className="p-3.5 rounded-xl border border-purple-900/40 bg-purple-950/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 border border-amber-400/30 flex items-center justify-center font-bold text-amber-300 text-sm shadow-inner">
                {currentUser.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{currentUser.fullName}</p>
                <p className="text-xs text-purple-300/80 truncate">{currentUser.department}</p>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-amber-400/90 font-mono">
                  <span>{currentUser.yearOfStudy}</span>
                  <span>·</span>
                  <span>REC</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Primary Navigation Links */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-purple-300/60 uppercase tracking-wider mb-2">
            Workspace
          </p>
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-purple-900/40 text-amber-300 border-l-2 border-amber-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-purple-900/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Academic Flow Engine Status */}
        <div className="p-3 rounded-lg border border-purple-900/50 bg-[#160a2b]/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Flow Engine Active</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Deterministic rule-based prioritization: importance weighting + proximity urgency. Zero black-box AI.
          </p>
          <div className="pt-1 flex items-center justify-between text-[10px] text-purple-300/70 border-t border-purple-900/30">
            <span>Formula</span>
            <span className="font-mono text-amber-400/90">W(p) + W(c) + P(t)</span>
          </div>
        </div>

      </div>

      {/* Footer Quick Action */}
      <div className="pt-4 border-t border-purple-950/80 space-y-2">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors cursor-pointer"
          title="Download complete Maven project with Java 21 servlets and MySQL schema"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloading ? 'Packaging ZIP...' : 'Export Maven WAR (.zip)'}</span>
        </button>

        <p className="text-[10px] text-center text-slate-500">
          AFIS v1.0 · Tomcat 10.1 & MySQL
        </p>
      </div>

    </aside>
  );
};
