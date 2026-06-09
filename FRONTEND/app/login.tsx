import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function LoginScreen() {
  // Recuperamos si el usuario eligió 'alumno' o 'admin'
  const { role } = useLocalSearchParams();
  const [verificando, setVerificando] = useState(false);

  const manejarLoginSimulado = () => {
    setVerificando(true);
    
    // Simulamos que el sistema está validando la cuenta con Google durante 1.5 segundos
    setTimeout(() => {
      setVerificando(false);
      
      // Función para redirigir según el rol
      const redirigir = () => {
        if (role === 'admin') {
          router.replace({ pathname: '/mantenimiento', params: { usuario: 'admin.mantenimiento@upa.edu.mx' } });
        } else {
          router.replace({ pathname: '/reportar', params: { usuario: 'alumno@upa.edu.mx' } });
        }
      };

      // Si estamos en la versión Web (Computadora del Admin)
      if (Platform.OS === 'web') {
        window.alert('Verificación Exitosa\n\nSe ha simulado el inicio de sesión con tu correo institucional (@upa.edu.mx).');
        redirigir();
      } else {
        // Si estamos en el celular (Alumnos)
        Alert.alert(
          'Verificación Exitosa',
          'Se ha simulado el inicio de sesión con tu correo institucional (@upa.edu.mx).',
          [{ text: 'Continuar', onPress: redirigir }],
          { cancelable: false }
        );
      }
    }, 1500);
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>
        Acceso de {role === 'admin' ? 'Administrador' : 'Alumno'}
      </Text>
      <Text style={styles.subtitulo}>
        Para continuar, verifica tu identidad usando tu correo institucional de la universidad.
      </Text>

      {verificando ? (
        <ActivityIndicator size="large" color="#DB4437" />
      ) : (
        <TouchableOpacity style={styles.botonGoogle} onPress={manejarLoginSimulado}>
          <Text style={styles.textoBoton}>🌐 Iniciar sesión con Google (Simulado)</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F5F5F5' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#00529b', marginBottom: 15, textAlign: 'center' },
  subtitulo: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40, paddingHorizontal: 10 },
  botonGoogle: {
    backgroundColor: '#DB4437', // Color característico de Google
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    elevation: 3,
  },
  textoBoton: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});