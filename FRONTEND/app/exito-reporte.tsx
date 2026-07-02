import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function ExitoReporteScreen() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.icono}>✅</Text>
      <Text style={styles.titulo}>¡Reporte Enviado!</Text>
      <Text style={styles.subtitulo}>
        Tu reporte ha sido enviado correctamente al departamento de mantenimiento. 
        Gracias por ayudarnos a mantener la universidad en excelentes condiciones.
      </Text>

      <TouchableOpacity style={styles.boton} onPress={() => router.replace('/')}>
        <Text style={styles.textoBoton}>Salir al Menú Principal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eef2f5',
    padding: 30,
  },
  icono: {
    fontSize: 80,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00529b',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  boton: {
    backgroundColor: '#4caf50', // Verde de éxito
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  textoBoton: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});