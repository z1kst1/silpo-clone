# 1. Легкий Linux із Node.js
FROM node:22-alpine

# 2. Робоча папка для бекенду
WORKDIR /app

# 3. Копіюємо package.json та встановлюємо ТІЛЬКИ production-бібліотеки
COPY package*.json ./
RUN npm install --omit=dev

# 4. Копіюємо весь source-код бекенду
COPY . .

# 5. Відкриваємо порт бекенду
EXPOSE 3000

# 6. Запускаємо production-сервер
CMD ["npm", "run", "start"]
