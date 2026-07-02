import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from 'expo-router';

// Importamos nuestra configuración de Axios
import api from '../api/conexion'; 

const ReporteScreen = () => {
  const { usuario } = useLocalSearchParams();

  // Extrae automáticamente la matrícula del correo institucional. Si es el correo genérico 'alumno', lo deja vacío.
  const prefijoCorreo = usuario ? (usuario as string).split('@')[0] : '';
  const matriculaInicial = prefijoCorreo.toLowerCase() !== 'alumno' ? prefijoCorreo.toUpperCase() : '';

  const [matricula, setMatricula] = useState(matriculaInicial); 
  const [edificio, setEdificio] = useState('1');
  const [aula, setAula] = useState('');
  const [categoria, setCategoria] = useState(1);
  const [descripcion, setDescripcion] = useState('');

  // Estados para controlar el foco en los inputs
  const [focoMatricula, setFocoMatricula] = useState(false);
  const [focoAula, setFocoAula] = useState(false);
  const [focoDesc, setFocoDesc] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const manejarEnvio = async () => {
    if (!matricula || !aula || !descripcion) {
      Alert.alert('Campos Incompletos', 'Por favor completa todos los campos obligatorios (Matrícula, Aula y Descripción).');
      return;
    }

    const aulaLimpia = aula.trim(); 
    setEnviando(true);

    const datosReporte = {
      matricula_usuario: matricula.toUpperCase(),
      edificio: edificio,
      aula: aulaLimpia, 
      id_categoria: categoria,
      descripcion: descripcion,
    };

    try {
      // Enviamos los datos al backend
      const respuesta = await api.post('/reportes', datosReporte);
      console.log('Respuesta del servidor:', respuesta.data);
      
      // Limpiamos el formulario
      setMatricula(usuario ? matriculaInicial : '');
      setAula('');
      setDescripcion('');
      setEdificio('1');
      setCategoria(1);

      // Redirigimos a la pantalla de éxito
      router.replace('/exito-reporte');
    } catch (error) {
      console.error('Error al enviar el reporte:', error);
      Alert.alert(
        'Fallo de Conexión', 
        'No se pudo conectar al servidor. Asegúrate de que el entorno Docker esté corriendo.'
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#f8fafc' }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}
    >
      <ScrollView 
        style={styles.contenedor} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabecera superior */}
        <View style={styles.cabecera}>
          <TouchableOpacity style={styles.btnSalir} onPress={() => router.replace('/')}>
            <Text style={styles.txtBtnSalir}>← SALIR AL MENÚ</Text>
          </TouchableOpacity>
          <Text style={styles.subtituloCyber}>PORTAL DE REPORTES UPA</Text>
          <Text style={styles.titulo}>Nuevo Reporte de Falla</Text>
        </View>

        {/* SECCIÓN 1: DATOS DEL ALUMNO */}
        <View style={styles.tarjeta}>
          <Text style={styles.seccionTitulo}>👤 1. Identificación</Text>
          <Text style={styles.label}>Matrícula del solicitante:</Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: focoMatricula ? '#2563eb' : '#cbd5e1' }
            ]}
            placeholder="Ej. UP20460"
            placeholderTextColor="#94a3b8"
            value={matricula}
            onChangeText={setMatricula}
            maxLength={10}
            autoCapitalize="characters"
            onFocus={() => setFocoMatricula(true)}
            onBlur={() => setFocoMatricula(false)}
          />
        </View>

        {/* SECCIÓN 2: UBICACIÓN */}
        <View style={styles.tarjeta}>
          <Text style={styles.seccionTitulo}>📍 2. Ubicación de la falla</Text>
          <Text style={styles.label}>Edificio:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={edificio}
              onValueChange={(itemValue) => setEdificio(itemValue)}
              style={styles.picker}
              dropdownIconColor="#475569"
            >
              <Picker.Item label="Edificio 1" value="1" />
              <Picker.Item label="Edificio 2" value="2" />
              <Picker.Item label="Edificio 3" value="3" />
              <Picker.Item label="Edificio 4" value="4" />
              <Picker.Item label="Edificio 5" value="5" />
              <Picker.Item label="Edificio 6" value="6" />
              <Picker.Item label="Edificio 7" value="7" />
            </Picker>
          </View>

          <Text style={styles.label}>Aula o Espacio (Ej. 101, Lab A, Baños):</Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: focoAula ? '#2563eb' : '#cbd5e1' }
            ]}
            placeholder="Ej. 101"
            placeholderTextColor="#94a3b8"
            value={aula}
            onChangeText={setAula}
            onFocus={() => setFocoAula(true)}
            onBlur={() => setFocoAula(false)}
          />
        </View>

        {/* SECCIÓN 3: DETALLES DEL PROBLEMA */}
        <View style={styles.tarjeta}>
          <Text style={styles.seccionTitulo}>🛠️ 3. Detalles de la avería</Text>
          <Text style={styles.label}>Categoría del problema:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoria}
              onValueChange={(itemValue) => setCategoria(Number(itemValue))}
              style={styles.picker}
              dropdownIconColor="#475569"
            >
              <Picker.Item label="Aire Acondicionado" value={1} />
              <Picker.Item label="Iluminación" value={2} />
              <Picker.Item label="Redes e Internet" value={3} />
              <Picker.Item label="Mobiliario" value={4} />
            </Picker>
          </View>

          <Text style={styles.label}>Descripción de la falla:</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              { borderColor: focoDesc ? '#2563eb' : '#cbd5e1' }
            ]}
            placeholder="Describe brevemente qué falla o avería se presenta..."
            placeholderTextColor="#94a3b8"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline={true}
            numberOfLines={5}
            onFocus={() => setFocoDesc(true)}
            onBlur={() => setFocoDesc(false)}
          />
        </View>

        {/* Botón de Enviar */}
        {enviando ? (
          <View style={styles.cargandoContainer}>
            <Text style={styles.cargandoTexto}>Enviando reporte...</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.boton} onPress={manejarEnvio} activeOpacity={0.8}>
            <Text style={styles.textoBoton}>Enviar Reporte de Mantenimiento</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 80,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600,
  },
  cabecera: {
    marginBottom: 20,
  },
  btnSalir: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
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
  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
  seccionTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
  },
  label: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 15,
    ...Platform.select({
      web: {
        outlineStyle: 'none'
      }
    })
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    marginBottom: 18,
    overflow: 'hidden',
  },
  picker: {
    color: '#0f172a',
    height: Platform.OS === 'ios' ? 120 : 50,
  },
  boton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBoton: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  cargandoContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  cargandoTexto: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '700',
  }
});

export default ReporteScreen;