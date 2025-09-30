import axios from "axios";

// Базовый URL — укажи свой адрес бэкенда
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Перехватчик для токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // или откуда у тебя хранится
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
