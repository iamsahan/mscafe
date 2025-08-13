module.exports = {
  apps: [{
    name: 'mscafe-api',
    script: 'server.js',
    instances: process.env.NODE_ENV === 'production' ? 'max' : 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    // Auto-restart settings
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    
    // Memory management
    max_memory_restart: '1G',
    
    // Log settings
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    
    // Monitoring
    monitoring: false,
    
    // Health check
    health_check_url: 'http://localhost:5000/health',
    health_check_grace_period: 3000,
    
    // Auto-restart on file changes (development only)
    watch: process.env.NODE_ENV === 'development' ? ['server.js', 'config/', 'controllers/', 'middleware/', 'models/', 'routes/'] : false,
    ignore_watch: ['node_modules', 'logs', 'uploads'],
    
    // Advanced settings
    node_args: process.env.NODE_ENV === 'production' ? '--max-old-space-size=2048' : '',
    
    // Graceful shutdown
    kill_timeout: 5000,
    
    // Auto-restart triggers
    autorestart: true,
    
    // Custom environment variables
    env_file: '.env'
  }]
};
