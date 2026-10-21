# AFIS — Academic Flow Intelligence System
> **Your Semester. Under Control.**  
> Production-grade student academic productivity and deadline management platform.  
> Designed for college students managing assignments, laboratory records, mini-projects, examinations, and university deadlines.

---

## 1. System Architecture & Tech Stack

| Layer | Technology | Specifications |
|---|---|---|
| **Frontend** | HTML5, CSS3, Bootstrap 5.3, Vanilla JS / ES6 | Royal purple & champagne gold design system, responsive sidebar, zero-pill typography, accessible contrast |
| **Backend** | Java 21 LTS, Jakarta Servlets 6.0, JSP APIs | Tomcat 10.1 compatible, clean MVC architecture (Model, DAO, Service, Servlet, Util) |
| **Persistence** | MySQL 8.0+ / InnoDB | Relational schema with Foreign Keys, Cascades, Indexes, PreparedStatement JDBC |
| **Security** | jBCrypt (Log rounds: 12), Jakarta Session Auth | Session-based state, HttpOnly cookies, SQL parameterization, ownership enforcement |
| **Build Tool** | Apache Maven 3.9+ | Target artifact: `afis.war` |
| **Package** | `in.rec.afis` | Customizable in `pom.xml` and Java source headers |

---

## 2. Step-by-Step Windows Local Environment Setup

### Step 2.1: Install Java 21 LTS (JDK)
1. Download **Eclipse Temurin JDK 21 (LTS)** or **Oracle JDK 21** for Windows x64:
   - Eclipse Temurin: `https://adoptium.net/temurin/releases/?version=21`
2. Run installer and check **"Set JAVA_HOME variable"** and **"Add to PATH"**.
3. Verify in Command Prompt (`cmd.exe` or PowerShell):
   ```cmd
   java -version
   ```
   *Expected output: `openjdk version "21.0.x" ...`*

### Step 2.2: Install MySQL 8.0+
1. Download **MySQL Community Server 8.0+** and **MySQL Workbench**:
   - `https://dev.mysql.com/downloads/installer/`
2. Run the MySQL installer:
   - Select default port `3306`.
   - Set root password (e.g., `root` or `password123`).
3. Verify MySQL service is running:
   ```cmd
   mysql -u root -p
   ```
4. Execute the database initialization script:
   ```cmd
   mysql -u root -p < database.sql
   ```
   *This creates `afis_db`, tables (`users`, `subjects`, `tasks`, `reminders`, `task_history`), and pre-seeds Rajalakshmi Engineering College 2nd Year CSE semester courses and demo tasks.*

### Step 2.3: Install Apache Maven
1. Download Maven 3.9+ zip from `https://maven.apache.org/download.cgi`.
2. Extract to `C:\Program Files\Apache\maven`.
3. Add `C:\Program Files\Apache\maven\bin` to Windows System Environment Variables `PATH`.
4. Verify:
   ```cmd
   mvn -version
   ```

### Step 2.4: Install Apache Tomcat 10.1 (Jakarta EE 10)
1. Download Tomcat 10.1 (`apache-tomcat-10.1.x-windows-x64.zip`):
   - `https://tomcat.apache.org/download-10.cgi`
2. Extract to `C:\apache-tomcat-10.1`.
3. Set environment variable `CATALINA_HOME`:
   ```cmd
   setx CATALINA_HOME "C:\apache-tomcat-10.1" /M
   ```

---

## 3. Environment Variables Configuration

AFIS automatically reads database credentials from environment variables, falling back to local defaults if unset:

| Variable | Default Value | Description |
|---|---|---|
| `DB_URL` | `jdbc:mysql://localhost:3306/afis_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC` | JDBC connection URL |
| `DB_USER` | `root` | MySQL database user |
| `DB_PASSWORD` | `root` | MySQL database password |

To set them on Windows PowerShell before starting Tomcat:
```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/afis_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USER="root"
$env:DB_PASSWORD="yourPasswordHere"
```

---

## 4. Build & Deployment Commands

### Build WAR Package
Navigate to the root directory containing `pom.xml`:
```cmd
mvn clean package
```
*Maven will compile all Java 21 classes, execute JUnit 5 tests, and generate `target/afis.war`.*

### Deploy to Tomcat 10.1
1. Copy the generated WAR to Tomcat's `webapps` directory:
   ```cmd
   copy target\afis.war "%CATALINA_HOME%\webapps\ROOT.war"
   ```
   *(Deploying as `ROOT.war` maps the app to `http://localhost:8080/`, or keep as `afis.war` for `http://localhost:8080/afis/`).*
2. Start Tomcat:
   ```cmd
   "%CATALINA_HOME%\bin\startup.bat"
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:8080/
   ```

---

## 5. REST API Endpoint Documentation

All endpoints reside under `/api/` and return standard JSON responses:

### 5.1 Authentication (`/api/auth/*`)
- **`POST /api/auth/register`**
  - Request:
    ```json
    {
      "email": "oviya.s.2025.cse@rajalakshmi.edu.in",
      "password": "password123",
      "fullName": "Oviya S.",
      "department": "Computer Science & Engineering",
      "yearOfStudy": "2nd Year",
      "collegeName": "Rajalakshmi Engineering College"
    }
    ```
  - Response (200 OK):
    ```json
    {
      "success": true,
      "message": "Account created successfully.",
      "data": { "id": "usr-101-rec-cse", "email": "oviya.s.2025.cse@rajalakshmi.edu.in", "fullName": "Oviya S." }
    }
    ```
- **`POST /api/auth/login`**
  - Request:
    ```json
    { "email": "oviya.s.2025.cse@rajalakshmi.edu.in", "password": "password123" }
    ```
  - Response (200 OK): Sets `JSESSIONID` HttpOnly cookie.
- **`POST /api/auth/logout`**
  - Invalidates student session.
- **`GET /api/auth/me`**
  - Returns authenticated student profile.

### 5.2 Tasks Management (`/api/tasks/*`)
- **`GET /api/tasks`**
  - Query parameters: `status`, `priority`, `category`, `subjectId`, `search`, `sortBy`, `sortDir`
  - Example: `GET /api/tasks?status=To%20Do&priority=Critical&sortBy=due_date&sortDir=ASC`
- **`POST /api/tasks`**
  - Creates deliverable. Body:
    ```json
    {
      "subjectId": "sub-04",
      "title": "Operating Systems Concurrency Deadlock Proof",
      "description": "Simulation in C using pthread mutex locks",
      "category": "Laboratory Record",
      "dueDate": "2026-10-23T16:00:00",
      "priority": "Critical"
    }
    ```
- **`PUT /api/tasks`**
  - Updates deliverable with ownership verification (`WHERE id = ? AND user_id = ?`).
- **`DELETE /api/tasks?id={taskId}`**
  - Deletes deliverable after confirmation.
- **`POST /api/tasks/complete`**
  - Body: `{ "id": "tsk-01" }`. Toggles status between Completed and In Progress.

### 5.3 Academic Flow Intelligence (`/api/intelligence/*`)
- **`GET /api/intelligence/recommendation`**
  - Computes top focus item and plain-English explanation.
  - Response (200 OK):
    ```json
    {
      "success": true,
      "message": "Flow recommendation generated",
      "data": {
        "recommendedTask": {
          "id": "tsk-01",
          "title": "Dining Philosophers Concurrency Record",
          "subjectCode": "CS3461",
          "priority": "Critical",
          "dueDate": "2026-10-21T18:00:00"
        },
        "flowScore": 215,
        "basePriorityScore": 100,
        "categoryWeight": 15,
        "proximityScore": 100,
        "isOverdue": false,
        "statusNote": "Due in 14 hours",
        "explanation": "AFIS recommends focusing on Dining Philosophers Concurrency Record (CS3461) because it has the highest Academic Flow Score of 215/275. Primary drivers: Importance Level [Critical]: +100 points, Deliverable Category [Laboratory Record]: +15 points, Deliverable deadline within 24 hours (+100 proximity points)."
      }
    }
    ```

### 5.4 Dashboard & Analytics (`/api/dashboard`, `/api/analytics`)
- Returns real aggregated statistics directly from MySQL (completion rate, overdue counts, subject distribution).

---

## 6. Academic Flow Intelligence: Mathematical Rule Formulation

AFIS deliberately rejects opaque "AI" black boxes in favor of transparent, explainable academic scheduling logic:

$$\text{Flow Score} = \text{Priority Weight} + \text{Category Weight} + \text{Proximity Score}$$

1. **User Importance Weight**:
   - `Critical` $\to +100$
   - `High` $\to +75$
   - `Medium` $\to +50$
   - `Low` $\to +25$
2. **Academic Impact Category**:
   - `Examination` $\to +25$ (High semester grade impact)
   - `Project` $\to +20$ (Mini-project deliverables)
   - `Laboratory Record` $\to +15$ (Observation & record checkoff)
   - `Presentation` $\to +15$ (Seminar reviews)
   - `Assignment` $\to +10$ (Problem sets)
   - `General` $\to +5$
3. **Deadline Proximity Urgency**:
   - `Overdue` $\to +150$ (Academic recovery required)
   - `Due within 24 hours` $\to +100$
   - `Due within 48 hours` $\to +75$
   - `Due within 7 days` $\to +45$
   - `Due within 14 days` $\to +20$
   - `Due beyond 14 days` $\to +5$
4. **Completed Task Filter**:
   - Status `Completed` $\to \text{Score} = 0$, excluded from active recommendations, pending, and overdue counts.

---

## 7. Security Hardening & Cross-User Isolation

1. **BCrypt Password Hashing**: Passwords undergo salted BCrypt hashing with 12 log rounds (`$2a$12$...`). Plain-text credentials never touch memory or logs.
2. **Strict User Ownership**:
   Every database query and mutation enforces:
   ```sql
   SELECT ... FROM tasks WHERE user_id = ?
   UPDATE tasks SET ... WHERE id = ? AND user_id = ?
   DELETE FROM tasks WHERE id = ? AND user_id = ?
   ```
   A logged-in student cannot read, edit, or delete another student's tasks even if they manipulate request parameters.
3. **Session Invalidation**:
   Calling `/api/auth/logout` explicitly executes `request.getSession().invalidate()`, destroying server-side state.

---

## 8. Automated Unit Test Cases (JUnit 5)

Run automated tests via Maven:
```cmd
mvn test
```
The test suite includes:
1. `AuthServiceTest`:
   - Validates institutional email pattern format.
   - Tests BCrypt hash salting uniqueness and verification.
   - Rejects passwords under minimum length policy.
2. `TaskCrudTest`:
   - Verifies parsing of enum strings (`Laboratory Record`, `Examination`).
   - Verifies priority weight mapping.
3. `FlowIntelligenceTest`:
   - Asserts completed tasks evaluate to zero score.
   - Verifies overdue tasks receive +150 urgency points.
   - Asserts near-deadline tasks (<24h) receive +100 proximity points.
4. `SecurityIsolationTest`:
   - Invariant check ensuring every mutation SQL includes `user_id = ?`.
   - Confirms password hash stripping before JSON serialization.

---

## 9. Demonstrating for College Review (CSE 2nd Year)

When presenting this project to faculty or viva evaluators:
1. Show the **MySQL Schema** in MySQL Workbench (`afis_db`).
2. Show the **Jakarta Servlets** in Tomcat (`/api/tasks`, `/api/intelligence`).
3. Create a new task with high importance due tomorrow $\to$ observe the **Academic Flow Intelligence** recalculate score in real time and explain why it became the #1 recommended focus item!
4. Mark the task completed $\to$ observe the task immediately disappear from overdue/pending, recalculating the completion gauge and choosing the next best task.
