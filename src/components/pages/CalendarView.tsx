import React, { useState } from 'react';
import { Task, Subject } from '../../types';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Bell,
  BookOpen,
} from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  subjects: Subject[];
  onToggleComplete: (task: Task) => void;
  onEditTask: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  subjects,
  onToggleComplete,
  onEditTask,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayTasks, setSelectedDayTasks] = useState<Task[] | null>(null);
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>('');

  const now = new Date();

  // Calendar math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Group tasks by Date string YYYY-MM-DD
  const tasksByDate = React.useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      const d = new Date(t.dueDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Chronologically sorted upcoming tasks
  const upcomingChronological = React.useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [tasks]);

  const handleSelectDay = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTasks = tasksByDate[dateKey] || [];
    setSelectedDayTasks(dayTasks);
    setSelectedDateLabel(`${monthNames[month]} ${day}, ${year}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-950/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Calendar & Academic Deadlines</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized monthly schedule with countdown indicators and extensible reminder schedule.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-purple-800 bg-purple-950/40 text-slate-200 hover:bg-purple-900/60 transition-colors cursor-pointer"
          >
            Today
          </button>
          <div className="flex items-center gap-1 bg-[#150a2b] border border-purple-900/50 rounded-lg p-0.5">
            <button
              onClick={prevMonth}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-purple-900/40 cursor-pointer"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-white px-2 font-mono">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-purple-900/40 cursor-pointer"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar on Left, Agenda / Day Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Calendar (Spans 2 columns) */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-purple-900/40 bg-[#150a2b]/80 space-y-4">
          
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 pb-2 border-b border-purple-950/60">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank leading slots */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[70px] rounded-lg bg-transparent" />
            ))}

            {/* Calendar Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayTasks = tasksByDate[dateKey] || [];
              const isToday =
                now.getDate() === day &&
                now.getMonth() === month &&
                now.getFullYear() === year;

              const hasOverdue = dayTasks.some(
                (t) => t.status !== 'Completed' && new Date(t.dueDate).getTime() < now.getTime()
              );
              const hasPending = dayTasks.some((t) => t.status !== 'Completed');

              return (
                <button
                  key={day}
                  onClick={() => handleSelectDay(day)}
                  className={`min-h-[78px] p-1.5 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer group ${
                    isToday
                      ? 'border-amber-400 bg-amber-400/10 shadow-sm'
                      : dayTasks.length > 0
                      ? 'border-purple-800/60 bg-[#1a0c36] hover:border-amber-400/50'
                      : 'border-purple-950/30 bg-[#120726]/40 hover:bg-purple-950/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isToday
                          ? 'text-amber-400 bg-amber-400/20 px-1.5 py-0.5 rounded'
                          : 'text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {day}
                    </span>
                    {dayTasks.length > 0 && (
                      <span
                        className={`text-[10px] font-mono px-1 rounded ${
                          hasOverdue
                            ? 'bg-rose-500/20 text-rose-300'
                            : hasPending
                            ? 'bg-amber-400/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task Indicators */}
                  <div className="space-y-1 mt-1">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className={`text-[10px] px-1 py-0.5 rounded truncate font-medium ${
                          t.status === 'Completed'
                            ? 'bg-slate-800 text-slate-400 line-through'
                            : t.priority === 'Critical'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800/30'
                            : 'bg-purple-900/60 text-purple-200 border border-purple-800/30'
                        }`}
                        title={`${t.subjectCode}: ${t.title}`}
                      >
                        {t.subjectCode}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="text-[9px] text-amber-400 font-mono block">
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="pt-3 border-t border-purple-950/60 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Overdue Deadline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Pending Task</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Completed</span>
            </div>
          </div>

        </div>

        {/* Right Side: Day Inspector / Chronological Deadlines */}
        <div className="p-5 rounded-xl border border-purple-900/40 bg-[#150a2b]/80 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-purple-950/60">
              <h3 className="text-sm font-bold text-white tracking-tight">
                {selectedDateLabel ? selectedDateLabel : 'Upcoming Deadlines'}
              </h3>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>

            {selectedDayTasks ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{selectedDayTasks.length} deliverables on this date</span>
                  <button
                    onClick={() => setSelectedDayTasks(null)}
                    className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                  >
                    View All Upcoming
                  </button>
                </div>

                {selectedDayTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No tasks due on this date.
                  </p>
                ) : (
                  selectedDayTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-lg border border-purple-900/40 bg-[#1a0c36] space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          {t.subjectCode}
                        </span>
                        <span className="text-[10px] text-purple-300 font-mono">
                          {new Date(t.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-white">{t.title}</p>
                      <div className="flex items-center gap-2 pt-1 text-[11px]">
                        <button
                          onClick={() => onToggleComplete(t)}
                          className="text-emerald-400 hover:text-emerald-300 cursor-pointer font-medium"
                        >
                          {t.status === 'Completed' ? 'Completed ✓' : 'Mark Done'}
                        </button>
                        <span className="text-slate-600">·</span>
                        <button
                          onClick={() => onEditTask(t)}
                          className="text-slate-400 hover:text-white cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {upcomingChronological.map((task) => {
                  const isCompleted = task.status === 'Completed';
                  const isOverdue = !isCompleted && new Date(task.dueDate).getTime() < now.getTime();
                  const diffHours = Math.round((new Date(task.dueDate).getTime() - now.getTime()) / (1000 * 3600));

                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border transition-all space-y-1.5 ${
                        isCompleted
                          ? 'border-purple-950/30 bg-[#120726]/40 opacity-70'
                          : isOverdue
                          ? 'border-rose-500/30 bg-rose-950/20'
                          : 'border-purple-900/40 bg-[#1a0c36]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-amber-400">{task.subjectCode}</span>
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                            isCompleted
                              ? 'text-slate-400 bg-slate-800'
                              : isOverdue
                              ? 'text-rose-300 bg-rose-900/40'
                              : 'text-amber-300 bg-amber-900/40'
                          }`}
                        >
                          {isCompleted
                            ? 'Completed'
                            : isOverdue
                            ? `Overdue (${Math.abs(diffHours)}h)`
                            : diffHours <= 24
                            ? `Due in ${Math.max(1, diffHours)}h`
                            : `Due in ${Math.round(diffHours / 24)}d`}
                        </span>
                      </div>

                      <p className={`text-xs font-semibold ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                        {task.title}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>{new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        <button
                          onClick={() => onToggleComplete(task)}
                          className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                        >
                          {isCompleted ? 'Completed ✓' : 'Mark Done'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Extensible Reminder Model Callout */}
          <div className="pt-3 border-t border-purple-950/60 p-3 rounded-lg bg-[#0e051c]/90 border border-purple-900/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Extensible Reminder Engine</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              AFIS stores schedule reminders in MySQL (<code className="text-amber-400 font-mono text-[10px]">reminders</code> table). Notifications trigger via web countdowns; email dispatch requires local SMTP gateway setup.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
