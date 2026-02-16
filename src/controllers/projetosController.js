const Projeto = require('../models/Projeto');

async function listar(req, res) {
  try {
    const projetos = await Projeto.listar(50);
    res.render('pages/projetos', { projetos, title: 'Projetos Realizados' });
  } catch (err) {
    console.error(err);
    res.render('pages/projetos', { projetos: [], title: 'Projetos Realizados' });
  }
}

async function detalhe(req, res) {
  try {
    const projeto = await Projeto.buscarPorId(req.params.id);
    res.render('pages/projeto', { projeto, title: projeto?.titulo || 'Projeto' });
  } catch (err) {
    console.error(err);
    res.status(404).render('pages/404', { title: 'Não encontrado' });
  }
}

module.exports = { listar, detalhe };
