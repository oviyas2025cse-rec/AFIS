package in.rec.afis.servlet;

import com.google.gson.JsonObject;
import in.rec.afis.model.User;
import in.rec.afis.service.AuthService;
import in.rec.afis.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Authentication Servlet for Student Login, Registration, Session Check, and Logout.
 * Mapped to /api/auth/*
 */
@WebServlet(name = "AuthServlet", urlPatterns = {"/api/auth/*"})
public class AuthServlet extends BaseServlet {

    private final AuthService authService = new AuthService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String pathInfo = request.getPathInfo();

        if ("/me".equals(pathInfo)) {
            String userId = getAuthenticatedUserId(request);
            if (userId == null) {
                JsonUtil.sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "No active session");
                return;
            }
            try {
                Optional<User> userOpt = authService.getUserById(userId);
                if (userOpt.isPresent()) {
                    User u = userOpt.get();
                    u.setPasswordHash(null); // Never return password hash
                    JsonUtil.sendSuccess(response, "Session active", u);
                } else {
                    request.getSession().invalidate();
                    JsonUtil.sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "User account no longer exists");
                }
            } catch (Exception e) {
                JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server error: " + e.getMessage());
            }
        } else {
            JsonUtil.sendError(response, HttpServletResponse.SC_NOT_FOUND, "Endpoint not found");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String pathInfo = request.getPathInfo();

        try {
            if ("/login".equals(pathInfo)) {
                handleLogin(request, response);
            } else if ("/register".equals(pathInfo)) {
                handleRegister(request, response);
            } else if ("/logout".equals(pathInfo)) {
                handleLogout(request, response);
            } else {
                JsonUtil.sendError(response, HttpServletResponse.SC_NOT_FOUND, "Authentication action not supported");
            }
        } catch (IllegalArgumentException e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (SecurityException e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
        } catch (IllegalStateException e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_CONFLICT, e.getMessage());
        } catch (Exception e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server error: " + e.getMessage());
        }
    }

    private void handleLogin(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String body = readRequestBody(request);
        JsonObject json = JsonUtil.fromJson(body, JsonObject.class);

        if (json == null || !json.has("email") || !json.has("password")) {
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Missing email or password.");
            return;
        }

        String email = json.get("email").getAsString();
        String password = json.get("password").getAsString();

        User user = authService.authenticate(email, password);

        // Create new session upon successful authentication
        HttpSession session = request.getSession(true);
        session.setAttribute(SESSION_USER_ID, user.getId());
        session.setAttribute(SESSION_USER_EMAIL, user.getEmail());
        session.setMaxInactiveInterval(3600 * 4); // 4 hours timeout

        user.setPasswordHash(null);
        Map<String, Object> data = new HashMap<>();
        data.put("user", user);
        data.put("sessionId", session.getId());

        JsonUtil.sendSuccess(response, "Login successful. Welcome back, " + user.getFullName() + "!", data);
    }

    private void handleRegister(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String body = readRequestBody(request);
        JsonObject json = JsonUtil.fromJson(body, JsonObject.class);

        if (json == null || !json.has("email") || !json.has("password") || !json.has("fullName")) {
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Please provide email, password, and full name.");
            return;
        }

        String email = json.get("email").getAsString();
        String password = json.get("password").getAsString();
        String fullName = json.get("fullName").getAsString();
        String department = json.has("department") ? json.get("department").getAsString() : "Computer Science & Engineering";
        String yearOfStudy = json.has("yearOfStudy") ? json.get("yearOfStudy").getAsString() : "2nd Year";
        String collegeName = json.has("collegeName") ? json.get("collegeName").getAsString() : "Rajalakshmi Engineering College";

        User newUser = authService.registerStudent(email, password, fullName, department, yearOfStudy, collegeName);

        // Auto-login registered student
        HttpSession session = request.getSession(true);
        session.setAttribute(SESSION_USER_ID, newUser.getId());
        session.setAttribute(SESSION_USER_EMAIL, newUser.getEmail());

        newUser.setPasswordHash(null);
        JsonUtil.sendSuccess(response, "Account created successfully. Welcome to AFIS!", newUser);
    }

    private void handleLogout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        JsonUtil.sendSuccess(response, "Logged out successfully.", null);
    }
}
