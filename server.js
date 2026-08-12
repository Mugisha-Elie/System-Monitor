import http from 'node:http'
import os from 'node:os'

process.loadEnvFile();

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  const systemInfo = {
    platform: os.platform(),
    architecture: os.arch(),
    totalMemoryGB: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
    freeMemoryGB: (os.freemem() / 1024 / 1024 / 1024).toFixed(2),
    uptimeSeconds: os.uptime()
  }
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(systemInfo, null, 2));
})

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
})

function gracefulShutdown(signal) {
  console.log(`\n[${signal}] Received. Closing HTTP server gracefully...`);

  server.close(() => {
    console.log(`[SERVER] Closed all active connections. Process exiting.`);
    process.exit(0)
  })
} 

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))