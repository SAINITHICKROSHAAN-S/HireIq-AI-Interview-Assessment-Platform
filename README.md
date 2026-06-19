# HireIq-AI-Interview-Assessment-Platform
Full-stack AI-powered interview assessment platform built with Spring Boot, React, MySQL, and JWT authentication.

---

## Environment Setup

All secrets and environment-specific values are kept **outside** version control.  
Never commit a `.env` file or hardcode credentials in `application.properties`.

### Required Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini AI API key (obtain from [Google AI Studio](https://aistudio.google.com)) |
| `DB_PASSWORD` | MySQL root/user password for `hireiq_db` |
| `DB_URL` | *(optional)* JDBC URL — defaults to `jdbc:mysql://localhost:3306/hireiq_db` |
| `DB_USERNAME` | *(optional)* DB user — defaults to `root` |

### How to Configure

**Option 1 — Shell environment variables (recommended for local dev)**

```bash
export GEMINI_API_KEY=your_gemini_api_key_here
export DB_PASSWORD=your_mysql_password_here
```

Then start the backend normally:

```bash
cd backend/hireiq-backend
./mvnw spring-boot:run
```

**Option 2 — Pass directly to Maven**

```bash
cd backend/hireiq-backend
GEMINI_API_KEY=your_key DB_PASSWORD=your_pass ./mvnw spring-boot:run
```

**Option 3 — `.env` file (local only, never commit)**

Copy the example template and fill in your values:

```bash
cp backend/hireiq-backend/.env.example backend/hireiq-backend/.env
# edit .env with your real values
```

> [!CAUTION]
> The `.env` file is listed in `.gitignore` and must **never** be committed.  
> Only `.env.example` (with placeholder values) is safe to track.

### Verifying the Setup

If `GEMINI_API_KEY` or `DB_PASSWORD` is missing, Spring Boot will fail at startup with:

```
Could not resolve placeholder 'GEMINI_API_KEY' in value "${GEMINI_API_KEY}"
```

This is intentional — the application performs a **fail-fast** check so secrets are never silently ignored.
