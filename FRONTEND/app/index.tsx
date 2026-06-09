import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Index() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Sistema de Mantenimiento UPA</Text>
      <Text style={styles.subtitulo}>Selecciona tu perfil de acceso:</Text>

      <TouchableOpacity 
        style={styles.botonAlumno}
        onPress={() => router.push({ pathname: '/login', params: { role: 'alumno' } })}
      >
        <Text style={styles.textoBoton}>📱 Interfaz de Alumno</Text>
        <Text style={styles.textoDes}>Crear reportes desde la aplicación</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.botonAdmin}
        onPress={() => router.push({ pathname: '/login', params: { role: 'admin' } })}
      >
        <Text style={styles.textoBoton}>💻 Interfaz de Administrador</Text>
        <Text style={styles.textoDes}>Gestionar reportes desde la computadora</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00529b',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  botonAlumno: {
    backgroundColor: '#4caf50',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  botonAdmin: {
    backgroundColor: '#0056b3',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textoDes: {
    color: '#E0E0E0',
    fontSize: 14,
  }
});