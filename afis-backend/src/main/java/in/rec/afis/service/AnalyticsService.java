package in.rec.afis.service;

import in.rec.afis.dao.TaskDAO;
import in.rec.afis.model.DashboardStats;
import in.rec.afis.model.Task;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for calculating real student academic productivity analytics.
 * Zero hardcoded numbers; all calculations derive directly from database records.
 */
public class AnalyticsService {

    private final TaskDAO taskDAO = new TaskDAO();

    public DashboardStats getDashboardStats(String userId) throws SQLException {
        DashboardStats stats = new DashboardStats();

        // 1. Fetch real summary counts
        Map<String, Integer> counts = taskDAO.getDashboardSummaryCounts(userId);
        int total = counts.getOrDefault("total", 0);
        int pending = counts.getOrDefault("pending", 0);
        int completed = counts.getOrDefault("completed", 0);
        int overdue = counts.getOrDefault("overdue", 0);
        int upcoming = counts.getOrDefault("upcoming", 0);

        stats.setTotalTasks(total);
        stats.setPendingTasks(pending);
        stats.setCompletedTasks(completed);
        stats.setOverdueTasks(overdue);
        stats.setUpcomingDeadlines(upcoming);

        // Completion rate calculation
        double rate = total > 0 ? ((double) completed / total) * 100.0 : 0.0;
        stats.setCompletionRate(Math.round(rate * 10.0) / 10.0);

        // 2. Next nearest pending deadline
        List<Task> upcomingTasks = taskDAO.findFiltered(userId, "To Do,In Progress", null, null, null, null, "due_date", "ASC");
        if (!upcomingTasks.isEmpty()) {
            stats.setNextDeadlineTask(upcomingTasks.get(0));
        }

        // 3. Recent 5 tasks
        List<Task> recent = taskDAO.findFiltered(userId, null, null, null, null, null, "created_at", "DESC");
        if (recent.size() > 5) {
            recent = recent.subList(0, 5);
        }
        stats.setRecentTasks(recent);

        // 4. Priority Breakdown
        stats.setPriorityBreakdown(taskDAO.getPriorityBreakdown(userId));

        // 5. Workload by subject
        stats.setWeeklyWorkload(taskDAO.getSubjectWorkload(userId));

        return stats;
    }

    public Map<String, Object> getDetailedAnalytics(String userId) throws SQLException {
        DashboardStats stats = getDashboardStats(userId);
        Map<String, Object> result = new HashMap<>();

        result.put("stats", stats);
        result.put("subjectWorkload", taskDAO.getSubjectWorkload(userId));
        result.put("priorityDistribution", stats.getPriorityBreakdown());

        // Category breakdown
        Map<String, Integer> categoryMap = new HashMap<>();
        List<Task> all = taskDAO.findFiltered(userId, null, null, null, null, null, "due_date", "ASC");
        for (Task t : all) {
            String cat = t.getCategory().getDisplayName();
            categoryMap.put(cat, categoryMap.getOrDefault(cat, 0) + 1);
        }
        result.put("categoryDistribution", categoryMap);

        // Calculate academic health score (0 - 100) based on on-time completion & pending overdue ratio
        int pending = stats.getPendingTasks();
        int overdue = stats.getOverdueTasks();
        int completed = stats.getCompletedTasks();
        
        int healthScore = 100;
        if (overdue > 0) {
            healthScore -= Math.min(50, overdue * 15);
        }
        if (pending > 8) {
            healthScore -= 10;
        }
        if (completed > 0) {
            healthScore = Math.min(100, healthScore + (int)(stats.getCompletionRate() * 0.2));
        }
        healthScore = Math.max(20, Math.min(100, healthScore));
        result.put("academicHealthScore", healthScore);

        return result;
    }
}
