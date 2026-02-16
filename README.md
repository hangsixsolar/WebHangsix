# Hangsix Energia Solar - Website

Site de apresentação da Hangsix Energia Solar.

## Requisitos

- Node.js 18+
- Conta Supabase

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`
2. Preencha as variáveis do Supabase:
   - `SUPABASE_URL` - URL do seu projeto
   - `SUPABASE_ANON_KEY` - Chave anônima do projeto
   - `SESSION_SECRET` - Chave aleatória para sessão

## Banco de Dados

1. Acesse o Supabase SQL Editor
2. Execute o script `database/01_create_tables.sql`
3. Crie o usuário admin: `node database/seed_admin.js`
   - Login: `admin` | Senha: `admin123` (altere após primeiro acesso!)

## Executar

```bash
npm run dev   # desenvolvimento com hot reload
npm start     # produção
```

Acesse: http://localhost:3000

## Rotas

| Rota | Descrição |
|------|-----------|
| / | Home |
| /calculadora-solar | Calculadora de economia |
| /projetos | Lista de projetos |
| /projeto/:id | Detalhes do projeto |
| /servicos | Serviços oferecidos |
| /sobre | Sobre a empresa |
| /contato | Formulário de contato |
| /admin | Área administrativa (requer login) |

## Estrutura

```
hangsix/
├── database/         # Scripts SQL e seed
├── public/           # Assets estáticos
├── src/
│   ├── config/       # Configuração Supabase
│   ├── controllers/  # Lógica das rotas
│   ├── middleware/   # Autenticação
│   ├── models/       # Acesso ao banco
│   ├── routes/       # Definição de rotas
│   ├── utils/        # Utilitários (calculadora)
│   └── views/        # Templates EJS
└── app.js            # Entrada da aplicação
```
