# HappyTails Development Startup Script

Write-Host "🐾 Starting HappyTails Development Environment..." -ForegroundColor Cyan

# Start Backend
Write-Host "`n📦 Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\USER\Desktop\happytails\backend; npm run dev" -WindowStyle Normal

# Wait a moment for backend to initialize
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "🎨 Starting Frontend Application..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\USER\Desktop\happytails\frontend; npm run dev" -WindowStyle Normal

Write-Host "`n✅ Both servers are starting!" -ForegroundColor Green
Write-Host "📍 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📍 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "📍 API Docs: http://localhost:5000/api-docs" -ForegroundColor Cyan
Write-Host "`n💡 Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
