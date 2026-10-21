package in.rec.afis;

import in.rec.afis.model.Priority;
import in.rec.afis.model.Task;
import in.rec.afis.model.TaskCategory;
import in.rec.afis.model.TaskStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.sql.Timestamp;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("AFIS Task Entity & Domain Model Unit Tests")
public class TaskCrudTest {

    @Test
    @DisplayName("TaskCategory enum parses standard and alternate display strings")
    void testTaskCategoryParsing() {
        assertEquals(TaskCategory.LABORATORY_RECORD, TaskCategory.fromString("Laboratory Record"));
        assertEquals(TaskCategory.LABORATORY_RECORD, TaskCategory.fromString("laboratory_record"));
        assertEquals(TaskCategory.EXAMINATION, TaskCategory.fromString("Examination"));
        assertEquals(TaskCategory.PROJECT, TaskCategory.fromString("Project"));
        assertEquals(TaskCategory.ASSIGNMENT, TaskCategory.fromString("Assignment"));
        assertEquals(TaskCategory.ASSIGNMENT, TaskCategory.fromString(null)); // fallback
    }

    @Test
    @DisplayName("Priority enum correctly maps academic importance weights")
    void testPriorityWeights() {
        assertEquals(100, Priority.CRITICAL.getWeight());
        assertEquals(75, Priority.HIGH.getWeight());
        assertEquals(50, Priority.MEDIUM.getWeight());
        assertEquals(25, Priority.LOW.getWeight());
    }

    @Test
    @DisplayName("Task entity holds academic deliverable metadata and attributes")
    void testTaskGettersAndSetters() {
        Task task = new Task();
        task.setId("tsk-001");
        task.setTitle("CS3401 Asymptotic Analysis Problem Set");
        task.setPriority(Priority.HIGH);
        task.setStatus(TaskStatus.IN_PROGRESS);
        task.setCategory(TaskCategory.ASSIGNMENT);
        Timestamp now = new Timestamp(System.currentTimeMillis());
        task.setDueDate(now);

        assertEquals("tsk-001", task.getId());
        assertEquals("CS3401 Asymptotic Analysis Problem Set", task.getTitle());
        assertEquals(Priority.HIGH, task.getPriority());
        assertEquals(TaskStatus.IN_PROGRESS, task.getStatus());
        assertEquals(TaskCategory.ASSIGNMENT, task.getCategory());
        assertEquals(now, task.getDueDate());
    }
}
