import React from 'react';
import { Task, Subject } from '../../types';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  BookOpen,
  PieChart,
} from 'lucide-react';

interface AnalyticsViewProps {
  tasks: Task[];
  subjects: Subject[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks, subjects }) => {
  const now = new Date();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const pending = tasks.filter((t) => t.status !== 'Completed').length;
  const overdue = tasks.filter((t) => t.status !== 'Completed' && new Date(t.dueDate).getTime() < now.getTime()).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Category distribution
  const categoryCounts: Record<string, number> = {};
  tasks.forEach((t) => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });

  // Subject distribution
  const subjectCounts: Record<string, { name: string; code: string; color: string; count: number; completedCount: number }> = {};
  subjects.forEach((s) => {
    const subTasks = tasks.filter((t) => t.subjectId === s.id);
    subjectCounts[s.subjectCode] = {
      name: s.subjectName,
      code: s.subjectCode,
      color: s.colorHex || '#8B5CF6',
      count: subTasks.length,
      completedCount: subTasks.filter((t) => t.status === 'Completed').length,
    };
  });

  // Dynamic Academic Health Score (0 - 100)
  let healthScore = 100;
  if (overdue > 0) healthScore -= Math.min(50, overdue * 15);
  if (pending > 8) healthScore -= 10;
  if (completed > 0) healthScore = Math.min(100, healthScore + Math.round(completionRate * 0.15));
  healthScore = Math.max(20, Math.min(100, healthScore));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-950/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Productivity Analytics & Semester Health</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time execution metrics calculated from persistent deliverable records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Semester Health:</span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
            healthScore >= 80 ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' :
            healthScore >= 60 ? 'border-amber-500/40 bg-amber-950/20 text-amber-300' :
            'border-rose-500/40 bg-rose-950/20 text-rose-300'
          }`}>
            {healthScore}/100
          </span>
        </div>
      </div>

      {total === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-purple-900/60 bg-[#120726]/50">
          <p className="text-sm font-semibold text-white">No Academic Records Available</p>
          <p className="text-xs text-slate-400 mt-1">Create course deliverables to generate real-time productivity analytics.</p>
        </div>
      ) : (
        <>
          {/* Top Row: Completion Gauge, Split, Health */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Completion Rate Gauge */}
            <div className="p-6 rounded-xl border border-purple-900/40 bg-[#150a2b]/80 space-y-4 text-center flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Task Completion Rate
                </span>
                <div className="mt-4 relative inline-flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-8 border-purple-950 flex items-center justify-center relative">
                    <div
                      className="absolute inset-0 rounded-full border-8 border-amber-400"
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${completionRate > 25 ? '100% 0%' : `${50 + completionRate * 2}% 0%`}, ${
                          completionRate > 50 ? '100% 100%' : `${50 + completionRate * 2}% ${completionRate * 2}%`
                        }, ${completionRate > 75 ? '0% 100%' : '50% 50%'}, 50% 50%)`,
                        transform: 'rotate(-90deg)',
                      }}
                    />
                    <div className="text-center">
                      <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                        {completionRate}%
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {completed}/{total} DONE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                {completionRate >= 70
                  ? 'Strong pace. Most deliverables are on track for submission.'
                  : 'Focus on clearing critical submissions to boost your completion score.'}
              </p>
            </div>

            {/* Completed vs Pending Split */}
            <div className="p-6 rounded-xl border border-purple-900/40 bg-[#150a2b]/80 space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Workload Status Balance
                </span>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Completed</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{completed}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-purple-950 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all"
                      style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pending Deliverables</span>
                    </span>
                    <span className="font-mono font-bold text-amber-400">{pending}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-purple-950 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${total > 0 ? (pending / total) * 100 : 0}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Overdue Submissions</span>
                    </span>
                    <span className="font-mono font-bold text-rose-400">{overdue}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-purple-950 overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all"
                      style={{ width: `${total > 0 ? (overdue / total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-purple-950/60">
                Overdue items immediately trigger the highest urgency score (+150 pts).
              </div>
            </div>

            {/* Academic Discipline / Health Insights */}
            <div className="p-6 rounded-xl border border-purple-900/40 bg-[#150a2b]/80 space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Discipline Index
                </span>

                <div className="mt-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-900/30 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-white tabular-nums">{healthScore}/100</p>
                    <p className="text-xs text-amber-300 font-medium">
                      {healthScore >= 80 ? 'Optimal Academic Rhythm' : healthScore >= 60 ? 'Moderate Workload' : 'Action Required'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Active enrolled courses: <strong>{subjects.length}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>Average deliverables per subject: <strong>{(total / Math.max(1, subjects.length)).toFixed(1)}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${overdue === 0 ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span>Overdue ratio: <strong>{total > 0 ? Math.round((overdue / total) * 100) : 0}%</strong></span>
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 pt-2 border-t border-purple-950/60">
                Calculated dynamically from real database records without subjective guesswork.
              </p>
            </div>

          </div>

          {/* Row 2: Subject Breakdown & Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Workload by Subject */}
            <div className="p-5 rounded-xl border border-purple-900/40 bg-[#150a2b]/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white tracking-tight">Workload & Completion by Subject</h3>
                <BookOpen className="w-4 h-4 text-amber-400" />
              </div>

              <div className="space-y-3">
                {Object.values(subjectCounts).map((sub) => {
                  const pct = sub.count > 0 ? Math.round((sub.completedCount / sub.count) * 100) : 0;
                  return (
                    <div key={sub.code} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">
                          <span className="text-amber-400 font-mono">{sub.code}</span> · {sub.name}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {sub.completedCount}/{sub.count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-purple-950">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: sub.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="p-5 rounded-xl border border-purple-900/40 bg-[#150a2b]/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white tracking-tight">Deliverable Category Breakdown</h3>
                <PieChart className="w-4 h-4 text-purple-400" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(categoryCounts).map(([cat, count]) => (
                  <div key={cat} className="p-3 rounded-lg border border-purple-900/40 bg-[#190c30]">
                    <span className="text-[10px] text-slate-400 block truncate">{cat}</span>
                    <span className="text-xl font-bold font-mono text-amber-300 tabular-nums">{count}</span>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      {Math.round((count / total) * 100)}% of total
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
};
