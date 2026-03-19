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

app.listen(PORT, () => {
  console.log(`J.A.R.V.I.S. online on port ${PORT}`);
});
