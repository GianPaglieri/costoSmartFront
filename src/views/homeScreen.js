import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Picker, TouchableOpacity } from 'react-native';
import { fetchListaPrecios } from '../controllers/ListaPreciosController';
import { obtenerCantidadVentas, registrarVenta } from '../controllers/VentaController';
import styles from '../styles/styles';

const HomeScreen = () => {
  const [listaPrecios, setListaPrecios] = useState([]);
  const [selectedTorta, setSelectedTorta] = useState(null);
  const [selectedTortaNombre, setSelectedTortaNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cantidadVentas, setCantidadVentas] = useState(obtenerCantidadVentas);

  useEffect(() => {
    obtenerListaPrecios();
    obtenerCantidadVentasOnStart(); // Cambio aquí
  }, []);

  const obtenerListaPrecios = async () => {
    try {
      const listaPreciosData = await fetchListaPrecios();
      setListaPrecios(listaPreciosData);
    } catch (error) {
      console.error('Error al obtener la lista de precios:', error);
    }
  };

  const obtenerCantidadVentasOnStart = async () => { // Cambio aquí
    try {
      const nuevaCantidadVentas = await obtenerCantidadVentas();
      setCantidadVentas(nuevaCantidadVentas); // Actualizar el estado con la nueva cantidad de ventas
    } catch (error) {
      console.error('Error al obtener la cantidad de ventas al inicio:', error);
    }
  };

  const renderizarItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.nombre_torta}</Text>
      <Text style={styles.cell}>{item.costo_total}</Text>
    </View>
  );

  const renderizarEncabezado = () => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.encabezado]}>Nombre Torta</Text>
      <Text style={[styles.cell, styles.encabezado]}>Costo Total</Text>
    </View>
  );

  const handleConfirmarVenta = async () => {
    if (selectedTorta) {
      try {
        // Lógica para confirmar la venta
        console.log('Venta confirmada');
        setMensaje('Venta confirmada exitosamente');
      } catch (error) {
        console.error('Error al confirmar la venta:', error);
        setMensaje('Error al confirmar la venta');
      }
    }
  };

  const handleGenerarVenta = async () => {
    if (selectedTorta) {
      try {
        await registrarVenta(selectedTorta); // Llamada a la función que genera la venta
        const nuevaCantidadVentas = await obtenerCantidadVentas(); // Obtener la nueva cantidad de ventas
  
        setCantidadVentas(nuevaCantidadVentas); // Actualizar el estado con la nueva cantidad de ventas
        setMensaje('Venta generada exitosamente');
      } catch (error) {
        console.error('Error al generar la venta:', error);
        setMensaje('Error al generar la venta');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PRECIOS</Text>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ventas Totales</Text>
          <Text style={styles.cardSubtitle}>{cantidadVentas} cantidad de ordenes</Text> {/* Aquí muestra la cantidad de ventas */}
          <Text style={styles.cardValue}>$100.00</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterText}>+10%</Text>
            <Text style={styles.cardFooterTextRight}>14.4k esta semana</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Generar Venta</Text>
          <Text style={styles.cardSubtitle}>+2 en la semana</Text>
          <View style={styles.cardContent}>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={selectedTorta}
                onValueChange={(itemValue, itemIndex) => {
                  setSelectedTorta(itemValue);
                  setSelectedTortaNombre(listaPrecios[itemIndex].nombre_torta);
                }}
              >
                <Picker.Item label="Seleccionar torta" value={null} />
                {listaPrecios.map((torta) => (
                  <Picker.Item key={torta.id_torta} label={torta.nombre_torta} value={torta.id_torta} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.venderButton}
              onPress={handleGenerarVenta}
              disabled={!selectedTorta}
            >
              <Text style={styles.venderButtonText}>Vender</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={listaPrecios}
        renderItem={renderizarItem}
        ListHeaderComponent={renderizarEncabezado}
        keyExtractor={(item) => item.id_torta.toString()}
      />

      {mensaje ? <Text>{mensaje}</Text> : null}
    </View>
  );
};

export default HomeScreen;





















