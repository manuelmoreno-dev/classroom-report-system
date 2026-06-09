import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

// 1. Importamos nuestra configuración de Axios
import api from '../api/conexion'; 

const ReporteScreen = () => {
  const [matricula, setMatricula] = useState(''); 
  const [edificio, setEdificio] = useState('1');
  const [aula, setAula] = useState('');
  const [categoria, setCategoria] = useState(1);
  const [descripcion, setDescripcion] = useState('');

  const manejarEnvio = async () => {
  if (!matricula || !aula || !descripcion) {
    Alert.alert('Error', 'Por favor completa todos los campos (Matrícula, Aula y Descripción).');
    return;
    }

    // Limpiamos lo que escribió el usuario (quita espacios y ajusta letras)
    const aulaLimpia = aula.trim(); 

    const datosReporte = {
      matricula_usuario: matricula,
      edificio: edificio,
      aula: aulaLimpia, 
      id_categoria: categoria,
      descripcion: descripcion,
    };

    try {
      // 3. Enviamos los datos al backend usando POST
      const respuesta = await api.post('/reportes', datosReporte);
      
      console.log('Respuesta del servidor:', respuesta.data);
      
      // 4. Limpiamos el formulario para un nuevo reporte
      setMatricula('');
      setAula('');
      setDescripcion('');
      setEdificio('1');
      setCategoria(1);

      // 5. Redirigimos a la pantalla de éxito
      router.replace('/exito-reporte');

    } catch (error) {
      console.error('Error al enviar el reporte:', error);
      Alert.alert('Error de conexión', 'No se pudo comunicar con el servidor. Verifica tu IP y que Node.js esté corriendo.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}
    >
      <ScrollView 
        style={styles.contenedor} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>📝 Nuevo Reporte de Mantenimiento</Text>
        <Text style={styles.subtitulo}>Ayúdanos a mantener la universidad en excelentes condiciones detallando la falla a continuación.</Text>

        {/* SECCIÓN 1: DATOS DEL ALUMNO */}
        <View style={styles.tarjeta}>
          <Text style={styles.seccionTitulo}>👤 1. Datos del Solicitante</Text>
          <Text style={styles.label}>Matrícula:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. UP20460"
            placeholderTextColor="#999"
            value={matricula}
            onChangeText={setMatricula}
            maxLength={10}
          />
        </View>

        {/* SECCIÓN 2: UBICACIÓN */}
        <View style={styles.tarjeta}>
          <Text style={styles.seccionTitulo}>📍 2. Ubicación de la Falla</Text>
          <Text style={styles.label}>Edificio:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={edificio}
              onValueChange={(itemValue) => setEdificio(itemValue)}
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

          <Text style={styles.label}>Aula o Espacio (Ej. 101, LabA, Baños):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. LabA"
            placeholderTextColor="#999"
            value={aula}
            onChangeText={setAula}
          />
        </View>

        {/* SECCIÓN 3: DETALLES DEL PROBLEMA */}
        <View style={styles.tarjeta}>
          <Text style={styles.seccionTitulo}>🛠️ 3. Detalles del Problema</Text>
          <Text style={styles.label}>Tipo de Avería:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoria}
              onValueChange={(itemValue) => setCategoria(Number(itemValue))}
            >
              <Picker.Item label="Aire Acondicionado" value={1} />
              <Picker.Item label="Iluminación" value={2} />
              <Picker.Item label="Redes e Internet" value={3} />
              <Picker.Item label="Mobiliario" value={4} />
            </Picker>
          </View>

          <Text style={styles.label}>Descripción detallada:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe exactamente qué está fallando..."
            placeholderTextColor="#999"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline={true}
            numberOfLines={5}
          />
        </View>

        <TouchableOpacity style={styles.boton} onPress={manejarEnvio}>
          <Text style={styles.textoBoton}>Enviar Reporte 🚀</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ==========================================
// ESTILOS DE LA PANTALLA
// ==========================================
const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#eef2f5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Aumentado para que puedas desplazar el formulario hasta arriba
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600, // Ancho máximo del formulario
  },
  titulo: {
    fontSize: 22,
    fontWeight: '900',
    color: '#00529b',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 10,
  },
  subtitulo: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  tarjeta: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  boton: {
    backgroundColor: '#4caf50', // Verde de éxito
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  textoBoton: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReporteScreen;