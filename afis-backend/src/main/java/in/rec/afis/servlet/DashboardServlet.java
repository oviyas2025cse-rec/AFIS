package in.rec.afis.servlet;

import in.rec.afis.model.DashboardStats;
import in.rec.afis.service.AnalyticsService;
import in.rec.afis.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Dashboard Overview Metrics Servlet.
 * Mapped to /api/dashboard
 */
@WebServlet(name = "DashboardServlet", urlPatterns = {"/api/dashboard"})
public class DashboardServlet extends BaseServlet {

    private final AnalyticsService analyticsService = new AnalyticsService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!requireAuthentication(request, response)) return;
        String userId = getAuthenticatedUserId(request);

        try {
            DashboardStats stats = analyticsService.getDashboardStats(userId);
            JsonUtil.sendSuccess(response, "Dashboard metrics loaded", stats);
        } catch (Exception e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to load dashboard: " + e.getMessage());
        }
    }
}
