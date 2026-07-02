-- Esquema de base de datos para Classroom Report System (General/Escolar)

CREATE DATABASE IF NOT EXISTS upa_reportes;
USE upa_reportes;

-- 1. Tabla de Aulas (Catálogo autogestionado)
CREATE TABLE IF NOT EXISTS aulas (
  id_aula INT AUTO_INCREMENT PRIMARY KEY,
  edificio VARCHAR(50) NOT NULL,
  nombre_aula VARCHAR(50) NOT NULL,
  UNIQUE KEY unique_aula (edificio, nombre_aula)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Categorías (Catálogo estático de averías)
CREATE TABLE IF NOT EXISTS categorias (
  id_categoria INT PRIMARY KEY,
  nombre_categoria VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla de Reportes
CREATE TABLE IF NOT EXISTS Reportes (
  id_reporte INT AUTO_INCREMENT PRIMARY KEY,
  matricula_usuario VARCHAR(50) NOT NULL,
  id_aula INT NOT NULL,
  id_categoria INT NOT NULL,
  descripcion TEXT NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
  fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_aula) REFERENCES aulas(id_aula) ON DELETE CASCADE,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Inserción de categorías por defecto
INSERT INTO categorias (id_categoria, nombre_categoria) VALUES
(1, 'Aire Acondicionado'),
(2, 'Iluminación'),
(3, 'Redes e Internet'),
(4, 'Mobiliario')
ON DUPLICATE KEY UPDATE nombre_categoria = VALUES(nombre_categoria);
