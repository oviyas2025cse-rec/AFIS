import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProximityScore,
  calculateTaskFlowScore,
  evaluateAcademicFlow,
  TaskItem,
} from './flowAlgorithm';

const mockNow = new Date('2026-10-21T10:00:00Z');

test('proximity score identifies overdue tasks accurately', () => {
  const overdueDate = '2026-10-20T10:00:00Z'; // 24 hours ago
  const result = calculateProximityScore(overdueDate, mockNow);
  assert.equal(result.isOverdue, true);
  assert.equal(result.proximityScore, 150);
  assert.match(result.statusNote, /Overdue/);
});

test('proximity score awards maximum urgent points within 24 hours', () => {
  const urgentDate = '2026-10-21T20:00:00Z'; // 10 hours ahead
  const result = calculateProximityScore(urgentDate, mockNow);
  assert.equal(result.isOverdue, false);
  assert.equal(result.proximityScore, 100);
  assert.match(result.statusNote, /Due in 10 hours/);
});

test('completed tasks receive zero flow score and zero active penalties', () => {
  const completedTask: TaskItem = {
    id: 't-1',
    userId: 'u-1',
    title: 'Completed Lab Manual',
    description: 'Submitted to instructor',
    subjectCode: 'CS3461',
    subjectName: 'Operating Systems Lab',
    category: 'Laboratory Record',
    dueDate: '2026-10-20T10:00:00Z', // past due date
    priority: 'Critical',
    status: 'Completed',
    createdAt: '2026-10-18T10:00:00Z',
    updatedAt: '2026-10-20T09:30:00Z',
  };

  const breakdown = calculateTaskFlowScore(completedTask, mockNow);
  assert.equal(breakdown.totalScore, 0);
  assert.equal(breakdown.isOverdue, false);
  assert.equal(breakdown.statusNote, 'Completed');
});

test('task flow score calculates correct sum of priority, category, and proximity', () => {
  const activeTask: TaskItem = {
    id: 't-2',
    userId: 'u-1',
    title: 'Midterm Examination Revision',
    description: 'Trees and Dynamic Programming',
    subjectCode: 'CS3401',
    subjectName: 'Algorithms',
    category: 'Examination', // +25
    dueDate: '2026-10-21T18:00:00Z', // 8 hours ahead (+100)
    priority: 'Critical', // +100
    status: 'In Progress',
    createdAt: '2026-10-15T10:00:00Z',
    updatedAt: '2026-10-20T10:00:00Z',
  };

  const breakdown = calculateTaskFlowScore(activeTask, mockNow);
  // 100 (Critical) + 25 (Examination) + 100 (Within 24h) = 225
  assert.equal(breakdown.totalScore, 225);
  assert.equal(breakdown.basePriorityScore, 100);
  assert.equal(breakdown.categoryWeight, 25);
  assert.equal(breakdown.proximityScore, 100);
  assert.equal(breakdown.isOverdue, false);
});

test('evaluateAcademicFlow picks highest score task and excludes completed tasks', () => {
  const tasks: TaskItem[] = [
    {
      id: 't-comp',
      userId: 'u-1',
      title: 'Already Finished Task',
      description: 'Done',
      subjectCode: 'CS3491',
      subjectName: 'DBMS',
      category: 'Assignment',
      dueDate: '2026-10-20T10:00:00Z',
      priority: 'Critical',
      status: 'Completed',
      createdAt: '2026-10-10T10:00:00Z',
      updatedAt: '2026-10-20T08:00:00Z',
    },
    {
      id: 't-low',
      userId: 'u-1',
      title: 'Low Priority Assignment',
      description: 'Essay',
      subjectCode: 'GE3451',
      subjectName: 'Environmental Science',
      category: 'Assignment', // +10
      dueDate: '2026-10-28T10:00:00Z', // 7 days ahead (+45)
      priority: 'Low', // +25
      status: 'To Do',
      createdAt: '2026-10-18T10:00:00Z',
      updatedAt: '2026-10-18T10:00:00Z',
    },
    {
      id: 't-critical',
      userId: 'u-1',
      title: 'OS Process Synchronization Record',
      description: 'Dining philosophers simulation writeup',
      subjectCode: 'CS3461',
      subjectName: 'Operating Systems Lab',
      category: 'Laboratory Record', // +15
      dueDate: '2026-10-21T18:00:00Z', // 8 hours ahead (+100)
      priority: 'High', // +75
      status: 'In Progress',
      createdAt: '2026-10-18T10:00:00Z',
      updatedAt: '2026-10-18T10:00:00Z',
    },
  ];

  const result = evaluateAcademicFlow(tasks, mockNow);
  assert.equal(result.recommendedTask?.id, 't-critical');
  assert.equal(result.activeCount, 2);
  assert.equal(result.overdueCount, 0);
  assert.match(result.explanation, /OS Process Synchronization Record/);
  assert.match(result.explanation, /Flow Score 190\/275/); // 75 + 15 + 100 = 190
});
