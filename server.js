const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const HTML_FILE = path.join(__dirname, 'index.html');

// 初始化資料檔
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]}));
}

const server = http.createServer((req, res) => {
  // API: 讀取卡片資料
  if (req.method === 'GET' && req.url === '/api/data') {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
    return;
  }

  // API: 儲存卡片資料
  if (req.method === 'POST' && req.url === '/api/data') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      fs.writeFileSync(DATA_FILE, body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"ok":true}');
    });
    return;
  }

  // 提供 index.html
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    const html = fs.readFileSync(HTML_FILE, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
  // 取得本機 IP
  const nets = os.networkInterfaces();
  let localIP = 'localhost';
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        localIP = net.address;
        break;
      }
    }
  }
  console.log('');
  console.log('===========================================');
  console.log('  療癒抽籤箱 伺服器已啟動！');
  console.log('===========================================');
  console.log('');
  console.log('  這台電腦開啟: http://localhost:' + PORT);
  console.log('  其他電腦開啟: http://' + localIP + ':' + PORT);
  console.log('');
  console.log('  (請確保兩台電腦在同一個 WiFi 網路下)');
  console.log('  按 Ctrl+C 可停止伺服器');
  console.log('');
});
