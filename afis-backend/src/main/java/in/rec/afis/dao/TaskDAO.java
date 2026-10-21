package in.rec.afis.dao;

import in.rec.afis.model.Priority;
import in.rec.afis.model.Task;
import in.rec.afis.model.TaskCategory;
import in.rec.afis.model.TaskStatus;

import java.sql.*;
import java.util.*;

/**
 * Data Access Object for Academic Tasks.
 * Every query and mutation strictly enforces student ownership (`user_id = ?`).
 */
public class TaskDAO {

    public List<Task> findFiltered(String userId, String status, String priority, String category, 
                                   String subjectId, String search, String sortBy, String sortDir) throws SQLException {
        List<Task> tasks = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
                "SELECT t.id, t.user_id, t.subject_id, s.subject_code, s.subject_name, " +
                "t.title, t.description, t.category, t.due_date, t.priority, t.status, " +
                "t.flow_score, t.created_at, t.updated_at, t.completed_at " +
                "FROM tasks t " +
                "INNER JOIN subjects s ON t.subject_id = s.id " +
                "WHERE t.user_id = ? "
        );

        List<Object> params = new ArrayList<>();
        params.add(userId);

        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            sql.append("AND t.status = ? ");
            params.add(status.trim());
        }

        if (priority != null && !priority.trim().isEmpty() && !priority.equalsIgnoreCase("ALL")) {
            sql.append("AND t.priority = ? ");
            params.add(priority.trim());
        }

        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            sql.append("AND t.category = ? ");
            params.add(category.trim());
        }

        if (subjectId != null && !subjectId.trim().isEmpty() && !subjectId.equalsIgnoreCase("ALL")) {
            sql.append("AND t.subject_id = ? ");
            params.add(subjectId.trim());
        }

        if (search != null && !search.trim().isEmpty()) {
            sql.append("AND (LOWER(t.title) LIKE ? OR LOWER(t.description) LIKE ? OR LOWER(s.subject_code) LIKE ?) ");
            String pattern = "%" + search.trim().toLowerCase() + "%";
            params.add(pattern);
            params.add(pattern);
            params.add(pattern);
        }

        // Safe sorting whitelist
        String sortColumn = "t.due_date";
        if ("priority".equalsIgnoreCase(sortBy)) sortColumn = "FIELD(t.priority, 'Critical', 'High', 'Medium', 'Low')";
        else if ("flow_score".equalsIgnoreCase(sortBy)) sortColumn = "t.flow_score";
        else if ("title".equalsIgnoreCase(sortBy)) sortColumn = "t.title";
        else if ("created_at".equalsIgnoreCase(sortBy)) sortColumn = "t.created_at";

        String direction = "DESC".equalsIgnoreCase(sortDir) ? "DESC" : "ASC";
        if ("flow_score".equalsIgnoreCase(sortBy)) direction = "DESC";

        sql.append("ORDER BY ").append(sortColumn).append(" ").append(direction);

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    tasks.add(mapResultSetToTask(rs));
                }
            }
        }
        return tasks;
    }

    public Optional<Task> findById(String id, String userId) throws SQLException {
        String sql = "SELECT t.id, t.user_id, t.subject_id, s.subject_code, s.subject_name, " +
                     "t.title, t.description, t.category, t.due_date, t.priority, t.status, " +
                     "t.flow_score, t.created_at, t.updated_at, t.completed_at " +
                     "FROM tasks t " +
                     "INNER JOIN subjects s ON t.subject_id = s.id " +
                     "WHERE t.id = ? AND t.user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, id);
            ps.setString(2, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToTask(rs));
                }
            }
        }
        return Optional.empty();
    }

    public boolean createTask(Task task) throws SQLException {
        String sql = "INSERT INTO tasks (id, user_id, subject_id, title, description, category, due_date, priority, status, flow_score) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, task.getId() != null ? task.getId() : UUID.randomUUID().toString());
            ps.setString(2, task.getUserId());
            ps.setString(3, task.getSubjectId());
            ps.setString(4, task.getTitle());
            ps.setString(5, task.getDescription());
            ps.setString(6, task.getCategory().getDisplayName());
            ps.setTimestamp(7, task.getDueDate());
            ps.setString(8, task.getPriority().name().substring(0, 1).toUpperCase() + task.getPriority().name().substring(1).toLowerCase());
            ps.setString(9, task.getStatus().getDisplayName());
            ps.setInt(10, task.getFlowScore());
            return ps.executeUpdate() > 0;
        }
    }

    public boolean updateTask(Task task) throws SQLException {
        String sql = "UPDATE tasks SET subject_id = ?, title = ?, description = ?, category = ?, due_date = ?, " +
                     "priority = ?, status = ?, flow_score = ? " +
                     "WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, task.getSubjectId());
            ps.setString(2, task.getTitle());
            ps.setString(3, task.getDescription());
            ps.setString(4, task.getCategory().getDisplayName());
            ps.setTimestamp(5, task.getDueDate());
            ps.setString(6, task.getPriority().name().substring(0, 1).toUpperCase() + task.getPriority().name().substring(1).toLowerCase());
            ps.setString(7, task.getStatus().getDisplayName());
            ps.setInt(8, task.getFlowScore());
            ps.setString(9, task.getId());
            ps.setString(10, task.getUserId());
            return ps.executeUpdate() > 0;
        }
    }

    public boolean updateStatus(String id, String userId, TaskStatus newStatus) throws SQLException {
        String sql = "UPDATE tasks SET status = ?, completed_at = CASE WHEN ? = 'Completed' THEN NOW() ELSE NULL END " +
                     "WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, newStatus.getDisplayName());
            ps.setString(2, newStatus.getDisplayName());
            ps.setString(3, id);
            ps.setString(4, userId);
            return ps.executeUpdate() > 0;
        }
    }

    public boolean deleteTask(String id, String userId) throws SQLException {
        String sql = "DELETE FROM tasks WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, id);
            ps.setString(2, userId);
            return ps.executeUpdate() > 0;
        }
    }

    public Map<String, Integer> getDashboardSummaryCounts(String userId) throws SQLException {
        Map<String, Integer> counts = new HashMap<>();
        String sql = "SELECT " +
                     "COUNT(*) AS total, " +
                     "SUM(CASE WHEN status != 'Completed' THEN 1 ELSE 0 END) AS pending, " +
                     "SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed, " +
                     "SUM(CASE WHEN status != 'Completed' AND due_date < NOW() THEN 1 ELSE 0 END) AS overdue, " +
                     "SUM(CASE WHEN status != 'Completed' AND due_date >= NOW() AND due_date <= DATE_ADD(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS upcoming " +
                     "FROM tasks WHERE user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    counts.put("total", rs.getInt("total"));
                    counts.put("pending", rs.getInt("pending"));
                    counts.put("completed", rs.getInt("completed"));
                    counts.put("overdue", rs.getInt("overdue"));
                    counts.put("upcoming", rs.getInt("upcoming"));
                }
            }
        }
        return counts;
    }

    public Map<String, Integer> getPriorityBreakdown(String userId) throws SQLException {
        Map<String, Integer> map = new LinkedHashMap<>();
        map.put("Critical", 0);
        map.put("High", 0);
        map.put("Medium", 0);
        map.put("Low", 0);

        String sql = "SELECT priority, COUNT(*) AS cnt FROM tasks WHERE user_id = ? AND status != 'Completed' GROUP BY priority";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    map.put(rs.getString("priority"), rs.getInt("cnt"));
                }
            }
        }
        return map;
    }

    public Map<String, Integer> getSubjectWorkload(String userId) throws SQLException {
        Map<String, Integer> map = new LinkedHashMap<>();
        String sql = "SELECT s.subject_code, COUNT(t.id) AS cnt " +
                     "FROM subjects s " +
                     "LEFT JOIN tasks t ON s.id = t.subject_id AND t.status != 'Completed' " +
                     "WHERE s.user_id = ? " +
                     "GROUP BY s.id, s.subject_code " +
                     "ORDER BY cnt DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    map.put(rs.getString("subject_code"), rs.getInt("cnt"));
                }
            }
        }
        return map;
    }

    private Task mapResultSetToTask(ResultSet rs) throws SQLException {
        Task t = new Task();
        t.setId(rs.getString("id"));
        t.setUserId(rs.getString("user_id"));
        t.setSubjectId(rs.getString("subject_id"));
        t.setSubjectCode(rs.getString("subject_code"));
        t.setSubjectName(rs.getString("subject_name"));
        t.setTitle(rs.getString("title"));
        t.setDescription(rs.getString("description"));
        t.setCategory(TaskCategory.fromString(rs.getString("category")));
        t.setDueDate(rs.getTimestamp("due_date"));
        t.setPriority(Priority.fromString(rs.getString("priority")));
        t.setStatus(TaskStatus.fromString(rs.getString("status")));
        t.setFlowScore(rs.getInt("flow_score"));
        t.setCreatedAt(rs.getTimestamp("created_at"));
        t.setUpdatedAt(rs.getTimestamp("updated_at"));
        t.setCompletedAt(rs.getTimestamp("completed_at"));
        return t;
    }
}
