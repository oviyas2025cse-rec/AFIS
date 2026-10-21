package in.rec.afis;

import in.rec.afis.model.Priority;
import in.rec.afis.model.Task;
import in.rec.afis.model.TaskCategory;
import in.rec.afis.model.TaskStatus;
import in.rec.afis.service.FlowIntelligenceService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("AFIS Academic Flow Intelligence Rule Engine Tests")
public class FlowIntelligenceTest {

    private final FlowIntelligenceService flowService = new FlowIntelligenceService();
    private final Instant fixedNow = Instant.parse("2026-10-21T10:00:00Z");

    @Test
    @DisplayName("Completed tasks strictly evaluate to zero flow score")
    void testCompletedTasksScoreZero() {
        Task task = new Task();
        task.setPriority(Priority.CRITICAL);
        task.setCategory(TaskCategory.EXAMINATION);
        task.setStatus(TaskStatus.COMPLETED);
        task.setDueDate(Timestamp.from(fixedNow.minus(1, ChronoUnit.DAYS)));

        int score = flowService.calculateScore(task, fixedNow);
        assertEquals(0, score, "Completed tasks must be awarded 0 flow score");
    }

    @Test
    @DisplayName("Overdue tasks receive maximum urgency penalty of 150 points")
    void testOverdueTasksReceiveMaxUrgency() {
        Task task = new Task();
        task.setPriority(Priority.HIGH); // 75
        task.setCategory(TaskCategory.LABORATORY_RECORD); // 15
        task.setStatus(TaskStatus.TO_DO);
        task.setDueDate(Timestamp.from(fixedNow.minus(12, ChronoUnit.HOURS))); // Overdue

        int score = flowService.calculateScore(task, fixedNow);
        // Expected: 75 (High) + 15 (Lab Record) + 150 (Overdue) = 240
        assertEquals(240, score);
    }

    @Test
    @DisplayName("Upcoming deadline within 24 hours scores 100 proximity points")
    void testNearDeadlineScores100ProximityPoints() {
        Task task = new Task();
        task.setPriority(Priority.CRITICAL); // 100
        task.setCategory(TaskCategory.EXAMINATION); // 25
        task.setStatus(TaskStatus.IN_PROGRESS);
        task.setDueDate(Timestamp.from(fixedNow.plus(8, ChronoUnit.HOURS))); // Due in 8 hours

        int score = flowService.calculateScore(task, fixedNow);
        // Expected: 100 (Critical) + 25 (Exam) + 100 (<= 24h) = 225
        assertEquals(225, score);
    }

    @Test
    @DisplayName("Far deadline beyond 14 days receives nominal 5 proximity points")
    void testFarDeadlineProximity() {
        Task task = new Task();
        task.setPriority(Priority.LOW); // 25
        task.setCategory(TaskCategory.ASSIGNMENT); // 10
        task.setStatus(TaskStatus.TO_DO);
        task.setDueDate(Timestamp.from(fixedNow.plus(20, ChronoUnit.DAYS))); // > 14 days

        int score = flowService.calculateScore(task, fixedNow);
        // Expected: 25 (Low) + 10 (Assignment) + 5 (> 14d) = 40
        assertEquals(40, score);
    }
}
