const crypto = require('crypto');
const { supabase } = require('../config/supabase');
const bcrypt = require('bcryptjs');

const Usuario = {
  async buscarPorEmail(email) {
    const emailNorm = (email || '').trim().toLowerCase();
    const { data, error } = await supabase
      .from('usuarios_sistema')
      .select('*')
      .eq('email', emailNorm)
      .single();
    if (error) return null;
    return data;
  },

  async verificarSenha(senha, hash) {
    if (!hash) return false;
    // bcrypt: começa com $2a$, $2b$, $2y$
    if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
      return bcrypt.compare(senha, hash);
    }
    // Hash hex: compatível com sistema existente (md5=32, sha1=40, sha256=64)
    const algo = process.env.HASH_ALGORITHM || 
      (hash.length === 32 ? 'md5' : hash.length === 40 ? 'sha1' : 'sha256');
    const hex = crypto.createHash(algo).update(senha, 'utf8').digest('hex');
    if (hex.length !== hash.length) return false;
    try {
      return crypto.timingSafeEqual(Buffer.from(hex, 'hex'), Buffer.from(hash.toLowerCase(), 'hex'));
    } catch {
      return hex === hash.toLowerCase();
    }
  },

  async criar(email, senha, nome) {
    const senha_hash = await bcrypt.hash(senha, 10);
    const { data, error } = await supabase
      .from('usuarios_sistema')
      .insert([{ email, senha_hash, nome }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

module.exports = Usuario;
