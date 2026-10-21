-- ============================================================================
-- AFIS: Academic Flow Intelligence System
-- Database Schema & Initial Seed Data
-- Compatible with: MySQL 8.0+
-- Database Name: afis_db
-- ============================================================================

CREATE DATABASE IF NOT EXISTS afis_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE afis_db;

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- Stores student accounts with BCrypt-hashed credentials.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    department VARCHAR(100) DEFAULT 'Computer Science & Engineering',
    year_of_study VARCHAR(20) DEFAULT '2nd Year',
    college_name VARCHAR(150) DEFAULT 'Rajalakshmi Engineering College',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. SUBJECTS TABLE
-- Academic courses mapped to specific students (enforcing student ownership).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(150) NOT NULL,
    credits INT DEFAULT 3,
    faculty_name VARCHAR(120),
    color_hex VARCHAR(7) DEFAULT '#8B5CF6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subjects_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_subject_code UNIQUE (user_id, subject_code),
    INDEX idx_subjects_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. TASKS TABLE
-- Academic deliverables, deadlines, and Flow Intelligence attributes.
-- Enforces strict ownership via user_id foreign key.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    subject_id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category ENUM('Assignment', 'Laboratory Record', 'Project', 'Examination', 'Presentation', 'General') NOT NULL DEFAULT 'Assignment',
    due_date DATETIME NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
    status ENUM('To Do', 'In Progress', 'Completed') NOT NULL DEFAULT 'To Do',
    flow_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at DATETIME NULL,
    CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_tasks_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    INDEX idx_tasks_user_status (user_id, status),
    INDEX idx_tasks_due_date (due_date),
    INDEX idx_tasks_user_due (user_id, due_date),
    INDEX idx_tasks_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. REMINDERS TABLE (Optional Extensible Reminder Model)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reminders (
    id VARCHAR(36) PRIMARY KEY,
    task_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    remind_at DATETIME NOT NULL,
    is_sent BOOLEAN DEFAULT FALSE,
    note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reminders_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_reminders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_reminders_time (remind_at, is_sent)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. TASK AUDIT HISTORY TABLE
-- Tracks status transitions for productivity analytics.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS task_history (
    id VARCHAR(36) PRIMARY KEY,
    task_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    previous_status VARCHAR(30),
    new_status VARCHAR(30),
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_history_user_logged (user_id, logged_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA (Ready for Demo & Testing)
-- Default demo account credentials:
-- Email: oviya.s.2025.cse@rajalakshmi.edu.in
-- Password: password123 (BCrypt hash: $2a$12$e8Yg0QzYp5Z7bV7T1n.gveiR9k.iQnO7uOaU6N0zU2E7h5H0cO5d2)
-- ============================================================================

INSERT INTO users (id, email, password_hash, full_name, department, year_of_study, college_name)
VALUES (
    'usr-101-rec-cse',
    'oviya.s.2025.cse@rajalakshmi.edu.in',
    '$2a$12$e8Yg0QzYp5Z7bV7T1n.gveiR9k.iQnO7uOaU6N0zU2E7h5H0cO5d2',
    'Oviya S.',
    'B.E. Computer Science and Engineering',
    '2nd Year (Semester IV)',
    'Rajalakshmi Engineering College, Chennai'
) ON DUPLICATE KEY UPDATE id=id;

-- Seed Subjects for 2nd Year CSE
INSERT INTO subjects (id, user_id, subject_code, subject_name, credits, faculty_name, color_hex) VALUES
('sub-01', 'usr-101-rec-cse', 'CS3401', 'Algorithms & Complexity Analysis', 4, 'Dr. R. Kavitha', '#7C3AED'),
('sub-02', 'usr-101-rec-cse', 'CS3491', 'Database Management Systems', 3, 'Prof. M. Suresh', '#D4AF37'),
('sub-03', 'usr-101-rec-cse', 'CS3492', 'Operating Systems Core', 3, 'Dr. P. Anitha', '#3B82F6'),
('sub-04', 'usr-101-rec-cse', 'CS3461', 'Operating Systems Laboratory', 2, 'Prof. K. Venkatesh', '#10B981'),
('sub-05', 'usr-101-rec-cse', 'CS3481', 'DBMS & Web Applications Lab', 2, 'Dr. N. Meenakshi', '#EC4899'),
('sub-06', 'usr-101-rec-cse', 'GE3451', 'Environmental Science & Sustainability', 2, 'Dr. S. Balaji', '#F59E0B')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Tasks with realistic deadlines relative to current academic semester
INSERT INTO tasks (id, user_id, subject_id, title, description, category, due_date, priority, status, flow_score, created_at) VALUES
('tsk-01', 'usr-101-rec-cse', 'sub-04', 'Dining Philosophers Concurrency Record', 'Implement semaphore solution in C and record test cases with deadlock prevention proof.', 'Laboratory Record', DATE_ADD(NOW(), INTERVAL 14 HOUR), 'Critical', 'In Progress', 215, NOW()),
('tsk-02', 'usr-101-rec-cse', 'sub-01', 'Divide & Conquer Master Theorem Set', 'Solve 10 recurrence relations and submit PDF report on Anna University portal.', 'Assignment', DATE_ADD(NOW(), INTERVAL 2 DAY), 'High', 'To Do', 160, NOW()),
('tsk-03', 'usr-101-rec-cse', 'sub-02', 'B+ Tree Indexing & Query Optimization Review', 'Preparation for Continuous Assessment Test (CAT-2) Units 3 & 4.', 'Examination', DATE_ADD(NOW(), INTERVAL 4 DAY), 'Critical', 'To Do', 170, NOW()),
('tsk-04', 'usr-101-rec-cse', 'sub-05', 'Mini Project: Student Academic Flow Servlet Demo', 'Implement MVC architecture with Jakarta Servlets and MySQL connection pool.', 'Project', DATE_ADD(NOW(), INTERVAL 7 DAY), 'High', 'In Progress', 140, NOW()),
('tsk-05', 'usr-101-rec-cse', 'sub-03', 'Virtual Memory Page Replacement Simulator', 'LRU, FIFO, and Optimal algorithms comparative analysis report.', 'Assignment', DATE_SUB(NOW(), INTERVAL 1 DAY), 'High', 'To Do', 235, NOW()),
('tsk-06', 'usr-101-rec-cse', 'sub-06', 'Carbon Footprint Field Survey & Report', 'Case study of Thandalam village groundwater quality.', 'Presentation', DATE_ADD(NOW(), INTERVAL 10 DAY), 'Medium', 'To Do', 85, NOW()),
('tsk-07', 'usr-101-rec-cse', 'sub-02', 'SQL Normalization Lab Exercise 4', 'BCNF and 3NF decomposition schemas with functional dependencies.', 'Laboratory Record', DATE_SUB(NOW(), INTERVAL 3 DAY), 'Critical', 'Completed', 0, NOW())
ON DUPLICATE KEY UPDATE id=id;
