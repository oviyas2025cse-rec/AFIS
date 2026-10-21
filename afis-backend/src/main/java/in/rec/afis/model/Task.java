package in.rec.afis.model;

import java.sql.Timestamp;

/**
 * Academic task / deadline entity.
 */
public class Task {
    private String id;
    private String userId;
    private String subjectId;
    private String subjectCode;
    private String subjectName;
    private String title;
    private String description;
    private TaskCategory category;
    private Timestamp dueDate;
    private Priority priority;
    private TaskStatus status;
    private int flowScore;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private Timestamp completedAt;

    public Task() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TaskCategory getCategory() { return category; }
    public void setCategory(TaskCategory category) { this.category = category; }

    public Timestamp getDueDate() { return dueDate; }
    public void setDueDate(Timestamp dueDate) { this.dueDate = dueDate; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public int getFlowScore() { return flowScore; }
    public void setFlowScore(int flowScore) { this.flowScore = flowScore; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }

    public Timestamp getCompletedAt() { return completedAt; }
    public void setCompletedAt(Timestamp completedAt) { this.completedAt = completedAt; }
}
