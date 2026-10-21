export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskCategory = 'Assignment' | 'Laboratory Record' | 'Project' | 'Examination' | 'Presentation' | 'General';
export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';

export interface User {
  id: string;
  email: string;
  fullName: string;
  department: string;
  yearOfStudy: string;
  collegeName: string;
}

export interface Subject {
  id: string;
  userId: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  facultyName: string;
  colorHex: string;
}

export interface Task {
  id: string;
  userId: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  description: string;
  category: TaskCategory;
  dueDate: string; // ISO date string
  priority: PriorityLevel;
  status: TaskStatus;
  flowScore: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export interface DashboardMetrics {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  overdueTasks: number;
  upcomingDeadlines: number;
  completionRate: number;
  nextDeadlineTask: Task | null;
  priorityBreakdown: Record<PriorityLevel, number>;
  subjectWorkload: Record<string, number>;
  recentTasks: Task[];
}

export type ActivePage =
  | 'landing'
  | 'dashboard'
  | 'tasks'
  | 'calendar'
  | 'analytics'
  | 'profile'
  | 'backend-docs';

export interface TraceLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  servlet: string;
  sqlQuery: string;
  params: string[];
}
