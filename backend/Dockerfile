FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["sh", "-c", "node dist/scripts/ensure-db.js && npm run db:migrate && node dist/server.js"]
