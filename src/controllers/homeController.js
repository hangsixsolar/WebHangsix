const Projeto = require('../models/Projeto');

async function home(req, res) {
  try {
    const projetos = await Projeto.listar(6);
    res.render('pages/home', { projetos, title: 'Hangsix Energia Solar' });
  } catch (err) {
    console.error(err);
    res.render('pages/home', { projetos: [], title: 'Hangsix Energia Solar' });
  }
}

module.exports = { home };
