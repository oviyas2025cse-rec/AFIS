package in.rec.afis.model;

import java.util.List;
import java.util.Map;

/**
 * Aggregated dashboard metrics calculated from database records.
 */
public class DashboardStats {
    private int totalTasks;
    private int pendingTasks;
    private int completedTasks;
    private int overdueTasks;
    private int upcomingDeadlines;
    private double completionRate;
    private Task nextDeadlineTask;
    private List<Task> recentTasks;
    private Map<String, Integer> priorityBreakdown;
    private Map<String, Integer> weeklyWorkload;

    public DashboardStats() {}

    public int getTotalTasks() { return totalTasks; }
    public void setTotalTasks(int totalTasks) { this.totalTasks = totalTasks; }

    public int getPendingTasks() { return pendingTasks; }
    public void setPendingTasks(int pendingTasks) { this.pendingTasks = pendingTasks; }

    public int getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(int completedTasks) { this.completedTasks = completedTasks; }

    public int getOverdueTasks() { return overdueTasks; }
    public void setOverdueTasks(int overdueTasks) { this.overdueTasks = overdueTasks; }

    public int getUpcomingDeadlines() { return upcomingDeadlines; }
    public void setUpcomingDeadlines(int upcomingDeadlines) { this.upcomingDeadlines = upcomingDeadlines; }

    public double getCompletionRate() { return completionRate; }
    public void setCompletionRate(double completionRate) { this.completionRate = completionRate; }

    public Task getNextDeadlineTask() { return nextDeadlineTask; }
    public void setNextDeadlineTask(Task nextDeadlineTask) { this.nextDeadlineTask = nextDeadlineTask; }

    public List<Task> getRecentTasks() { return recentTasks; }
    public void setRecentTasks(List<Task> recentTasks) { this.recentTasks = recentTasks; }

    public Map<String, Integer> getPriorityBreakdown() { return priorityBreakdown; }
    public void setPriorityBreakdown(Map<String, Integer> priorityBreakdown) { this.priorityBreakdown = priorityBreakdown; }

    public Map<String, Integer> getWeeklyWorkload() { return weeklyWorkload; }
    public void setWeeklyWorkload(Map<String, Integer> weeklyWorkload) { this.weeklyWorkload = weeklyWorkload; }
}
