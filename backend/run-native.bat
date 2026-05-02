@echo off
setlocal
cd /d %~dp0

if not exist .venv (
  echo Creating virtual environment...
  python -m venv .venv
)

call .venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt

if not exist .env (
  copy .env.example .env >nul
  echo Created .env from .env.example. Edit it if needed.
)

echo Starting FastAPI backend on http://localhost:8000
python -m uvicorn main:app --reload --port 8000
