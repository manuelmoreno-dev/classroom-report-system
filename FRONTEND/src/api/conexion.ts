import axios from 'axios';

// Reemplaza esto con tu Dirección IPv4 real (ej. 192.168.1.75)
// Si usas el emulador de Android nativo, a veces funciona con '10.0.2.2'
const IP_COMPUTADORA = '192.168.1.84'; 

const api = axios.create({
  baseURL: `http://${IP_COMPUTADORA}:3000/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;