import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Button, Select, MenuItem, Grid, 
  Snackbar, Alert, useMediaQuery, ThemeProvider, createTheme 
} from '@mui/material';
import { fetchIngredientesMenosStock } from '../controllers/IngredientController';
import { obtenerCantidadVentas, registrarVenta, obtenerGanancias, obtenerVentas, obtenerCantidadVentasSemanales, obtenerPorcentajeVentas } from '../controllers/VentaController';
import { fetchListaPrecios, fetchPrecioPorIdTorta } from '../controllers/ListaPreciosController';
import styles from '../styles/styles';
import { Doughnut } from 'react-chartjs-2';
import { Chart, DoughnutController, Tooltip, Legend, ArcElement } from 'chart.js';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Link } from 'react-router-dom';

Chart.register(DoughnutController, Tooltip, Legend, ArcElement);

const baseUrl = 'http://149.50.131.253/api'; 

// Crear tema responsive
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const HomeScreen = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
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
      setCantidadVentasSemana(cantidad.cantidadVentas); // Accede directamente a cantidadVentasSemana
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
  const actualizarTodosLosDatos = async () => {
    try {
      // Actualizar ingredientes faltantes
      await obtenerIngredientesFaltantes();
      
      // Actualizar ventas y gráfico
      const ventas = await obtenerVentas();
      actualizarChartData(ventas);
      
      // Actualizar cantidad de ventas
      const nuevaCantidadVentas = await obtenerCantidadVentas();
      setCantidadVentas(nuevaCantidadVentas.cantidadVentas);
      
      // Actualizar ganancias
      const nuevasGanancias = await obtenerGanancias();
      setGanancias(nuevasGanancias);
      
      // Actualizar ventas semanales
      const nuevaCantidadSemanal = await obtenerCantidadVentasSemanales();
      setCantidadVentasSemana(nuevaCantidadSemanal);
      
      // Actualizar porcentaje de ventas
      const nuevoPorcentaje = await obtenerPorcentajeVentas();
      setPorcentajeVentas(nuevoPorcentaje);
      setAumento(nuevoPorcentaje.porcentajeCambio > 0);
      
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
    }
  };
  const renderizarEncabezado = () => (
    <TableRow>
      <TableCell style={{ ...styles.tableHeaderCell, fontWeight: 'bold' }}>Nombre Ingrediente</TableCell>
    <TableCell style={{ ...styles.tableHeaderCell, fontWeight: 'bold' }}>Cantidad Stock</TableCell>
    </TableRow>
  );

  const handleGenerarVenta = async () => {
    if (selectedTorta) {
      try {
        console.log('Datos enviados al backend:', { id_torta: selectedTorta.id_torta });
        const response = await registrarVenta(selectedTorta.id_torta);
        console.log('Respuesta del servidor al registrar venta:', response);
        
        if (response.success) {
          // Actualizar todos los datos después de una venta exitosa
          await actualizarTodosLosDatos();
          
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
    <ThemeProvider theme={theme}>
  <div style={{ 
    ...styles.container, 
    padding: isMobile ? '10px' : '20px',
    marginLeft: isMobile ? '0' : '40px',
    marginRight: isMobile ? '0' : '40px'
  }}>
    <Grid container spacing={isMobile ? 1 : 2}>
      <Grid item xs={12} md={6}>
        <Paper style={{ 
          ...styles.card, 
          backgroundColor: '#E1F5FE', 
          padding: isMobile ? '15px' : '30px',
          height: '100%'
        }}>
          <Typography variant={isMobile ? 'h6' : 'h5'} style={styles.cardTitle}>
            Ventas Totales
          </Typography>
          <Typography style={styles.cardSubtitle}>{cantidadVentas} cantidad de ventas totales</Typography>
          <Typography style={styles.cardValue}>${ganancias.ganancias}</Typography>
          <div style={styles.cardFooter}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Typography 
      style={{ 
        color: porcentajeVentas.porcentajeCambio?.includes('-') ? 'red' : 'green',
        fontWeight: 'bold',
        marginRight: '4px',
        fontSize: '14px' // Ajusta según necesites
      }}
    >
      {porcentajeVentas.porcentajeCambio}
    </Typography>
    <Typography style={{ color: 'black', fontSize: '14px' }}>
      de variación semanal
    </Typography>
  </div>
  <Typography style={styles.cardFooterTextRight}>
    {(cantidadVentasSemana.cantidadVentas)} ventas esta semana
  </Typography>
</div>
        </Paper>
      </Grid>

          <Grid item xs={12} md={6}>
            <Paper style={{ 
              ...styles.card, 
              padding: isMobile ? '15px' : '30px',
              height: '100%'
            }}>
              <Typography variant={isMobile ? 'h6' : 'h5'} style={styles.cardTitle}>
                Generar venta
              </Typography>
              <Typography style={styles.cardSubtitle}>
                Al generar una venta, el stock se actualizará automáticamente.
              </Typography>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row', 
                alignItems: 'center',
                gap: '20px'
              }}>
                {selectedTortaInfo && (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    marginBottom: isMobile ? '15px' : '0'
                  }}>
                    <img 
                      src={`${baseUrl}/${selectedTortaInfo.imagen_torta}`} 
                      alt="Torta" 
                      style={{ 
                        width: isMobile ? '80px' : '100px', 
                        height: isMobile ? '80px' : '100px', 
                        objectFit: 'cover',
                        borderRadius: '5px' 
                      }} 
                    />
                    <Typography variant="body1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      {selectedTortaInfo.nombre_torta}
                    </Typography>
                    <Typography variant="body2" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      ${selectedTortaInfo.costo_total}
                    </Typography>
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  width: isMobile ? '100%' : 'auto'
                }}>
                  <Select
                    value={selectedTorta ? selectedTorta.id_torta : ''}
                    onChange={(e) => {
                      setSelectedTorta(listaPrecios.find(torta => torta.id_torta === e.target.value));
                      handleTortaSeleccionada(e.target.value); 
                    }}
                    style={{ 
                      width: isMobile ? '100%' : '200px',
                      marginBottom: '10px'
                    }}
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
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleGenerarVenta}
                    style={{ width: isMobile ? '100%' : 'auto' }}
                  >
                    Generar Venta
                  </Button>
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid>

        {/* Segunda fila - Tabla y gráfico */}
        <Grid container spacing={isMobile ? 1 : 2} style={{ marginTop: '15px' }}>
          <Grid item xs={12} md={6}>
            <Paper style={{ 
              ...styles.card, 
              padding: isMobile ? '15px' : '20px',
              height: '100%'
            }}>
              <Typography variant={isMobile ? 'h6' : 'h5'} style={styles.cardTitle}>
                Ingredientes con menos stock
              </Typography>
              
              {ingredientesFaltantes.length === 0 ? (
                <Typography>No hay ingredientes con menos stock disponibles.</Typography>
              ) : (
                <TableContainer>
                  <Table size={isMobile ? 'small' : 'medium'}>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>Nombre</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }} align="right">Stock</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ingredientesFaltantes.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.nombre}</TableCell>
                          <TableCell align="right">{item.CantidadStock}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/ingredientes"
                style={{ marginTop: '15px', width: isMobile ? '100%' : 'auto' }}
              >
                Actualizar Stock
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper style={{ 
              ...styles.card, 
              padding: isMobile ? '15px' : '20px',
              height: '100%'
            }}>
              <Typography variant={isMobile ? 'h6' : 'h5'} style={styles.cardTitle}>
                Tortas Vendidas
              </Typography>
              <div style={{ 
                height: isMobile ? '250px' : '300px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Doughnut 
                  data={chartData} 
                  options={{
                    maintainAspectRatio: false,
                    responsive: true
                  }} 
                />
              </div>
            </Paper>
          </Grid>
        </Grid>

        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={6000} 
          onClose={handleSnackbarClose}
          anchorOrigin={{
            vertical: isMobile ? 'bottom' : 'top',
            horizontal: 'center'
          }}
        >
          <Alert onClose={handleSnackbarClose} severity={alertMessage?.type} sx={{ width: '100%' }}>
            {alertMessage?.message}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
};

export default HomeScreen;