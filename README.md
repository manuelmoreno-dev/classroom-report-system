git add README.md
# 📱 Classroom Report System

> Aplicación móvil Full-Stack para reportar averías en aulas de la **Universidad Politécnica de Aguascalientes**.

![Stack](https://img.shields.io/badge/React_Native-Expo_SDK_54-blue?style=flat-square&logo=expo)
![Backend](https://img.shields.io/badge/Backend-Node.js_%26_Express-green?style=flat-square&logo=nodedotjs)
![Database](https://img.shields.io/badge/Database-MySQL-orange?style=flat-square&logo=mysql)
![Language](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

---

## 📌 Descripción

Sistema que permite a **estudiantes y personal** de la UPA reportar fallas de infraestructura en edificios y aulas directamente desde su celular. Los administradores de mantenimiento visualizan, gestionan y actualizan el estado de cada reporte desde la misma app.

---

## ✨ Funcionalidades

| Rol | Funcionalidades |
|---|---|
| 🎓 Alumno | Seleccionar edificio y aula, elegir categoría de avería, enviar reporte, ver historial propio |
| 🔧 Administrador | Ver todos los reportes, filtrar por estado, actualizar estado (Pendiente → En Proceso → Resuelto) |

---

## 🛠️ Stack Tecnológico

### Frontend
- **React Native + TypeScript** — UI nativa tipada
- **Expo SDK 54 + Expo Router** — Navegación basada en archivos (`app/`)
- **Axios** — Peticiones HTTP asíncronas (`GET` / `POST`)
- `@react-native-picker/picker` — Selectores de edificio/categoría
- `FlatList` + `RefreshControl` — Pull-to-refresh en historial

### Backend
- **Node.js + Express** — API REST
- **CORS** — Comunicación segura en red local
- **Dotenv** — Variables de entorno protegidas

### Base de datos
- **MySQL** — Persistencia relacional
- **mysql2/promise** — Consultas async/await sin bloqueo
- Diseño normalizado con `FOREIGN KEY` + `ON DELETE CASCADE`
- Flujo **Upsert inteligente** — registra aulas nuevas automáticamente al momento del reporte

---

## 🏗️ Arquitectura del flujo de datos

```
[React Native App]
       │
       │  POST /reportes  (JSON: edificio, aula, matrícula, categoría)
       ▼
[Express API Server]
       │
       ├─► ¿Aula existe en catálogo?
       │       ├─ Sí → obtiene ID relacional
       │       └─ No → INSERT automático (Upsert)
       │
       └─► INSERT reporte vinculando: ID aula + matrícula + categoría
       │
       │  GET /reportes  (JOIN: aulas + reportes + categorías)
       ▼
[Panel de Mantenimiento]  →  Tarjetas organizadas por estado
```

---

## 📁 Estructura del proyecto

```
classroom-report-system/
├── BACKEND/
│   ├── src/
│   │   ├── routes/
│   │   └── db.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── FRONTEND/
│   ├── app/               # Expo Router (file-based routing)
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── navigation/
│   │   └── screens/
│   └── package.json
└── README.md
```

---

## ⚙️ Instalación y uso

### Prerrequisitos
- Node.js v18+
- MySQL corriendo localmente
- Expo Go instalado en tu celular

### 1. Clonar el repositorio
```bash
git clone https://github.com/up240460-commits/classroom-report-system.git
cd classroom-report-system
```

### 2. Configurar el Backend
```bash
cd BACKEND
npm install
cp .env.example .env   # Llena las variables con tus credenciales
node server.js
```

### 3. Configurar el Frontend
```bash
cd FRONTEND
npm install
npx expo start
```
Escanea el QR con Expo Go desde tu celular (misma red WiFi que el servidor).

---

## 🔐 Variables de entorno

Crea un archivo `.env` dentro de `BACKEND/` basándote en `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=classroom_reports
PORT=3000
```

---

## 👥 Autores

| Nombre | GitHub |
|---|---|
| José Manuel Moreno González | [@up240460-commits](https://github.com/up240460-commits) |

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.
