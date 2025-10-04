module.exports = {
  apps: [
    {
      name: 'happytails-api',
      script: './server.js',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster', // Enable cluster mode for load balancing
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Auto-restart configuration
      watch: false, // Disable watch in production
      ignore_watch: ['node_modules', 'logs', 'coverage', 'tests'],
      max_memory_restart: '500M', // Restart if memory exceeds 500MB
      
      // Restart behavior
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Process management
      cron_restart: '0 0 * * *', // Restart daily at midnight
      
      // Environment-specific settings
      node_args: '--max-old-space-size=4096', // Increase Node.js memory limit
    },
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/happytails.git',
      path: '/var/www/happytails/backend',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production',
      },
    },
  },
};
