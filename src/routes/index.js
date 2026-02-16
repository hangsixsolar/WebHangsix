const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const calculadoraController = require('../controllers/calculadoraController');
const projetosController = require('../controllers/projetosController');
const contatoController = require('../controllers/contatoController');
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/auth');

// Páginas públicas
router.get('/', homeController.home);
router.get('/calculadora-solar', calculadoraController.getCalculadora);
router.post('/calculadora-solar', calculadoraController.postCalculadora);
router.get('/projetos', projetosController.listar);
router.get('/projeto/:id', projetosController.detalhe);
router.get('/servicos', (req, res) => res.render('pages/servicos', { title: 'Serviços' }));
router.get('/sobre', (req, res) => res.render('pages/sobre', { title: 'Sobre' }));
router.get('/contato', contatoController.getContato);
router.post('/contato', contatoController.postContato);

// Admin - público (login)
router.get('/admin/login', adminController.getLogin);
router.post('/admin/login', adminController.postLogin);
router.get('/admin/logout', adminController.logout);

// Admin - protegido
router.get('/admin', requireAuth, adminController.dashboard);
router.get('/admin/projetos', requireAuth, adminController.listarProjetos);
router.get('/admin/projetos/novo', requireAuth, adminController.formProjeto);
router.post('/admin/projetos', requireAuth, adminController.upload.array('imagens', 10), adminController.criarProjeto);
router.get('/admin/projetos/:id/editar', requireAuth, adminController.editarProjetoForm);
router.post('/admin/projetos/:id', requireAuth, adminController.upload.array('imagens', 10), adminController.atualizarProjeto);
router.post('/admin/projetos/:id/excluir', requireAuth, adminController.excluirProjeto);
router.get('/admin/simulacoes', requireAuth, adminController.listarSimulacoes);
router.get('/admin/contatos', requireAuth, adminController.listarContatos);

module.exports = router;
