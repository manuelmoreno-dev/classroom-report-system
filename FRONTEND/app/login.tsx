import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function LoginScreen() {
  const { role } = useLocalSearchParams();
  const [correo, setCorreo] = useState('');
  const [verificando, setVerificando] = useState(false);
  const [estaEnfocado, setEstaEnfocado] = useState(false);

  // Definimos las cuentas de prueba sugeridas según el rol
  const correoSugerido = role === 'admin' ? 'admin@upa.edu.mx' : 'alumno@upa.edu.mx';
  
  const autocompletarPrueba = () => {
    setCorreo(correoSugerido);
  };

  const manejarLogin = () => {
    const correoLimpio = correo.trim().toLowerCase();

    if (!correoLimpio) {
      Alert.alert('Datos requeridos', 'Por favor ingresa tu correo electrónico institucional para acceder.');
      return;
    }

    if (!correoLimpio.endsWith('@upa.edu.mx')) {
      Alert.alert('Acceso Restringido', 'Debes utilizar un correo institucional válido con terminación @upa.edu.mx.');
      return;
    }

    setVerificando(true);

    setTimeout(() => {
      setVerificando(false);
      
      const redirigir = () => {
        if (role === 'admin') {
          router.replace({ pathname: '/mantenimiento', params: { usuario: correoLimpio } });
        } else {
          router.replace({ pathname: '/reportar', params: { usuario: correoLimpio } });
        }
      };

      if (Platform.OS === 'web') {
        window.alert(`Verificación Exitosa\n\nIdentidad confirmada: ${correoLimpio}`);
        redirigir();
      } else {
        Alert.alert(
          'Verificación Exitosa',
          `Sesión iniciada correctamente como:\n${correoLimpio}`,
          [{ text: 'Acceder al Portal', onPress: redirigir }],
          { cancelable: false }
        );
      }
    }, 1000);
  };

  // Colores de acento según el rol
  const colorAcento = role === 'admin' ? '#0f172a' : '#2563eb';
  const colorFondoBoton = role === 'admin' ? '#0f172a' : '#2563eb';

  return (
    <View style={styles.contenedor}>
      <View style={styles.contenido}>
        
        {/* Botón Regresar */}
        <TouchableOpacity style={styles.botonAtras} onPress={() => router.back()}>
          <Text style={styles.textoBotonAtras}>← REGRESAR AL MENÚ</Text>
        </TouchableOpacity>

        {/* Cabecera */}
        <View style={styles.cabeceraContainer}>
          <Text style={[styles.rolLabel, { color: colorAcento }]}>
            PERFIL: {role === 'admin' ? 'ADMINISTRADOR' : 'ALUMNO / PERSONAL'}
          </Text>
          <Text style={styles.titulo}>Iniciar Sesión</Text>
          <Text style={styles.descripcion}>
            Valida tu identidad ingresando tu correo institucional para ingresar al sistema de reportes.
          </Text>
        </View>

        {/* Tarjeta de Formulario */}
        <View style={styles.loginCard}>
          <Text style={styles.inputLabel}>CORREO ELECTRÓNICO INSTITUCIONAL</Text>
          
          <TextInput
            style={[
              styles.input,
              { borderColor: estaEnfocado ? colorAcento : '#cbd5e1' }
            ]}
            placeholder="ejemplo@upa.edu.mx"
            placeholderTextColor="#94a3b8"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setEstaEnfocado(true)}
            onBlur={() => setEstaEnfocado(false)}
          />

          {/* Sugerencia de Cuenta de Prueba */}
          <View style={styles.sugerenciaContainer}>
            <Text style={styles.sugerenciaLabel}>Cuenta de prueba para este perfil:</Text>
            <TouchableOpacity 
              style={[styles.badgePrueba, { borderColor: colorAcento }]} 
              onPress={autocompletarPrueba}
              activeOpacity={0.7}
            >
              <Text style={[styles.textoBadge, { color: colorAcento }]}>
                {correoSugerido} ⚡
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botón de Acceso */}
          {verificando ? (
            <View style={styles.cargandoContainer}>
              <ActivityIndicator size="small" color={colorAcento} />
              <Text style={[styles.textoCargando, { color: colorAcento }]}>Confirmando credenciales...</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.botonAcceso, { backgroundColor: colorFondoBoton }]} 
              onPress={manejarLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.textoBotonAcceso}>Confirmar e Ingresar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <Text style={styles.footer}>Universidad Politécnica de Aguascalientes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  contenido: {
    width: '100%',
    maxWidth: 400,
  },
  botonAtras: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textoBotonAtras: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cabeceraContainer: {
    marginBottom: 25,
  },
  rolLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  titulo: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  descripcion: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  loginCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
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
  inputLabel: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1.5,
    color: '#0f172a',
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    ...Platform.select({
      web: {
        outlineStyle: 'none'
      }
    })
  },
  sugerenciaContainer: {
    marginBottom: 24,
  },
  sugerenciaLabel: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '500',
  },
  badgePrueba: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  textoBadge: {
    fontSize: 13,
    fontWeight: '700',
  },
  botonAcceso: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotonAcceso: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  cargandoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  textoCargando: {
    marginLeft: 12,
    fontSize: 13,
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