# Roda a API sem Docker (SQLite). Requer Python 3.11 ou 3.12.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path ".venv")) {
    python -m venv .venv
}
& .\.venv\Scripts\pip install -q -r requirements.txt

if (-not (Test-Path ".env")) {
    Copy-Item .env.example .env
}

$env:DATABASE_URL = "sqlite:///./smartstay.db"
Write-Host "API: http://localhost:8000  |  Docs: http://localhost:8000/docs"
& .\.venv\Scripts\uvicorn app.main:app --reload --port 8000
