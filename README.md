# Life Admin AI

Life Admin AI is an AI-powered task manager designed to turn natural language plans into structured tasks. The app helps users organize daily activities and longer-term preparation work using AI-assisted parsing, preview, editing, and Firestore-backed storage.
project link : - https://life-admin-frontend-145379378917.asia-south1.run.app/
project demo video : - https://drive.google.com/file/d/19CBhtItf02wx48VGZAslTYHZZjcc3bjX/view

## What this app does

- Converts a natural language prompt into task objects.
- Shows a preview of generated tasks before saving.
- Saves tasks into Firestore via a FastAPI backend.
- Supports single-event task creation and multi-step planning.
- Uses simple built-in planning rules for inputs like "prepare for interview" or "plan for event".

## Why this project exists

This project demonstrates how to combine AI task extraction with a task management UI:

- Easy task capture: type a sentence and get structured results.
- AI preview: review generated task titles, descriptions, priorities, and due dates.
- Conditional planning: a meeting prompt becomes one task, while a preparation prompt becomes multiple subtasks.
- Backend validation: the API validates and normalizes date strings before storing them.

## Example behavior

- Input: `Meeting tomorrow at 10am`
  - The app typically creates a single task with a precise due date.
- Input: `Prepare for interview next Friday`
  - The app will generate multiple tasks, such as research, practice, and preparation steps, and may distribute them across the planning window.

## Tech stack

- Frontend
  - React 19 + Vite
  - `axios` for API calls
  - `react-hot-toast` for notifications
  - `react-calendar` for date views

- Backend
  - FastAPI
  - Uvicorn
  - `google-genai` for Gemini AI
  - Google Firestore for task storage

- Deployment
  - Backend Dockerfile included
  - Google Cloud Run deployment 

## Architecture overview

- `frontend/` contains the React UI and API client.
- `backend/` contains the FastAPI app, task routes, AI logic, and Firestore integration.
- `app/routes/ai.py` exposes task preview and bulk save endpoints.
- `app/agents/orchestrator.py` dispatches user input either to a direct task extraction agent or a planning agent.
- `app/agents/task_agent.py` decides whether to run advanced planning logic based on keywords such as `plan`, `prepare`, or `schedule`.
- `app/services/ai_service.py` builds prompts for Gemini and parses JSON task output.
- `app/scheduler.py` distributes subtasks over time when a planning workflow is detected.
- `frontend/src/pages/AIInput.jsx` is the natural language input page.
- `frontend/src/pages/Preview.jsx` lets users review tasks before saving.

## Folder structure

- `backend/`
  - `app/main.py` - FastAPI entrypoint
  - `app/routes/tasks.py` - task CRUD APIs
  - `app/routes/ai.py` - AI preview/save APIs
  - `app/services/` - Firestore, AI, calendar helper classes
  - `app/agents/` - AI logic and planning rules
  - `app/scheduler.py` - task distribution helper
  - `requirements.txt` - Python dependencies
  - `Dockerfile` - backend container build
  - `.env` - Gemini API key configuration

- `frontend/`
  - `src/api/api.js` - frontend API client
  - `src/components/` - modals and UI components
  - `src/pages/` - AI input, preview, tasks, calendar views
  - `src/utils/utils.js` - date formatting and conversion utilities
  - `package.json` - npm scripts, dependencies

## Setup instructions

### Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file with:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Optional local Firestore setup:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="$(Resolve-Path serviceAccountKey.json)"
```

Run backend:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## API endpoints

- `GET /` — app status
- `GET /health` — health check
- `GET /tasks` — read all tasks
- `GET /tasks/{task_id}` — read one task
- `POST /tasks` — create task manually
- `PUT /tasks/{task_id}` — update task
- `DELETE /tasks/{task_id}` — delete task
- `PATCH /tasks/{task_id}/complete` — mark complete
- `POST /ai/preview-tasks` — preview generated tasks from natural language
- `POST /ai/save-tasks` — save AI-generated tasks

## Important notes

- AI-generated input is processed via Gemini and converted to JSON by the backend.
- The app expects ISO-style `due_date` values.
- `frontend/src/api/api.js` currently uses a deployed backend URL; change it for local development.
- Planning prompts such as `plan`, `prepare`, or `schedule` route to a planning agent, which can break a goal into multiple actionable tasks.

## Troubleshooting

- If AI calls fail, verify `GEMINI_API_KEY` in `backend/.env`.
- If Firestore access fails, verify `serviceAccountKey.json` and `GOOGLE_APPLICATION_CREDENTIALS`.
- If the frontend cannot reach the backend, update `frontend/src/api/api.js` with the correct backend base URL.

## Deployment

- Build or deploy the backend container using `backend/Dockerfile`.
- The repository already uses Google Cloud Run for backend deployment.
