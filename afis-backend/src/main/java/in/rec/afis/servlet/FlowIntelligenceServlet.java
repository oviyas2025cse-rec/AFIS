package in.rec.afis.servlet;

import in.rec.afis.model.FlowRecommendation;
import in.rec.afis.service.FlowIntelligenceService;
import in.rec.afis.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Academic Flow Intelligence Servlet.
 * Returns transparent rule-based next priority task recommendation.
 * Mapped to /api/intelligence/recommendation
 */
@WebServlet(name = "FlowIntelligenceServlet", urlPatterns = {"/api/intelligence/recommendation"})
public class FlowIntelligenceServlet extends BaseServlet {

    private final FlowIntelligenceService flowService = new FlowIntelligenceService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!requireAuthentication(request, response)) return;
        String userId = getAuthenticatedUserId(request);

        try {
            FlowRecommendation recommendation = flowService.getNextFocusRecommendation(userId);
            JsonUtil.sendSuccess(response, "Flow recommendation generated", recommendation);
        } catch (Exception e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to compute flow recommendation: " + e.getMessage());
        }
    }
}
