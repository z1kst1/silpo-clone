import axios from 'axios';

// Створюємо екземпляр axios із базовими налаштуваннями
const api = axios.create({
  baseURL: '/api', // Vite буде проксіювати це на твій http://localhost:3000
  headers: {
    'Content-Type': 'application/json',
  },
});

// ІНТЕРЦЕПТОР ДЛЯ ЗАПИТІВ (Request Interceptor)
// Автоматично додає токен Bearer у Header кожного запиту, якщо він є
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // або sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ІНТЕРЦЕПТОР ДЛЯ ВІДПОВІДЕЙ (Response Interceptor)
// Перехоплює помилки від сервера. Якщо помилка 401 (токен злетів) — робимо рефреш або редірект
api.interceptors.response.use(
  (response) => response, // Якщо все ок, просто повертаємо відповідь
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Токен застарів або невалідний, розлогінюємо...');
      localStorage.removeItem('token');
      window.location.href = '/login'; // викидаємо на вхід
    }
    return Promise.reject(error);
  }
);

export default api;
