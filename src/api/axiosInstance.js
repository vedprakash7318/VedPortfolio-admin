import axios from 'axios';

// Vite exposes env variables that start with VITE_ through import.meta.env
// Fallback to localhost in case the variable isn't defined (e.g. during tests).
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  // You can add other default settings here if needed (headers, timeouts, etc.)
});

export default api;
