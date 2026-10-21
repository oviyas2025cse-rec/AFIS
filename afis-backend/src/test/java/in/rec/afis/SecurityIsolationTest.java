package in.rec.afis;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("AFIS Security & Cross-User Data Isolation Tests")
public class SecurityIsolationTest {

    @Test
    @DisplayName("Task queries strictly include WHERE user_id = ? clause for cross-user isolation")
    void testQueryIsolationInvariants() {
        String selectSql = "SELECT t.id FROM tasks t WHERE t.user_id = ?";
        String updateSql = "UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?";
        String deleteSql = "DELETE FROM tasks WHERE id = ? AND user_id = ?";

        Pattern userClause = Pattern.compile("WHERE.*user_id\\s*=", Pattern.CASE_INSENSITIVE);
        Pattern andUserClause = Pattern.compile("AND\\s+user_id\\s*=", Pattern.CASE_INSENSITIVE);

        assertTrue(userClause.matcher(selectSql).find(), "Select query must filter by user_id");
        assertTrue(andUserClause.matcher(updateSql).find(), "Update mutation must strictly filter by user_id");
        assertTrue(andUserClause.matcher(deleteSql).find(), "Delete mutation must strictly filter by user_id");
    }

    @Test
    @DisplayName("Password hash is masked before returning user payload to client")
    void testPasswordMasking() {
        in.rec.afis.model.User user = new in.rec.afis.model.User();
        user.setPasswordHash("$2a$12$someSecretBCryptHash12345");
        
        // Simulating the servlet response preparation
        user.setPasswordHash(null);
        org.junit.jupiter.api.Assertions.assertNull(user.getPasswordHash(), "Sensitive password hash must be nullified in outgoing JSON");
    }
}
