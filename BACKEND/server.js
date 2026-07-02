require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite recibir datos en formato JSON desde React Native

// Configuración de la conexión a la base de datos
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

// ==========================================
// ENDPOINTS (Rutas de la API)
// ==========================================

app.post('/api/reportes', async (req, res) => {
    // 1. Recibimos los datos del celular
    const { matricula_usuario, edificio, aula, id_categoria, descripcion } = req.body;

    // Inicializamos la variable de conexión afuera del try para poder cerrarla en el catch si algo truena
    let connection;

    try {
        // Creamos la conexión usando tu configuración dbConfig
        connection = await mysql.createConnection(dbConfig);

        // 2. Buscamos si ya existe el salón en ese edificio usando 'connection.execute'
        const [existe] = await connection.execute(
            'SELECT id_aula FROM aulas WHERE edificio = ? AND nombre_aula = ?', 
            [edificio, aula.trim()]
        );

        let id_aula_final;

        if (existe.length > 0) {
            // Si ya existe, tomamos su ID numérico
            id_aula_final = existe[0].id_aula;
        } else {
            // Si es nuevo, lo creamos en el catálogo de aulas
            const [resultadoInsert] = await connection.execute(
                'INSERT INTO aulas (edificio, nombre_aula) VALUES (?, ?)', 
                [edificio, aula.trim()]
            );
            // Tomamos el ID autoincrementable asignado por MySQL
            id_aula_final = resultadoInsert.insertId;
        }

        // 3. Insertamos el reporte usando el id_aula_final (INT limpio)
        await connection.execute(
            'INSERT INTO Reportes (matricula_usuario, id_aula, id_categoria, descripcion) VALUES (?, ?, ?, ?)', 
            [matricula_usuario, id_aula_final, id_categoria, descripcion]
        );

        // Cerramos la conexión con éxito antes de responder
        await connection.end();
        
        res.status(200).json({ mensaje: "Reporte creado exitosamente." });

    } catch (error) {
        console.error("Error al crear el reporte:", error);
        
        // Si la conexión alcanzó a abrirse pero algo falló después, la cerramos de todos modos
        if (connection) await connection.end();
        
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.get('/api/reportes', async (req, res) => {
    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);

        // Traemos los reportes uniéndolos con la tabla de aulas para tener el edificio y nombre de aula
        const [reportes] = await connection.execute(`
            SELECT 
                r.id_reporte,
                r.descripcion,
                IFNULL(r.estado, 'pendiente') AS estado,
                r.fecha_reporte,
                r.matricula_usuario AS reportado_por,
                a.edificio,
                r.id_aula,
                a.nombre_aula,
                r.id_categoria AS categoria
            FROM Reportes r
            LEFT JOIN aulas a ON r.id_aula = a.id_aula
            ORDER BY r.id_reporte DESC
        `);

        await connection.end();
        
        res.status(200).json(reportes);
    } catch (error) {
        console.error("Error al obtener el historial de reportes:", error);
        
        if (connection) await connection.end();
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta para actualizar el estado de un reporte
app.put('/api/reportes/:id/estado', async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        await connection.execute(
            'UPDATE Reportes SET estado = ? WHERE id_reporte = ?',
            [estado, id]
        );

        await connection.end();
        res.status(200).json({ mensaje: "Estado actualizado exitosamente." });
    } catch (error) {
        console.error("Error al actualizar el estado:", error);
        if (connection) await connection.end();
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// ==========================================
// INICIAR EL SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});