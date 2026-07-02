import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Alert, Platform } from 'react-native';
import api from '../src/api/conexion'; // Tu configuración de Axios
import { useLocalSearchParams, router } from 'expo-router';

interface Reporte {
  id_reporte: number;
  descripcion: string;
  estado: string;
  fecha_reporte: string;
  reportado_por: string;
  edificio: string;
  id_aula: number;
  nombre_aula?: string;
  categoria: string;
}

// Diccionario de colores para los estados
const COLORES_ESTADO: Record<string, string> = {
  'pendiente': '#f97316',   // Naranja
  'en proceso': '#2563eb',  // Azul
  'resuelto': '#10b981',    // Verde
};

// Diccionario para convertir el ID de categoría a nombre legible
const CATEGORIAS_TEXTO: Record<string | number, string> = {
  1: 'Aire Acondicionado',
  2: 'Iluminación',
  3: 'Redes e Internet',
  4: 'Mobiliario',
};

export default function HistorialScreen() {
  const { usuario } = useLocalSearchParams(); // Correo del admin logueado
  
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [filtro, setFiltro] = useState<string>('activos'); // Pestaña de filtro seleccionada
  const [mostrarInfo, setMostrarInfo] = useState(false); // Diagnósticos

  // Obtener los reportes desde el backend
  const obtenerReportes = async () => {
    try {
      const respuesta = await api.get('/reportes');
      setReportes(respuesta.data);
    } catch (error) {
      console.error('Error al obtener los reportes:', error);
      Alert.alert('Fallo de Sincronización', 'No se pudieron recuperar los reportes de la base de datos de Docker.');
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  useEffect(() => {
    obtenerReportes();
  }, []);

  const alRefrescar = () => {
    setRefrescando(true);
    obtenerReportes();
  };

  // Cambiar el estado de un reporte
  const cambiarEstado = async (id_reporte: number, nuevoEstado: string) => {
    try {
      await api.put(`/reportes/${id_reporte}/estado`, { estado: nuevoEstado });
      
      // Actualizamos localmente
      setReportes((reportesAnteriores) => 
        reportesAnteriores.map((rep) => 
          rep.id_reporte === id_reporte ? { ...rep, estado: nuevoEstado } : rep
        )
      );
      
      if (Platform.OS === 'web') {
        window.alert(`Éxito\n\nEl reporte #${id_reporte} se actualizó a: ${nuevoEstado.toUpperCase()}`);
      } else {
        Alert.alert('Estado Actualizado', `El reporte #${id_reporte} ahora está como: ${nuevoEstado}.`);
      }
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      Alert.alert('Error', 'No se pudieron guardar los cambios en el servidor.');
    }
  };

  const obtenerColorEstado = (estado: string) => {
    const estadoNormalizado = estado?.toLowerCase() || '';
    return COLORES_ESTADO[estadoNormalizado] || '#64748b';
  };

  // Diseño de cada tarjeta de reporte
  const renderItem = ({ item }: { item: Reporte }) => {
    const colorEstado = obtenerColorEstado(item.estado);
    const nombreCategoria = CATEGORIAS_TEXTO[item.categoria] || `Otra falla (${item.categoria})`;

    return (
      <View style={[styles.tarjeta, { borderLeftColor: colorEstado }]}>
        <View style={styles.encabezadoTarjeta}>
          <View style={styles.categoriaBadge}>
            <Text style={styles.categoriaTxt}>🛠️ {nombreCategoria}</Text>
          </View>
          <Text style={[styles.estadoTxt, { color: colorEstado }]}>
            ● {item.estado?.toUpperCase() || 'PENDIENTE'}
          </Text>
        </View>

        <Text style={styles.ubicacionTxt}>
          📍 Edificio {item.edificio} - Aula {item.nombre_aula || item.id_aula}
        </Text>

        <View style={styles.seccionDetalle}>
          <Text style={styles.labelDetalle}>DESCRIPCIÓN DEL INCIDENTE</Text>
          <Text style={styles.descripcionTxt}>{item.descripcion}</Text>
        </View>

        <View style={styles.pieTarjeta}>
          <Text style={styles.usuarioTxt}>👤 Reporta: {item.reportado_por || 'Alumno'}</Text>
          <Text style={styles.fechaTxt}>
            📅 {new Date(item.fecha_reporte).toLocaleDateString()} {new Date(item.fecha_reporte).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {/* Controles de Mantenimiento */}
        <View style={styles.adminControles}>
          <Text style={styles.adminTitulo}>REASIGNAR ESTADO DE INCIDENCIA</Text>
          <View style={styles.botonesEstado}>
            <TouchableOpacity 
              style={[styles.btnEstado, styles.btnPendiente, item.estado === 'pendiente' && styles.btnPendienteActivo]}
              onPress={() => cambiarEstado(item.id_reporte, 'pendiente')}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnEstadoTxt, { color: '#c2410c' }]}>Pendiente</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.btnEstado, styles.btnProceso, item.estado === 'en proceso' && styles.btnProcesoActivo]}
              onPress={() => cambiarEstado(item.id_reporte, 'en proceso')}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnEstadoTxt, { color: '#1d4ed8' }]}>Proceso</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.btnEstado, styles.btnResuelto, item.estado === 'resuelto' && styles.btnResueltoActivo]}
              onPress={() => cambiarEstado(item.id_reporte, 'resuelto')}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnEstadoTxt, { color: '#047857' }]}>Resuelto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Estadísticas automáticas para el Dashboard
  const pendientes = reportes.filter(r => (r.estado || 'pendiente').toLowerCase() === 'pendiente').length;
  const enProceso = reportes.filter(r => (r.estado || '').toLowerCase() === 'en proceso').length;
  const resueltos = reportes.filter(r => (r.estado || '').toLowerCase() === 'resuelto').length;
  const activos = pendientes + enProceso;

  // Filtrar resueltos este mes para la gráfica
  const ahora = new Date();
  const resueltosEsteMes = reportes.filter(r => {
    const fecha = new Date(r.fecha_reporte);
    const esResuelto = (r.estado || '').toLowerCase() === 'resuelto';
    const mismoMes = fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
    return esResuelto && mismoMes;
  }).length;

  // Totales para la gráfica dinámica
  const totalGrafica = resueltosEsteMes + enProceso + pendientes;
  const maxValor = Math.max(resueltosEsteMes, enProceso, pendientes);

  // Filtro
  const reportesFiltrados = reportes.filter(r => {
    const estadoNormalizado = (r.estado || 'pendiente').toLowerCase();
    if (filtro === 'activos') return estadoNormalizado !== 'resuelto';
    return estadoNormalizado === filtro;
  });

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.cargandoTxt}>Cargando reportes del servidor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      
      {/* Cabecera superior */}
      <View style={styles.headerDashboard}>
        <TouchableOpacity style={styles.btnSalir} onPress={() => router.replace('/')}>
          <Text style={styles.txtBtnSalir}>← CERRAR CONSOLA</Text>
        </TouchableOpacity>
        <Text style={styles.subtituloCyber}>SISTEMA DE MANTENIMIENTO E INFRAESTRUCTURA</Text>
        <Text style={styles.titulo}>Consola de Control</Text>
      </View>

      {/* Tarjeta del Administrador Logueado */}
      <View style={styles.headerPanel}>
        <View style={styles.perfilInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.perfilAvatar}>👨‍💼</Text>
          </View>
          <View>
            <Text style={styles.perfilNombre}>Administrador Central</Text>
            <Text style={styles.perfilEmail}>{usuario || 'admin@upa.edu.mx'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setMostrarInfo(!mostrarInfo)} style={styles.btnInfo}>
          <Text style={styles.btnInfoTxt}>Diagnóstico</Text>
        </TouchableOpacity>
      </View>

      {/* Panel Diagnóstico */}
      {mostrarInfo && (
        <View style={styles.infoPanel}>
          <Text style={styles.infoTitulo}>🩺 Diagnóstico de Entorno</Text>
          <Text style={styles.infoTexto}>• Base de Datos: Docker Container Active (MySQL 8)</Text>
          <Text style={styles.infoTexto}>• API Endpoint: {api.defaults.baseURL}</Text>
          <Text style={styles.infoTexto}>• Carga de Base de Datos: {reportes.length} registros totales</Text>
        </View>
      )}

      {/* Pestañas de Filtro / Estadísticas */}
      <View style={styles.dashboardContainer}>
        <TouchableOpacity 
          style={[styles.cardStat, filtro === 'activos' ? styles.cardActiva : styles.cardInactiva, { borderLeftColor: '#ef4444' }]}
          onPress={() => setFiltro('activos')}
        >
          <Text style={[styles.statNumero, { color: '#dc2626' }]}>{activos}</Text>
          <Text style={styles.statLabel}>🚨 Prioridad</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.cardStat, filtro === 'pendiente' ? styles.cardActiva : styles.cardInactiva, { borderLeftColor: COLORES_ESTADO['pendiente'] }]}
          onPress={() => setFiltro('pendiente')}
        >
          <Text style={[styles.statNumero, { color: '#d97706' }]}>{pendientes}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.cardStat, filtro === 'en proceso' ? styles.cardActiva : styles.cardInactiva, { borderLeftColor: COLORES_ESTADO['en proceso'] }]}
          onPress={() => setFiltro('en proceso')}
        >
          <Text style={[styles.statNumero, { color: '#2563eb' }]}>{enProceso}</Text>
          <Text style={styles.statLabel}>En Proceso</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.cardStat, filtro === 'resuelto' ? styles.cardActiva : styles.cardInactiva, { borderLeftColor: COLORES_ESTADO['resuelto'] }]}
          onPress={() => setFiltro('resuelto')}
        >
          <Text style={[styles.statNumero, { color: '#059669' }]}>{resueltos}</Text>
          <Text style={styles.statLabel}>Resueltos</Text>
        </TouchableOpacity>
      </View>

      {/* SECCIÓN NUEVA: GRÁFICA DE RENDIMIENTO */}
      <View style={styles.graficaTarjeta}>
        <Text style={styles.graficaTitulo}>📊 Estado Mensual y Rendimiento</Text>
        
        {/* Gráfica de Barras Verticales */}
        <View style={styles.graficaContenedor}>
          
          {/* Barra 1: Resueltos este mes */}
          <View style={styles.graficaColumna}>
            <Text style={[styles.columnaValor, { color: '#10b981' }]}>{resueltosEsteMes}</Text>
            <View style={styles.columnaLineaBase}>
              <View 
                style={[
                  styles.columnaBarra, 
                  { 
                    height: totalGrafica > 0 ? (resueltosEsteMes / maxValor) * 90 : 2,
                    backgroundColor: '#10b981' 
                  }
                ]} 
              />
            </View>
            <Text style={styles.columnaEtiqueta}>Resueltos (Mes)</Text>
          </View>

          {/* Barra 2: En Proceso */}
          <View style={styles.graficaColumna}>
            <Text style={[styles.columnaValor, { color: '#2563eb' }]}>{enProceso}</Text>
            <View style={styles.columnaLineaBase}>
              <View 
                style={[
                  styles.columnaBarra, 
                  { 
                    height: totalGrafica > 0 ? (enProceso / maxValor) * 90 : 2,
                    backgroundColor: '#2563eb' 
                  }
                ]} 
              />
            </View>
            <Text style={styles.columnaEtiqueta}>En Proceso</Text>
          </View>

          {/* Barra 3: Pendientes */}
          <View style={styles.graficaColumna}>
            <Text style={[styles.columnaValor, { color: '#f97316' }]}>{pendientes}</Text>
            <View style={styles.columnaLineaBase}>
              <View 
                style={[
                  styles.columnaBarra, 
                  { 
                    height: totalGrafica > 0 ? (pendientes / maxValor) * 90 : 2,
                    backgroundColor: '#f97316' 
                  }
                ]} 
              />
            </View>
            <Text style={styles.columnaEtiqueta}>Pendientes</Text>
          </View>

        </View>

        {/* Barra Compartida Horizontal (Proporción Visual) */}
        <View style={styles.barraHorizontalContenedor}>
          {totalGrafica === 0 ? (
            <View style={[styles.segmentoBarra, { width: '100%', backgroundColor: '#e2e8f0' }]} />
          ) : (
            <>
              {resueltosEsteMes > 0 && (
                <View style={[styles.segmentoBarra, { width: `${(resueltosEsteMes / totalGrafica) * 100}%`, backgroundColor: '#10b981' }]} />
              )}
              {enProceso > 0 && (
                <View style={[styles.segmentoBarra, { width: `${(enProceso / totalGrafica) * 100}%`, backgroundColor: '#2563eb' }]} />
              )}
              {pendientes > 0 && (
                <View style={[styles.segmentoBarra, { width: `${(pendientes / totalGrafica) * 100}%`, backgroundColor: '#f97316' }]} />
              )}
            </>
          )}
        </View>
      </View>

      <Text style={styles.subtituloLista}>
        {filtro === 'activos' ? 'MOSTRANDO: REPORTES CON ATENCIÓN REQUERIDA' : 
         filtro === 'pendiente' ? 'MOSTRANDO: REPORTES PENDIENTES' :
         filtro === 'en proceso' ? 'MOSTRANDO: REPORTES EN PROCESO' :
         'MOSTRANDO: HISTORIAL DE INCIDENCIAS RESUELTAS'}
      </Text>

      {reportesFiltrados.length === 0 ? (
        <View style={styles.centroVacio}>
          <Text style={styles.vacioTxt}>No se encontraron reportes en esta categoría.</Text>
        </View>
      ) : (
        <FlatList
          data={reportesFiltrados}
          keyExtractor={(item) => item.id_reporte.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl refreshing={refrescando} onRefresh={alRefrescar} colors={['#2563eb']} tintColor="#2563eb" />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  headerDashboard: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1000,
  },
  btnSalir: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 15,
  },
  txtBtnSalir: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },
  subtituloCyber: {
    color: '#2563eb',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f8fafc',
  },
  centroVacio: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cargandoTxt: {
    marginTop: 12,
    color: '#2563eb',
    fontWeight: '700',
  },
  vacioTxt: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  headerPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    maxWidth: 1000,
    alignSelf: 'center',
    width: Platform.OS === 'web' ? '100%' : 'auto',
    ...Platform.select({
      web: {
        width: 'calc(100% - 40px)'
      }
    })
  },
  perfilInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  perfilAvatar: { fontSize: 22 },
  perfilNombre: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  perfilEmail: { fontSize: 12, color: '#475569', marginTop: 2 },
  btnInfo: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnInfoTxt: { color: '#1d4ed8', fontWeight: '700', fontSize: 12 },
  infoPanel: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    marginHorizontal: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0284c7',
    borderWidth: 1,
    borderColor: '#bae6fd',
    maxWidth: 1000,
    alignSelf: 'center',
    width: Platform.OS === 'web' ? '100%' : 'auto',
    ...Platform.select({
      web: {
        width: 'calc(100% - 40px)'
      }
    })
  },
  infoTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0369a1',
    marginBottom: 8,
  },
  infoTexto: { fontSize: 13.5, color: '#334155', marginBottom: 5 },
  dashboardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginBottom: 15,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1000,
  },
  cardStat: {
    flex: 1,
    minWidth: 105,
    margin: 5,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardActiva: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    transform: [{ scale: 1.01 }],
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }
    })
  },
  cardInactiva: {
    backgroundColor: '#f8fafc',
    opacity: 0.6,
  },
  subtituloLista: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 5,
    letterSpacing: 1,
  },
  statNumero: {
    fontSize: 26,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: '#475569',
    marginTop: 6,
    fontWeight: '700',
  },

  // ESTILOS DE LA NUEVA GRÁFICA DE RENDIMIENTO
  graficaTarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    maxWidth: 1000,
    alignSelf: 'center',
    width: Platform.OS === 'web' ? '100%' : 'auto',
    ...Platform.select({
      web: {
        width: 'calc(100% - 40px)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)'
      }
    })
  },
  graficaTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 20,
  },
  graficaContenedor: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: 20,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  graficaColumna: {
    alignItems: 'center',
    width: '30%',
  },
  columnaValor: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  columnaLineaBase: {
    height: 90,
    width: 24,
    justifyContent: 'flex-end',
  },
  columnaBarra: {
    width: '100%',
    borderRadius: 4,
  },
  columnaEtiqueta: {
    fontSize: 11,
    color: '#475569',
    marginTop: 8,
    fontWeight: '700',
    textAlign: 'center',
  },
  barraHorizontalContenedor: {
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
  },
  segmentoBarra: {
    height: '100%',
  },

  lista: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1000,
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
      },
      web: {
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.02)'
      }
    })
  },
  encabezadoTarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoriaBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoriaTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  estadoTxt: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ubicacionTxt: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 10,
  },
  seccionDetalle: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  labelDetalle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  descripcionTxt: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  pieTarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
    marginBottom: 16,
  },
  usuarioTxt: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '500',
  },
  fechaTxt: {
    fontSize: 11.5,
    color: '#64748b',
  },
  adminControles: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 14,
  },
  adminTitulo: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  botonesEstado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnEstado: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  btnEstadoTxt: {
    fontSize: 12,
    fontWeight: '700',
  },
  btnPendiente: {
    backgroundColor: '#fff7ed',
    borderColor: '#ffedd5',
  },
  btnPendienteActivo: {
    borderColor: '#f97316',
    backgroundColor: '#ffedd5',
  },
  btnProceso: {
    backgroundColor: '#eff6ff',
    borderColor: '#dbeafe',
  },
  btnProcesoActivo: {
    borderColor: '#2563eb',
    backgroundColor: '#dbeafe',
  },
  btnResuelto: {
    backgroundColor: '#ecfdf5',
    borderColor: '#d1fae5',
  },
  btnResueltoActivo: {
    borderColor: '#10b981',
    backgroundColor: '#d1fae5',
  },
});