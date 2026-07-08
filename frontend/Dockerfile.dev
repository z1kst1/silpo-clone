# 1. Легкий Linux із Node.js
FROM node:22-alpine

# 2. Робоча папка
WORKDIR /app

# 3. Встановлюємо залежності
COPY package*.json ./
RUN npm install

# 4. Код копіюється через volume в docker-compose (живе оновлення)
COPY . .

# 5. Відкриваємо порт dev-сервера Vite
EXPOSE 5173

# 6. Запускаємо звичний dev-сервер з hot-reload
CMD ["npm", "run", "dev", "--", "--host"]

