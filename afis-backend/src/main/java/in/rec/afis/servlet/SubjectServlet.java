package in.rec.afis.servlet;

import com.google.gson.JsonObject;
import in.rec.afis.dao.SubjectDAO;
import in.rec.afis.model.Subject;
import in.rec.afis.util.JsonUtil;
import in.rec.afis.util.ValidationUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

/**
 * Subject / Course Management Servlet.
 * Mapped to /api/subjects/*
 */
@WebServlet(name = "SubjectServlet", urlPatterns = {"/api/subjects", "/api/subjects/*"})
public class SubjectServlet extends BaseServlet {

    private final SubjectDAO subjectDAO = new SubjectDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!requireAuthentication(request, response)) return;
        String userId = getAuthenticatedUserId(request);

        try {
            List<Subject> subjects = subjectDAO.findByUserId(userId);
            JsonUtil.sendSuccess(response, "Subjects loaded", subjects);
        } catch (Exception e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to load subjects: " + e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!requireAuthentication(request, response)) return;
        String userId = getAuthenticatedUserId(request);

        try {
            String body = readRequestBody(request);
            JsonObject json = JsonUtil.fromJson(body, JsonObject.class);

            if (json == null || !json.has("subjectCode") || !json.has("subjectName")) {
                JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Course code and name are required.");
                return;
            }

            Subject s = new Subject();
            s.setUserId(userId);
            s.setSubjectCode(json.get("subjectCode").getAsString().trim().toUpperCase());
            s.setSubjectName(json.get("subjectName").getAsString().trim());
            s.setCredits(json.has("credits") ? json.get("credits").getAsInt() : 3);
            s.setFacultyName(json.has("facultyName") ? json.get("facultyName").getAsString() : "Department Faculty");
            s.setColorHex(json.has("colorHex") ? json.get("colorHex").getAsString() : "#8B5CF6");

            subjectDAO.createSubject(s);
            JsonUtil.sendSuccess(response, "Subject added successfully.", s);
        } catch (Exception e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to create subject: " + e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!requireAuthentication(request, response)) return;
        String userId = getAuthenticatedUserId(request);

        String pathInfo = request.getPathInfo();
        String id = (pathInfo != null && pathInfo.length() > 1) ? pathInfo.substring(1) : request.getParameter("id");

        if (!ValidationUtil.isNonEmpty(id)) {
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Subject ID required.");
            return;
        }

        try {
            boolean deleted = subjectDAO.deleteSubject(id, userId);
            if (deleted) {
                JsonUtil.sendSuccess(response, "Subject removed successfully.", null);
            } else {
                JsonUtil.sendError(response, HttpServletResponse.SC_NOT_FOUND, "Subject not found or access denied.");
            }
        } catch (Exception e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to remove subject: " + e.getMessage());
        }
    }
}
