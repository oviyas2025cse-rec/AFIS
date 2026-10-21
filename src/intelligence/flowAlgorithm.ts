/**
 * AFIS - Academic Flow Intelligence System
 * Transparent Rule-Based Priority & Recommendation Engine
 * (Zero black-box AI - 100% deterministic, explainable academic mathematics)
 */

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskCategory = 'Assignment' | 'Laboratory Record' | 'Project' | 'Examination' | 'Presentation' | 'General';
export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';

export interface TaskItem {
  id: string;
  userId: string;
  subjectId?: string;
  title: string;
  description: string;
  subjectCode: string;
  subjectName: string;
  category: TaskCategory;
  dueDate: string; // ISO string e.g. "2026-10-22T14:30:00"
  priority: PriorityLevel;
  status: TaskStatus;
  flowScore?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export interface FlowScoreBreakdown {
  taskId: string;
  basePriorityScore: number;
  categoryWeight: number;
  proximityScore: number;
  totalScore: number;
  hoursRemaining: number;
  isOverdue: boolean;
  statusNote: string;
  reasons: string[];
}

export interface RecommendationResult {
  recommendedTask: TaskItem | null;
  breakdown: FlowScoreBreakdown | null;
  explanation: string;
  activeCount: number;
  overdueCount: number;
}

// 1. Base Priority Weights
export const PRIORITY_WEIGHTS: Record<PriorityLevel, number> = {
  Critical: 100,
  High: 75,
  Medium: 50,
  Low: 25,
};

// 2. Academic Category Weights
export const CATEGORY_WEIGHTS: Record<TaskCategory, number> = {
  Examination: 25,
  Project: 20,
  'Laboratory Record': 15,
  Presentation: 15,
  Assignment: 10,
  General: 5,
};

/**
 * Calculates deadline proximity score and hours remaining relative to a reference time.
 */
export function calculateProximityScore(dueDateIso: string, referenceTime: Date = new Date()): {
  proximityScore: number;
  hoursRemaining: number;
  isOverdue: boolean;
  statusNote: string;
  proximityReason: string;
} {
  const due = new Date(dueDateIso).getTime();
  const now = referenceTime.getTime();
  const diffMs = due - now;
  const hoursRemaining = diffMs / (1000 * 60 * 60);

  if (hoursRemaining < 0) {
    const overdueDays = Math.ceil(Math.abs(hoursRemaining) / 24);
    return {
      proximityScore: 150,
      hoursRemaining,
      isOverdue: true,
      statusNote: `Overdue by ${overdueDays} day${overdueDays > 1 ? 's' : ''}`,
      proximityReason: `Overdue by ${Math.abs(Math.round(hoursRemaining))} hours (+150 urgency score)`,
    };
  }

  if (hoursRemaining <= 24) {
    const hrs = Math.max(1, Math.round(hoursRemaining));
    return {
      proximityScore: 100,
      hoursRemaining,
      isOverdue: false,
      statusNote: `Due in ${hrs} hour${hrs > 1 ? 's' : ''}`,
      proximityReason: `Due in under 24 hours (${hrs}h remaining, +100 proximity score)`,
    };
  }

  if (hoursRemaining <= 48) {
    return {
      proximityScore: 75,
      hoursRemaining,
      isOverdue: false,
      statusNote: 'Due tomorrow',
      proximityReason: 'Due within 48 hours (+75 proximity score)',
    };
  }

  if (hoursRemaining <= 24 * 7) {
    const days = Math.round(hoursRemaining / 24);
    return {
      proximityScore: 45,
      hoursRemaining,
      isOverdue: false,
      statusNote: `Due in ${days} days`,
      proximityReason: `Due within 7 days (${days} days remaining, +45 proximity score)`,
    };
  }

  if (hoursRemaining <= 24 * 14) {
    return {
      proximityScore: 20,
      hoursRemaining,
      isOverdue: false,
      statusNote: 'Due in 2 weeks',
      proximityReason: 'Due within 14 days (+20 proximity score)',
    };
  }

  return {
    proximityScore: 5,
    hoursRemaining,
    isOverdue: false,
    statusNote: 'Upcoming (later)',
    proximityReason: 'Due beyond 2 weeks (+5 proximity score)',
  };
}

/**
 * Calculates full Flow Score breakdown for a task.
 */
export function calculateTaskFlowScore(task: TaskItem, referenceTime: Date = new Date()): FlowScoreBreakdown {
  if (task.status === 'Completed') {
    return {
      taskId: task.id,
      basePriorityScore: 0,
      categoryWeight: 0,
      proximityScore: 0,
      totalScore: 0,
      hoursRemaining: 0,
      isOverdue: false,
      statusNote: 'Completed',
      reasons: ['Task is completed and excluded from active scoring.'],
    };
  }

  const basePriorityScore = PRIORITY_WEIGHTS[task.priority] ?? 25;
  const categoryWeight = CATEGORY_WEIGHTS[task.category] ?? 5;
  const proximity = calculateProximityScore(task.dueDate, referenceTime);

  const totalScore = basePriorityScore + categoryWeight + proximity.proximityScore;
  const reasons: string[] = [
    `Importance Level [${task.priority}]: +${basePriorityScore} points`,
    `Academic Category [${task.category}]: +${categoryWeight} points`,
    proximity.proximityReason,
  ];

  return {
    taskId: task.id,
    basePriorityScore,
    categoryWeight,
    proximityScore: proximity.proximityScore,
    totalScore,
    hoursRemaining: proximity.hoursRemaining,
    isOverdue: proximity.isOverdue,
    statusNote: proximity.statusNote,
    reasons,
  };
}

/**
 * Evaluates a list of tasks and returns the top-recommended focus task.
 */
export function evaluateAcademicFlow(tasks: TaskItem[], referenceTime: Date = new Date()): RecommendationResult {
  const activeTasks = tasks.filter((t) => t.status !== 'Completed');
  const overdueTasks = activeTasks.filter((t) => new Date(t.dueDate).getTime() < referenceTime.getTime());

  if (activeTasks.length === 0) {
    return {
      recommendedTask: null,
      breakdown: null,
      explanation: 'All assignments, lab records, and exams are completed! No pending deadlines.',
      activeCount: 0,
      overdueCount: 0,
    };
  }

  // Score all active tasks
  const scoredTasks = activeTasks.map((t) => ({
    task: t,
    breakdown: calculateTaskFlowScore(t, referenceTime),
  }));

  // Sort by totalScore DESC, then earliest dueDate ASC
  scoredTasks.sort((a, b) => {
    if (b.breakdown.totalScore !== a.breakdown.totalScore) {
      return b.breakdown.totalScore - a.breakdown.totalScore;
    }
    return new Date(a.task.dueDate).getTime() - new Date(b.task.dueDate).getTime();
  });

  const top = scoredTasks[0];
  const explanation = `Recommended focus: "${top.task.title}" (${top.task.subjectCode}) with Flow Score ${top.breakdown.totalScore}/275. ` +
    `Key factors: ${top.breakdown.reasons.join(' · ')}.`;

  return {
    recommendedTask: top.task,
    breakdown: top.breakdown,
    explanation,
    activeCount: activeTasks.length,
    overdueCount: overdueTasks.length,
  };
}
