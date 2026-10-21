package in.rec.afis.util;

import java.util.regex.Pattern;

/**
 * Server-side input validation and sanitization.
 */
public class ValidationUtil {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    public static boolean isValidEmail(String email) {
        if (email == null) return false;
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    public static boolean isNonEmpty(String str) {
        return str != null && !str.trim().isEmpty();
    }

    public static boolean isStrongPassword(String password) {
        return password != null && password.length() >= 6;
    }

    public static String sanitize(String input) {
        if (input == null) return "";
        return input.trim();
    }
}
