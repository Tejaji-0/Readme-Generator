# README Generator

A full-stack application that automatically generates professional READMEs from your GitHub repositories using AI.

## 🏗️ Project Structure

```
readme-generator/
├── frontend/           # Next.js React frontend
├── backend/           # Express.js API server
├── python/           # Python AI/ML scripts (formerly summariser-llm)
└── package.json      # Root package.json for monorepo management
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python 3.8+
- npm or yarn

### Installation

1. **Install all dependencies:**
```bash
npm run install:all
```

2. **Set up Python environment:**
```bash
cd python
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Configure environment variables:**
```bash
# In frontend/.env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# In backend/.env (create if needed)
PORT=5000
```

### Development

**Start both frontend and backend concurrently:**
```bash
npm run dev
```

**Or start them individually:**
```bash
# Backend (Express server on port 5000)
npm run dev:backend

# Frontend (Next.js on port 3000)
npm run dev:frontend
```

### Production Build

```bash
npm run build
```

## 📁 Detailed Structure

### Frontend (`/frontend`)
- **Technology:** Next.js 15, React 19, TypeScript
- **UI:** Tailwind CSS, shadcn/ui components
- **Port:** 3000 (development)

### Backend (`/backend`)
- **Technology:** Express.js, TypeScript
- **Features:** API routes, file handling, repo cloning
- **Port:** 5000
- **Temp Files:** Created in `backend/temp/` directory

### Python AI (`/python`)
- **Technology:** Python with Groq AI
- **Purpose:** Code analysis and README generation
- **Virtual Environment:** `python/venv/`

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate-readme` | Generate README from GitHub repo |
| GET | `/api/check-readme?folder=<name>` | Check if README exists |
| GET | `/api/get-readme?folder=<name>` | Get README content |
| GET | `/api/get-readme/:folder` | Get README by folder param |
| GET | `/health` | Backend health check |

## 🛠️ Development Notes

### Key Changes from Original Structure:
1. **Separated frontend and backend** for independent deployment
2. **Moved temp folder** to `backend/temp/` instead of root
3. **Updated Python path references** to `../python/` instead of `summariser-llm/`
4. **Added API configuration** in frontend for backend communication
5. **Created monorepo structure** with root-level scripts

### File Paths Updated:
- Python scripts: `python/agents_groq.py`
- Python venv: `python/venv/bin/python`
- Temp directory: `backend/temp/`

## �� Deployment

### Frontend Deployment (Vercel/Netlify)
1. Deploy the `frontend/` folder
2. Set environment variable: `NEXT_PUBLIC_BACKEND_URL=<your-backend-url>`

### Backend Deployment (Railway/Heroku/VPS)
1. Deploy the `backend/` folder
2. Ensure Python environment is available
3. Set PORT environment variable

### Python Environment
- Ensure the `python/` folder is accessible from the backend
- Virtual environment should be activated and dependencies installed

## 📝 License

ISC
