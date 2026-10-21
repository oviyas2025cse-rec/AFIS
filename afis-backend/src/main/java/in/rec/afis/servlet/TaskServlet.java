package in.rec.afis.servlet;

import com.google.gson.JsonObject;
import in.rec.afis.model.Task;
import in.rec.afis.service.TaskService;
import in.rec.afis.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

/**
 * Task Management Servlet for Academic Deliverables.
 * Mapped to /api/tasks/*
 */
@WebServlet(name = "TaskServlet", urlPatterns = {"/api/tasks", "/api/tasks/*"})
public class TaskServlet extends BaseServlet {

    private final TaskService taskService = new TaskService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!requireAuthentication(request, response)) return;
        String userId = getAuthenticatedUserId(request);

        String pathInfo = request.getPathInfo();
        if (pathInfo != null && pathInfo.length() > 1 && !"/".equals(pathInfo)) {
            // Single task lookup: /api/tasks/{taskId}
            String taskId = pathInfo.substring(1);
            try {
                Optional<Task> taskOpt = taskService.getTaskById(taskId, userId);
                if (taskOpt.isPresent()) {
                    JsonUtil.sendSuccess(response, "Task retrieved", taskOpt.get());
                } else {
                    JsonUtil.sendError(response, HttpServletResponse.SC_NOT_FOUND, "Task not found or access denied.");
                }
            } catch (Exception e) {
                JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database error: " + e.getMessage());
            }
            return;
        }

        // Filtered task query
        String status = request.getParameter("status");
        String priority = request.getParameter("priority");
        String category = request.getParameter("category");
        String subjectId = request.getParameter("subjectId");
        String search = request.getParameter("search");
        String sortBy = request.getParameter("sortBy");
        String sortDir = request.getParameter("sortDir");

        try {
            List<Task> tasks = taskService.getTasks(userId, status, priority, category, subjectId, search, sortBy, sortDir);
            JsonUtil.sendSuccess(response, "Tasks loaded", tasks);
        } catch (Exception e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database error: " + e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!requireAuthentication(request, response)) return;
        String userId = getAuthenticatedUserId(request);
        String pathInfo = request.getPathInfo();

        if ("/complete".equals(pathInfo)) {
            handleToggleComplete(request, response, userId);
            return;
        }

        try {
            String body = readRequestBody(request);
            JsonObject json = JsonUtil.fromJson(body, JsonObject.class);

            if (json == null || !json.has("title") || !json.has("subjectId") || !json.has("dueDate")) {
                JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Required fields: title, subjectId, dueDate");
                return;
            }

            String title = json.get("title").getAsString();
            String description = json.has("description") ? json.get("description").getAsString() : "";
            String subjectId = json.get("subjectId").getAsString();
            String category = json.has("category") ? json.get("category").getAsString() : "Assignment";
            String dueDate = json.get("dueDate").getAsString();
            String priority = json.has("priority") ? json.get("priority").getAsString() : "Medium";

            Task created = taskService.createTask(userId, subjectId, title, description, category, dueDate, priority);
            JsonUtil.sendSuccess(response, "Academic task created successfully.", created);
        } catch (IllegalArgumentException e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to create task: " + e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!requireAuthentication(request, response)) return;
        String userId = getAuthenticatedUserId(request);

        try {
            String body = readRequestBody(request);
            JsonObject json = JsonUtil.fromJson(body, JsonObject.class);

            if (json == null || !json.has("id")) {
                JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Task ID is required for update.");
                return;
            }

            String taskId = json.get("id").getAsString();
            String title = json.has("title") ? json.get("title").getAsString() : null;
            String description = json.has("description") ? json.get("description").getAsString() : null;
            String subjectId = json.has("subjectId") ? json.get("subjectId").getAsString() : null;
            String category = json.has("category") ? json.get("category").getAsString() : null;
            String dueDate = json.has("dueDate") ? json.get("dueDate").getAsString() : null;
            String priority = json.has("priority") ? json.get("priority").getAsString() : null;
            String status = json.has("status") ? json.get("status").getAsString() : null;

            Task updated = taskService.updateTask(taskId, userId, subjectId, title, description, category, dueDate, priority, status);
            JsonUtil.sendSuccess(response, "Task updated successfully.", updated);
        } catch (SecurityException e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_FORBIDDEN, e.getMessage());
        } catch (IllegalArgumentException e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to update task: " + e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!requireAuthentication(request, response)) return;
        String userId = getAuthenticatedUserId(request);

        String pathInfo = request.getPathInfo();
        String taskId = null;
        if (pathInfo != null && pathInfo.length() > 1) {
            taskId = pathInfo.substring(1);
        } else {
            taskId = request.getParameter("id");
        }

        if (taskId == null || taskId.trim().isEmpty()) {
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Task ID is required for deletion.");
            return;
        }

        try {
            boolean deleted = taskService.deleteTask(taskId, userId);
            if (deleted) {
                JsonUtil.sendSuccess(response, "Task deleted successfully.", null);
            } else {
                JsonUtil.sendError(response, HttpServletResponse.SC_NOT_FOUND, "Task not found or access denied.");
            }
        } catch (Exception e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to delete task: " + e.getMessage());
        }
    }

    private void handleToggleComplete(HttpServletRequest request, HttpServletResponse response, String userId) throws IOException {
        String body = readRequestBody(request);
        JsonObject json = JsonUtil.fromJson(body, JsonObject.class);

        if (json == null || !json.has("id")) {
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Task ID is required.");
            return;
        }

        String taskId = json.get("id").getAsString();
        try {
            boolean updated = taskService.toggleComplete(taskId, userId);
            if (updated) {
                JsonUtil.sendSuccess(response, "Task status toggled successfully.", null);
            } else {
                JsonUtil.sendError(response, HttpServletResponse.SC_NOT_FOUND, "Task not found or access denied.");
            }
        } catch (Exception e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to toggle status: " + e.getMessage());
        }
    }
}
