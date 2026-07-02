import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { router } from 'expo-router';

export default function Index() {
  return (
    <View style={styles.contenedor}>
      <View style={styles.contenido}>
        
        {/* Cabecera Principal */}
        <View style={styles.cabeceraContainer}>
          <Text style={styles.organizacion}>SISTEMA ESCOLAR / UNIVERSITARIO</Text>
          <Text style={styles.titulo}>Sistema de Reportes</Text>
          <Text style={styles.subtitulo}>Mantenimiento e Infraestructura</Text>
          <View style={styles.divisor} />
        </View>

        <Text style={styles.instrucciones}>Selecciona tu perfil de acceso para ingresar al portal:</Text>

        {/* Tarjeta de Alumno */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push({ pathname: '/login', params: { role: 'alumno' } })}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconoContainer, styles.iconoAlumno]}>
              <Text style={styles.iconoText}>📱</Text>
            </View>
            <View style={styles.cardHeaderInfo}>
              <Text style={styles.cardTitulo}>Portal de Alumnos</Text>
              <Text style={styles.cardRolLabel}>Estudiantes y Personal</Text>
            </View>
          </View>
          <Text style={styles.cardDescripcion}>
            Registrar fallas en iluminación, mobiliario, redes o aire acondicionado directamente desde el aula.
          </Text>
          <View style={[styles.botonAcceso, styles.botonAccesoAlumno]}>
            <Text style={styles.textoBotonAcceso}>Crear Nuevo Reporte</Text>
          </View>
        </TouchableOpacity>

        {/* Tarjeta de Administrador */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push({ pathname: '/login', params: { role: 'admin' } })}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconoContainer, styles.iconoAdmin]}>
              <Text style={styles.iconoText}>💻</Text>
            </View>
            <View style={styles.cardHeaderInfo}>
              <Text style={styles.cardTitulo}>Portal de Mantenimiento</Text>
              <Text style={styles.cardRolLabel}>Área Administrativa</Text>
            </View>
          </View>
          <Text style={styles.cardDescripcion}>
            Monitorear incidentes, reasignar estados de trabajo y consultar estadísticas del catálogo de aulas.
          </Text>
          <View style={[styles.botonAcceso, styles.botonAccesoAdmin]}>
            <Text style={styles.textoBotonAcceso}>Ingresar como Administrador</Text>
          </View>
        </TouchableOpacity>

      </View>

      <Text style={styles.footer}>© 2026 Portal de Mantenimiento Escolar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f8fafc', // Fondo gris claro muy limpio (Stripe style)
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  contenido: {
    width: '100%',
    maxWidth: 440,
  },
  cabeceraContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  organizacion: {
    color: '#64748b', // Gris medio de alto contraste
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  titulo: {
    color: '#0f172a', // Pizarra muy oscuro (excelente contraste)
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitulo: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  divisor: {
    width: 60,
    height: 4,
    backgroundColor: '#2563eb', // Azul institucional limpio
    marginTop: 16,
    borderRadius: 2,
  },
  instrucciones: {
    color: '#475569',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '500',
  },
  // Tarjetas Blancas elegantes
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0', // Borde gris claro muy fino
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)'
      }
    })
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconoContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconoAlumno: {
    backgroundColor: '#eff6ff', // Azul claro
  },
  iconoAdmin: {
    backgroundColor: '#f8fafc', // Gris azulado
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconoText: {
    fontSize: 22,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  cardTitulo: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  cardRolLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  cardDescripcion: {
    color: '#475569',
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 18,
  },
  botonAcceso: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonAccesoAlumno: {
    backgroundColor: '#2563eb', // Azul principal para Alumnos
  },
  botonAccesoAdmin: {
    backgroundColor: '#0f172a', // Gris oscuro formal para Admin
  },
  textoBotonAcceso: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
  }
});