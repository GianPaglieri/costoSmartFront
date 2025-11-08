import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, DoughnutController, Legend, Tooltip } from 'chart.js';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BakeryDiningOutlinedIcon from '@mui/icons-material/BakeryDiningOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { Link } from 'react-router-dom';
import api from '../components/AxiosConfig';
import { fetchListaPrecios } from '../controllers/ListaPreciosController';
import { fetchIngredientesMenosStock } from '../controllers/IngredientController';
import {
  obtenerGanancias,
  obtenerCantidadVentas,
  obtenerCantidadVentasSemanales,
  obtenerPorcentajeVentas,
  obtenerVentas,
  registrarVenta,
} from '../controllers/VentaController';
import useResponsive from '../utils/useResponsive';
import { formatCurrency } from '../utils/formatters';
import { buildImageUrl } from '../utils/media';

Chart.register(DoughnutController, Tooltip, Legend, ArcElement);


// API base is centralized in AxiosConfig; avoid hardcoding URLs

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


const DEFAULT_RANGE_LABEL = 'Últimos 7 días';

const formatRangeLabel = (range) => {
  if (!range?.inicio || !range?.fin) {
    return DEFAULT_RANGE_LABEL;
  }
  try {
    const formatter = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit' });
    const startDate = formatter.format(new Date(range.inicio));
    const endDate = formatter.format(new Date(range.fin));
    return `${startDate} - ${endDate}`;
  } catch (error) {
    return DEFAULT_RANGE_LABEL;
  }
};
const HomeScreen = () => {
  const uploadsBase = api?.defaults?.baseURL
    ? (api.defaults.baseURL === '/api' ? '/api' : api.defaults.baseURL)
    : '';
  const buildImg = (relPath) => buildImageUrl(relPath, uploadsBase);
  const { isMobile, isCompact } = useResponsive(theme);

  
  const [listaPrecios, setListaPrecios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [ingredientesFaltantes, setIngredientesFaltantes] = useState([]);
  const [selectedTorta, setSelectedTorta] = useState(null);
  const [selectedTortaInfo, setSelectedTortaInfo] = useState(null);
  const [cantidadVentas, setCantidadVentas] = useState(0);
  const [rangoVentas, setRangoVentas] = useState(null);
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [topTorta, setTopTorta] = useState(null);
  const totalGanancias = useMemo(() => {
    if (typeof ganancias === 'number') {
      return ganancias;
    }
    return Number(ganancias?.ganancias ?? 0);
  }, [ganancias]);

  const formattedGanancias = useMemo(() => formatCurrency(totalGanancias), [totalGanancias]);

  const ventasRangeLabel = useMemo(() => formatRangeLabel(rangoVentas), [rangoVentas]);
  const tortaStats = useMemo(() => {
    if (!selectedTortaInfo) return [];

    const margenValor = Number(selectedTortaInfo?.porcentaje_ganancia ?? 0);
    const margenRedondeado = Number.isFinite(margenValor) ? Math.round(margenValor) : 0;
    const margenColor = margenRedondeado > 0 ? '#0f766e' : '#475569';
    const margenBg = margenRedondeado > 0 ? 'rgba(15,118,110,0.08)' : 'rgba(71,85,105,0.06)';

    return [
      {
        key: 'costo',
        label: 'Costo',
        value: formatCurrency(selectedTortaInfo?.costo_total),
        icon: <SavingsOutlinedIcon />,
        bg: 'rgba(37,99,235,0.08)',
        color: '#1d4ed8',
      },
      {
        key: 'lista',
        label: 'Lista',
        value: formatCurrency(selectedTortaInfo?.precio_lista),
        icon: <ReceiptLongOutlinedIcon />,
        bg: 'rgba(124,58,237,0.08)',
        color: '#6d28d9',
      },
      {
        key: 'margen',
        label: 'Margen',
        value: `${margenRedondeado}%`,
        icon: <TrendingUpOutlinedIcon />,
        bg: margenBg,
        color: margenColor,
      },
    ];
  }, [selectedTortaInfo]);

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
      setCantidadVentasSemana(cantidad.cantidadVentas); // Accede directamente a cantidadVentasSemana
    }).catch(error => {
      console.error('Error al obtener la cantidad de ventas semanales:', error);
    });
    obtenerPorcentajeVentas().then((porcentaje) => {
      setPorcentajeVentas(porcentaje);
    }).catch(error => {
      console.error('Error al obtener el porcentaje de ventas:', error);
    });
  }, []);

  // Escuchar buscador global en AppBar para filtrar tortas del selector
  useEffect(() => {
    const handleSearch = (e) => setFiltro((e?.detail?.q || '').trim());
    window.addEventListener('ui:search', handleSearch);
    return () => window.removeEventListener('ui:search', handleSearch);
  }, []);

  const listaFiltrada = filtro
    ? listaPrecios.filter((t) => (t?.nombre_torta || '').toLowerCase().includes(filtro.toLowerCase()))
    : listaPrecios;

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

    // calcular torta mas vendida
    if (labels.length) {
      let maxIdx = 0;
      for (let i = 1; i < data.length; i++) if (data[i] > data[maxIdx]) maxIdx = i;
      setTopTorta({ nombre: labels[maxIdx], cantidad: data[maxIdx] });
    } else {
      setTopTorta(null);
    }
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
        setRangoVentas(respuestaCantidadVentas.rango || null);
      } else {
        setRangoVentas(null);
        console.error('Error: respuesta de obtenerCantidadVentas no tiene la estructura esperada');
      }
      const nuevaCantidadVentasSemanales = await obtenerCantidadVentasSemanales();
      setCantidadVentasSemana(nuevaCantidadVentasSemanales);
    } catch (error) {
      console.error('Error al obtener las ventas al inicio:', error);
    }
  };

  const actualizarTodosLosDatos = async () => {
    try {
      // Actualizar ingredientes faltantes
      await obtenerIngredientesFaltantes();
      
      // Actualizar ventas y grafico
      const ventas = await obtenerVentas();
      actualizarChartData(ventas);
      
      // Actualizar cantidad de ventas
      const nuevaCantidadVentas = await obtenerCantidadVentas();
      setCantidadVentas(nuevaCantidadVentas.cantidadVentas);
      setRangoVentas(nuevaCantidadVentas.rango || null);
      
      // Actualizar ganancias
      const nuevasGanancias = await obtenerGanancias();
      setGanancias(nuevasGanancias);
      
      // Actualizar ventas semanales
      const nuevaCantidadSemanal = await obtenerCantidadVentasSemanales();
      setCantidadVentasSemana(nuevaCantidadSemanal);
      
      // Actualizar porcentaje de ventas
      const nuevoPorcentaje = await obtenerPorcentajeVentas();
      setPorcentajeVentas(nuevoPorcentaje);
      
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
    }
  };

  const handleGenerarVenta = async () => {
    if (selectedTorta && !isGenerating) {
      try {
        setIsGenerating(true);
        const response = await registrarVenta(selectedTorta.id_torta);
        
        if (response.success) {
          // Actualizar todos los datos despues de una venta exitosa
          await actualizarTodosLosDatos();
          
          setAlertMessage({ type: 'success', message: 'Venta generada exitosamente' });
          setSnackbarOpen(true);
        } else {
          const detalles = Array.isArray(response?.details) ? response.details : [];
          const detallesTexto = detalles.length
            ? ' | Faltantes: ' +
                detalles
                  .map((item) => {
                    const nombre = item?.nombre || 'Ingrediente';
                    const disponible = item?.disponible ?? 0;
                    const requerido = item?.requerido ?? 0;
                    const faltante = item?.faltante ?? Math.max(requerido - disponible, 0);
                    const unidad = item?.unidad ? ` ${item.unidad}` : '';
                    return `${nombre} (faltan ${faltante}${unidad}; stock ${disponible}${unidad}/${requerido}${unidad})`;
                  })
                  .join(' | ')
            : '';
          setAlertMessage({
            type: 'error',
            message: `${response.error || 'No se pudo registrar la venta'}${detallesTexto}`,
          });
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Error al generar la venta:', error);
        setAlertMessage({ type: 'error', message: 'Error al generar la venta' });
        setSnackbarOpen(true);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleTortaSeleccionada = async (tortaId) => {
    try {
      const listaPrecios = await fetchListaPrecios();
      const selectedTorta = listaPrecios.find(torta => torta.id_torta === tortaId);
      setSelectedTortaInfo(selectedTorta);
    } catch (error) {
      console.error('Error al obtener la informacion de la torta:', error);
      setSelectedTortaInfo(null);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <ThemeProvider theme={theme}>
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      width: '100%',
      maxWidth: { xs: '100%', lg: 1200 },
      mx: 'auto',
      px: { xs: 1.5, sm: 3 },
      py: { xs: 2, sm: 3 },
      boxSizing: 'border-box',
      overflowX: 'hidden',
    }}
  >
    <Grid container spacing={{ xs: 1.5, md: 2 }}>
      <Grid item xs={12} lg={6} xl={5}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
            backgroundColor: '#E1F5FE',
            minHeight: '100%',
            boxShadow: '0 20px 40px rgba(15,23,42,0.15)',
            width: '100%',
            maxWidth: { xs: '100%', lg: '100%' },
          }}
        >
          <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 700, mb: 1 }}>
            Ventas Totales
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.95rem' }}>
            {cantidadVentas} ventas ({ventasRangeLabel})
          </Typography>
          <Typography sx={{ fontSize: isMobile ? '2rem' : '2.4rem', fontWeight: 700, mt: 1 }}>
            {formattedGanancias}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {(() => {
                const raw = porcentajeVentas?.porcentajeCambio;
                let val = null;
                if (raw && typeof raw === 'string') {
                  const n = parseFloat(String(raw).replace('%','').replace(',','.'));
                  if (!Number.isNaN(n)) val = n;
                }
                if (val === null) return <Chip icon={<InfoOutlinedIcon />} label="Sin datos de semana anterior" size={isMobile ? 'small' : 'medium'} variant="outlined"/>;
                if (val > 0) return <Chip icon={<ArrowUpwardIcon />} color="success" label={`+${val}%`} size={isMobile ? 'small' : 'medium'} variant="outlined"/>;
                if (val < 0) return <Chip icon={<ArrowDownwardIcon />} color="error" label={`${val}%`} size={isMobile ? 'small' : 'medium'} variant="outlined"/>;
                return <Chip icon={<TrendingFlatIcon />} label={`0%`} size={isMobile ? 'small' : 'medium'} variant="outlined"/>;
              })()}
              <Typography variant="body2" color="text.secondary">vs semana anterior</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {cantidadVentasSemana?.cantidadVentas ?? 0} ventas esta semana
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {topTorta && (
              <Chip label={`Mas vendida: ${topTorta.nombre}`} color="secondary" variant="outlined" />
            )}
            <Chip label={`Tortas: ${listaPrecios.length}`} variant="outlined" />
          </Stack>
        </Paper>
      </Grid>

      <Grid item xs={12} lg={6} xl={5} sx={{ display: 'flex' }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
            backgroundColor: '#ffffff',
            minHeight: '100%',
            boxShadow: '0 20px 40px rgba(15,23,42,0.12)',
            width: '100%',
            maxWidth: { xs: '100%', lg: '100%' },
          }}
        >
          <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 700, mb: 1 }}>
            Generar venta
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.95rem' }}>
            Al generar una venta, el stock se actualizara automaticamente.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: isMobile || isCompact ? '1fr' : 'minmax(0, 1.3fr) minmax(0, 1fr)',
              gap: isMobile ? 2 : 3,
              alignItems: 'flex-start',
              mt: 2,
            }}
          >
            <Stack spacing={1.5}>
                  <Autocomplete
                    options={listaFiltrada}
                    value={selectedTorta}
                    onChange={(e, val) => {
                      setSelectedTorta(val || null);
                      if (val) handleTortaSeleccionada(val.id_torta);
                      else setSelectedTortaInfo(null);
                    }}
                    isOptionEqualToValue={(opt, val) => opt?.id_torta === val?.id_torta}
                    getOptionLabel={(opt) => opt?.nombre_torta || ''}
                    noOptionsText="No hay resultados"
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box
                          component="img"
                          src={buildImg(option?.imagen_torta)}
                          alt="prev"
                          sx={{
                            width: 36,
                            height: 36,
                            objectFit: 'cover',
                            borderRadius: 1,
                            mr: 1.5,
                          }}
                          onError={(e) => {
                            e.currentTarget.src = '/no-image.svg';
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {option?.nombre_torta}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.65 }}>
                            {formatCurrency(option?.precio_lista ?? option?.costo_total)}
                          </Typography>
                        </Box>
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Buscar torta..."
                        size={isMobile ? 'small' : 'medium'}
                      />
                    )}
                    sx={{ width: '100%' }}
                    ListboxProps={{ style: { maxHeight: 280 } }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Selecciona una torta de la lista para cargar automaticamente su informacion de
                    precio y stock.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGenerarVenta}
                    disabled={!selectedTorta || isGenerating}
                    sx={{
                      alignSelf: isMobile ? 'stretch' : 'flex-start',
                      px: isMobile ? 2 : 3,
                      py: isMobile ? 1 : 1.2,
                      minWidth: 160,
                      borderRadius: 2,
                      boxShadow: '0 16px 32px rgba(59,130,246,0.25)',
                      textTransform: 'none',
                    }}
                  >
                    {isGenerating ? 'Generando...' : 'Generar Venta'}
                  </Button>
                </Stack>

                {selectedTortaInfo && (
                  <Stack
                    spacing={1}
                    sx={{
                      width: '100%',
                      minWidth: isMobile ? '100%' : 280,
                      borderRadius: 2,
                      border: '1px solid rgba(59,130,246,0.15)',
                      backgroundColor: 'rgba(241,245,249,0.85)',
                      p: isMobile ? 1.25 : 1.5,
                    }}
                  >
                    <Stack
                      direction={isMobile || isCompact ? 'column' : 'row'}
                      spacing={isMobile ? 1 : 1.5}
                      alignItems={isMobile || isCompact ? 'flex-start' : 'center'}
                    >
                      <Box
                        component="img"
                        src={buildImg(selectedTortaInfo?.imagen_torta)}
                        alt={selectedTortaInfo?.nombre_torta || 'Torta'}
                        sx={{
                          width: isMobile ? 68 : 82,
                          height: isMobile ? 68 : 82,
                          objectFit: 'cover',
                          borderRadius: 12,
                          boxShadow: '0 8px 20px rgba(15,23,42,0.18)',
                          flexShrink: 0,
                        }}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = '/no-image.png';
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            lineHeight: 1.2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {selectedTortaInfo.nombre_torta}
                        </Typography>

                      </Box>
                    </Stack>
                    <Stack spacing={0.75} sx={{ width: '100%' }}>
                      {tortaStats.map((stat) => (
                        <Box
                          key={stat.key}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1,
                            padding: '12px 14px',
                            borderRadius: 2,
                            border: '1px solid rgba(15,23,42,0.08)',
                            backgroundColor: stat.bg,
                            width: '100%',
                            flexWrap: 'wrap',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Box
                              sx={{
                                width: 26,
                                height: 26,
                                borderRadius: '50%',
                                display: 'grid',
                                placeItems: 'center',
                                backgroundColor: 'rgba(15,23,42,0.06)',
                                color: stat.color,
                                '& svg': { fontSize: '1rem' },
                              }}
                            >
                              {stat.icon}
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569' }}
                            >
                              {stat.label}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: stat.color,
                              textAlign: 'right',
                              whiteSpace: 'normal',
                              wordBreak: 'break-word',
                              flex: '1 0 auto',
                            }}
                          >
                            {stat.value}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                )}
              </Box>
            </Paper>
      </Grid>
    </Grid>

    {/* Acciones rapidas (separadas para no mezclar con la card) */}
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: { xs: 1.5, sm: 2 },
        backgroundColor: '#ffffff',
        boxShadow: '0 18px 32px rgba(15,23,42,0.12)',
        mt: 2,
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Acciones rapidas</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Button variant="outlined" size={isMobile ? 'small' : 'medium'} startIcon={<BakeryDiningOutlinedIcon />} component={Link} to="/tortas">Nueva torta</Button>
        <Button variant="outlined" size={isMobile ? 'small' : 'medium'} startIcon={<Inventory2OutlinedIcon />} component={Link} to="/ingredientes">Nuevo ingrediente</Button>
        <Button variant="outlined" size={isMobile ? 'small' : 'medium'} startIcon={<MenuBookOutlinedIcon />} component={Link} to="/recetas">Nueva receta</Button>
      </Stack>
    </Paper>

        {/* Segunda fila - Tabla y grafico */}
        <Grid container spacing={{ xs: 1.5, md: 2 }} sx={{ mt: { xs: 2, md: 3 } }}>
          <Grid item xs={12} lg={6} xl={6} sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                p: { xs: 2, sm: 2.5 },
                backgroundColor: '#ffffff',
                boxShadow: '0 18px 32px rgba(15,23,42,0.1)',
                minHeight: '100%',
              }}
            >
              <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 700, mb: 1 }}>
                Ingredientes con menos stock
              </Typography>
              
              {ingredientesFaltantes.length === 0 ? (
                <Typography>No hay ingredientes con menos stock disponibles.</Typography>
              ) : (
                <TableContainer>
                  <Table size={isMobile ? 'small' : 'medium'}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">Stock</TableCell>
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
                sx={{ mt: 2, width: isMobile ? '100%' : 'auto' }}
              >
                Actualizar Stock
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={6} xl={6} sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                p: { xs: 2, sm: 2.5 },
                backgroundColor: '#ffffff',
                boxShadow: '0 18px 32px rgba(15,23,42,0.1)',
                minHeight: '100%',
              }}
            >
              <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 700, mb: 1 }}>
                Tortas Vendidas
              </Typography>
              <Box
                sx={{
                  height: isMobile ? 250 : 300,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Doughnut 
                  data={chartData} 
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    cutout: '60%',
                    plugins: {
                      legend: { position: 'bottom' },
                    }
                  }} 
                />
              </Box>
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
      </Box>
    </ThemeProvider>
  );
};

export default HomeScreen;
