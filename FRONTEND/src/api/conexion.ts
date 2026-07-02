import axios from 'axios';

const IP_COMPUTADORA = '192.168.1.72'; 

const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${IP_COMPUTADORA}:3000/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;