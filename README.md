# Boilerplate Fullstack

Monorepo base para novos projetos. Faça um fork (ou copie) e construa em cima.

- **Backend**: Node.js + Express + TypeScript + Prisma (PostgreSQL) — detalhes em [backend/README.md](backend/README.md)
- **Frontend**: React + Vite + Tailwind + Shadcn

---

## ✅ Requisitos

- **[Node.js LTS (>=18.x)](https://nodejs.org/)**
- **[PostgreSQL](https://www.postgresql.org/)**

```bash
node -v
npm -v
psql --version
```

---

## 🚀 Como rodar

### 1️⃣ Instalar dependências

Na raiz do projeto:

```bash
npm install
```

> Instala as dependências do **backend** e do **frontend** de uma vez (npm workspaces).

### 2️⃣ Configurar o ambiente

Copie o arquivo de exemplo e ajuste a `DATABASE_URL`:

```bash
cp backend/.env.example backend/.env
```

As variáveis disponíveis estão documentadas em [backend/README.md](backend/README.md#environment-variables). O frontend funciona sem `.env`; as opções estão em [frontend/README.md](frontend/README.md#configuração).

### 3️⃣ Criar as tabelas e o usuário admin

```bash
npm run prisma:db-push --workspace backend
npm run prisma:seed --workspace backend
```

> O seed cria o admin definido em `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` no `backend/.env`. Use essas credenciais no login do frontend.

### 4️⃣ Rodar

```bash
npm run dev
```

### 🌐 URLs

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1) (porta definida por `PORT_APP`)

---

## 📦 Build de produção

```bash
npm run build
npm start --workspace backend
```
