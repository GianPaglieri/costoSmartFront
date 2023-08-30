import React, { useState, useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { fetchTortas } from '../controllers/TortaController';
import styles from '../styles/styles';

const TortasScreen = () => {
  const [tortas, setTortas] = useState([]);

  useEffect(() => {
    obtenerTortas();
  }, []);

  const obtenerTortas = async () => {
    try {
      const tortasData = await fetchTortas();
      setTortas(tortasData);
    } catch (error) {
      console.error('Error al obtener las tortas:', error);
    }
  };

  const renderizarItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.ID_TORTA}</Text>
      <Text style={styles.cell}>{item.nombre_torta}</Text>
      <Text style={styles.cell}>{item.descripcion_torta}</Text>
      
    </View>
  );

  const renderizarEncabezado = () => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.encabezado]}>ID Torta</Text>
      <Text style={[styles.cell, styles.encabezado]}>Nombre Torta</Text>
      <Text style={[styles.cell, styles.encabezado]}>Descripcion Torta</Text>
      
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tortas</Text>
      {renderizarEncabezado()}
      <FlatList
        data={tortas}
        renderItem={renderizarItem}
        keyExtractor={(item) => item?.id_torta?.toString()}
      />
    </View>
  );
};

export default TortasScreen;






