require('dotenv').config();
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const { exec } = require('child_process');
const routes = require('./routes');

function openBrowser(url) {
  const cmd = process.platform === 'win32' ? `start "" "${url}"` : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
  exec(cmd, () => {});
}

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'hangsix-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(routes);

app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Não encontrado' });
});

app.use((err, req, res, next) => {
  console.error('Erro 500:', err.message);
  console.error(err.stack);
  res.status(500).send('Erro interno do servidor');
});

function startServer(port) {
  const server = app.listen(port, () => {
    const url = `http://localhost:${server.address().port}`;
    console.log(`Hangsix rodando em ${url}`);
    if (!process.env.VERCEL) openBrowser(url);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = Number(port) + 1;
      console.warn(`Porta ${port} em uso. Tentando ${nextPort}...`);
      startServer(nextPort);
    } else {
      throw err;
    }
  });
}
startServer(PORT);
