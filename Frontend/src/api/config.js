/**
 * Базовый URL API бэкенда.
 * Задаётся через VITE_API_URL в .env (например: http://localhost:5064)
 */
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5064';
