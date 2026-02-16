const { supabase } = require('../config/supabase');

const Contato = {
  async criar(contato) {
    const { data, error } = await supabase
      .from('contatos')
      .insert([{
        nome: contato.nome,
        telefone: contato.telefone,
        mensagem: contato.mensagem
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async listar(limite = 100) {
    const { data, error } = await supabase
      .from('contatos')
      .select('*')
      .order('data', { ascending: false })
      .limit(limite);
    if (error) throw error;
    return data || [];
  }
};

module.exports = Contato;
