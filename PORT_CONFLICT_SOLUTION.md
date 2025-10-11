# Port Conflict Solution - HappyTails

## Problem
The backend and frontend servers frequently failed to start with `EADDRINUSE` errors because ports 5000 and 8080 were already occupied by previous Node.js processes that weren't properly terminated.

## Permanent Solution

### Automated Port Cleanup
We've implemented automatic port cleanup scripts that run before starting the development servers.

### Files Added

#### 1. `backend/kill-port.js`
A Node.js script that automatically kills any process using port 5000 before the backend starts.

#### 2. `frontend/kill-port.js`
A Node.js script that automatically kills any process using port 8080 before the frontend starts.

#### 3. Updated `start-dev.ps1`
Enhanced the root-level startup script to automatically clean up ports before starting both servers.

### Updated Scripts

#### Backend (`backend/package.json`)
```json
"scripts": {
  "dev": "node kill-port.js 5000 && nodemon server.js",
  "dev:force": "node kill-port.js 5000 && node server.js"
}
```

#### Frontend (`frontend/package.json`)
```json
"scripts": {
  "dev": "node kill-port.js 8080 && vite",
  "dev:force": "node kill-port.js 8080 && node kill-port.js 8086 && vite"
}
```

## Usage

### Option 1: Start Individual Servers
Both servers now automatically clean up their ports before starting:

```powershell
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### Option 2: Start Both Servers (Recommended)
Use the enhanced startup script at the project root:

```powershell
.\start-dev.ps1
```

This script will:
1. ✅ Kill all processes on ports 5000, 8080, 8085, and 8086
2. ✅ Start the backend server in a new window
3. ✅ Start the frontend server in a new window
4. ✅ Display access URLs

## How It Works

### Windows (Current Implementation)
```javascript
// Find processes listening on the port
netstat -ano | findstr :PORT

// Extract PID and kill the process
taskkill /F /PID <pid>
```

### Unix/Linux/Mac (Also Supported)
```javascript
// Find and kill process on port
lsof -ti:PORT | xargs kill -9
```

## Benefits

1. **No More Port Conflicts** - Automatically cleans up stale processes
2. **Seamless Development** - Just run `npm run dev` without manual cleanup
3. **Cross-Platform** - Works on Windows, Mac, and Linux
4. **Safe** - Only kills processes on specific ports
5. **Informative** - Shows which processes were killed

## Alternative Commands

If you need to manually kill processes:

```powershell
# Kill all Node.js processes
taskkill /F /IM node.exe

# Kill specific port (Windows)
netstat -ano | findstr :5000
taskkill /F /PID <pid>
```

## Troubleshooting

### If ports are still in use:
1. Use the `dev:force` scripts for aggressive cleanup
2. Manually kill all Node processes: `taskkill /F /IM node.exe`
3. Restart your computer (rare cases)

### If scripts don't work:
1. Ensure you have admin privileges (usually not required)
2. Check if antivirus is blocking the scripts
3. Run PowerShell as Administrator

## Notes

- The kill-port scripts show friendly messages indicating port status
- Scripts are safe and only affect specified ports
- No need to manually check for running processes anymore
- Works automatically every time you run `npm run dev`

## Example Output

```
PS C:\Users\USER\Desktop\happytails\backend> npm run dev

> happytails-backend@1.0.0 dev
> node kill-port.js 5000 && nodemon server.js

✅ Killed process on port 5000 (PID: 12345)
[nodemon] starting `node server.js`
🚀 Server running on port 5000
```

This solution ensures smooth development workflow without manual port management!
