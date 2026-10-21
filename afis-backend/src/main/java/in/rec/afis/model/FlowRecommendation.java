package in.rec.afis.model;

import java.util.List;

/**
 * Transparent rule-based focus recommendation with explicit breakdown factors.
 */
public class FlowRecommendation {
    private Task recommendedTask;
    private int flowScore;
    private int basePriorityScore;
    private int categoryWeight;
    private int proximityScore;
    private boolean isOverdue;
    private String statusNote;
    private String explanation;
    private List<String> decisionFactors;

    public FlowRecommendation() {}

    public Task getRecommendedTask() { return recommendedTask; }
    public void setRecommendedTask(Task recommendedTask) { this.recommendedTask = recommendedTask; }

    public int getFlowScore() { return flowScore; }
    public void setFlowScore(int flowScore) { this.flowScore = flowScore; }

    public int getBasePriorityScore() { return basePriorityScore; }
    public void setBasePriorityScore(int basePriorityScore) { this.basePriorityScore = basePriorityScore; }

    public int getCategoryWeight() { return categoryWeight; }
    public void setCategoryWeight(int categoryWeight) { this.categoryWeight = categoryWeight; }

    public int getProximityScore() { return proximityScore; }
    public void setProximityScore(int proximityScore) { this.proximityScore = proximityScore; }

    public boolean isOverdue() { return isOverdue; }
    public void setOverdue(boolean overdue) { isOverdue = overdue; }

    public String getStatusNote() { return statusNote; }
    public void setStatusNote(String statusNote) { this.statusNote = statusNote; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public List<String> getDecisionFactors() { return decisionFactors; }
    public void setDecisionFactors(List<String> decisionFactors) { this.decisionFactors = decisionFactors; }
}
