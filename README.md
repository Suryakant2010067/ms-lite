# HRMS Lite

A lightweight Human Resource Management System (HRMS) for managing employee records and tracking attendance.

## Tech Stack
- **Frontend**: React (Vite), Vanilla CSS, Lucide Icons, Axios.
- **Backend**: Python (FastAPI), SQLAlchemy, Pydantic, Uvicorn.
- **Database**: SQLite (SQLAlchemy ORM).

## Features
- **Employee Management**: 
  - Add new employees with unique IDs.
  - View a complete list of employees.
  - Delete employees (cascades to attendance records).
- **Attendance Management**:
  - Mark attendance (Present/Absent) for any date.
  - View attendance history for all employees.
- **Dashboard**:
  - Summary cards for total employees and today's attendance.
  - Quick view of recent attendance activities.

## How to Run Locally

### Prerequisites
- Python 3.8+ and Node.js installed.

### Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```
2. Setup Backend:
   ```bash
   cd hrms-lite/backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```
3. Setup Frontend:
   ```bash
   cd hrms-lite/frontend
   npm install
   npm run dev
   ```

## API Documentation
Once the backend is running, you can access the interactive API docs at:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Redoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
