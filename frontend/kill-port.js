import { execSync } from 'child_process';

const PORT = process.argv[2] || 8080;

function killPort(port) {
  try {
    if (process.platform === 'win32') {
      // Windows
      try {
        const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
        const lines = output.split('\n').filter(line => line.includes('LISTENING'));
        
        lines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && !isNaN(pid)) {
            try {
              execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
              console.log(`✅ Killed process on port ${port} (PID: ${pid})`);
            } catch (e) {
              // Process might already be dead
            }
          }
        });
      } catch (e) {
        // No process found on this port
        console.log(`✅ Port ${port} is available`);
      }
    } else {
      // Unix-like systems (Mac/Linux)
      try {
        execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
        console.log(`✅ Killed process on port ${port}`);
      } catch (e) {
        console.log(`✅ Port ${port} is available`);
      }
    }
  } catch (error) {
    console.log(`✅ Port ${port} is available`);
  }
}

killPort(PORT);
