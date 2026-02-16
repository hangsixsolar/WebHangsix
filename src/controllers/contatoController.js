const Contato = require('../models/Contato');

function getContato(req, res) {
  res.render('pages/contato', { title: 'Contato', sucesso: false });
}

async function postContato(req, res) {
  const { nome, telefone, mensagem } = req.body;

  if (!nome || !telefone || !mensagem) {
    return res.render('pages/contato', {
      title: 'Contato',
      sucesso: false,
      erro: 'Preencha todos os campos.'
    });
  }

  try {
    await Contato.criar({ nome, telefone, mensagem });
    return res.render('pages/contato', { title: 'Contato', sucesso: true });
  } catch (err) {
    console.error(err);
    return res.render('pages/contato', {
      title: 'Contato',
      sucesso: false,
      erro: 'Erro ao enviar. Tente novamente.'
    });
  }
}

module.exports = { getContato, postContato };
