package in.rec.afis.model;

/**
 * Task completion workflow status.
 */
public enum TaskStatus {
    TO_DO("To Do"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed");

    private final String displayName;

    TaskStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static TaskStatus fromString(String value) {
        if (value == null) return TO_DO;
        String normalized = value.trim().toLowerCase().replace(" ", "_");
        for (TaskStatus s : values()) {
            if (s.name().equalsIgnoreCase(normalized) || s.displayName.equalsIgnoreCase(value.trim())) {
                return s;
            }
        }
        return TO_DO;
    }
}
