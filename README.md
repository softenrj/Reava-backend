# 🎵 Reava Backend

**Reava-backend** is a robust, scalable Node.js backend built with **Express** and **TypeScript**. It serves as the core API for a dynamic music streaming platform featuring user authentication, playlist management, music curation, and AI-powered recommendations. The backend integrates **Firebase Authentication**, leverages **MongoDB** with Mongoose for data persistence, and connects to **Groq AI** for intelligent playlist generation.

> ⚠️ This backend is built specifically for the **Reava App**. You can find the Reava app repository here: [https://github.com/softenrj/Reava](https://github.com/softenrj/Reava)

---

## 🚀 Key Features

- 🔐 **Secure User Authentication** via Firebase Admin SDK
- 🎶 **Comprehensive Music Management**: Upload, update, delete, and retrieve music tracks
- ❤️ **Like/Unlike Functionality** for personalized user experience
- 📂 **Playlist Operations**: Log plays, fetch history, reorder playlists
- 🤖 **AI-Driven Playlist Curation** using Groq’s LLaMA 3 model
- 📊 **User Analytics**: Track visits, streaks, and watch time
- 🛡️ **Robust Security** with JWT and middleware protections
- 🧩 **Modular MVC Architecture** for maintainability and scalability

---

## 🏗️ Project Structure

```
src/
├── config/         # Configuration for Firebase, MongoDB, environment variables
├── controller/     # Business logic for user, music, and playlist routes
├── middleware/     # Authentication, error handling, and utilities
├── models/         # Mongoose schemas and data models
├── routes/         # API route definitions
├── common/         # Shared utilities, services, and constants
├── index.ts        # Application entry point (server startup)
├── server.ts       # Express app and middleware configuration
```

---

## 🛠️ Technologies Used

| Layer               | Technology                   |
|---------------------|------------------------------|
| Language            | TypeScript                   |
| Framework           | Express.js                   |
| Database            | MongoDB + Mongoose           |
| Authentication      | Firebase Admin SDK           |
| Security            | Helmet                      |
| Logging             | Morgan, Chalk, jet-logger    |
| AI Integration      | Groq AI (LLaMA 3)            |
| Testing             | Vitest                      |
| Environment Config  | dotenv                      |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/softenrj/reava-backend.git
cd reava-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Server port
PORT=8000

# MongoDB connection string
MONGO_URI=your_mongo_connection_string

# Firebase configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_admin_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key" # Make sure to escape newline characters properly

# Firebase additional settings
FIREBASE_UNIVERSAL_DOMAIN=your_firebase_universal_domain
FIREBASE_AUTH_PROVIDER=your_auth_provider
FIREBASE_AUTH_URI=your_auth_uri
FIREBASE_CLIENT_CERT_URL=your_client_cert_url
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_TOKEN_URI=your_token_uri
FIREBASE_TYPE=your_firebase_type

# Groq AI API key
GROQ_API_KEY=your_groq_api_key

# Jet Logger configuration
JET_LOGGER_FILEPATH=path_to_log_file
JET_LOGGER_FORMAT=your_log_format
JET_LOGGER_MODE=your_log_mode
JET_LOGGER_TIMESTAMP=true

# Node environment
NODE_ENV=development | production
```

> **Important:** Ensure that the `FIREBASE_PRIVATE_KEY` value properly escapes newline characters and quotes.

This environment configuration is for the **Reava App**. For more details, visit the [Reava GitHub repository](https://github.com/softenrj/Reava).
NODE_ENV=development | production

### 4. Run the Server

- For development with hot reload:

```bash
npm run dev
```

- For production:

```bash
npm run build
npm start
```

---

## 📡 API Endpoints Overview

### User Routes

| Method | Endpoint                | Description                        |
|--------|-------------------------|----------------------------------|
| GET    | `/api/user/`            | Retrieve current user info        |
| POST   | `/api/user/`            | Create a new user                 |
| PUT    | `/api/user/`            | Update user profile               |
| GET    | `/api/user/stats`       | Fetch user statistics             |
| PUT    | `/api/user/daily-visit` | Track daily user visits           |
| GET    | `/api/user/profile`     | Get user profile data             |

### Music Routes

| Method | Endpoint                     | Description                  |
|--------|------------------------------|------------------------------|
| POST   | `/api/music/`                | Add new music                |
| PUT    | `/api/music/:musicId`        | Update music details         |
| DELETE | `/api/music/:musicId`        | Delete music                 |
| GET    | `/api/music/`                | Get all music for user       |
| GET    | `/api/music/:musicId`        | Get music by ID              |
| PUT    | `/api/music/like/:musicId`   | Like a music track           |
| PUT    | `/api/music/unlike/:musicId` | Unlike a music track         |

### Playlist Routes

| Method | Endpoint                            | Description                      |
|--------|-----------------------------------|--------------------------------|
| POST   | `/api/playlist/log/:musicId`      | Log a music play                |
| GET    | `/api/playlist/`                  | Get playlist history (paginated)|
| GET    | `/api/playlist/recent`            | Get recently played (deduplicated)|
| GET    | `/api/playlist/top`               | Get top played tracks           |
| GET    | `/api/playlist/mine`              | Get shuffled user music         |
| PUT    | `/api/playlist/watch-time/:musicId` | Update watch time stats         |
| GET    | `/api/playlist/gemini`            | AI-curated smart playlist       |

---

## 🤖 AI Playlist Generation

Reava leverages Groq’s LLaMA-3 model to intelligently reorder recently played songs based on engagement potential:

1. Fetches the top 10 recently played songs.
2. Sends a structured prompt to Groq AI requesting a reordered list.
3. Receives suggested song IDs ranked by engagement.
4. Maps IDs to actual music tracks and returns a smart playlist.

---

## 🧪 Testing

Run unit tests with:

```bash
npm run test
```

---

## 📦 Scripts

| Command         | Description               |
|-----------------|---------------------------|
| `npm run dev`   | Start development server  |
| `npm run build` | Build for production      |
| `npm start`     | Run production server     |
| `npm run lint`  | Lint codebase             |
| `npm run test`  | Run tests with Vitest     |

---

## 📦 Deployment Notes

- Ensure Firebase credentials are correctly configured on your deployment platform.
- Validate `.env` variables in production environments.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgements

- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Groq AI](https://console.groq.com/)
- [MongoDB + Mongoose](https://mongoosejs.com/)
- [Jet-Logger](https://www.npmjs.com/package/jet-logger)

---

> Built with ❤️ by Raj ([@softenrj](https://github.com/softenrj)) — Reava 🔊🎧
