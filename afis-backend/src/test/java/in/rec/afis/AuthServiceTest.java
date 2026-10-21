package in.rec.afis;

import in.rec.afis.util.PasswordUtil;
import in.rec.afis.util.ValidationUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("AFIS Authentication & Security Tests")
public class AuthServiceTest {

    @Test
    @DisplayName("Email format validation passes for valid institutional addresses")
    void testValidEmailFormats() {
        assertTrue(ValidationUtil.isValidEmail("oviya.s.2025.cse@rajalakshmi.edu.in"));
        assertTrue(ValidationUtil.isValidEmail("student@rec.ac.in"));
        assertTrue(ValidationUtil.isValidEmail("scholar.cs@annauniv.edu"));
        assertFalse(ValidationUtil.isValidEmail("invalid-email"));
        assertFalse(ValidationUtil.isValidEmail("user@"));
        assertFalse(ValidationUtil.isValidEmail(null));
    }

    @Test
    @DisplayName("Password hashing produces unique, secure BCrypt hashes that verify correctly")
    void testPasswordHashingAndVerification() {
        String plainPassword = "academicPassword2026!";
        String hash1 = PasswordUtil.hashPassword(plainPassword);
        String hash2 = PasswordUtil.hashPassword(plainPassword);

        assertNotNull(hash1);
        assertNotNull(hash2);
        assertNotEquals(hash1, hash2, "BCrypt salting must produce distinct hashes for identical passwords");

        assertTrue(PasswordUtil.verifyPassword(plainPassword, hash1));
        assertTrue(PasswordUtil.verifyPassword(plainPassword, hash2));
        assertFalse(PasswordUtil.verifyPassword("wrongPassword", hash1));
    }

    @Test
    @DisplayName("Password strength policy rejects passwords under 6 characters")
    void testPasswordStrengthPolicy() {
        assertTrue(ValidationUtil.isStrongPassword("pass123"));
        assertFalse(ValidationUtil.isStrongPassword("short"));
        assertFalse(ValidationUtil.isStrongPassword(""));
        assertFalse(ValidationUtil.isStrongPassword(null));
    }
}
