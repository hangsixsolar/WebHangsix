const { supabase } = require('../config/supabase');

const Simulacao = {
  async criar(simulacao) {
    const { data, error } = await supabase
      .from('simulacoes')
      .insert([{
        nome: simulacao.nome,
        telefone: simulacao.telefone,
        cidade: simulacao.cidade,
        valor_conta: simulacao.valor_conta,
        consumo: simulacao.consumo,
        tipo_imovel: simulacao.tipo_imovel,
        economia_estimada: simulacao.economia_estimada,
        potencia_sugerida: simulacao.potencia_sugerida
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async listar(limite = 100) {
    const { data, error } = await supabase
      .from('simulacoes')
      .select('*')
      .order('data', { ascending: false })
      .limit(limite);
    if (error) throw error;
    return data || [];
  }
};

module.exports = Simulacao;
