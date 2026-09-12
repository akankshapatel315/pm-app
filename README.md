# pm-app

## Docker (recommended)
Brings up Postgres, the backend, and the frontend together:

```
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- The backend creates the `pm_app` database itself if it doesn't exist yet, then runs migrations, before starting.
- Ports are overridable via `POSTGRES_PORT`, `BACKEND_PORT`, `FRONTEND_PORT` env vars if 5432/5000/3000 are already in use locally.

## frontend
Next.js + TypeScript + Tailwind CSS + shadcn/ui

```
cd frontend
npm run dev
```

## backend
Node.js + TypeScript + Express + Sequelize (PostgreSQL)

```
cd backend
cp .env.example .env   # update DB credentials
npm run dev
```

Migrations/seeders (via sequelize-cli, config in `src/config/config.js`):

```
npm run db:migrate
npm run db:seed
```
