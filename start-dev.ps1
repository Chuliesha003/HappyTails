# HappyTails Development Server Starter
# This script kills any processes on ports 5000 and 8080, then starts both servers

Write-Host "🚀 Starting HappyTails Development Servers..." -ForegroundColor Cyan
Write-Host ""

# Function to kill process on a specific port
function Kill-PortProcess {
    param($Port)
    try {
        $processes = netstat -ano | findstr ":$Port" | findstr "LISTENING"
        if ($processes) {
            $processes -split "`n" | ForEach-Object {
                if ($_ -match '\s+(\d+)$') {
                    $pid = $matches[1]
                    try {
                        taskkill /F /PID $pid 2>$null | Out-Null
                        Write-Host "✅ Killed process on port $Port (PID: $pid)" -ForegroundColor Green
                    } catch {
                        # Process might already be dead
                    }
                }
            }
        } else {
            Write-Host "✅ Port $Port is available" -ForegroundColor Green
        }
    } catch {
        Write-Host "✅ Port $Port is available" -ForegroundColor Green
    }
}

# Kill processes on ports 5000, 8080, 8085, 8086
Write-Host "🔍 Checking for processes on ports..." -ForegroundColor Yellow
Kill-PortProcess 5000
Kill-PortProcess 8080
Kill-PortProcess 8085
Kill-PortProcess 8086
Write-Host ""

# Start backend in a new window
Write-Host "🔧 Starting Backend Server (Port 5000)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"

# Wait a moment for backend to initialize
Start-Sleep -Seconds 2

# Start frontend in a new window
Write-Host "🎨 Starting Frontend Server (Port 8080)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

# Display info
Write-Host ""
Write-Host "✅ Development servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Frontend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "📍 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "📍 API Docs: http://localhost:5000/api-docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Both servers will open in separate windows." -ForegroundColor Yellow
Write-Host "⚠️  Close those windows to stop the servers." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
