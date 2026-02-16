const Usuario = require('../models/Usuario');
const Projeto = require('../models/Projeto');
const Simulacao = require('../models/Simulacao');
const Contato = require('../models/Contato');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Na Vercel/serverless: /tmp é gravável; disco local é somente leitura
const uploadDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, '../../public/uploads');
try {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
} catch (err) {
  console.warn('Não foi possível criar pasta uploads:', err.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

function getLogin(req, res) {
  if (req.session?.usuario) return res.redirect('/admin');
  res.render('pages/admin/login', { title: 'Admin - Login', erro: null });
}

async function postLogin(req, res) {
  const { email, senha } = req.body;
  const emailTrim = (email || '').trim().toLowerCase();
  if (!emailTrim || !senha) {
    return res.render('pages/admin/login', { title: 'Admin - Login', erro: 'Preencha e-mail e senha.' });
  }
  const user = await Usuario.buscarPorEmail(emailTrim);
  if (!user || !(await Usuario.verificarSenha(senha, user.senha_hash))) {
    return res.render('pages/admin/login', { title: 'Admin - Login', erro: 'E-mail ou senha inválidos.' });
  }
  req.session.usuario = user.email;
  req.session.userId = user.id;
  res.redirect('/admin');
}

function logout(req, res) {
  req.session.destroy();
  res.redirect('/admin/login');
}

async function dashboard(req, res) {
  try {
    const [projetos, simulacoes, contatos] = await Promise.all([
      Projeto.listar(5),
      Simulacao.listar(5),
      Contato.listar(5)
    ]);
    res.render('pages/admin/dashboard', {
      layout: 'layouts/admin',
      title: 'Admin',
      projetos,
      simulacoes,
      contatos
    });
  } catch (err) {
    console.error(err);
    res.render('pages/admin/dashboard', { layout: 'layouts/admin', projetos: [], simulacoes: [], contatos: [] });
  }
}

async function listarProjetos(req, res) {
  const projetos = await Projeto.listar(100);
  res.render('pages/admin/projetos', { layout: 'layouts/admin', title: 'Projetos', projetos });
}

function formProjeto(req, res) {
  res.render('pages/admin/projeto-form', { layout: 'layouts/admin', title: 'Novo Projeto', projeto: null });
}

async function criarProjeto(req, res) {
  const imagens = (req.files || []).map(f => '/uploads/' + f.filename);
  const projeto = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    local: req.body.local,
    potencia: req.body.potencia ? parseFloat(req.body.potencia) : null,
    economia: req.body.economia ? parseFloat(req.body.economia) : null,
    data_instalacao: req.body.data_instalacao || null,
    imagens_url: imagens
  };
  await Projeto.criar(projeto);
  res.redirect('/admin/projetos');
}

async function editarProjetoForm(req, res) {
  const projeto = await Projeto.buscarPorId(req.params.id);
  res.render('pages/admin/projeto-form', { layout: 'layouts/admin', title: 'Editar Projeto', projeto });
}

async function atualizarProjeto(req, res) {
  const projeto = await Projeto.buscarPorId(req.params.id);
  let imagens = projeto.imagens_url || [];
  if (req.files?.length) {
    imagens = [...imagens, ...req.files.map(f => '/uploads/' + f.filename)];
  }
  const body = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    local: req.body.local,
    potencia: req.body.potencia ? parseFloat(req.body.potencia) : null,
    economia: req.body.economia ? parseFloat(req.body.economia) : null,
    data_instalacao: req.body.data_instalacao || null,
    imagens_url: imagens
  };
  await Projeto.atualizar(req.params.id, body);
  res.redirect('/admin/projetos');
}

async function excluirProjeto(req, res) {
  await Projeto.excluir(req.params.id);
  res.redirect('/admin/projetos');
}

async function listarSimulacoes(req, res) {
  const simulacoes = await Simulacao.listar(100);
  res.render('pages/admin/simulacoes', { layout: 'layouts/admin', title: 'Simulações', simulacoes });
}

async function listarContatos(req, res) {
  const contatos = await Contato.listar(100);
  res.render('pages/admin/contatos', { layout: 'layouts/admin', title: 'Contatos', contatos });
}

module.exports = {
  getLogin,
  postLogin,
  logout,
  dashboard,
  listarProjetos,
  formProjeto,
  criarProjeto,
  editarProjetoForm,
  atualizarProjeto,
  excluirProjeto,
  listarSimulacoes,
  listarContatos,
  upload
};
