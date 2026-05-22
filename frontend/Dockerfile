# 1. Беремо той самий легкий Linux із Node.js
FROM node:22-alpine

# 2. Робоча папка для фронтенду
WORKDIR /app

# 3. Копіюємо package.json та встановлюємо бібліотеки
COPY package*.json ./
RUN npm install

# 4. Копіюємо весь код сайту
COPY . .

# 5. Відкриваємо порт 5173 (стандартний порт Vite)
EXPOSE 5173

# 6. Запускаємо сервер розробки Vite і дозволяємо доступ ззовні (--host)
CMD ["npm", "run", "dev", "--", "--host"]
