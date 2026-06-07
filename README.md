# Smart Teacher

Smart Teacher is an AI-powered learning platform designed to help users learn through guided lesson-style conversations.
Users can register, choose learning categories, ask questions,
receive structured educational responses, and revisit previous conversations.

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, OpenAI API, JWT, bcrypt  
**Frontend:** React, Vite, Redux Toolkit, React Router, Material UI

## Project Structure

```
server/   API, database models, business logic
client/   React dashboard
```

The backend is split into routes, controllers, services, and models.

## Setup

### Requirements
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key

### Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
DATABASE_URI=mongodb://localhost:27017/practec
PORT=2500
ACCESS_TOKEN_SECRET=your_secret_here
AI_KEY=your_openai_api_key
AI_MODEL=gpt-3.5-turbo
```

```bash
npm run dev
```

Server runs on `http://localhost:2500`

### Frontend

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:2500/api
```

```bash
npm run dev
```

Open `http://localhost:5173`

## Main Features

- User registration and login (JWT)
- Category and sub-category selection
- Prompt submission with OpenAI response
- Multi-turn conversations
- Personal history per user
- Resume a past conversation from history

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register |
| POST | `/api/users/login` | Login |
| GET | `/api/categories` | List categories |
| GET | `/api/subcategories` | List sub-categories |
| POST | `/api/prompts` | Start a conversation |
| POST | `/api/prompts/:id/messages` | Continue a conversation |
| GET | `/api/prompts/user` | User history |
| DELETE | `/api/prompts/:id` | Delete a conversation |

## Assumptions

- MongoDB is used instead of PostgreSQL.
- `username` is used for login instead of a separate name field.
- Categories are seeded automatically on first server start.
- Admin users are created manually in the database (`isAdmin: true`).

## Notes

- Each user can only access their own conversation history.
- Admin endpoints exist in the API but there is no admin UI yet.
