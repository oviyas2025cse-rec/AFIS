import React, { useState, useEffect } from 'react';
import { Task, Subject, PriorityLevel, TaskCategory, TaskStatus } from '../../types';
import { calculateTaskFlowScore } from '../../intelligence/flowAlgorithm';
import { X, Sparkles, Calendar, BookOpen, Layers } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    id?: string;
    title: string;
    description: string;
    subjectId: string;
    category: TaskCategory;
    dueDate: string;
    priority: PriorityLevel;
    status: TaskStatus;
  }) => void;
  initialTask: Task | null;
  subjects: Subject[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  subjects,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Assignment');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [validationError, setValidationError] = useState('');

  // Setup form values
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setSubjectId(initialTask.subjectId);
      setCategory(initialTask.category);
      // Format to datetime-local e.g. YYYY-MM-DDTHH:mm
      const d = new Date(initialTask.dueDate);
      const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setDueDate(iso);
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
    } else {
      setTitle('');
      setDescription('');
      setSubjectId(subjects.length > 0 ? subjects[0].id : '');
      setCategory('Assignment');
      // Default to 2 days ahead at 17:00
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 2);
      defaultDate.setHours(17, 0, 0, 0);
      const iso = new Date(defaultDate.getTime() - defaultDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setDueDate(iso);
      setPriority('Medium');
      setStatus('To Do');
    }
    setValidationError('');
  }, [initialTask, isOpen, subjects]);

  if (!isOpen) return null;

  // Live preview of Flow Score
  const previewTask: Task = {
    id: 'preview',
    userId: 'u',
    subjectId: subjectId || (subjects[0]?.id ?? ''),
    subjectCode: subjects.find(s => s.id === subjectId)?.subjectCode || 'SUB',
    subjectName: subjects.find(s => s.id === subjectId)?.subjectName || 'Course',
    title: title || 'Untitled Task',
    description,
    category,
    dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
    priority,
    status,
    flowScore: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const liveScore = calculateTaskFlowScore(previewTask, new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Please enter a task title.');
      return;
    }
    if (!subjectId) {
      setValidationError('Please select an enrolled subject.');
      return;
    }
    if (!dueDate) {
      setValidationError('Please select a valid deadline date and time.');
      return;
    }

    onSave({
      id: initialTask?.id,
      title: title.trim(),
      description: description.trim(),
      subjectId,
      category,
      dueDate: new Date(dueDate).toISOString(),
      priority,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-purple-900/60 bg-[#160a2c] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-purple-950/70 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">
              {initialTask ? 'Edit Academic Task' : 'Create Academic Deliverable'}
            </h2>
            <p className="text-xs text-slate-400">
              Flow Intelligence dynamically calculates priority points.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {validationError && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
              {validationError}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Deliverable Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dining Philosophers Concurrency Record"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0d0519] border border-purple-900/60 text-xs text-white placeholder-slate-500 focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Subject & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Enrolled Subject *
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0519] border border-purple-900/60 text-xs text-white focus:border-amber-400 cursor-pointer"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.subjectCode} - {sub.subjectName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0519] border border-purple-900/60 text-xs text-white focus:border-amber-400 cursor-pointer"
              >
                <option value="Assignment">Assignment (+10 pts)</option>
                <option value="Laboratory Record">Laboratory Record (+15 pts)</option>
                <option value="Project">Project (+20 pts)</option>
                <option value="Examination">Examination (+25 pts)</option>
                <option value="Presentation">Presentation (+15 pts)</option>
                <option value="General">General (+5 pts)</option>
              </select>
            </div>
          </div>

          {/* Due Date & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Submission Deadline *
              </label>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0519] border border-purple-900/60 text-xs text-white focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Importance Level *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0519] border border-purple-900/60 text-xs text-white focus:border-amber-400 cursor-pointer"
              >
                <option value="Critical">Critical (+100 pts)</option>
                <option value="High">High (+75 pts)</option>
                <option value="Medium">Medium (+50 pts)</option>
                <option value="Low">Low (+25 pts)</option>
              </select>
            </div>
          </div>

          {/* Status (if editing) */}
          {initialTask && (
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Workflow Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0519] border border-purple-900/60 text-xs text-white focus:border-amber-400 cursor-pointer"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Description & Requirements
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Lab code submission on college portal with observation table and screenshots..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0d0519] border border-purple-900/60 text-xs text-white placeholder-slate-500 focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Live Flow Score Preview Card */}
          <div className="p-3 rounded-lg border border-amber-400/30 bg-amber-500/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Computed Flow Score</span>
              </span>
              <span className="text-sm font-bold font-mono text-amber-300">
                {liveScore.totalScore} / 275 pts
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {liveScore.reasons.join(' · ')}
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-950/70">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              {initialTask ? 'Update Deliverable' : 'Create Task'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
