# HackWay

Guia e tracker de pentests: cadastro de alvos, escopo por fases PTES, biblioteca de
ferramentas/comandos por tipo de alvo, notas por fase e geração de relatórios
(técnico/executivo).

- `backend/` — API em FastAPI + SQLAlchemy async + Alembic + Pydantic v2
- `frontend/` — App em Next.js (App Router) + TypeScript + Tailwind
- `nginx/` — proxy reverso que unifica front e API sob a mesma origem (usado no docker-compose)

## Subindo tudo com Docker (recomendado)

```bash
cp backend/.env.example backend/.env   # preencha DATABASE_URL, SECRET_KEY, FIELD_ENCRYPTION_KEY (veja abaixo)
docker compose up --build
```

Isso sobe 3 containers atrás de um **proxy reverso nginx** em `http://localhost:8080`:

- `nginx` (porta publicada `8080`) — roteia `/api/*` para o backend e o resto para o frontend
- `backend` — aplica as migrações do Alembic automaticamente no start e sobe o uvicorn
- `frontend` — build de produção do Next.js (`output: "standalone"`)

Front e API ficam então na **mesma origem** (`http://localhost:8080`), o que evita
qualquer problema de cookie/CORS cross-site — o cookie de sessão (`httpOnly`) funciona
direto, sem configuração extra. `backend` e `frontend` não expõem porta ao host,
só o `nginx` fica acessível de fora.

Para gerar as chaves do `.env` (usando a própria imagem já buildada):

```bash
docker compose build backend
docker run --rm hackway-backend python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
docker run --rm hackway-backend python -c "import secrets; print(secrets.token_urlsafe(64))"
```

> **Supabase**: se o banco for Supabase, use a connection string do **Session
> pooler** (`Project Settings → Database → Connection String → Session pooler`,
> porta 5432, host `aws-0-<região>.pooler.supabase.com`, usuário
> `postgres.<ref-do-projeto>`) — a conexão "direta" (`db.<ref>.supabase.co`)
> só resolve em IPv6 e a rede padrão do Docker Desktop não tem rota de saída
> IPv6, então a conexão falha com "Network is unreachable".

## Segurança

- Senhas de usuário: hash com **bcrypt** (nunca armazenadas em texto plano).
- Dados anotados nos alvos — **endereço/identificador**, **descrição/regras de
  engajamento** e as **notas de cada fase** — são criptografados em repouso com
  **Fernet (AES simétrico)** antes de ir para o banco (`app/core/security.py`,
  `EncryptedString`). A aplicação descriptografa de forma transparente ao ler.
- Autenticação via JWT guardado em cookie `httpOnly` (não acessível por JS no
  navegador), `SameSite=Lax`, `Secure` em produção.

## Rodando sem Docker (dev solto)

### Backend (FastAPI)

Requer **Python 3.11 ou 3.12** (na data desta build, pacotes como `pydantic-core`
e `asyncpg` ainda não publicam wheels pré-compilados para Python 3.14 no Windows,
o que exige toolchain Rust para compilar do zero — evite 3.14 por enquanto).

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt

cp .env.example .env          # preencha DATABASE_URL, SECRET_KEY, FIELD_ENCRYPTION_KEY

# gerar a chave de criptografia dos dados dos alvos:
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"

alembic upgrade head           # cria as tabelas no Postgres

uvicorn app.main:app --reload --port 8000
```

A API fica em `http://localhost:8000/api` (docs interativas em `/docs`).

### Módulos (`app/modules/`)

Cada módulo é autocontido com `models.py`, `schemas.py`, `repository.py`
(acesso a dados), `controller.py` (regras de negócio) e `routes.py` (FastAPI router):

- `users` — cadastro de pentesters e especialidades
- `auth` — login/registro/logout, emissão do cookie JWT
- `targets` — CRUD de alvos, escopo de fases, progresso
- `notes` — anotações por alvo/fase (criptografadas)
- `tools` — base de referência de ferramentas/comandos por tipo de alvo e fase (dado estático)
- `reports` — geração de relatório técnico/executivo a partir do alvo + notas

### Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.local.example .env.local   # aponta para a API (NEXT_PUBLIC_API_URL)
npm run dev
```

Acesse `http://localhost:3000`. O proxy do Next.js (`proxy.ts`, antigo
`middleware.ts`) protege as rotas autenticadas checando o cookie de sessão.

> **Produção sem o nginx deste repo**: se frontend e backend ficarem em domínios
> diferentes, o cookie `SameSite=Lax` não trafega em requisições cross-site.
> Coloque a API atrás do mesmo domínio do frontend (é o que o `docker-compose.yml`
> já faz via nginx) ou ajuste a política de cookie (`SameSite=None; Secure`) com
> CORS restrito à origem exata.

## Banco de dados

Use qualquer Postgres gerenciado na nuvem (Neon, Supabase, RDS, etc.) — basta
apontar `DATABASE_URL` no `.env` do backend no formato:

```
postgresql+asyncpg://usuario:senha@host:5432/banco
```

As migrações ficam em `backend/alembic/versions/`. A migração inicial
(`0001_initial.py`) cria as tabelas `users`, `targets` e `notes`.
