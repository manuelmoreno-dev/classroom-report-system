# 📱 Classroom Report System — Sistema de Reportes Escolar

> Aplicación móvil Full-Stack para reportar averías en aulas de **escuelas, colegios y universidades** (adaptable a cualquier institución).

![Stack](https://img.shields.io/badge/React_Native-Expo_SDK_56-blue?style=flat-square&logo=expo)
![Backend](https://img.shields.io/badge/Backend-Node.js_%26_Express-green?style=flat-square&logo=nodedotjs)
![Database](https://img.shields.io/badge/Database-MySQL-orange?style=flat-square&logo=mysql)
![Language](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

---

## 📌 Descripción

Sistema que permite a **estudiantes y personal** de cualquier institución educativa reportar fallas de infraestructura en edificios y aulas directamente desde su celular. Los administradores de mantenimiento visualizan, gestionan y actualizan el estado de cada reporte desde la misma app.

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

### Si utilizas Docker (Recomendado)
**No es necesario crear ningún archivo `.env`**. Las variables de entorno necesarias están preconfiguradas directamente en el archivo `docker-compose.yml` e inyectadas automáticamente a los contenedores al iniciar.

### Si utilizas la Ejecución Local Tradicional
Es obligatorio crear el archivo `.env` para conectar el servidor con tu MySQL local. Crea un archivo llamado `.env` dentro de la carpeta `BACKEND/` basándote en `BACKEND/.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_local
DB_NAME=upa_reportes
PORT=3000
```
*(Asegúrate de cambiar `DB_PASSWORD` por la contraseña de tu MySQL local).*

---

## 🚀 Despliegue en Producción

Para poner este sistema en producción en un servidor o computadora central de la universidad (para que funcione de forma permanente y autónoma), sigue las siguientes directrices:

### 1. Servidor Backend y Base de Datos (Seguridad y Persistencia)

#### Opción A: Mediante Docker (Recomendado)
El archivo `docker-compose.yml` ya está preconfigurado con políticas de reinicio automático (`restart: always`) y persistencia de datos mediante volúmenes. Para producción:
1. **Seguridad Crítica**: Edita el archivo `docker-compose.yml` y cambia la contraseña por defecto de la base de datos (`MYSQL_ROOT_PASSWORD`) y del backend (`DB_PASSWORD`) a una contraseña segura.
2. **IP Estática / Dominio**: Configura las variables `REACT_NATIVE_PACKAGER_HOSTNAME` y `EXPO_PUBLIC_API_URL` en `docker-compose.yml` con la IP fija del servidor en la red de la institución (o un dominio dns local).
3. **Ejecución en segundo plano permanente**:
   ```bash
   docker compose up --build -d
   ```
   *(El flag `-d` inicia los servicios en segundo plano. Si el servidor se apaga o reinicia, Docker levantará los contenedores automáticamente).*

#### Opción B: Ejecución Local con PM2 (Sin Docker)
Si ejecutas de forma tradicional, utiliza un administrador de procesos como **PM2** para que el backend nunca se caiga y se inicie con el sistema:
1. Instala PM2 de forma global:
   ```bash
   npm install -g pm2
   ```
2. Inicia el backend con PM2:
   ```bash
   cd BACKEND
   pm2 start server.js --name "upa-backend"
   ```
3. Configura PM2 para auto-arrancar al reiniciar el servidor:
   ```bash
   pm2 startup
   pm2 save
   ```

---

### 2. Frontend: Compilación y Distribución de la Aplicación

En producción no se debe usar `npx expo start` ni la app Expo Go. Debes generar los archivos finales para distribución:

#### A. Para Dispositivos Android (Archivo APK)
Genera una aplicación instalable de forma directa en los celulares de los usuarios:
1. Instala la herramienta de compilación de Expo:
   ```bash
   npm install -g eas-cli
   ```
2. Inicia sesión en tu cuenta de Expo:
   ```bash
   eas login
   ```
3. Configura y compila la aplicación para generar el archivo `.apk`:
   ```bash
   eas build --platform android --profile preview
   ```
   *(Esto te entregará un enlace de descarga con el archivo APK listo para instalar en cualquier celular Android sin depender de Expo Go).*

#### B. Para el Panel de Mantenimiento Web (Admin)
Si los administradores van a ingresar desde su computadora, compila el sitio web estático:
1. Exporta el sitio web:
   ```bash
   cd FRONTEND
   npx expo export --platform web
   ```
2. Copia la carpeta de salida generada (`dist`) a un servidor web de producción como **Nginx** o **Apache** para servirlo de forma pública en la red institucional.

---

## 👥 Autores

| Nombre | GitHub |
|---|---|
| José Manuel Moreno González | [@manuelmoreno-dev](https://github.com/manuelmoreno-dev) |

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.
