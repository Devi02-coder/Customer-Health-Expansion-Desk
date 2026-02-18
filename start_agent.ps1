# Startup Script for Customer Health & Expansion Desk
Write-Host "Starting CHED Ecosystem..." -ForegroundColor Cyan

# 1. Start Backend
Write-Host "Launching Backend (Port 5005)..." -ForegroundColor Green
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "$PSScriptRoot\backend"
Start-Sleep -Seconds 5

# 2. Start AI Service
Write-Host "Launching AI Service (Port 8006)..." -ForegroundColor Green
Start-Process -FilePath "python" -ArgumentList "-m uvicorn app:app --reload --port 8006" -WorkingDirectory "$PSScriptRoot\ai-service"
Start-Sleep -Seconds 5

# 3. Start Frontend
Write-Host "Launching Frontend (Port 5173)..." -ForegroundColor Green
Start-Process -FilePath "node" -ArgumentList "node_modules/vite/bin/vite.js" -WorkingDirectory "$PSScriptRoot\frontend"
Start-Sleep -Seconds 5

Write-Host "Launching Browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"
