/**
 * Script para diagnosticar o login.
 * Uso: node database/debug_login.js SEU_EMAIL SUA_SENHA
 * Ex: node database/debug_login.js admin@hangsix.com.br admin123
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const [email, senha] = process.argv.slice(2);
if (!email || !senha) {
  console.log('Uso: node database/debug_login.js SEU_EMAIL SUA_SENHA');
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function debug() {
  console.log('--- Diagnóstico de Login ---\n');
  console.log('Email informado:', JSON.stringify(email));
  console.log('Senha informada:', senha.length, 'caracteres\n');

  const { data: user, error } = await supabase
    .from('usuarios_sistema')
    .select('*')
    .eq('email', email.trim())
    .single();

  if (error) {
    console.log('Erro ao buscar usuário:', error.message);
    console.log('Código:', error.code);
    return;
  }
  if (!user) {
    console.log('Usuário NÃO encontrado com esse email.');
    return;
  }

  console.log('Usuário encontrado:', user.id);
  console.log('Colunas retornadas:', Object.keys(user).join(', '));

  const hash = user.senha_hash || user.senha;
  if (!hash) {
    console.log('\nProblema: Não há coluna senha_hash ou senha com valor.');
    return;
  }

  const isBcrypt = hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$');
  console.log('\nFormato do hash:', isBcrypt ? 'bcrypt (OK)' : 'NÃO é bcrypt');
  console.log('Início do hash:', hash.substring(0, 20) + '...');

  const ok = await bcrypt.compare(senha, hash);
  console.log('\nbcrypt.compare(senha, hash) =', ok);

  if (!ok && !isBcrypt) {
    console.log('\n>>> Solução: O hash no banco NÃO é bcrypt.');
    console.log('>>> Se a senha foi salva em texto puro, gere um novo hash e atualize no Supabase:');
    const novoHash = await bcrypt.hash(senha, 10);
    console.log('>>> UPDATE usuarios_sistema SET senha_hash = \'' + novoHash + '\' WHERE email = \'' + email + '\';');
    console.log('\nOu rode: node database/seed_admin.js (para admin@hangsix.com.br)');
  }
}

debug();
