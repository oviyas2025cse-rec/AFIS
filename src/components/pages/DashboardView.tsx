import React from 'react';
import { Task, Subject, ActivePage } from '../../types';
import { evaluateAcademicFlow } from '../../intelligence/flowAlgorithm';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  Plus,
  BookOpen,
} from 'lucide-react';

interface DashboardViewProps {
  tasks: Task[];
  subjects: Subject[];
  onOpenAddTask: () => void;
  onToggleComplete: (task: Task) => void;
  onEditTask: (task: Task) => void;
  setActivePage: (page: ActivePage) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  subjects,
  onOpenAddTask,
  onToggleComplete,
  onEditTask,
  setActivePage,
}) => {
  const now = new Date();

  // Metrics derived from actual tasks state
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const overdueTasks = tasks.filter((t) => t.status !== 'Completed' && new Date(t.dueDate).getTime() < now.getTime()).length;
  
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 3600 * 1000).getTime();
  const upcomingDeadlines = tasks.filter(
    (t) => t.status !== 'Completed' && new Date(t.dueDate).getTime() >= now.getTime() && new Date(t.dueDate).getTime() <= sevenDaysFromNow
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Run Flow Intelligence Recommendation
  const flowResult = evaluateAcademicFlow(tasks, now);
  const recommended = flowResult.recommendedTask;
  const breakdown = flowResult.breakdown;

  // Next nearest pending deadline
  const sortedPending = [...tasks]
    .filter((t) => t.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const nextDeadlineTask = sortedPending.length > 0 ? sortedPending[0] : null;

  // Priority Breakdown
  const priorityCounts = {
    Critical: tasks.filter((t) => t.status !== 'Completed' && t.priority === 'Critical').length,
    High: tasks.filter((t) => t.status !== 'Completed' && t.priority === 'High').length,
    Medium: tasks.filter((t) => t.status !== 'Completed' && t.priority === 'Medium').length,
    Low: tasks.filter((t) => t.status !== 'Completed' && t.priority === 'Low').length,
  };

  // Subject Workload Breakdown
  const subjectWorkload: Record<string, number> = {};
  subjects.forEach((s) => {
    subjectWorkload[s.subjectCode] = tasks.filter((t) => t.subjectId === s.id && t.status !== 'Completed').length;
  });

  // Recent 5 tasks
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatHoursOrDays = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - now.getTime();
    const hours = Math.round(diff / (1000 * 3600));
    if (hours < 0) {
      const days = Math.ceil(Math.abs(hours) / 24);
      return { text: `Overdue by ${days}d`, isOverdue: true };
    }
    if (hours <= 24) {
      return { text: `Due in ${Math.max(1, hours)}h`, isUrgent: true };
    }
    const days = Math.round(hours / 24);
    return { text: `Due in ${days}d`, isUrgent: false };
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Title and Prominent Add Task Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-950/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Student Academic Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time semester metrics, deadline countdowns, and rule-based focus triage.
          </p>
        </div>

        <button
          onClick={onOpenAddTask}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm hover:shadow-amber-500/20 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Academic Task</span>
        </button>
      </div>

      {/* 5 Real Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        
        <div className="p-4 rounded-xl border border-purple-900/40 bg-[#150a2b]/80">
          <div className="flex items-center justify-between text-purple-300 text-xs font-medium">
            <span>Total Tasks</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-white tabular-nums">{totalTasks}</p>
          <p className="text-[11px] text-slate-400 mt-1">{completedTasks} completed ({completionRate}%)</p>
        </div>

        <div className="p-4 rounded-xl border border-purple-900/40 bg-[#150a2b]/80">
          <div className="flex items-center justify-between text-amber-300 text-xs font-medium">
            <span>Pending Tasks</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-amber-300 tabular-nums">{pendingTasks}</p>
          <p className="text-[11px] text-slate-400 mt-1">Requires student focus</p>
        </div>

        <div className="p-4 rounded-xl border border-purple-900/40 bg-[#150a2b]/80">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-medium">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-emerald-300 tabular-nums">{completedTasks}</p>
          <p className="text-[11px] text-slate-400 mt-1">Excluded from urgency</p>
        </div>

        <div className={`p-4 rounded-xl border ${
          overdueTasks > 0 ? 'border-rose-500/40 bg-rose-950/20' : 'border-purple-900/40 bg-[#150a2b]/80'
        }`}>
          <div className="flex items-center justify-between text-rose-300 text-xs font-medium">
            <span>Overdue Tasks</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className={`mt-2 text-2xl font-bold font-mono tabular-nums ${overdueTasks > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            {overdueTasks}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {overdueTasks > 0 ? 'Immediate submission needed' : 'Zero overdue items'}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-purple-900/40 bg-[#150a2b]/80 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-amber-300 text-xs font-medium">
            <span>7-Day Deadlines</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-amber-400 tabular-nums">{upcomingDeadlines}</p>
          <p className="text-[11px] text-slate-400 mt-1">Due within one week</p>
        </div>

      </div>

      {/* Row 2: Academic Flow Intelligence Hero + Next Deadline Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Flow Recommendation Card (Spans 2 columns) */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-amber-400/35 bg-gradient-to-br from-[#1c0c3a] via-[#170a2f] to-[#120726] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-purple-500 to-amber-300" />
          
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>ACADEMIC FLOW INTELLIGENCE · TOP FOCUS RECOMMENDATION</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-2">
                {recommended ? recommended.title : 'All Deliverables Completed'}
              </h2>
              {recommended && (
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
                  <span className="font-semibold text-amber-400">{recommended.subjectCode}</span>
                  <span aria-hidden="true">·</span>
                  <span>{recommended.subjectName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-purple-300">{recommended.category}</span>
                </div>
              )}
            </div>

            {recommended && breakdown && (
              <div className="text-right shrink-0">
                <div className="px-3 py-1.5 rounded-lg border border-amber-400/30 bg-amber-500/10 text-amber-300">
                  <span className="text-[10px] uppercase font-semibold block text-slate-400">Flow Score</span>
                  <span className="text-xl font-bold font-mono tabular-nums">{breakdown.totalScore}</span>
                  <span className="text-xs text-slate-400 font-mono"> / 275</span>
                </div>
              </div>
            )}
          </div>

          {recommended && breakdown ? (
            <div className="mt-5 space-y-4">
              
              {/* Factor Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-lg border border-purple-900/40 bg-purple-950/30">
                  <span className="text-[10px] text-slate-400 block">Importance Weight</span>
                  <span className="font-semibold text-white font-mono">+{breakdown.basePriorityScore} pts ({recommended.priority})</span>
                </div>
                <div className="p-2.5 rounded-lg border border-purple-900/40 bg-purple-950/30">
                  <span className="text-[10px] text-slate-400 block">Category Impact</span>
                  <span className="font-semibold text-white font-mono">+{breakdown.categoryWeight} pts ({recommended.category})</span>
                </div>
                <div className="p-2.5 rounded-lg border border-purple-900/40 bg-purple-950/30">
                  <span className="text-[10px] text-slate-400 block">Deadline Proximity</span>
                  <span className={`font-semibold font-mono ${breakdown.isOverdue ? 'text-rose-400' : 'text-amber-300'}`}>
                    +{breakdown.proximityScore} pts ({breakdown.statusNote})
                  </span>
                </div>
              </div>

              {/* Explainable Rationale */}
              <p className="text-xs text-slate-300 leading-relaxed bg-[#100620]/60 p-3 rounded-lg border border-purple-900/30">
                <strong className="text-amber-300">Why recommended: </strong>
                {flowResult.explanation}
              </p>

              {/* Quick Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => onToggleComplete(recommended as Task)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Task Completed</span>
                </button>

                <button
                  onClick={() => onEditTask(recommended as Task)}
                  className="px-3.5 py-2 rounded-lg border border-purple-800 bg-purple-950/40 hover:bg-purple-900/50 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  Edit Deliverable
                </button>
              </div>

            </div>
          ) : (
            <div className="mt-4 p-4 rounded-lg bg-[#100620]/40 text-xs text-slate-300">
              No pending tasks detected in your semester schedule. Enjoy your academic flow!
            </div>
          )}
        </div>

        {/* Next Deadline Panel */}
        <div className="p-5 rounded-xl border border-purple-900/40 bg-[#160a2b]/80 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Deadline</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>

            {nextDeadlineTask ? (
              <div className="mt-3 space-y-3">
                {(() => {
                  const timeInfo = formatHoursOrDays(nextDeadlineTask.dueDate);
                  return (
                    <div className={`p-2.5 rounded-lg border ${
                      timeInfo.isOverdue
                        ? 'border-rose-500/30 bg-rose-950/20 text-rose-300'
                        : 'border-amber-400/30 bg-amber-500/10 text-amber-300'
                    } flex items-center justify-between text-xs font-mono font-semibold`}>
                      <span>{timeInfo.text}</span>
                      <span>{new Date(nextDeadlineTask.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  );
                })()}

                <div>
                  <h3 className="text-sm font-semibold text-white leading-snug">{nextDeadlineTask.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className="text-amber-400 font-semibold">{nextDeadlineTask.subjectCode}</span>
                    <span aria-hidden="true">·</span>
                    <span>{nextDeadlineTask.category}</span>
                  </div>
                  {nextDeadlineTask.description && (
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {nextDeadlineTask.description}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-3">No pending deadlines scheduled.</p>
            )}
          </div>

          <button
            onClick={() => setActivePage('calendar')}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-amber-300 border border-amber-400/30 rounded-lg hover:bg-amber-400/10 transition-colors cursor-pointer"
          >
            <span>View Full Calendar</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Row 3: Priority Breakdown + Weekly Workload by Subject */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Priority Breakdown */}
        <div className="p-5 rounded-xl border border-purple-900/40 bg-[#150a2b]/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">Active Workload by Priority</h3>
            <span className="text-xs text-slate-400">{pendingTasks} pending tasks</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-950/20">
              <span className="text-[11px] font-semibold text-rose-300 block">Critical (100pt)</span>
              <span className="text-2xl font-bold font-mono text-rose-400 tabular-nums">{priorityCounts.Critical}</span>
            </div>
            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20">
              <span className="text-[11px] font-semibold text-amber-300 block">High (75pt)</span>
              <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">{priorityCounts.High}</span>
            </div>
            <div className="p-3 rounded-lg border border-blue-500/30 bg-blue-950/20">
              <span className="text-[11px] font-semibold text-blue-300 block">Medium (50pt)</span>
              <span className="text-2xl font-bold font-mono text-blue-400 tabular-nums">{priorityCounts.Medium}</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-700 bg-slate-900/40">
              <span className="text-[11px] font-semibold text-slate-300 block">Low (25pt)</span>
              <span className="text-2xl font-bold font-mono text-slate-300 tabular-nums">{priorityCounts.Low}</span>
            </div>
          </div>
        </div>

        {/* Workload by Subject */}
        <div className="p-5 rounded-xl border border-purple-900/40 bg-[#150a2b]/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">Course Deliverable Distribution</h3>
            <span className="text-xs text-slate-400">{subjects.length} enrolled subjects</span>
          </div>

          <div className="space-y-2.5">
            {subjects.map((sub) => {
              const count = subjectWorkload[sub.subjectCode] || 0;
              const maxCount = Math.max(1, ...Object.values(subjectWorkload));
              const pct = Math.round((count / maxCount) * 100);

              return (
                <div key={sub.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">
                      <strong className="text-amber-400 font-mono">{sub.subjectCode}</strong> · {sub.subjectName}
                    </span>
                    <span className="font-mono text-slate-400 tabular-nums">{count} active</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-purple-950">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${count > 0 ? Math.max(8, pct) : 0}%`,
                        backgroundColor: sub.colorHex || '#d4af37',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Row 4: Recent Tasks List */}
      <div className="p-5 rounded-xl border border-purple-900/40 bg-[#150a2b]/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">Recent Academic Tasks</h3>
          <button
            onClick={() => setActivePage('tasks')}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
          >
            Manage All Tasks →
          </button>
        </div>

        <div className="divide-y divide-purple-950/60">
          {recentTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const isOverdue = !isCompleted && new Date(task.dueDate).getTime() < now.getTime();

            return (
              <div key={task.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => onToggleComplete(task)}
                    className="focus:outline-none cursor-pointer"
                    title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    aria-label={`Toggle completion for ${task.title}`}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 transition-colors ${
                        isCompleted ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-600 hover:text-slate-400'
                      }`}
                    />
                  </button>

                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${isCompleted ? 'text-slate-500 line-through' : 'text-white'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="text-amber-400 font-mono font-medium">{task.subjectCode}</span>
                      <span aria-hidden="true">·</span>
                      <span>{task.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className={isOverdue ? 'text-rose-400 font-medium' : ''}>
                        {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                    task.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300' :
                    task.priority === 'High' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-purple-900/30 text-purple-300'
                  }`}>
                    {task.priority}
                  </span>

                  <button
                    onClick={() => onEditTask(task)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-purple-900/30 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
