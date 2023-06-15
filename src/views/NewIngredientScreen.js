import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import styles from '../styles/styles';
import { agregarIngrediente } from '../controllers/IngredientController';

const NewIngredientScreen = ({ handleAgregarIngrediente, closeModal }) => {
  const [nombre, setNombre] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [tamanoPaquete, setTamanoPaquete] = useState('');
  const [costo, setCosto] = useState('');
  const [stock, setStock] = useState('');

  const handleAgregar = () => {
    const ingredientData = {
      nombre,
      unidad_Medida: unidadMedida,
      tamano_Paquete: tamanoPaquete,
      costo,
      CantidadStock: stock,
    };

    agregarIngrediente(ingredientData)
      .then(() => {
        console.log('Ingrediente guardado exitosamente');
        // Realizar acciones adicionales después de guardar el ingrediente, si es necesario
      })
      .catch((error) => {
        console.error('Error al agregar el ingrediente:', error);
        // Manejar el error de acuerdo a tus necesidades
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Ingrediente</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Unidad de Medida"
        value={unidadMedida}
        onChangeText={setUnidadMedida}
      />
      <TextInput
        style={styles.input}
        placeholder="Tamaño de Paquete"
        value={tamanoPaquete}
        onChangeText={setTamanoPaquete}
      />
      <TextInput
        style={styles.input}
        placeholder="Costo"
        value={costo}
        onChangeText={setCosto}
      />
      <TextInput
        style={styles.input}
        placeholder="Stock"
        value={stock}
        onChangeText={setStock}
      />
      <View style={styles.buttonContainer}>
        <Button title="Agregar" onPress={handleAgregar} />
        <Button title="Cancelar" onPress={closeModal} />
      </View>
    </View>
  );
};

export default NewIngredientScreen;






