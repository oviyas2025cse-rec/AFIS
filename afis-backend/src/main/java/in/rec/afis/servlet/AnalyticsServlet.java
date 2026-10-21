package in.rec.afis.servlet;

import in.rec.afis.service.AnalyticsService;
import in.rec.afis.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

/**
 * Academic Productivity Analytics Servlet.
 * Mapped to /api/analytics
 */
@WebServlet(name = "AnalyticsServlet", urlPatterns = {"/api/analytics"})
public class AnalyticsServlet extends BaseServlet {

    private final AnalyticsService analyticsService = new AnalyticsService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!requireAuthentication(request, response)) return;
        String userId = getAuthenticatedUserId(request);

        try {
            Map<String, Object> data = analyticsService.getDetailedAnalytics(userId);
            JsonUtil.sendSuccess(response, "Analytics data computed", data);
        } catch (Exception e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to compute analytics: " + e.getMessage());
        }
    }
}
