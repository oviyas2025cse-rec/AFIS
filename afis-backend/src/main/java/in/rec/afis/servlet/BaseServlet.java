package in.rec.afis.servlet;

import in.rec.afis.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.BufferedReader;
import java.io.IOException;

/**
 * Base Servlet providing session authentication checks and request utilities.
 */
public abstract class BaseServlet extends HttpServlet {

    public static final String SESSION_USER_ID = "userId";
    public static final String SESSION_USER_EMAIL = "userEmail";

    /**
     * Retrieves the authenticated user's ID from session.
     * Returns null if unauthenticated.
     */
    protected String getAuthenticatedUserId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return null;
        Object userId = session.getAttribute(SESSION_USER_ID);
        return userId != null ? userId.toString() : null;
    }

    /**
     * Enforces authentication; sends HTTP 401 Unauthorized if not signed in.
     */
    protected boolean requireAuthentication(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String userId = getAuthenticatedUserId(request);
        if (userId == null) {
            JsonUtil.sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized. Please log in to access this academic resource.");
            return false;
        }
        return true;
    }

    /**
     * Reads JSON body string from HTTP request.
     */
    protected String readRequestBody(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        return sb.toString();
    }
}
