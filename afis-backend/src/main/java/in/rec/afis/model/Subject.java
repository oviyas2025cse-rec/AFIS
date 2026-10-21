package in.rec.afis.model;

import java.sql.Timestamp;

/**
 * Academic course/subject mapped to a student.
 */
public class Subject {
    private String id;
    private String userId;
    private String subjectCode;
    private String subjectName;
    private int credits;
    private String facultyName;
    private String colorHex;
    private Timestamp createdAt;

    public Subject() {}

    public Subject(String id, String userId, String subjectCode, String subjectName, int credits, String facultyName, String colorHex) {
        this.id = id;
        this.userId = userId;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.credits = credits;
        this.facultyName = facultyName;
        this.colorHex = colorHex;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }

    public String getFacultyName() { return facultyName; }
    public void setFacultyName(String facultyName) { this.facultyName = facultyName; }

    public String getColorHex() { return colorHex; }
    public void setColorHex(String colorHex) { this.colorHex = colorHex; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
