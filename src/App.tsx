/**
 * AFIS — Academic Flow Intelligence System
 * Production-Style Student Academic Productivity & Deadline Management Platform
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { User, Subject, Task, ActivePage, PriorityLevel, TaskCategory, TaskStatus } from './types';
import { INITIAL_USER, INITIAL_SUBJECTS, INITIAL_TASKS } from './data/seedData';
import { calculateTaskFlowScore } from './intelligence/flowAlgorithm';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/pages/LandingPage';
import { DashboardView } from './components/pages/DashboardView';
import { TaskManagementView } from './components/pages/TaskManagementView';
import { CalendarView } from './components/pages/CalendarView';
import { AnalyticsView } from './components/pages/AnalyticsView';
import { ProfileSettingsView } from './components/pages/ProfileSettingsView';
import { BackendExplorerView } from './components/pages/BackendExplorerView';
import { TaskModal } from './components/modals/TaskModal';
import { DeleteConfirmModal } from './components/modals/DeleteConfirmModal';
import { AuthModal } from './components/modals/AuthModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USER);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Recalculate Flow Scores whenever tasks change
  useEffect(() => {
    const now = new Date();
    setTasks((prev) =>
      prev.map((t) => {
        const breakdown = calculateTaskFlowScore(t, now);
        return {
          ...t,
          flowScore: breakdown.totalScore,
        };
      })
    );
  }, []);

  const handleOpenAddTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTaskPrompt = (task: Task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = () => {
    if (!taskToDelete) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    setTaskToDelete(null);
  };

  const handleSaveTask = (taskData: {
    id?: string;
    title: string;
    description: string;
    subjectId: string;
    category: TaskCategory;
    dueDate: string;
    priority: PriorityLevel;
    status: TaskStatus;
  }) => {
    const now = new Date();
    const subject = subjects.find((s) => s.id === taskData.subjectId);
    const subjectCode = subject?.subjectCode || 'SUB';
    const subjectName = subject?.subjectName || 'Course';

    if (taskData.id) {
      // Update existing
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskData.id) {
            const updated: Task = {
              ...t,
              title: taskData.title,
              description: taskData.description,
              subjectId: taskData.subjectId,
              subjectCode,
              subjectName,
              category: taskData.category,
              dueDate: taskData.dueDate,
              priority: taskData.priority,
              status: taskData.status,
              updatedAt: now.toISOString(),
              completedAt: taskData.status === 'Completed' ? now.toISOString() : null,
            };
            const breakdown = calculateTaskFlowScore(updated, now);
            updated.flowScore = breakdown.totalScore;
            return updated;
          }
          return t;
        })
      );
    } else {
      // Create new
      const newTask: Task = {
        id: 'tsk-' + Date.now().toString(36),
        userId: currentUser?.id || 'usr-default',
        title: taskData.title,
        description: taskData.description,
        subjectId: taskData.subjectId,
        subjectCode,
        subjectName,
        category: taskData.category,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status,
        flowScore: 0,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        completedAt: taskData.status === 'Completed' ? now.toISOString() : null,
      };
      const breakdown = calculateTaskFlowScore(newTask, now);
      newTask.flowScore = breakdown.totalScore;
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleToggleComplete = (task: Task) => {
    const isCompleted = task.status === 'Completed';
    const nextStatus: TaskStatus = isCompleted ? 'In Progress' : 'Completed';
    const now = new Date();

    if (!isCompleted) {
      // Celebrate completion
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#D4AF37', '#8B5CF6', '#10B981'],
      });
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === task.id) {
          const updated: Task = {
            ...t,
            status: nextStatus,
            updatedAt: now.toISOString(),
            completedAt: nextStatus === 'Completed' ? now.toISOString() : null,
          };
          const breakdown = calculateTaskFlowScore(updated, now);
          updated.flowScore = breakdown.totalScore;
          return updated;
        }
        return t;
      })
    );
  };

  const handleAddSubject = (subjectData: Omit<Subject, 'id' | 'userId'>) => {
    const newSubject: Subject = {
      id: 'sub-' + Date.now().toString(36),
      userId: currentUser?.id || 'usr-default',
      ...subjectData,
    };
    setSubjects((prev) => [...prev, newSubject]);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('landing');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActivePage('dashboard');
  };

  // Pending and overdue counts for badge display
  const now = new Date();
  const pendingCount = tasks.filter((t) => t.status !== 'Completed').length;
  const overdueCount = tasks.filter((t) => t.status !== 'Completed' && new Date(t.dueDate).getTime() < now.getTime()).length;

  return (
    <div className="min-h-screen bg-[#0c0517] text-slate-100 flex flex-col font-sans selection:bg-purple-700 selection:text-white">
      
      {/* Top Bar adhering to the 3-Zone Contract */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        currentUser={currentUser}
        onOpenAddTask={handleOpenAddTask}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Workspace Frame */}
      {activePage === 'landing' ? (
        <main className="flex-1 px-4 py-8">
          <LandingPage
            onGetStarted={() => {
              if (!currentUser) setCurrentUser(INITIAL_USER);
              setActivePage('dashboard');
            }}
            onExploreBackend={() => setActivePage('backend-docs')}
            setActivePage={setActivePage}
          />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl mx-auto w-full">
          {/* Professional Sidebar */}
          <Sidebar
            activePage={activePage}
            setActivePage={setActivePage}
            currentUser={currentUser}
            pendingCount={pendingCount}
            overdueCount={overdueCount}
          />

          {/* Page Content Viewport */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 min-w-0 max-w-full overflow-x-hidden">
            {activePage === 'dashboard' && (
              <DashboardView
                tasks={tasks}
                subjects={subjects}
                onOpenAddTask={handleOpenAddTask}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleEditTask}
                setActivePage={setActivePage}
              />
            )}

            {activePage === 'tasks' && (
              <TaskManagementView
                tasks={tasks}
                subjects={subjects}
                onOpenAddTask={handleOpenAddTask}
                onEditTask={handleEditTask}
                onDeleteTaskPrompt={handleDeleteTaskPrompt}
                onToggleComplete={handleToggleComplete}
              />
            )}

            {activePage === 'calendar' && (
              <CalendarView
                tasks={tasks}
                subjects={subjects}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleEditTask}
              />
            )}

            {activePage === 'analytics' && (
              <AnalyticsView
                tasks={tasks}
                subjects={subjects}
              />
            )}

            {activePage === 'profile' && (
              <ProfileSettingsView
                currentUser={currentUser}
                subjects={subjects}
                onAddSubject={handleAddSubject}
                onDeleteSubject={handleDeleteSubject}
              />
            )}

            {activePage === 'backend-docs' && (
              <BackendExplorerView />
            )}
          </main>
        </div>
      )}

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={taskToEdit}
        subjects={subjects}
      />

      <DeleteConfirmModal
        isOpen={!!taskToDelete}
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
