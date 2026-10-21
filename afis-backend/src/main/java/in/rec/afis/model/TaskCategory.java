package in.rec.afis.model;

/**
 * Academic deliverable categories and academic impact weights.
 */
public enum TaskCategory {
    ASSIGNMENT("Assignment", 10),
    LABORATORY_RECORD("Laboratory Record", 15),
    PROJECT("Project", 20),
    EXAMINATION("Examination", 25),
    PRESENTATION("Presentation", 15),
    GENERAL("General", 5);

    private final String displayName;
    private final int weight;

    TaskCategory(String displayName, int weight) {
        this.displayName = displayName;
        this.weight = weight;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getWeight() {
        return weight;
    }

    public static TaskCategory fromString(String value) {
        if (value == null) return ASSIGNMENT;
        String normalized = value.trim().toLowerCase().replace(" ", "_");
        for (TaskCategory c : values()) {
            if (c.name().equalsIgnoreCase(normalized) || c.displayName.equalsIgnoreCase(value.trim())) {
                return c;
            }
        }
        return ASSIGNMENT;
    }
}
