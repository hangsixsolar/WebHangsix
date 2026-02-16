  -- =============================================
  -- HANGSIX ENERGIA SOLAR - Estrutura de Tabelas
  -- Execute no Supabase SQL Editor
  -- =============================================
  -- Nota: A tabela usuarios_sistema já existe no projeto (login dos usuários cadastrados).

  -- Tabela de simulações (calculadora solar)
  CREATE TABLE IF NOT EXISTS simulacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(200) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    valor_conta DECIMAL(10,2) NOT NULL,
    consumo INTEGER,
    tipo_imovel VARCHAR(50),
    economia_estimada DECIMAL(10,2),
    potencia_sugerida DECIMAL(10,2),
    data TIMESTAMPTZ DEFAULT NOW()
  );

  -- Tabela de projetos realizados
  CREATE TABLE IF NOT EXISTS projetos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    local VARCHAR(200),
    potencia DECIMAL(10,2),
    economia DECIMAL(10,2),
    imagens_url TEXT[] DEFAULT '{}',
    data_instalacao DATE,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
  );

  -- Tabela de contatos (formulário de contato)
  CREATE TABLE IF NOT EXISTS contatos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(200) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    mensagem TEXT NOT NULL,
    data TIMESTAMPTZ DEFAULT NOW()
  );

  -- Índices para performance
  CREATE INDEX IF NOT EXISTS idx_simulacoes_data ON simulacoes(data);
  CREATE INDEX IF NOT EXISTS idx_projetos_data ON projetos(data_instalacao);
  CREATE INDEX IF NOT EXISTS idx_contatos_data ON contatos(data);

  -- RLS desativado: o controle de acesso é feito pelo backend via código.
  -- A base só armazena os dados.
  ALTER TABLE simulacoes DISABLE ROW LEVEL SECURITY;
  ALTER TABLE projetos DISABLE ROW LEVEL SECURITY;
  ALTER TABLE contatos DISABLE ROW LEVEL SECURITY;
