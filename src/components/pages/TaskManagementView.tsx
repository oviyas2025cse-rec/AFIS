import React, { useState, useMemo } from 'react';
import { Task, Subject, PriorityLevel, TaskCategory, TaskStatus } from '../../types';
import { calculateTaskFlowScore } from '../../intelligence/flowAlgorithm';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Trash2,
  Edit3,
  AlertTriangle,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';

interface TaskManagementViewProps {
  tasks: Task[];
  subjects: Subject[];
  onOpenAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTaskPrompt: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
}

export const TaskManagementView: React.FC<TaskManagementViewProps> = ({
  tasks,
  subjects,
  onOpenAddTask,
  onEditTask,
  onDeleteTaskPrompt,
  onToggleComplete,
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'dueDate' | 'flowScore' | 'priority' | 'title'>('dueDate');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('ASC');

  const now = new Date();

  // Filter and Sort logic
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search
        if (search.trim()) {
          const query = search.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(query);
          const matchDesc = task.description.toLowerCase().includes(query);
          const matchSub = task.subjectCode.toLowerCase().includes(query) || task.subjectName.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchSub) return false;
        }

        // Status
        if (selectedStatus !== 'ALL') {
          if (task.status !== selectedStatus) return false;
        }

        // Priority
        if (selectedPriority !== 'ALL') {
          if (task.priority !== selectedPriority) return false;
        }

        // Category
        if (selectedCategory !== 'ALL') {
          if (task.category !== selectedCategory) return false;
        }

        // Subject
        if (selectedSubject !== 'ALL') {
          if (task.subjectId !== selectedSubject) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'dueDate') {
          cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else if (sortBy === 'flowScore') {
          const scoreA = calculateTaskFlowScore(a, now).totalScore;
          const scoreB = calculateTaskFlowScore(b, now).totalScore;
          cmp = scoreB - scoreA; // default high to low for score
        } else if (sortBy === 'priority') {
          const pOrder: Record<PriorityLevel, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          cmp = pOrder[b.priority] - pOrder[a.priority];
        } else if (sortBy === 'title') {
          cmp = a.title.localeCompare(b.title);
        }

        return sortDir === 'DESC' ? -cmp : cmp;
      });
  }, [tasks, search, selectedStatus, selectedPriority, selectedCategory, selectedSubject, sortBy, sortDir]);

  const activeFilterCount = (selectedStatus !== 'ALL' ? 1 : 0) +
    (selectedPriority !== 'ALL' ? 1 : 0) +
    (selectedCategory !== 'ALL' ? 1 : 0) +
    (selectedSubject !== 'ALL' ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const resetFilters = () => {
    setSearch('');
    setSelectedStatus('ALL');
    setSelectedPriority('ALL');
    setSelectedCategory('ALL');
    setSelectedSubject('ALL');
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Add Task Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-950/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Academic Tasks & Deadlines</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 font-mono">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage course deliverables, track real-time priority scores, and filter by subject syllabus.
          </p>
        </div>

        <button
          onClick={onOpenAddTask}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm hover:shadow-amber-500/20 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Deliverable</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl border border-purple-900/40 bg-[#150a2b]/80 space-y-3.5">
        
        {/* Top Row: Search and Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, description, or course code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#0e051c] border border-purple-900/60 rounded-lg text-xs text-white placeholder-slate-500 focus:border-amber-400 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-2 bg-[#0e051c] border border-purple-900/60 rounded-lg text-xs text-slate-200 focus:border-amber-400 cursor-pointer"
            >
              <option value="dueDate">Due Date</option>
              <option value="flowScore">Flow Score (Intelligence)</option>
              <option value="priority">Priority Weight</option>
              <option value="title">Alphabetical</option>
            </select>

            <button
              onClick={() => setSortDir((d) => (d === 'ASC' ? 'DESC' : 'ASC'))}
              className="px-2.5 py-2 bg-[#0e051c] border border-purple-900/60 rounded-lg text-xs text-slate-300 hover:text-white cursor-pointer font-mono"
              title="Toggle sort direction"
            >
              {sortDir}
            </button>
          </div>
        </div>

        {/* Filter Badges & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-purple-950/60 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </span>

          {/* Status Buttons */}
          <div className="flex items-center gap-1 bg-[#0e051c] p-0.5 rounded-lg border border-purple-900/40">
            {['ALL', 'To Do', 'In Progress', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st}
              </button>
            ))}
          </div>

          {/* Subject Dropdown */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-2.5 py-1 bg-[#0e051c] border border-purple-900/60 rounded-lg text-xs text-slate-300 focus:border-amber-400 cursor-pointer"
          >
            <option value="ALL">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.subjectCode} - {sub.subjectName}
              </option>
            ))}
          </select>

          {/* Priority Dropdown */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1 bg-[#0e051c] border border-purple-900/60 rounded-lg text-xs text-slate-300 focus:border-amber-400 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1 bg-[#0e051c] border border-purple-900/60 rounded-lg text-xs text-slate-300 focus:border-amber-400 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Assignment">Assignment</option>
            <option value="Laboratory Record">Laboratory Record</option>
            <option value="Project">Project</option>
            <option value="Examination">Examination</option>
            <option value="Presentation">Presentation</option>
            <option value="General">General</option>
          </select>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-amber-400 hover:text-amber-300 font-medium ml-auto flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>

      {/* Task List / Cards */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-purple-900/60 bg-[#120726]/50 space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-900/30 border border-purple-700/40 flex items-center justify-center mx-auto text-amber-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Academic Tasks Match Your Criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {activeFilterCount > 0
              ? 'Try relaxing or resetting your active filters to see other semester deliverables.'
              : 'Your task list is empty. Add your first assignment, lab record, or project milestone.'}
          </p>
          <div className="pt-2">
            {activeFilterCount > 0 ? (
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-xs font-semibold text-amber-400 border border-amber-400/30 rounded-lg hover:bg-amber-400/10 transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            ) : (
              <button
                onClick={onOpenAddTask}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                Create First Task
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const flowBreakdown = calculateTaskFlowScore(task, now);
            const isOverdue = flowBreakdown.isOverdue;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'border-purple-950/40 bg-[#120726]/40 opacity-75'
                    : isOverdue
                    ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/20 via-[#190c30] to-[#160a2b]'
                    : 'border-purple-900/40 bg-[#180b33] hover:border-amber-400/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  
                  {/* Left: Completion toggle + Title & Details */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => onToggleComplete(task)}
                      className="mt-0.5 focus:outline-none cursor-pointer shrink-0"
                      title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                      aria-label={`Toggle completion for ${task.title}`}
                    >
                      <CheckCircle2
                        className={`w-5 h-5 transition-colors ${
                          isCompleted ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-600 hover:text-amber-400'
                        }`}
                      />
                    </button>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                          {task.subjectCode}
                        </span>
                        <h2 className={`text-base font-semibold ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                          {task.title}
                        </h2>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Clean Unboxed Metadata line */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-0.5">
                        <span className="text-purple-300">{task.subjectName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{task.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className={isOverdue ? 'text-rose-400 font-semibold' : ''}>
                          Due: {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className={flowBreakdown.isOverdue ? 'text-rose-400 font-medium' : 'text-amber-300/90'}>
                          {flowBreakdown.statusNote}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Flow Score Badge & Action Controls */}
                  <div className="flex items-center sm:flex-col items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-purple-950/40">
                    
                    {/* Flow Score Pill */}
                    <div
                      className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${
                        isCompleted
                          ? 'border-purple-900/40 bg-purple-950/20 text-slate-400'
                          : isOverdue
                          ? 'border-rose-500/40 bg-rose-950/30 text-rose-300'
                          : 'border-amber-400/30 bg-amber-500/10 text-amber-300'
                      }`}
                      title={flowBreakdown.reasons.join('\n')}
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Flow Score: {flowBreakdown.totalScore}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        task.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300 font-bold' :
                        task.priority === 'High' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-purple-900/30 text-purple-300'
                      }`}>
                        {task.priority}
                      </span>

                      <button
                        onClick={() => onEditTask(task)}
                        className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-purple-900/40 transition-colors cursor-pointer"
                        title="Edit Task"
                        aria-label={`Edit ${task.title}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteTaskPrompt(task)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete Task"
                        aria-label={`Delete ${task.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
