# 📱 Classroom Report System — UPA

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
│   ├── package.json
│   └── Dockerfile          # Configuración de Docker para el backend
├── database/               # Base de datos MySQL
│   ├── schema.sql          # Esquema de tablas e inicialización
│   └── README.md           # Explicación técnica del esquema
├── FRONTEND/
│   ├── app/                # Expo Router (file-based routing)
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── navigation/
│   │   └── screens/
│   └── package.json
├── docker-compose.yml      # Orquestación de contenedores (Base de datos + API)
└── README.md
```

---

## ⚙️ Instalación y uso

### Prerrequisitos
- Node.js v18+ (para ejecución local)
- Docker y Docker Compose (para ejecución en contenedores, recomendado)
- Expo Go instalado en tu celular

### 1. Clonar el repositorio
```bash
git clone https://github.com/manuelmoreno-dev/classroom-report-system.git
cd classroom-report-system
```

---

### Opción A: Ejecución con Docker (Recomendada)
Esta opción levanta automáticamente la base de datos MySQL, la API de Node.js Express y el frontend de Expo en segundo plano.

1. **Levantar todos los servicios**:
   ```bash
   docker compose up --build -d
   ```
2. **Escanear el Código QR de Expo**:
   Dado que Expo corre en segundo plano dentro del contenedor, visualiza la terminal del frontend para ver el código QR:
   ```bash
   docker compose logs -f frontend
   ```
   Escanea el código QR con **Expo Go** en tu celular (asegúrate de que tu celular y computadora estén en la misma red WiFi).
3. **Acceder a la versión Web (Opcional)**:
   Abre en tu navegador `http://localhost:8081`.
4. **Detener todos los servicios**:
   ```bash
   docker compose down
   ```

*Nota: La base de datos se inicializa automáticamente con `database/schema.sql` y guarda los datos en un volumen persistente de Docker. La comunicación se realiza usando tu IP física `192.168.1.72`. Si tu IP cambia, actualízala en el archivo `docker-compose.yml` en las variables `REACT_NATIVE_PACKAGER_HOSTNAME` y `EXPO_PUBLIC_API_URL`.*

---

### Opción B: Ejecución Local Tradicional

1. **Configurar la Base de Datos**:
   - Crea una base de datos MySQL llamada `upa_reportes`.
   - Ejecuta el script SQL en `database/schema.sql` para crear las tablas e inicializar las categorías.

2. **Configurar y levantar el Backend**:
   ```bash
   cd BACKEND
   npm install
   cp .env.example .env   # Configura tus credenciales locales
   node server.js
   ```

3. **Configurar y levantar el Frontend**:
   ```bash
   cd FRONTEND
   npm install
   npx expo start
   ```
   Escanea el código QR con la app **Expo Go** desde tu celular.

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
| José Manuel Moreno González | [@manuelmoreno-dev](https://github.com/manuelmoreno-dev) |

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.
