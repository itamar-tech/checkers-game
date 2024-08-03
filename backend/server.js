const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Backend do Jogo de Damas');
});

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});

