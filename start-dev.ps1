# HappyTails Development Startup Script
Write-Host "Starting HappyTails Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Start Backend Server
Write-Host "Starting Backend Server (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit","-Command","cd C:\Users\USER\Desktop\happytails\backend; Write-Host 'Backend Server Starting...' -ForegroundColor Green; node server.js"

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server  
Write-Host "Starting Frontend Application (Port 8085)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit","-Command","cd C:\Users\USER\Desktop\happytails\frontend; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; npm run dev"

# Wait a moment
Start-Sleep -Seconds 2

# Display info
Write-Host ""
Write-Host "Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend:  http://localhost:8085" -ForegroundColor Cyan
Write-Host "Backend:   http://localhost:5000" -ForegroundColor Cyan
Write-Host "API Docs:  http://localhost:5000/api-docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop servers: Close the PowerShell windows" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
