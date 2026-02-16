const { calcularSolar } = require('../utils/calculadora');
const Simulacao = require('../models/Simulacao');

function getCalculadora(req, res, next) {
  try {
    res.render('pages/calculadora', {
      title: 'Calculadora Solar',
      resultado: null,
      formData: {},
      erro: null
    });
  } catch (err) {
    next(err);
  }
}

async function postCalculadora(req, res, next) {
  try {
    const { nome, telefone, cidade, valor_conta, consumo, tipo_imovel } = req.body;
    const valorConta = parseFloat(valor_conta) || 0;
    const consumoMensal = consumo ? parseInt(consumo) : null;

    if (!nome || !telefone || !cidade || valorConta <= 0) {
      return res.render('pages/calculadora', {
        title: 'Calculadora Solar',
        resultado: null,
        formData: { nome: nome || '', telefone: telefone || '', cidade: cidade || '', valor_conta: valor_conta, consumo: consumo, tipo_imovel: tipo_imovel || 'residencial' },
        erro: 'Preencha nome, telefone, cidade e valor da conta.'
      });
    }

    const calc = calcularSolar(valorConta, consumoMensal, tipo_imovel);

    try {
      await Simulacao.criar({
        nome,
        telefone,
        cidade,
        valor_conta: valorConta,
        consumo: consumoMensal,
        tipo_imovel: tipo_imovel || 'residencial',
        economia_estimada: calc.economia_estimada,
        potencia_sugerida: calc.potencia_sugerida
      });
    } catch (err) {
      console.error('Erro ao salvar simulação:', err);
    }

    res.render('pages/calculadora', {
      title: 'Calculadora Solar',
      resultado: calc,
      formData: { nome, telefone, cidade, valor_conta: valorConta, consumo: consumoMensal, tipo_imovel }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCalculadora, postCalculadora };
