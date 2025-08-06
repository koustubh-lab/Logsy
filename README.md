# 📝 Logsy

**Logsy** is a modern, full-stack blogging platform built with Java Spring Boot and React. It features magic link authentication, rich content creation, and smooth user experience powered by Supabase and Resend.

![Logsy Banner](https://via.placeholder.com/1200x400?text=Logsy+Blogging+Platform)

---

## 🚀 Features

- ✍️ Clean and responsive blogging interface
- 🔐 Passwordless magic link login via JWT
- ☁️ Supabase Storage for images and media
- 📧 Transactional emails via Resend (login, activation)
- 🧩 Modular backend structure with Spring Boot
- 👤 User profiles with avatars, bios, and more

---

## 🛠️ Tech Stack

| Layer    | Stack                          |
| -------- | ------------------------------ |
| Frontend | React, Tailwind CSS, ShadCN UI |
| Backend  | Java Spring Boot (REST API)    |
| Auth     | Magic Link with JWT            |
| Database | Supabase PostgreSQL            |
| Storage  | Supabase Buckets               |
| Emails   | Resend (Transactional API)     |

---

## 🔐 Authentication Flow (Magic Link + JWT)

1. User provides their email
2. Backend generates a short-lived JWT token
3. The token is embedded in a magic link and emailed via Resend
4. When the user clicks the link, the frontend hits the backend endpoint with the token
5. Spring Boot validates the JWT and authenticates the user

> ✅ No Supabase Auth is used — the entire authentication logic is managed by Spring Boot and JWT.

---

## 📦 Installation

### ☕ Backend (Spring Boot)

```bash
git clone https://github.com/your-username/logsy-backend.git
cd logsy-backend

cp .env.example .env  # Create your environment file
./mvnw spring-boot:run
```

> ✅ The backend serves all API routes, handles authentication, media uploads, and sends emails.

---

## 🔐 Backend Environment Variables

Create a `.env` file in the root of the backend folder and define the following variables:

```env
SUPABASE_PROJECT_URL=https://your-project.supabase.co
SUPABASE_DB_USERNAME=your_db_username
SUPABASE_DB_PASSWORD=your_db_password
SUPABASE_BUCKET_URL=https://your-project.supabase.co/storage/v1
RESEND_API_KEY=your-resend-api-key
```

> 💡 These are consumed in `application.properties` or injected via `@Value`.

---

## 📁 Folder Structure

### ☕ Backend (`logsy-backend/`)

```
logsy-backend/
├── src/
│   ├── main/
│   │   ├── java/com/spring/blog_application/
│   │   │   ├── aspects/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   ├── security/
│   │   │   ├── service/
│   │   │   ├── utils/
│   │   │   └── BlogApplication.java
│   │   └── resources/
│   │       ├── keys/
│   │       ├── static/
│   │       ├── templates/
│   │       └── application.properties
│   └── test/
├── Dockerfile
├── pom.xml
├── .gitignore
└── mvnw / mvnw.cmd
```

---

## 💬 Contact

Made with ❤️ by [Koustubh Karande](https://koustubhkarande.vercel.app/)
Reach out on [LinkedIn](https://www.linkedin.com/in/koustubhkarandedev/)

---

## 📄 License

This project is licensed under the MIT License – see [LICENSE](LICENSE).
