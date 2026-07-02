import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';

export default function ExitoReporteScreen() {
  return (
    <View style={styles.contenedor}>
      <View style={styles.contenidoCard}>
        <View style={styles.checkContainer}>
          <Text style={styles.icono}>✓</Text>
        </View>

        <Text style={styles.estadoLabel}>ENVÍO COMPLETADO</Text>
        <Text style={styles.titulo}>¡Reporte Registrado!</Text>
        
        <Text style={styles.subtitulo}>
          El reporte ha sido enviado exitosamente a la base de datos de soporte. 
          El personal del departamento de mantenimiento revisará el problema a la brevedad.
        </Text>

        <TouchableOpacity 
          style={styles.boton} 
          onPress={() => router.replace('/')}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBoton}>Volver al Menú Principal</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.footer}>Universidad Politécnica de Aguascalientes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  contenidoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)'
      }
    })
  },
  checkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ecfdf5', // Fondo verde claro suave
    borderWidth: 2,
    borderColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icono: {
    fontSize: 40,
    color: '#10b981',
    fontWeight: 'bold',
  },
  estadoLabel: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  boton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBoton: { 
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