import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Snackbar,
  useMediaQuery,
  Box,
  IconButton,
  InputAdornment,
  Stack,
  Divider
} from '@mui/material';
import {
  EditOutlined as EditOutlinedIcon,
  DeleteOutline as DeleteOutlineIcon,
  SaveRounded as SaveRoundedIcon,
  CloseRounded as CloseRoundedIcon,
  AddRounded as AddRoundedIcon,
  Search as SearchIcon,
  AttachMoneyOutlined as AttachMoneyOutlinedIcon,
  MenuBookOutlined as MenuBookOutlinedIcon
} from '@mui/icons-material';
import {
  fetchRecetas,
  editarReceta,
  agregarIngrediente,
  eliminarIngrediente,
} from '../controllers/RecetaController';
import { useTheme } from '@mui/material/styles';
import { fetchIngredientes } from '../controllers/IngredientController';
import { fetchListaPrecios } from '../controllers/ListaPreciosController';
import api from '../components/AxiosConfig';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { buildImageUrl } from '../utils/media';

const RecetasScreen = () => {
  // Base de uploads alineada con Axios (evita depender del proxy local)
  const uploadsBase = api?.defaults?.baseURL
    ? (api.defaults.baseURL === '/api' ? '/api' : api.defaults.baseURL)
    : '';
  const buildImg = (relPath) => buildImageUrl(relPath, uploadsBase);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const [recetas, setRecetas] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editedReceta, setEditedReceta] = useState({});
  const [newIngrediente, setNewIngrediente] = useState({
    id_ingrediente: '',
    total_cantidad: '',
  });
  const [editedIngredienteIndex, setEditedIngredienteIndex] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [deleteIdx, setDeleteIdx] = useState(null);

  // 1) Cargar recetas, ingredientes y precios al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const recetasData = await fetchRecetas();
        setRecetas(recetasData || []);

        const ingredientesData = await fetchIngredientes();
        const sortedIng = (ingredientesData || []).sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        );
        setIngredientes(sortedIng);

        const preciosData = await fetchListaPrecios();
        setPrecios(preciosData || []);
      } catch (err) {
        console.error('Error al obtener datos en Recetas:', err);
      }
    };
    fetchData();
  }, []);

  // Escuchar buscador global en AppBar
  useEffect(() => {
    const handleSearch = (e) => setFiltro((e?.detail?.q || '').trim());
    window.addEventListener('ui:search', handleSearch);
    return () => window.removeEventListener('ui:search', handleSearch);
  }, []);

  // 2) Si venimos de Tortas con location.state.recetaTortaId, abrimos el modal de esa receta
  useEffect(() => {
    if (location.state && location.state.recetaTortaId) {
      const idTorta = location.state.recetaTortaId;
      const recetaEncontrada = recetas.find((r) => r.ID_TORTA === idTorta);
      if (recetaEncontrada) {
        setEditedReceta(recetaEncontrada);
        setModalOpen(true);
      } else {
        // Si la lista aun no estaba cargada, la recargamos y volvemos a intentar
        (async () => {
          const data = await fetchRecetas();
          setRecetas(data || []);
          const r2 = data.find((r) => r.ID_TORTA === idTorta);
          if (r2) {
            setEditedReceta(r2);
            setModalOpen(true);
          }
        })();
      }
    }
  }, [location.state, recetas]);

  // 3) Abrir modal al hacer clic en una receta
  const handleOpenModal = (receta) => {
    if (receta && receta.ID_TORTA) {
      setEditedReceta(receta);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditedIngredienteIndex(null);
    setNewIngrediente({ id_ingrediente: '', total_cantidad: '' });
    // Limpiar el state para que no se abra solo si recargamos
    navigate('/recetas', { replace: true, state: {} });
  };

  // 4) Boton "Editar Torta" -> navega a /tortas con editTortaId
  const handleEditarTortaDesdeReceta = () => {
    if (editedReceta && editedReceta.ID_TORTA) {
      navigate('/tortas', { state: { editTortaId: editedReceta.ID_TORTA } });
      setModalOpen(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditReceta = async () => {
    try {
      if (editedReceta.ID_TORTA) {
        const response = await editarReceta(editedReceta);
        if (response.success) {
          setAlertMessage({ type: 'success', message: 'Receta editada exitosamente' });
          setSnackbarOpen(true);
          const updated = await fetchRecetas();
          setRecetas(updated || []);
          const refreshed =
            (updated || []).find((r) => r.ID_TORTA === editedReceta.ID_TORTA) || editedReceta;
          setEditedReceta(refreshed);
        } else {
          setAlertMessage({ type: 'error', message: response.error });
          setSnackbarOpen(true);
        }
      }
    } catch (err) {
      setAlertMessage({ type: 'error', message: `Error al editar receta: ${err.message}` });
      setSnackbarOpen(true);
    }
  };

  const handleAddIngrediente = async () => {
    try {
      if (
        editedReceta.ID_TORTA &&
        newIngrediente.id_ingrediente &&
        newIngrediente.total_cantidad
      ) {
        const response = await agregarIngrediente(
          editedReceta.ID_TORTA,
          newIngrediente.id_ingrediente,
          newIngrediente.total_cantidad
        );
        if (response.success) {
          setAlertMessage({ type: 'success', message: 'Ingrediente agregado exitosamente' });
          setSnackbarOpen(true);

          const updatedPrecios = await fetchListaPrecios();
          setPrecios(updatedPrecios || []);

          const updatedRecetas = await fetchRecetas();
          setRecetas(updatedRecetas || []);
          const refreshed =
            (updatedRecetas || []).find((r) => r.ID_TORTA === editedReceta.ID_TORTA) ||
            editedReceta;
          setEditedReceta(refreshed);

          setNewIngrediente({ id_ingrediente: '', total_cantidad: '' });
        } else {
          setAlertMessage({ type: 'error', message: response.error });
          setSnackbarOpen(true);
        }
      }
    } catch (err) {
      setAlertMessage({ type: 'error', message: `Error al agregar ingrediente: ${err.message}` });
      setSnackbarOpen(true);
    }
  };

  const handleDeleteIngrediente = async (index) => {
    try {
      const ingrediente = editedReceta.ingredientes[index];
      const response = await eliminarIngrediente(
        editedReceta.ID_TORTA,
        ingrediente.ID_INGREDIENTE
      );
      if (response.success) {
        setAlertMessage({ type: 'success', message: 'Ingrediente eliminado exitosamente' });
        // Eliminar localmente
        const actualizado = {
          ...editedReceta,
          ingredientes: editedReceta.ingredientes.filter((_, idx) => idx !== index),
        };
        setEditedReceta(actualizado);
        const updatedPrecios = await fetchListaPrecios();
        setPrecios(updatedPrecios || []);
        const allRecetas = await fetchRecetas();
        setRecetas(allRecetas || []);
        const refreshed =
          (allRecetas || []).find((r) => r.ID_TORTA === editedReceta.ID_TORTA) || actualizado;
        setEditedReceta(refreshed);
      } else {
        setAlertMessage({ type: 'error', message: response.error || 'Error interno' });
      }
      setSnackbarOpen(true);
    } catch (err) {
      setAlertMessage({ type: 'error', message: `Error al eliminar ingrediente: ${err.message}` });
      setSnackbarOpen(true);
    }
  };
  const askDeleteIngrediente = (index) => setDeleteIdx(index);
  const confirmDeleteIngrediente = async () => {
    if (deleteIdx !== null) {
      await handleDeleteIngrediente(deleteIdx);
      setDeleteIdx(null);
    }
  };

  const handleEditIngrediente = (index) => {
    setEditedIngredienteIndex(index);
  };

  const handleEditInputChange = (event, index) => {
    const { value } = event.target;
    setEditedReceta((prev) => {
      const copy = { ...prev };
      copy.ingredientes = [...copy.ingredientes];
      const current = copy.ingredientes[index] || {};
      const unitCost = Number(current.unit_cost ?? 0);
      const cantidadNum = Number(value);
      copy.ingredientes[index] = {
        ...current,
        total_cantidad: value,
        subtotal_cost: Number.isNaN(cantidadNum) ? 0 : unitCost * cantidadNum,
      };
      return copy;
    });
  };

  const handleSaveIngrediente = async () => {
    try {
      if (
        editedReceta.ID_TORTA &&
        editedReceta.ingredientes[editedIngredienteIndex]
      ) {
        const ing = editedReceta.ingredientes[editedIngredienteIndex];
        const cantidadNum = Number(ing.total_cantidad);
        const response = await editarReceta({
          ID_TORTA: editedReceta.ID_TORTA,
          ID_INGREDIENTE: ing.ID_INGREDIENTE,
          total_cantidad: cantidadNum,
        });
        if (response.success) {
          setAlertMessage({ type: 'success', message: 'Ingrediente editado exitosamente' });
          setSnackbarOpen(true);
          const updated = await fetchRecetas();
          setRecetas(updated || []);
          const refreshed =
            (updated || []).find((r) => r.ID_TORTA === editedReceta.ID_TORTA) || editedReceta;
          setEditedReceta(refreshed);
          // Actualizar precios
          const updatedPrecios = await fetchListaPrecios();
          setPrecios(updatedPrecios || []);
          setEditedIngredienteIndex(null);
        } else {
          setAlertMessage({ type: 'error', message: response.error });
          setSnackbarOpen(true);
        }
      }
    } catch (err) {
      setAlertMessage({ type: 'error', message: `Error al editar ingrediente: ${err.message}` });
      setSnackbarOpen(true);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewIngrediente((prev) => ({ ...prev, [name]: value }));
  };

  const obtenerDetallePrecioPorIdTorta = (idTorta) => {
  const precioEncontrado = precios.find((p) => p.id_torta === idTorta);
  if (!precioEncontrado) {
    return {
      costo: 0,
      precioLista: 0,
      margen: 0,
      displayCosto: 'Sin datos',
      displayPrecioLista: 'Sin datos',
      displayMargen: '0%',
    };
  }
  const costo = precioEncontrado.costo_total ?? 0;
  const precioLista = precioEncontrado.precio_lista ?? precioEncontrado.costo_total ?? 0;
  const margen = precioEncontrado.porcentaje_ganancia ?? 0;

  return {
    costo,
    precioLista,
    margen,
    displayCosto: formatCurrency(costo),
    displayPrecioLista: formatCurrency(precioLista),
    displayMargen: formatPercent(margen),
  };
};

  const selectedNuevoIngrediente = ingredientes.find((ing) => ing.id === newIngrediente.id_ingrediente);
  const unidadNuevoIngrediente =
    selectedNuevoIngrediente?.unidad_Medida ??
    selectedNuevoIngrediente?.unidad_medida ??
    selectedNuevoIngrediente?.unidad ??
    '';

  return (
    <>
      <Box sx={{ p: isMobile ? 1 : 3 }}>
        <Grid container spacing={isMobile ? 1 : 2}>
          {snackbarOpen && (
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
              anchorOrigin={{
                vertical: isMobile ? 'bottom' : 'top',
                horizontal: 'center',
              }}
            >
              <Alert onClose={handleSnackbarClose} severity={alertMessage.type}>
                {alertMessage.message}
              </Alert>
            </Snackbar>
          )}

          {/* Buscador global en AppBar; eliminamos el local */}

          {recetas
            .filter((r) =>
              r.nombre_torta.toLowerCase().includes(filtro.toLowerCase())
            )
            .map((receta, index) => {
              const detalle = obtenerDetallePrecioPorIdTorta(receta.ID_TORTA);
              return (
                <Grid item key={`${receta.ID_TORTA}-${index}`} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 16px 32px rgba(15, 23, 42, 0.14)',
                      },
                    }}
                    onClick={() => handleOpenModal(receta)}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        height: isMobile ? 140 : 180,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        component="img"
                        src={buildImg(receta.imagen)}
                        alt={receta.nombre_torta}
                        onError={(e)=>{ e.currentTarget.src = '/no-image.svg'; }}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.35s ease',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(15,23,42,0) 45%, rgba(15,23,42,0.78) 100%)',
                        }}
                      />
                      <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                        <Typography
                          variant={isMobile ? 'body1' : 'h6'}
                          sx={{ fontWeight: 600, color: 'common.white' }}
                        >
                          {receta.nombre_torta}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}
                        >
                          {detalle.displayPrecioLista}
                        </Typography>
                      </Box>
                    </Box>
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.25,
                        p: isMobile ? 1.5 : 2,
                      }}
                    >
                      {receta.descripcion_torta && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {receta.descripcion_torta}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}


          <Dialog
            open={modalOpen}
            onClose={handleCloseModal}
            fullWidth
            maxWidth={isMobile ? 'xs' : 'sm'}
            fullScreen={isMobile}
            PaperProps={{
              sx: {
                borderRadius: isMobile ? 0 : 4,
                overflow: 'hidden',
                backgroundColor: '#f8fafc',
                boxShadow: '0 32px 60px rgba(15, 23, 42, 0.18)',
              },
            }}
          >
            <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: isMobile ? 2 : 3,
                py: isMobile ? 1.5 : 2,
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)',
                color: '#f8fafc',
                borderBottom: '1px solid rgba(15,23,42,0.35)',
              }}
            >
              <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 600 }}>
                {`Ingredientes: ${editedReceta.nombre_torta || ''}`}
              </Typography>
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  color: 'inherit',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                }}
              >
                <CloseRoundedIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent
              sx={{
                px: isMobile ? 2 : 3,
                py: isMobile ? 2 : 3,
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(241,245,249,0.92) 100%)',
              }}
            >
              {editedReceta?.costos?.total !== undefined && (
                <Box
                  sx={{
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    p: isMobile ? 1.5 : 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(99,102,241,0.12) 100%)',
                    border: '1px solid rgba(59,130,246,0.18)',
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography
                      variant="overline"
                      sx={{ color: '#1e293b', letterSpacing: '0.12em' }}
                    >
                      Costo total
                    </Typography>
                    <Typography
                      variant={isMobile ? 'h6' : 'h5'}
                      sx={{ fontWeight: 700, color: '#0f172a' }}
                    >
                      {formatCurrency(editedReceta.costos.total ?? 0)}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      width: isMobile ? 42 : 48,
                      height: isMobile ? 42 : 48,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      backgroundColor: 'rgba(37,99,235,0.18)',
                      color: '#1d4ed8',
                    }}
                  >
                    <AttachMoneyOutlinedIcon fontSize={isMobile ? 'medium' : 'large'} />
                  </Box>
                </Box>
              )}
              <Divider sx={{ mb: 2, opacity: 0.35 }} />
              <List
                dense={isMobile}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  px: 0,
                }}
              >
                {editedReceta.ingredientes &&
                  editedReceta.ingredientes.map((ingrediente, idx) => (
                    <ListItem
                      key={ingrediente.ID_INGREDIENTE ?? idx}
                      sx={{
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: 'flex-start',
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 10px 24px rgba(15,23,42,0.08)',
                        border: '1px solid rgba(148, 163, 184, 0.18)',
                        gap: isMobile ? 1 : 0,
                        px: isMobile ? 2 : 3,
                        py: isMobile ? 1.5 : 2,
                      }}
                    >
                      <ListItemText
                        primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                        primary={ingrediente.Nombre}
                        secondary={(() => {
                          const unitCost = Number(ingrediente.unit_cost ?? 0);
                          const cantidadActual = Number(ingrediente.total_cantidad ?? 0);
                          const subtotalActual = Number.isNaN(cantidadActual)
                            ? 0
                            : unitCost * cantidadActual;
                          const metaIngrediente = ingredientes.find(
                            (ing) => Number(ing.id) === Number(ingrediente.ID_INGREDIENTE ?? ingrediente.id)
                          );
                          const unidadMedida =
                            metaIngrediente?.unidad_Medida ??
                            metaIngrediente?.unidad_medida ??
                            metaIngrediente?.unidad ??
                            ingrediente.unidad_Medida ??
                            ingrediente.unidad_medida ??
                            '';
                          const unidadSufijo = unidadMedida ? ` ${unidadMedida}` : '';
                          const costoUnitarioTexto = unidadMedida
                            ? `${formatCurrency(unitCost)} / ${unidadMedida}`
                            : formatCurrency(unitCost);

                          if (editedIngredienteIndex === idx) {
                            return (
                              <Stack spacing={0.75} alignItems="flex-start">
                                <TextField
                                  label={`Cantidad${unidadMedida ? ` (${unidadMedida})` : ''}`}
                                  name="total_cantidad"
                                  value={ingrediente.total_cantidad}
                                  onChange={(ev) => handleEditInputChange(ev, idx)}
                                  margin="normal"
                                  size="small"
                                  fullWidth={isMobile}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  Costo unitario: {costoUnitarioTexto} | Subtotal:{' '}
                                  {formatCurrency(subtotalActual)}
                                </Typography>
                              </Stack>
                            );
                          }

                          return (
                            <Stack spacing={0.3} alignItems="flex-start">
                              <Typography variant="body2" color="text.secondary">
                                Cantidad: {ingrediente.total_cantidad}
                                {unidadSufijo}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Costo unitario: {costoUnitarioTexto} | Subtotal:{' '}
                                {formatCurrency(subtotalActual)}
                              </Typography>
                            </Stack>
                          );
                        })()}
                        sx={{ flexGrow: 1 }}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 0.5,
                          mt: isMobile ? 1 : 0,
                          alignSelf: isMobile ? 'flex-end' : 'center',
                        }}
                      >
                        {editedIngredienteIndex === idx ? (
                          <IconButton
                            onClick={handleSaveIngrediente}
                            color="primary"
                            size={isMobile ? 'small' : 'medium'}
                          >
                            <SaveRoundedIcon fontSize={isMobile ? 'small' : 'medium'} />
                          </IconButton>
                        ) : (
                          <>
                            <IconButton
                              onClick={() => handleEditIngrediente(idx)}
                              color="primary"
                              size={isMobile ? 'small' : 'medium'}
                            >
                              <EditOutlinedIcon fontSize={isMobile ? 'small' : 'medium'} />
                            </IconButton>
                            <IconButton
                              onClick={() => askDeleteIngrediente(idx)}
                              color="error"
                              size={isMobile ? 'small' : 'medium'}
                            >
                              <DeleteOutlineIcon fontSize={isMobile ? 'small' : 'medium'} />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </ListItem>
                  ))}

              </List>

              <Box
                sx={{
                  mt: 3,
                  p: isMobile ? 2 : 2.5,
                  borderRadius: 3,
                  background: 'rgba(255,255,255,0.85)',
                  border: '1px dashed rgba(59, 130, 246, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)',
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Agregar nuevo ingrediente
                </Typography>
                <FormControl
                  fullWidth
                  sx={{
                    mb: 2,
                    backgroundColor: 'common.white',
                    borderRadius: 2,
                  }}
                >
                  <InputLabel id="select-ingrediente-label">Ingrediente</InputLabel>
                  <Select
                    labelId="select-ingrediente-label"
                    id="select-ingrediente"
                    name="id_ingrediente"
                    value={newIngrediente.id_ingrediente}
                    onChange={handleInputChange}
                    size={isMobile ? 'small' : 'medium'}
                  >
                    {ingredientes.map((ing) => {
                      const unidad = ing.unidad_Medida ?? ing.unidad_medida ?? ing.unidad ?? '';
                      const nombreConUnidad = unidad ? `${ing.nombre} (${unidad})` : ing.nombre;
                      return (
                        <MenuItem key={ing.id} value={ing.id}>
                          {nombreConUnidad}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <TextField
                  label={`Cantidad${unidadNuevoIngrediente ? ` (${unidadNuevoIngrediente})` : ''}`}
                  name="total_cantidad"
                  value={newIngrediente.total_cantidad}
                  onChange={handleInputChange}
                  margin="normal"
                  fullWidth
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ mb: 2 }}
                />
                <Button
                  onClick={handleAddIngrediente}
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  fullWidth={isMobile}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    alignSelf: isMobile ? 'stretch' : 'flex-start',
                    borderRadius: 2,
                    boxShadow: '0 12px 24px rgba(59,130,246,0.25)',
                    textTransform: 'none',
                  }}
                >
                  Agregar Ingrediente
                </Button>
              </Box>
            </DialogContent>

            <DialogActions
              sx={{
                justifyContent: 'space-between',
                px: isMobile ? 2 : 3,
                py: isMobile ? 1.5 : 2,
                backgroundColor: 'rgba(15,23,42,0.04)',
                borderTop: '1px solid rgba(148, 163, 184, 0.18)',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {editedReceta && editedReceta.ID_TORTA && (
                  <Button
                    onClick={handleEditarTortaDesdeReceta}
                    variant="outlined"
                    size={isMobile ? 'small' : 'medium'}
                    startIcon={<MenuBookOutlinedIcon />}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Ver torta completa
                  </Button>
                )}
              </Stack>
              <Button
                onClick={handleCloseModal}
                size={isMobile ? 'small' : 'medium'}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  color: 'common.white',
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Box>
    <Dialog open={deleteIdx !== null} onClose={() => setDeleteIdx(null)} maxWidth="xs" fullWidth>
      <DialogTitle>Confirmar eliminacion</DialogTitle>
      <DialogContent>
        <Typography>Eliminar este ingrediente de la receta?</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => setDeleteIdx(null)}>Cancelar</Button>
        <Button variant="outlined" color="error" startIcon={<DeleteOutlineIcon />} onClick={confirmDeleteIngrediente}>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default RecetasScreen;
