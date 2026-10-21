import { User, Subject, Task } from '../types';

export const INITIAL_USER: User = {
  id: 'usr-101-rec-cse',
  email: 'oviya.s.2025.cse@rajalakshmi.edu.in',
  fullName: 'Oviya S.',
  department: 'B.E. Computer Science and Engineering',
  yearOfStudy: '2nd Year (Semester IV)',
  collegeName: 'Rajalakshmi Engineering College, Chennai',
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-01',
    userId: 'usr-101-rec-cse',
    subjectCode: 'CS3401',
    subjectName: 'Algorithms & Complexity Analysis',
    credits: 4,
    facultyName: 'Dr. R. Kavitha',
    colorHex: '#7C3AED',
  },
  {
    id: 'sub-02',
    userId: 'usr-101-rec-cse',
    subjectCode: 'CS3491',
    subjectName: 'Database Management Systems',
    credits: 3,
    facultyName: 'Prof. M. Suresh',
    colorHex: '#D4AF37',
  },
  {
    id: 'sub-03',
    userId: 'usr-101-rec-cse',
    subjectCode: 'CS3492',
    subjectName: 'Operating Systems Core',
    credits: 3,
    facultyName: 'Dr. P. Anitha',
    colorHex: '#3B82F6',
  },
  {
    id: 'sub-04',
    userId: 'usr-101-rec-cse',
    subjectCode: 'CS3461',
    subjectName: 'Operating Systems Laboratory',
    credits: 2,
    facultyName: 'Prof. K. Venkatesh',
    colorHex: '#10B981',
  },
  {
    id: 'sub-05',
    userId: 'usr-101-rec-cse',
    subjectCode: 'CS3481',
    subjectName: 'DBMS & Web Applications Lab',
    credits: 2,
    facultyName: 'Dr. N. Meenakshi',
    colorHex: '#EC4899',
  },
  {
    id: 'sub-06',
    userId: 'usr-101-rec-cse',
    subjectCode: 'GE3451',
    subjectName: 'Environmental Science & Sustainability',
    credits: 2,
    facultyName: 'Dr. S. Balaji',
    colorHex: '#F59E0B',
  },
];

// Dynamically generate dates relative to current time so the demo is always fresh and realistic
const now = new Date();
const addHours = (h: number) => new Date(now.getTime() + h * 3600 * 1000).toISOString();
const addDays = (d: number, h: number = 17) => {
  const target = new Date(now);
  target.setDate(target.getDate() + d);
  target.setHours(h, 30, 0, 0);
  return target.toISOString();
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-01',
    userId: 'usr-101-rec-cse',
    subjectId: 'sub-04',
    subjectCode: 'CS3461',
    subjectName: 'Operating Systems Laboratory',
    title: 'Dining Philosophers Concurrency Record',
    description: 'Implement semaphore solution in C and record test cases with deadlock prevention proof.',
    category: 'Laboratory Record',
    dueDate: addHours(14), // Due in 14 hours
    priority: 'Critical',
    status: 'In Progress',
    flowScore: 215,
    createdAt: addDays(-2),
    updatedAt: addHours(-3),
  },
  {
    id: 'tsk-02',
    userId: 'usr-101-rec-cse',
    subjectId: 'sub-01',
    subjectCode: 'CS3401',
    subjectName: 'Algorithms & Complexity Analysis',
    title: 'Divide & Conquer Master Theorem Set',
    description: 'Solve 10 recurrence relations and submit PDF report on Anna University portal.',
    category: 'Assignment',
    dueDate: addDays(2, 23), // Due in 2 days
    priority: 'High',
    status: 'To Do',
    flowScore: 160,
    createdAt: addDays(-3),
    updatedAt: addDays(-3),
  },
  {
    id: 'tsk-03',
    userId: 'usr-101-rec-cse',
    subjectId: 'sub-02',
    subjectCode: 'CS3491',
    subjectName: 'Database Management Systems',
    title: 'B+ Tree Indexing & Query Optimization Review',
    description: 'Preparation for Continuous Assessment Test (CAT-2) Units 3 & 4 with sample execution plans.',
    category: 'Examination',
    dueDate: addDays(4, 9), // Due in 4 days
    priority: 'Critical',
    status: 'To Do',
    flowScore: 170,
    createdAt: addDays(-4),
    updatedAt: addDays(-1),
  },
  {
    id: 'tsk-04',
    userId: 'usr-101-rec-cse',
    subjectId: 'sub-05',
    subjectCode: 'CS3481',
    subjectName: 'DBMS & Web Applications Lab',
    title: 'Mini Project: Student Academic Flow Servlet Demo',
    description: 'Implement MVC architecture with Jakarta Servlets and MySQL connection pool.',
    category: 'Project',
    dueDate: addDays(7, 16), // Due in 7 days
    priority: 'High',
    status: 'In Progress',
    flowScore: 140,
    createdAt: addDays(-5),
    updatedAt: addDays(-2),
  },
  {
    id: 'tsk-05',
    userId: 'usr-101-rec-cse',
    subjectId: 'sub-03',
    subjectCode: 'CS3492',
    subjectName: 'Operating Systems Core',
    title: 'Virtual Memory Page Replacement Simulator',
    description: 'LRU, FIFO, and Optimal algorithms comparative analysis report with page fault graphs.',
    category: 'Assignment',
    dueDate: addDays(-1, 12), // Overdue by 1 day
    priority: 'High',
    status: 'To Do',
    flowScore: 235,
    createdAt: addDays(-6),
    updatedAt: addDays(-1),
  },
  {
    id: 'tsk-06',
    userId: 'usr-101-rec-cse',
    subjectId: 'sub-06',
    subjectCode: 'GE3451',
    subjectName: 'Environmental Science & Sustainability',
    title: 'Carbon Footprint Field Survey & Report',
    description: 'Case study of Thandalam village groundwater quality and renewable energy audit.',
    category: 'Presentation',
    dueDate: addDays(10, 11), // Due in 10 days
    priority: 'Medium',
    status: 'To Do',
    flowScore: 85,
    createdAt: addDays(-7),
    updatedAt: addDays(-7),
  },
  {
    id: 'tsk-07',
    userId: 'usr-101-rec-cse',
    subjectId: 'sub-02',
    subjectCode: 'CS3491',
    subjectName: 'Database Management Systems',
    title: 'SQL Normalization Lab Exercise 4',
    description: 'BCNF and 3NF decomposition schemas with functional dependencies and lossless join proof.',
    category: 'Laboratory Record',
    dueDate: addDays(-3, 16),
    priority: 'Critical',
    status: 'Completed',
    flowScore: 0,
    createdAt: addDays(-8),
    updatedAt: addDays(-3),
    completedAt: addDays(-3),
  },
];
