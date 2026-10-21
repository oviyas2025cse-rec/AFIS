package in.rec.afis.service;

import in.rec.afis.dao.TaskDAO;
import in.rec.afis.model.FlowRecommendation;
import in.rec.afis.model.Task;
import in.rec.afis.model.TaskStatus;

import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Academic Flow Intelligence Rule Engine.
 * 100% deterministic, explainable academic mathematics based on importance and deadline proximity.
 */
public class FlowIntelligenceService {

    private final TaskDAO taskDAO = new TaskDAO();

    /**
     * Calculates the Flow Score for a task based on:
     * 1. User-selected priority weight (25 to 100)
     * 2. Academic deliverable category weight (5 to 25)
     * 3. Deadline proximity urgency (5 to 150)
     */
    public int calculateScore(Task task, Instant referenceTime) {
        if (task.getStatus() == TaskStatus.COMPLETED) {
            return 0; // Completed tasks receive zero score
        }

        int priorityWeight = task.getPriority().getWeight();
        int categoryWeight = task.getCategory().getWeight();
        int proximityWeight = calculateProximityWeight(task.getDueDate(), referenceTime);

        return priorityWeight + categoryWeight + proximityWeight;
    }

    public int calculateProximityWeight(Timestamp dueTimestamp, Instant now) {
        if (dueTimestamp == null) return 5;
        Instant due = dueTimestamp.toInstant();
        Duration diff = Duration.between(now, due);
        long hours = diff.toHours();

        if (hours < 0) {
            return 150; // Overdue urgency penalty
        } else if (hours <= 24) {
            return 100; // Due within 24 hours
        } else if (hours <= 48) {
            return 75;  // Due within 48 hours
        } else if (hours <= 24 * 7) {
            return 45;  // Due within 7 days
        } else if (hours <= 24 * 14) {
            return 20;  // Due within 14 days
        } else {
            return 5;   // Due later
        }
    }

    /**
     * Recommends the next critical task to focus on and explains why.
     */
    public FlowRecommendation getNextFocusRecommendation(String userId) throws SQLException {
        List<Task> allTasks = taskDAO.findFiltered(userId, "To Do,In Progress", null, null, null, null, "due_date", "ASC");
        Instant now = Instant.now();

        FlowRecommendation rec = new FlowRecommendation();
        if (allTasks.isEmpty()) {
            rec.setExplanation("All semester deliverables are up to date! No pending deadlines requiring focus.");
            rec.setStatusNote("All Clear");
            rec.setDecisionFactors(List.of("No active tasks remaining in semester pipeline"));
            return rec;
        }

        Task topTask = null;
        int highestScore = -1;
        int topBasePriority = 0;
        int topCategoryWeight = 0;
        int topProximity = 0;
        boolean topOverdue = false;
        String topStatusNote = "";
        List<String> topFactors = new ArrayList<>();

        for (Task t : allTasks) {
            if (t.getStatus() == TaskStatus.COMPLETED) continue;

            int pScore = t.getPriority().getWeight();
            int cWeight = t.getCategory().getWeight();
            int prox = calculateProximityWeight(t.getDueDate(), now);
            int total = pScore + cWeight + prox;

            long hoursRemaining = Duration.between(now, t.getDueDate().toInstant()).toHours();
            boolean isOverdue = hoursRemaining < 0;

            String statusNote;
            String proxReason;
            if (isOverdue) {
                long days = Math.abs(hoursRemaining) / 24;
                statusNote = "Overdue by " + (days > 0 ? days + "d" : Math.abs(hoursRemaining) + "h");
                proxReason = "Task is overdue (" + statusNote + ") requiring immediate recovery (+150 urgency points)";
            } else if (hoursRemaining <= 24) {
                statusNote = "Due in " + Math.max(1, hoursRemaining) + "h";
                proxReason = "Deliverable deadline within 24 hours (+100 proximity points)";
            } else if (hoursRemaining <= 48) {
                statusNote = "Due tomorrow";
                proxReason = "Deliverable deadline within 48 hours (+75 proximity points)";
            } else {
                long days = hoursRemaining / 24;
                statusNote = "Due in " + days + "d";
                proxReason = "Due within " + days + " days (+" + prox + " proximity points)";
            }

            if (total > highestScore) {
                highestScore = total;
                topTask = t;
                topBasePriority = pScore;
                topCategoryWeight = cWeight;
                topProximity = prox;
                topOverdue = isOverdue;
                topStatusNote = statusNote;

                topFactors = List.of(
                        "Importance Level [" + t.getPriority().name() + "]: +" + pScore + " points",
                        "Deliverable Category [" + t.getCategory().getDisplayName() + "]: +" + cWeight + " points",
                        proxReason
                );
            }
        }

        rec.setRecommendedTask(topTask);
        rec.setFlowScore(highestScore);
        rec.setBasePriorityScore(topBasePriority);
        rec.setCategoryWeight(topCategoryWeight);
        rec.setProximityScore(topProximity);
        rec.setOverdue(topOverdue);
        rec.setStatusNote(topStatusNote);
        rec.setDecisionFactors(topFactors);

        if (topTask != null) {
            rec.setExplanation("AFIS recommends focusing on \"" + topTask.getTitle() + "\" (" + topTask.getSubjectCode() + 
                    ") because it has the highest Academic Flow Score of " + highestScore + "/275. " +
                    "Primary drivers: " + String.join(", ", topFactors) + ".");
        }

        return rec;
    }
}
