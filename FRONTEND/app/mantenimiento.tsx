import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import api from '../src/api/conexion'; // Tu configuración de Axios con la IP de tu compu
import { useLocalSearchParams } from 'expo-router';

// Definimos la estructura de un reporte según lo que regresa tu Backend
interface Reporte {
  id_reporte: number;
  descripcion: string;
  estado: string;
  fecha_reporte: string;
  reportado_por: string;
  edificio: string;
  id_aula: number; // o nombre_aula si ajustaste el JOIN en el backend
  nombre_aula?: string;
  categoria: string;
}

// Diccionario de colores para los estados (fuera del componente para evitar recrearlo)
const COLORES_ESTADO: Record<string, string> = {
  'pendiente': '#ff9800',
  'en proceso': '#2196f3',
  'resuelto': '#4caf50',
};

// Diccionario para convertir el ID de categoría a nombre legible
const CATEGORIAS_TEXTO: Record<string | number, string> = {
  1: 'Aire Acondicionado',
  2: 'Iluminación',
  3: 'Redes e Internet',
  4: 'Mobiliario',
};

export default function HistorialScreen() {
  const { usuario } = useLocalSearchParams(); // Obtenemos el correo del usuario logueado
  
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [filtro, setFiltro] = useState<string>('activos'); // Estado para controlar qué sección del menú se ve
  const [mostrarInfo, setMostrarInfo] = useState(false); // Estado para el panel extra

  // Función para obtener los reportes desde el backend
  const obtenerReportes = async () => {
    try {
      const respuesta = await api.get('/reportes');
      setReportes(respuesta.data);
    } catch (error) {
      console.error('Error al obtener los reportes:', error);
      Alert.alert('Error', 'No se pudieron cargar los reportes de mantenimiento.');
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  useEffect(() => {
    obtenerReportes();
  }, []);

  // Función para arrastrar hacia abajo y actualizar la lista
  const alRefrescar = () => {
    setRefrescando(true);
    obtenerReportes();
  };

  // Función para darle color al texto según el estado del reporte
  const obtenerColorEstado = (estado: string) => {
    const estadoNormalizado = estado?.toLowerCase() || '';
    return COLORES_ESTADO[estadoNormalizado] || '#757575';
  };

  // Función para cambiar el estado enviándolo al backend
  const cambiarEstado = async (id_reporte: number, nuevoEstado: string) => {
    try {
      await api.put(`/reportes/${id_reporte}/estado`, { estado: nuevoEstado });
      
      // Actualizamos la lista localmente sin necesidad de recargarla de internet
      setReportes((reportesAnteriores) => 
        reportesAnteriores.map((rep) => 
          rep.id_reporte === id_reporte ? { ...rep, estado: nuevoEstado } : rep
        )
      );
      Alert.alert('Éxito', `El estado se actualizó a: ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado del reporte.');
    }
  };

  // Diseño de cada tarjeta de reporte
  const renderItem = ({ item }: { item: Reporte }) => (
    <View style={styles.tarjeta}>
      <View style={styles.encabezadoTarjeta}>
        <Text style={styles.categoriaTxt}>
          🛠️ {CATEGORIAS_TEXTO[item.categoria] || `Otra falla (${item.categoria})`}
        </Text>
        <Text style={[styles.estadoTxt, { color: obtenerColorEstado(item.estado) }]}>
          {item.estado || 'Pendiente'}
        </Text>
      </View>

      <Text style={styles.ubicacionTxt}>
  📍 Edificio {item.edificio} - Aula {item.nombre_aula || item.id_aula}
</Text>

      <View style={styles.seccionDetalle}>
        <Text style={styles.labelDetalle}>Descripción completa:</Text>
        <Text style={styles.descripcionTxt}>{item.descripcion}</Text>
      </View>

      <View style={styles.pieTarjeta}>
        <Text style={styles.usuarioTxt}>👤 Alumno: {item.reportado_por || 'Usuario'}</Text>
        <Text style={styles.fechaTxt}>
          📅 {new Date(item.fecha_reporte).toLocaleDateString()} {new Date(item.fecha_reporte).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      {/* Controles de Administrador */}
      <View style={styles.adminControles}>
        <Text style={styles.adminTitulo}>Cambiar estado (Admin):</Text>
        <View style={styles.botonesEstado}>
          <TouchableOpacity 
            style={[styles.btnEstado, { backgroundColor: COLORES_ESTADO['pendiente'] }]}
            onPress={() => cambiarEstado(item.id_reporte, 'pendiente')}
          >
            <Text style={styles.btnEstadoTxt}>Pendiente</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btnEstado, { backgroundColor: COLORES_ESTADO['en proceso'] }]}
            onPress={() => cambiarEstado(item.id_reporte, 'en proceso')}
          >
            <Text style={styles.btnEstadoTxt}>En Proceso</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btnEstado, { backgroundColor: COLORES_ESTADO['resuelto'] }]}
            onPress={() => cambiarEstado(item.id_reporte, 'resuelto')}
          >
            <Text style={styles.btnEstadoTxt}>Resuelto</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Cálculos automáticos para el Dashboard
  const pendientes = reportes.filter(r => (r.estado || 'pendiente').toLowerCase() === 'pendiente').length;
  const enProceso = reportes.filter(r => (r.estado || '').toLowerCase() === 'en proceso').length;
  const resueltos = reportes.filter(r => (r.estado || '').toLowerCase() === 'resuelto').length;
  const activos = pendientes + enProceso; // Total de los que requieren atención

  // Filtramos la lista dependiendo del menú seleccionado
  const reportesFiltrados = reportes.filter(r => {
    const estadoNormalizado = (r.estado || 'pendiente').toLowerCase();
    // Si estamos en la pestaña principal, mostramos todo menos los resueltos
    if (filtro === 'activos') return estadoNormalizado !== 'resuelto';
    return estadoNormalizado === filtro;
  });

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#00529b" />
        <Text style={styles.cargandoTxt}>Cargando reportes de la UPA...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Panel de Reportes</Text>
      
      {/* Encabezado del Perfil y Botón de Información */}
      <View style={styles.headerPanel}>
        <View style={styles.perfilInfo}>
          <Text style={styles.perfilAvatar}>👨‍💼</Text>
          <View>
            <Text style={styles.perfilNombre}>Administrador de Sistema</Text>
            <Text style={styles.perfilEmail}>{usuario || 'admin@upa.edu.mx'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setMostrarInfo(!mostrarInfo)} style={styles.btnInfo}>
          <Text style={styles.btnInfoTxt}>ℹ️ Info Sistema</Text>
        </TouchableOpacity>
      </View>

      {/* Panel de Información Desplegable */}
      {mostrarInfo && (
        <View style={styles.infoPanel}>
          <Text style={styles.infoTitulo}>Acerca del Sistema de Mantenimiento</Text>
          <Text style={styles.infoTexto}>• Base de Datos: Conectada (MySQL Activo)</Text>
          <Text style={styles.infoTexto}>• Servidor: {api.defaults.baseURL || 'Localhost'}</Text>
          <Text style={styles.infoTexto}>• Los reportes con estado "Resuelto" se guardan automáticamente en el historial.</Text>
        </View>
      )}

      {/* Dashboard Resumen como Menú Interactivo */}
      <View style={styles.dashboardContainer}>
        <TouchableOpacity 
          style={[styles.cardStat, filtro === 'activos' ? styles.cardActiva : styles.cardInactiva, { borderLeftColor: '#e91e63' }]}
          onPress={() => setFiltro('activos')}
        >
          <Text style={styles.statNumero}>{activos}</Text>
          <Text style={styles.statLabel}>🚨 Prioridad</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.cardStat, filtro === 'pendiente' ? styles.cardActiva : styles.cardInactiva, { borderLeftColor: COLORES_ESTADO['pendiente'] }]}
          onPress={() => setFiltro('pendiente')}
        >
          <Text style={styles.statNumero}>{pendientes}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.cardStat, filtro === 'en proceso' ? styles.cardActiva : styles.cardInactiva, { borderLeftColor: COLORES_ESTADO['en proceso'] }]}
          onPress={() => setFiltro('en proceso')}
        >
          <Text style={styles.statNumero}>{enProceso}</Text>
          <Text style={styles.statLabel}>En Proceso</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.cardStat, filtro === 'resuelto' ? styles.cardActiva : styles.cardInactiva, { borderLeftColor: COLORES_ESTADO['resuelto'] }]}
          onPress={() => setFiltro('resuelto')}
        >
          <Text style={styles.statNumero}>{resueltos}</Text>
          <Text style={styles.statLabel}>✅ Resueltos</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtituloLista}>
        {filtro === 'activos' ? 'Mostrando: Reportes que requieren atención' : 
         filtro === 'pendiente' ? 'Mostrando: Reportes pendientes' :
         filtro === 'en proceso' ? 'Mostrando: Reportes en proceso' :
         'Mostrando: Historial de reportes resueltos'}
      </Text>

      {reportesFiltrados.length === 0 ? (
        <View style={styles.centro}>
          <Text style={styles.vacioTxt}>No hay reportes en esta categoría. ¡Todo en orden!</Text>
        </View>
      ) : (
        <FlatList
          data={reportesFiltrados}
          keyExtractor={(item) => item.id_reporte.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl refreshing={refrescando} onRefresh={alRefrescar} colors={['#00529b']} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#eef2f5',
    paddingTop: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00529b',
    textAlign: 'center',
    marginBottom: 15,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cargandoTxt: {
    marginTop: 10,
    color: '#666',
  },
  vacioTxt: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  headerPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  perfilInfo: { flexDirection: 'row', alignItems: 'center' },
  perfilAvatar: { fontSize: 32, marginRight: 12 },
  perfilNombre: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  perfilEmail: { fontSize: 13, color: '#666' },
  btnInfo: {
    backgroundColor: '#e1f5fe',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnInfoTxt: { color: '#00529b', fontWeight: 'bold', fontSize: 13 },
  infoPanel: {
    backgroundColor: '#e8f4f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#00529b',
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  infoTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00529b',
    marginBottom: 8,
  },
  infoTexto: { fontSize: 13, color: '#444', marginBottom: 4 },

  dashboardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 10,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1000,
  },
  cardStat: {
    flex: 1,
    minWidth: 120, // Si la pantalla es pequeña (celular) se apilan, si es grande (PC) se alinean.
    margin: 5,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardActiva: {
    backgroundColor: '#ffffff',
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.2,
    elevation: 4,
  },
  cardInactiva: {
    backgroundColor: '#f2f2f2',
    opacity: 0.65,
    elevation: 1,
    shadowOpacity: 0.05,
  },
  subtituloLista: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 5,
  },
  statNumero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    fontWeight: '500',
  },
  lista: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1000, // Limita el ancho en computadoras
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  encabezadoTarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoriaTxt: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#e1f5fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  estadoTxt: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  ubicacionTxt: {
    fontSize: 15,
    fontWeight: '600',
    color: '#00529b',
    marginBottom: 6,
  },
  seccionDetalle: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  labelDetalle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  descripcionTxt: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  pieTarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  usuarioTxt: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
  },
  fechaTxt: {
    fontSize: 12,
    color: '#999',
  },
  adminControles: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  adminTitulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  botonesEstado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnEstado: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 3,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnEstadoTxt: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});