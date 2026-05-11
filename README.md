# Ledger - AI-Powered CA Practice Platform

## Project Structure

```
ledger/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── models/     # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── routers/     # API endpoints
│   │   └── services/    # Business logic
│   ├── main.py          # FastAPI app
│   ├── requirements.txt
│   └── Dockerfile
├── docker/          # Docker setup
│   ├── docker-compose.yml
│   └── seed.sql         # Initial data
├── src/              # Next.js frontend
│   ├── app/           # Pages
│   ├── components/    # UI components
│   ├── context/       # Auth context
│   ├── lib/          # API client
│   └── store/        # State management
└── package.json
```

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Start PostgreSQL and API
cd docker
docker-compose up -d

# API will be available at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Option 2: Local Development

**Backend:**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ledger
export DATABASE_URL_ASYNC=postgresql+asyncpg://postgres:postgres@localhost:5432/ledger
export SECRET_KEY=your-secret-key

# Create database
createdb ledger

# Run the API
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend  # or /

npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ledger
DATABASE_URL_ASYNC=postgresql+asyncpg://postgres:postgres@localhost:5432/ledger
SECRET_KEY=your-super-secret-key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT)
- `POST /api/auth/login/json` - JSON login
- `GET /api/auth/me` - Get current user

### Quiz
- `GET /api/quiz/questions` - List questions
- `GET /api/quiz/questions/subjects` - List subjects
- `POST /api/quiz/start` - Start quiz session
- `POST /api/quiz/{id}/submit` - Submit quiz
- `GET /api/quiz/history` - Quiz history

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `PATCH /api/tasks/{id}/complete` - Toggle complete
- `DELETE /api/tasks/{id}` - Delete task

### Progress
- `GET /api/progress/overview` - User stats
- `GET /api/progress/mastery` - Subject mastery
- `GET /api/progress/weekly` - Weekly data

## Database Schema

### Tables
- `users` - User accounts
- `user_stats` - Study statistics
- `questions` - Question bank
- `quiz_sessions` - Quiz attempts
- `quiz_answers` - Individual answers
- `tasks` - Study tasks
- `subjects` - ICAN subjects
- `subject_mastery` - Per-subject progress

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, TailwindCSS
- **Backend**: FastAPI, Python 3.11+
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy 2.0
- **Auth**: JWT (python-jose)
- **Password**: bcrypt (passlib)