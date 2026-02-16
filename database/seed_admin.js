/**
 * Script para criar usuário admin inicial
 * Execute: node database/seed_admin.js
 * Login: admin@hangsix.com.br | Senha: admin123 (ALTERE APÓS PRIMEIRO ACESSO!)
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY);

async function seed() {
  const senha_hash = await bcrypt.hash('admin123', 10);
  const { data, error } = await supabase
    .from('usuarios_sistema')
    .upsert({ email: 'admin@hangsix.com.br', senha_hash, nome: 'Administrador' }, { onConflict: 'email' })
    .select()
    .single();
  if (error) {
    console.error('Erro:', error.message);
    process.exit(1);
  }
  console.log('Usuário admin criado com sucesso!');
  console.log('Login: admin@hangsix.com.br | Senha: admin123');
}

seed();
