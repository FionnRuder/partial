module.exports = {
    apps: [
        {
            name: "partial-server",
            script: "npm",
            args: "run start",
            env: {
                NODE_ENV: "production",
            },
            // Environment variables should be set in .env file or system environment
            // PM2 will automatically load .env file if dotenv is configured
            instances: 1, // Set to 'max' for cluster mode, or a number for specific instances
            exec_mode: "fork", // Use 'cluster' for load balancing
            watch: false, // Disable watch in production
            max_memory_restart: "1G", // Restart if memory exceeds 1GB
            error_file: "./logs/pm2-error.log",
            out_file: "./logs/pm2-out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss Z",
            merge_logs: true,
        },
        {
            name: "partial-server-dev",
            script: "npm",
            args: "run dev",
            env: {
                NODE_ENV: "development",
            },
            watch: true, // Enable watch in development
            ignore_watch: ["node_modules", "dist", "logs"],
        }
    ]
}