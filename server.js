const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

  // Inject API keys as window globals before the closing </head> tag
  const injection = `<script>
    window.CLAUDE_API_KEY = "${process.env.CLAUDE_API_KEY || ''}";
    window.ELEVEN_API_KEY = "${process.env.ELEVEN_API_KEY || ''}";
  </script>`;

  html = html.replace('</head>', injection + '\n</head>');
  res.send(html);
});

// Serve static files (if any additional assets are added later)
app.use(express.static(__dirname));

const https = require('https');
const http = require('http');

app.post('/pc-command', express.json(), (req, res) => {
  const options = {
    hostname: '100.111.171.88',
    port: 4000,
    path: '/command',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': 'JARVIS369SECRET'
    }
  };
  const proxyReq = http.request(options, (proxyRes) => {
    let data = '';
    proxyRes.on('data', chunk => data += chunk);
    proxyRes.on('end', () => res.json(JSON.parse(data)));
  });
  proxyReq.on('error', (e) => res.status(500).json({ error: e.message }));
  proxyReq.write(JSON.stringify(req.body));
  proxyReq.end();
});

app.listen(PORT, () => {
  console.log(`J.A.R.V.I.S. online on port ${PORT}`);
});
