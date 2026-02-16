const { supabase } = require('../config/supabase');

const Projeto = {
  async listar(limite = 10) {
    const { data, error } = await supabase
      .from('projetos')
      .select('*')
      .order('data_instalacao', { ascending: false })
      .limit(limite);
    if (error) throw error;
    return data || [];
  },

  async buscarPorId(id) {
    const { data, error } = await supabase
      .from('projetos')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async criar(projeto) {
    const { data, error } = await supabase
      .from('projetos')
      .insert([{
        titulo: projeto.titulo,
        descricao: projeto.descricao,
        local: projeto.local,
        potencia: projeto.potencia,
        economia: projeto.economia,
        imagens_url: projeto.imagens_url || [],
        data_instalacao: projeto.data_instalacao
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async atualizar(id, projeto) {
    const { data, error } = await supabase
      .from('projetos')
      .update({
        titulo: projeto.titulo,
        descricao: projeto.descricao,
        local: projeto.local,
        potencia: projeto.potencia,
        economia: projeto.economia,
        imagens_url: projeto.imagens_url,
        data_instalacao: projeto.data_instalacao,
        atualizado_em: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async excluir(id) {
    const { error } = await supabase.from('projetos').delete().eq('id', id);
    if (error) throw error;
  }
};

module.exports = Projeto;
