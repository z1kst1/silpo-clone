# 1. Легкий Linux із Node.js
FROM node:22-alpine

# 2. Робоча папка
WORKDIR /app

# 3. Встановлюємо залежності (всі потрібні — vite теж)
COPY package*.json ./
RUN npm install

# 4. Копіюємо код і білдимо
COPY . .
RUN npm run build

# 5. Відкриваємо порт
EXPOSE 4173

# 6. Запускаємо preview-сервер (роздає збілджений код)
CMD ["npm", "run", "preview", "--", "--host"]