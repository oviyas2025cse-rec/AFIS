package in.rec.afis.service;

import in.rec.afis.dao.SubjectDAO;
import in.rec.afis.dao.TaskDAO;
import in.rec.afis.model.Priority;
import in.rec.afis.model.Subject;
import in.rec.afis.model.Task;
import in.rec.afis.model.TaskCategory;
import in.rec.afis.model.TaskStatus;
import in.rec.afis.util.ValidationUtil;

import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Task Management Service with validation, score recalculation, and user isolation.
 */
public class TaskService {

    private final TaskDAO taskDAO = new TaskDAO();
    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final FlowIntelligenceService flowService = new FlowIntelligenceService();

    public List<Task> getTasks(String userId, String status, String priority, String category,
                               String subjectId, String search, String sortBy, String sortDir) throws SQLException {
        return taskDAO.findFiltered(userId, status, priority, category, subjectId, search, sortBy, sortDir);
    }

    public Optional<Task> getTaskById(String taskId, String userId) throws SQLException {
        return taskDAO.findById(taskId, userId);
    }

    public Task createTask(String userId, String subjectId, String title, String description,
                           String categoryStr, String dueDateStr, String priorityStr) throws SQLException {
        if (!ValidationUtil.isNonEmpty(title)) {
            throw new IllegalArgumentException("Task title is required.");
        }
        if (!ValidationUtil.isNonEmpty(subjectId)) {
            throw new IllegalArgumentException("Subject selection is required.");
        }

        // Verify subject belongs to user
        Optional<Subject> subj = subjectDAO.findById(subjectId, userId);
        if (subj.isEmpty()) {
            throw new IllegalArgumentException("Invalid subject selected or access denied.");
        }

        TaskCategory category = TaskCategory.fromString(categoryStr);
        Priority priority = Priority.fromString(priorityStr);
        Timestamp dueDate;
        try {
            dueDate = Timestamp.valueOf(dueDateStr.replace("T", " ") + (dueDateStr.length() <= 16 ? ":00" : ""));
        } catch (Exception e) {
            dueDate = new Timestamp(System.currentTimeMillis() + 86400000L * 2); // fallback 2 days
        }

        Task task = new Task();
        task.setId(UUID.randomUUID().toString());
        task.setUserId(userId);
        task.setSubjectId(subjectId);
        task.setTitle(title.trim());
        task.setDescription(description != null ? description.trim() : "");
        task.setCategory(category);
        task.setDueDate(dueDate);
        task.setPriority(priority);
        task.setStatus(TaskStatus.TO_DO);

        int score = flowService.calculateScore(task, Instant.now());
        task.setFlowScore(score);

        taskDAO.createTask(task);
        return taskDAO.findById(task.getId(), userId).orElse(task);
    }

    public Task updateTask(String taskId, String userId, String subjectId, String title, String description,
                           String categoryStr, String dueDateStr, String priorityStr, String statusStr) throws SQLException {
        Optional<Task> existing = taskDAO.findById(taskId, userId);
        if (existing.isEmpty()) {
            throw new SecurityException("Task not found or access denied.");
        }

        Task task = existing.get();
        if (ValidationUtil.isNonEmpty(title)) task.setTitle(title.trim());
        if (description != null) task.setDescription(description.trim());
        if (ValidationUtil.isNonEmpty(subjectId)) task.setSubjectId(subjectId);
        if (ValidationUtil.isNonEmpty(categoryStr)) task.setCategory(TaskCategory.fromString(categoryStr));
        if (ValidationUtil.isNonEmpty(priorityStr)) task.setPriority(Priority.fromString(priorityStr));
        if (ValidationUtil.isNonEmpty(statusStr)) task.setStatus(TaskStatus.fromString(statusStr));

        if (ValidationUtil.isNonEmpty(dueDateStr)) {
            try {
                task.setDueDate(Timestamp.valueOf(dueDateStr.replace("T", " ") + (dueDateStr.length() <= 16 ? ":00" : "")));
            } catch (Exception ignored) {
            }
        }

        int score = flowService.calculateScore(task, Instant.now());
        task.setFlowScore(score);

        taskDAO.updateTask(task);
        return taskDAO.findById(taskId, userId).orElse(task);
    }

    public boolean toggleComplete(String taskId, String userId) throws SQLException {
        Optional<Task> existing = taskDAO.findById(taskId, userId);
        if (existing.isEmpty()) {
            throw new SecurityException("Task not found or access denied.");
        }

        Task task = existing.get();
        TaskStatus nextStatus = (task.getStatus() == TaskStatus.COMPLETED) ? TaskStatus.IN_PROGRESS : TaskStatus.COMPLETED;
        return taskDAO.updateStatus(taskId, userId, nextStatus);
    }

    public boolean deleteTask(String taskId, String userId) throws SQLException {
        return taskDAO.deleteTask(taskId, userId);
    }
}
