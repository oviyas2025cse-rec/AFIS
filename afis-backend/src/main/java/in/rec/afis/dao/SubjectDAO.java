package in.rec.afis.dao;

import in.rec.afis.model.Subject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Data Access Object for Academic Subjects with per-user ownership enforcement.
 */
public class SubjectDAO {

    public List<Subject> findByUserId(String userId) throws SQLException {
        List<Subject> list = new ArrayList<>();
        String sql = "SELECT id, user_id, subject_code, subject_name, credits, faculty_name, color_hex, created_at " +
                     "FROM subjects WHERE user_id = ? ORDER BY subject_code ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToSubject(rs));
                }
            }
        }
        return list;
    }

    public Optional<Subject> findById(String id, String userId) throws SQLException {
        String sql = "SELECT id, user_id, subject_code, subject_name, credits, faculty_name, color_hex, created_at " +
                     "FROM subjects WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, id);
            ps.setString(2, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToSubject(rs));
                }
            }
        }
        return Optional.empty();
    }

    public boolean createSubject(Subject subject) throws SQLException {
        String sql = "INSERT INTO subjects (id, user_id, subject_code, subject_name, credits, faculty_name, color_hex) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, subject.getId() != null ? subject.getId() : UUID.randomUUID().toString());
            ps.setString(2, subject.getUserId());
            ps.setString(3, subject.getSubjectCode().trim().toUpperCase());
            ps.setString(4, subject.getSubjectName().trim());
            ps.setInt(5, subject.getCredits());
            ps.setString(6, subject.getFacultyName());
            ps.setString(7, subject.getColorHex() != null ? subject.getColorHex() : "#8B5CF6");
            return ps.executeUpdate() > 0;
        }
    }

    public boolean deleteSubject(String id, String userId) throws SQLException {
        String sql = "DELETE FROM subjects WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, id);
            ps.setString(2, userId);
            return ps.executeUpdate() > 0;
        }
    }

    public void seedDefaultSemesterSubjects(String userId) throws SQLException {
        String[][] defaults = {
                {"CS3401", "Algorithms & Complexity Analysis", "4", "Dr. R. Kavitha", "#7C3AED"},
                {"CS3491", "Database Management Systems", "3", "Prof. M. Suresh", "#D4AF37"},
                {"CS3492", "Operating Systems Core", "3", "Dr. P. Anitha", "#3B82F6"},
                {"CS3461", "Operating Systems Laboratory", "2", "Prof. K. Venkatesh", "#10B981"},
                {"CS3481", "DBMS & Web Applications Lab", "2", "Dr. N. Meenakshi", "#EC4899"},
                {"GE3451", "Environmental Science & Sustainability", "2", "Dr. S. Balaji", "#F59E0B"}
        };
        for (String[] def : defaults) {
            Subject s = new Subject(UUID.randomUUID().toString(), userId, def[0], def[1], Integer.parseInt(def[2]), def[3], def[4]);
            try {
                createSubject(s);
            } catch (SQLException ignored) {
                // Ignore duplicates on seed
            }
        }
    }

    private Subject mapResultSetToSubject(ResultSet rs) throws SQLException {
        Subject s = new Subject();
        s.setId(rs.getString("id"));
        s.setUserId(rs.getString("user_id"));
        s.setSubjectCode(rs.getString("subject_code"));
        s.setSubjectName(rs.getString("subject_name"));
        s.setCredits(rs.getInt("credits"));
        s.setFacultyName(rs.getString("faculty_name"));
        s.setColorHex(rs.getString("color_hex"));
        s.setCreatedAt(rs.getTimestamp("created_at"));
        return s;
    }
}
