package in.rec.afis.service;

import in.rec.afis.dao.SubjectDAO;
import in.rec.afis.dao.UserDAO;
import in.rec.afis.model.User;
import in.rec.afis.util.PasswordUtil;
import in.rec.afis.util.ValidationUtil;

import java.sql.SQLException;
import java.util.Optional;
import java.util.UUID;

/**
 * Authentication and Student Registration Service.
 */
public class AuthService {

    private final UserDAO userDAO = new UserDAO();
    private final SubjectDAO subjectDAO = new SubjectDAO();

    public User registerStudent(String email, String password, String fullName, String department, String yearOfStudy, String collegeName) throws SQLException {
        if (!ValidationUtil.isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid email format. Please provide a valid academic email address.");
        }
        if (!ValidationUtil.isStrongPassword(password)) {
            throw new IllegalArgumentException("Password must be at least 6 characters long.");
        }
        if (!ValidationUtil.isNonEmpty(fullName)) {
            throw new IllegalArgumentException("Full name cannot be empty.");
        }

        if (userDAO.emailExists(email)) {
            throw new IllegalStateException("An account with email " + email + " already exists.");
        }

        String userId = UUID.randomUUID().toString();
        String hashedPassword = PasswordUtil.hashPassword(password);

        User newUser = new User(
                userId,
                email.trim().toLowerCase(),
                hashedPassword,
                fullName.trim(),
                ValidationUtil.isNonEmpty(department) ? department.trim() : "Computer Science & Engineering",
                ValidationUtil.isNonEmpty(yearOfStudy) ? yearOfStudy.trim() : "2nd Year",
                ValidationUtil.isNonEmpty(collegeName) ? collegeName.trim() : "Rajalakshmi Engineering College"
        );

        userDAO.createUser(newUser);

        // Seed default 2nd Year CSE semester subjects automatically for the student
        try {
            subjectDAO.seedDefaultSemesterSubjects(userId);
        } catch (Exception ignored) {
        }

        return newUser;
    }

    public User authenticate(String email, String plainPassword) throws SQLException {
        if (!ValidationUtil.isValidEmail(email) || !ValidationUtil.isNonEmpty(plainPassword)) {
            throw new IllegalArgumentException("Please provide both email and password.");
        }

        Optional<User> userOpt = userDAO.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new SecurityException("Invalid academic email or password.");
        }

        User user = userOpt.get();
        if (!PasswordUtil.verifyPassword(plainPassword, user.getPasswordHash())) {
            throw new SecurityException("Invalid academic email or password.");
        }

        return user;
    }

    public Optional<User> getUserById(String userId) throws SQLException {
        return userDAO.findById(userId);
    }
}
