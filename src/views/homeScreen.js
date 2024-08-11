import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Select, MenuItem, Grid, Snackbar, Alert } from '@mui/material';
import { fetchIngredientesMenosStock } from '../controllers/IngredientController';
import { obtenerCantidadVentas, registrarVenta, obtenerGanancias, obtenerVentas, obtenerCantidadVentasSemanales, obtenerPorcentajeVentas } from '../controllers/VentaController';
import { fetchListaPrecios, fetchPrecioPorIdTorta } from '../controllers/ListaPreciosController';
import styles from '../styles/styles';
import axios from 'axios'; 
import { Doughnut } from 'react-chartjs-2';
import { Chart, DoughnutController, Tooltip, Legend, ArcElement } from 'chart.js';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Link } from 'react-router-dom';

Chart.register(DoughnutController, Tooltip, Legend, ArcElement);

const baseUrl = 'http://localhost:3000'; 
const HomeScreen = () => {
  const [listaPrecios, setListaPrecios] = useState([]);
  const [ingredientesFaltantes, setIngredientesFaltantes] = useState([]);
  const [selectedTorta, setSelectedTorta] = useState(null);
  const [selectedTortaInfo, setSelectedTortaInfo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cantidadVentas, setCantidadVentas] = useState(0);
  const [cantidadVentasSemana, setCantidadVentasSemana] = useState(0);
  const [porcentajeVentas, setPorcentajeVentas] = useState(0);
  const [ganancias, setGanancias] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [aumento, setAumento] = useState(false);

  useEffect(() => {
    obtenerIngredientesFaltantes();
    obtenerCantidadVentasOnStart();
    obtenerListaPrecios();
    obtenerGanancias().then((result) => {
      setGanancias(result);
    });
    obtenerVentas().then((ventas) => {
      actualizarChartData(ventas);
    });
    obtenerCantidadVentasSemanales().then((cantidad) => {
      console.log('Cantidad de ventas semanales obtenida desde Home:', cantidad); // Agrega este console.log
      setCantidadVentasSemana(cantidad.cantidadVentasSemana); // Accede directamente a cantidadVentasSemana
    }).catch(error => {
      console.error('Error al obtener la cantidad de ventas semanales:', error);
    });
    obtenerPorcentajeVentas().then((porcentaje) => {
      setPorcentajeVentas(porcentaje);
      setAumento(porcentaje.porcentajeCambio > 0);
    }).catch(error => {
      console.error('Error al obtener el porcentaje de ventas:', error);
    });
  }, []);

  const actualizarChartData = (ventas) => {
   
    const tortasData = {};

    ventas.forEach((venta) => {
      const { ID_TORTA, Torta } = venta;
      const nombreTorta = Torta ? Torta.nombre_torta : 'Desconocido';

      if (tortasData[nombreTorta]) {
        tortasData[nombreTorta]++;
      } else {
        tortasData[nombreTorta] = 1;
      }
    });

    const labels = Object.keys(tortasData);
    const data = Object.values(tortasData);
    const backgroundColor = labels.map(() => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`);

    setChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor,
        },
      ],
    });
  };

  const obtenerListaPrecios = async () => {
    try {
      const listaPreciosData = await fetchListaPrecios();
      setListaPrecios(listaPreciosData);
    } catch (error) {
      console.error('Error al obtener la lista de precios:', error);
    }
  };

  const obtenerIngredientesFaltantes = async () => {
    try {
      const ingredientesFaltantesData = await fetchIngredientesMenosStock();
     
      setIngredientesFaltantes(ingredientesFaltantesData);
    } catch (error) {
      console.error('Error al obtener los ingredientes con menos stock:', error);
    }
  };

  const obtenerCantidadVentasOnStart = async () => {
    try {
      const respuestaCantidadVentas = await obtenerCantidadVentas();
      if (respuestaCantidadVentas && respuestaCantidadVentas.cantidadVentas !== undefined) {
        setCantidadVentas(respuestaCantidadVentas.cantidadVentas);
      } else {
        console.error('Error: respuesta de obtenerCantidadVentas no tiene la estructura esperada');
      }
      const nuevaCantidadVentasSemanales = await obtenerCantidadVentasSemanales();
      setCantidadVentasSemana(nuevaCantidadVentasSemanales);
    } catch (error) {
      console.error('Error al obtener las ventas al inicio:', error);
    }
  };

  const renderizarItem = (item) => (
    <TableRow key={item.id} style={styles.tableRow}>
      <TableCell style={styles.tableCell}>{item.nombre}</TableCell>
      <TableCell style={styles.tableCell}>{item.CantidadStock}</TableCell>
    </TableRow>
  );

  const renderizarEncabezado = () => (
    <TableRow>
      <TableCell style={{ ...styles.tableHeaderCell, fontWeight: 'bold' }}>Nombre Ingrediente</TableCell>
    <TableCell style={{ ...styles.tableHeaderCell, fontWeight: 'bold' }}>Cantidad Stock</TableCell>
    </TableRow>
  );

  const handleGenerarVenta = async () => {
    if (selectedTorta) {
      try {
        console.log('Datos enviados al backend:', { id_torta: selectedTorta.id_torta }); // Nuevo console log
        const response = await registrarVenta(selectedTorta.id_torta);
        console.log('Respuesta del servidor al registrar venta:', response); // Agregar este console log
        if (response.success) {
          const nuevaCantidadVentas = await obtenerCantidadVentas();
          setCantidadVentas(nuevaCantidadVentas.cantidadVentas);
          setAlertMessage({ type: 'success', message: 'Venta generada exitosamente' });
          setSnackbarOpen(true);
        } else {
          setAlertMessage({ type: 'error', message: response.error });
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Error al generar la venta:', error);
        setAlertMessage({ type: 'error', message: 'Error al generar la venta' });
        setSnackbarOpen(true);
      }
    }
  };

  const handleTortaSeleccionada = async (tortaId) => {
    try {
      const listaPrecios = await fetchListaPrecios();
      const selectedTorta = listaPrecios.find(torta => torta.id_torta === tortaId);
      setSelectedTortaInfo(selectedTorta);
      console.log('Datos de la torta seleccionada:', selectedTorta); 
    } catch (error) {
      console.error('Error al obtener la información de la torta:', error);
      setSelectedTortaInfo(null);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <div style={styles.container}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper style={{ ...styles.card, backgroundColor: '#E1F5FE', maxWidth: '600px', marginLeft: '40px', height: '100%' }}>
            <Typography variant="h6" style={styles.cardTitle}>
              Ventas Totales
            </Typography>
            <Typography style={styles.cardSubtitle}>{cantidadVentas} cantidad de ventas totales</Typography>
            <Typography style={styles.cardValue}>${ganancias.ganancias}</Typography>
            <div style={styles.cardFooter}>
              <Typography style={styles.cardFooterText}>
                {aumento ? <ArrowUpwardIcon style={{ color: 'green' }} /> : <ArrowDownwardIcon style={{ color: 'red' }} />} 
                {porcentajeVentas.porcentajeCambio}% de variación semanal en las ventas
              </Typography>
              <Typography style={styles.cardFooterTextRight}>{(cantidadVentasSemana.cantidadVentasSemana)} ventas esta semana</Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper style={{ ...styles.card, maxWidth: '600px', marginLeft: '40px', height: '100%' }}>
            <Typography variant="h6" style={styles.cardTitle}>
              Generar venta
            </Typography>
            <Typography style={styles.cardSubtitle}>Al generar una venta, el stock se actualizará automáticamente.</Typography>
            <div style={{ display: 'flex', alignItems: 'left' }}>
              
              <div style={{ marginRight: '20px' }}>
                {selectedTortaInfo && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={`http://localhost:3000/${selectedTortaInfo.imagen_torta}`} alt="Torta" style={{ width: '100px', height: '100px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
                    <Typography variant="body1" style={{ textAlign: 'center', marginBottom: '5px', fontWeight: 'bold' }}>{selectedTortaInfo.nombre_torta}</Typography>
                    <Typography variant="body2" style={{ textAlign: 'center', fontWeight: 'bold' }}>{selectedTortaInfo.costo_total}</Typography>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Select
                  value={selectedTorta ? selectedTorta.id_torta : ''}
                  onChange={(e) => {
                    setSelectedTorta(listaPrecios.find(torta => torta.id_torta === e.target.value));
                    handleTortaSeleccionada(e.target.value); 
                  }}
                  style={styles.select}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Seleccione torta...
                  </MenuItem>
                  {listaPrecios.map((torta) => (
                    <MenuItem key={torta.id_torta} value={torta.id_torta}>
                      {torta.nombre_torta}
                    </MenuItem>
                  ))}
                </Select>
                <Button variant="contained" color="primary" onClick={handleGenerarVenta} style={{ marginTop: '10px' }}>
                  Generar Venta
                </Button>
                
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
  
      <Grid container spacing={2} style={{ marginTop: '15px' }}>
        <Grid item xs={12} sm={6}>
          <Paper style={{ ...styles.card, maxWidth: '500px', marginLeft: '40px', height: '100%' }}>
            <Typography variant="h6" style={styles.cardTitle}>
              Ingredientes con menos stock
            </Typography>
            {ingredientesFaltantes.length === 0 ? (
              <Typography>No hay ingredientes con menos stock disponibles.</Typography>
            ) : (
              <TableContainer style={styles.tableContainer}>
                <Table style={styles.table}>
                  <TableHead>{renderizarEncabezado()}</TableHead>
                  <TableBody>
                    {ingredientesFaltantes.map(renderizarItem)}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/ingredientes"
              style={{ marginTop: '15px' }}
            >
              Actualizar Stock
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper style={{ ...styles.card, maxWidth: '500px', marginLeft: '40px', height: '100%' }}>
            <Typography variant="h6" style={styles.cardTitle}>
              Tortas Vendidas
            </Typography>
            <Doughnut data={chartData} />
          </Paper>
        </Grid>
      </Grid>
  
      {snackbarOpen && (
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={alertMessage.type}>
            {alertMessage.message}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default HomeScreen;
