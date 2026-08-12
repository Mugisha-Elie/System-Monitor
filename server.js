import http from 'node:http'
import os from 'node:os'
import { parse } from 'node:path/win32';

process.loadEnvFile();

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathName = parsedUrl.pathname;


  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  

  if (req.method === 'GET' && pathName === '/api/status') {
    const systemInfo = {
      platform: os.platform(),
      architecture: os.arch(),
      totalMemoryGB: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
      freeMemoryGB: (os.freemem() / 1024 / 1024 / 1024).toFixed(2),
      uptimeSeconds: os.uptime()
    }
    res.statusCode = 200;
    res.end(JSON.stringify(systemInfo, null, 2));
    return;
  }

  if (req.method === 'GET' && pathName === '/api/process') {
    const unit = parsedUrl.searchParams.get('unit')?.toLowerCase() || 'mb';
    const memory = process.memoryUsage();

    let divisor = 1024 * 1024;
    if (unit === 'gb') divisor = 1024 * 1024 * 1024;
    if (unit === 'kb') divisor = 1024;
    if (unit === 'bytes') divisor = 1;
    
    const processInfo = {
      pid: process.pid,
      nodeVersion: process.version,
      processUptimeSeconds: process.uptime().toFixed(2),
      memoryUsageMB: {
        rss: (memory.rss / divisor).toFixed(2),
        heapTotal: (memory.heapTotal / divisor).toFixed(2),
        heapUsed: (memory.heapUsed / divisor).toFixed(2)
      }
    };
    res.statusCode = 200;
    res.end(JSON.stringify(processInfo, null, 2))
    return;
  }

  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Endpoint Not Found', path: pathName }));
});

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