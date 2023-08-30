import React, { useState, useEffect, Alert } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Button, ScrollView } from 'react-native';
import styles from '../styles/styles';
import { fetchIngredientes, agregarIngrediente, editarIngrediente, borrarIngrediente } from '../controllers/IngredientController';

const IngredientListScreen = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIngredientId, setEditIngredientId] = useState('');
  const [nombre, setNombre] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [tamanoPaquete, setTamanoPaquete] = useState('');
  const [costo, setCosto] = useState('');
  const [stock, setStock] = useState('');
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  useEffect(() => {
    obtenerIngredientes();
  }, []);

  const obtenerIngredientes = async () => {
    const data = await fetchIngredientes();
    setIngredientes(data);
  };

  const handleAgregarIngrediente = async () => {
    const ingredientData = {
      nombre,
      unidad_Medida: unidadMedida,
      tamano_Paquete: tamanoPaquete,
      costo,
      CantidadStock: stock,
    };

    await agregarIngrediente(ingredientData);
    obtenerIngredientes();
    closeModal();
  };

  const handleEditarIngrediente = async () => {
    const ingredientData = {
      id: editIngredientId,
      nombre,
      unidad_Medida: unidadMedida,
      tamano_Paquete: tamanoPaquete,
      costo,
      CantidadStock: stock,
    };

    await editarIngrediente(ingredientData);
    obtenerIngredientes();
    closeModal();
  };

  const handleEliminarIngrediente = async (ingredientId) => {
    await borrarIngrediente(ingredientId);
    obtenerIngredientes();
  };

  const handleOpenModal = (ingredientId) => {
    const selectedIngredient = ingredientes.find((ingredient) => ingredient.id === ingredientId);
    if (selectedIngredient) {
      setEditMode(true);
      setEditIngredientId(selectedIngredient.id);
      setNombre(selectedIngredient.nombre);
      setUnidadMedida(selectedIngredient.unidad_Medida);
      setTamanoPaquete(selectedIngredient.tamano_Paquete);
      setCosto(selectedIngredient.costo);
      setStock(selectedIngredient.CantidadStock);
      setShowDeleteButton(true);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setEditMode(false);
    setEditIngredientId('');
    setNombre('');
    setUnidadMedida('');
    setTamanoPaquete('');
    setCosto('');
    setStock('');
    setShowDeleteButton(false);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Ingredientes</Text>
      <ScrollView style={styles.table}>
        <View style={styles.row}>
          <Text style={[styles.cell, styles.header]}>Nombre</Text>
          <Text style={[styles.cell, styles.header]}>Unidad de Medida</Text>
          <Text style={[styles.cell, styles.header]}>Tamaño del Paquete</Text>
          <Text style={[styles.cell, styles.header]}>Costo</Text>
          <Text style={[styles.cell, styles.header]}>Stock</Text>
        </View>
        {ingredientes.map((ingrediente) => (
          <TouchableOpacity
            key={ingrediente.id}
            style={styles.row}
            onPress={() => handleOpenModal(ingrediente.id)}
            onLongPress={() => handleEliminarIngrediente(ingrediente.id)}
          >
            <Text style={styles.cell}>{ingrediente.nombre}</Text>
            <Text style={styles.cell}>{ingrediente.unidad_Medida}</Text>
            <Text style={styles.cell}>{ingrediente.tamano_Paquete}</Text>
            <Text style={styles.cell}>{ingrediente.costo}</Text>
            <Text style={styles.cell}>{ingrediente.CantidadStock}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Agregar</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editMode ? 'Editar Ingrediente' : 'Agregar Ingrediente'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={nombre}
              onChangeText={(text) => setNombre(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Unidad de Medida"
              value={unidadMedida}
              onChangeText={(text) => setUnidadMedida(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Tamaño del Paquete"
              value={tamanoPaquete}
              onChangeText={(text) => setTamanoPaquete(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Costo"
              value={costo}
              onChangeText={(text) => setCosto(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Stock"
              value={stock}
              onChangeText={(text) => setStock(text)}
            />
            <View style={styles.modalButtonContainer}>
              {showDeleteButton && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleEliminarIngrediente(editIngredientId)}>
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              )}
              <Button
                title={editMode ? 'Editar' : 'Agregar'}
                onPress={editMode ? handleEditarIngrediente : handleAgregarIngrediente}
              />
              <Button title="Cancelar" onPress={closeModal} color="#ccc" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default IngredientListScreen;














