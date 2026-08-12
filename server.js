import http from 'node:http'

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Server is running' }));
})

server.listen(5000, () => {
  console.log("Server listening at http://localhost:5000");
})