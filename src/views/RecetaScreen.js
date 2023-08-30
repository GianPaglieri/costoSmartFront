import React, { useState, useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { fetchRecetas } from '../controllers/RecetaController';
import styles from '../styles/styles';

const RecetaScreen = () => {
  const [recetas, setRecetas] = useState([]);

  useEffect(() => {
    obtenerRecetas();
  }, []);

  const obtenerRecetas = async () => {
    try {
      const recetasData = await fetchRecetas();
      setRecetas(recetasData);
    } catch (error) {
      console.error('Error al obtener las recetas:', error);
    }
  };

  const renderizarItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.ID_TORTA}</Text>
      <Text style={styles.cell}>{item.nombre_torta}</Text>
      <Text style={styles.cell}>{item.ID_INGREDIENTE}</Text>
      <Text style={styles.cell}>{item.cantidad}</Text>
      
    </View>
  );

  const renderizarEncabezado = () => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.encabezado]}>ID Torta</Text>
      <Text style={[styles.cell, styles.encabezado]}>Nombre Torta</Text>
      <Text style={[styles.cell, styles.encabezado]}>ID Ingrediente</Text>
      <Text style={[styles.cell, styles.encabezado]}>Cantidad Ingrediente</Text>
      
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Recetas</Text>
      {renderizarEncabezado()}
      <FlatList
        data={recetas}
        renderItem={renderizarItem}
        keyExtractor={(item) => item?.id_torta?.toString()}
      />
    </View>
  );
};

export default RecetaScreen;






