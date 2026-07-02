# Base de Datos — Classroom Report System

Esta carpeta contiene el esquema y la documentación para la base de datos MySQL del **Classroom Report System**.

## 📌 Estructura del Esquema (`schema.sql`)

La base de datos consta de 3 tablas principales diseñadas con integridad referencial:

1. **`aulas`**: Almacena los salones y edificios registrados en el sistema. Los salones se registran de forma automática (flujo upsert) cuando se genera un nuevo reporte.
2. **`categorias`**: Catálogo estático con las categorías de fallas o averías.
3. **`Reportes`**: Historial de fallas reportadas por los alumnos. Se asocia con `aulas` y `categorias`.

---

## 📐 Diagrama de Relaciones (E-R)

```
[aulas] 1 ──── 0..* [Reportes] 0..* ──── 1 [categorias]
```

- **Relación Aulas-Reportes**: Si se elimina una aula (`ON DELETE CASCADE`), todos los reportes asociados a esa aula serán eliminados automáticamente.
- **Relación Categorías-Reportes**: Cada reporte está vinculado a una categoría válida (1: Aire Acondicionado, 2: Iluminación, etc.).

---

## 🛠️ Inicialización en Docker

Al arrancar los contenedores mediante Docker Compose, el archivo `schema.sql` es cargado y ejecutado automáticamente gracias al volumen configurado:

```yaml
volumes:
  - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
```

*Nota: La carpeta del volumen de persistencia para MySQL está gestionada por Docker en el volumen nombrado `db_data`.*
