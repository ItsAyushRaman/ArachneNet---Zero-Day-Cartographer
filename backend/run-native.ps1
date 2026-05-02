$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if (-not (Test-Path '.venv')) {
  Write-Host 'Creating virtual environment...'
  python -m venv .venv
}

. .\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt

if (-not (Test-Path '.env')) {
  Copy-Item '.env.example' '.env'
  Write-Host 'Created .env from .env.example. Edit it if needed.'
}

Write-Host 'Starting FastAPI backend on http://localhost:8000'
python -m uvicorn main:app --reload --port 8000
