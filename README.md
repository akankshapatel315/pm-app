# pm-app

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
