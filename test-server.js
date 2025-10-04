import http from 'http';
import fs from 'fs';
import path from 'path';

const server = http.createServer((req, res) => {
    let filePath = './test-auth-frontend.html';
    
    if (req.url === '/' || req.url === '/test-auth-frontend.html') {
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`🚀 Test server running at http://localhost:${PORT}`);
    console.log('📝 Open: http://localhost:8080/test-auth-frontend.html');
});