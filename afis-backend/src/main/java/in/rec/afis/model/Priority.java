package in.rec.afis.model;

/**
 * Task priority levels with assigned base intelligence weights.
 */
public enum Priority {
    LOW(25),
    MEDIUM(50),
    HIGH(75),
    CRITICAL(100);

    private final int weight;

    Priority(int weight) {
        this.weight = weight;
    }

    public int getWeight() {
        return weight;
    }

    public static Priority fromString(String value) {
        if (value == null) return MEDIUM;
        for (Priority p : values()) {
            if (p.name().equalsIgnoreCase(value.trim())) {
                return p;
            }
        }
        return MEDIUM;
    }
}
