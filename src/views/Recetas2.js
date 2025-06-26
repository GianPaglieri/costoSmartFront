import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Grid,
  Card,
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
  ThemeProvider,
  createTheme,
  Box,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  fetchRecetas,
  editarReceta,
  agregarIngrediente,
  eliminarIngrediente,
  baseUrl
} from '../controllers/RecetaController';
import { fetchIngredientes } from '../controllers/IngredientController';
import { fetchListaPrecios } from '../controllers/ListaPreciosController';

// Tema responsive
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

const RecetasComponent = () => {
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

  // 2) Si venimos de Tortas con location.state.recetaTortaId, abrimos el modal de esa receta
  useEffect(() => {
    if (location.state && location.state.recetaTortaId) {
      const idTorta = location.state.recetaTortaId;
      const recetaEncontrada = recetas.find((r) => r.ID_TORTA === idTorta);
      if (recetaEncontrada) {
        setEditedReceta(recetaEncontrada);
        setModalOpen(true);
      } else {
        // Si la lista aún no estaba cargada, la recargamos y volvemos a intentar
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
    navigate('/recetas2', { replace: true, state: {} });
  };

  // 4) Botón “Editar Torta” → navega a /tortas con editTortaId
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

          // Actualizar precios
          const updatedPrecios = await fetchListaPrecios();
          setPrecios(updatedPrecios || []);

          // Actualizar localmente la receta para mostrar el nuevo ingrediente
          const updatedReceta = { ...editedReceta };
          updatedReceta.ingredientes.push({
            ID_INGREDIENTE: newIngrediente.id_ingrediente,
            total_cantidad: newIngrediente.total_cantidad,
            Nombre:
              ingredientes.find((ing) => ing.id === newIngrediente.id_ingrediente)
                ?.nombre || '',
          });
          setEditedReceta(updatedReceta);

          // Limpiar input
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
        // Actualizar precios
        const updatedPrecios = await fetchListaPrecios();
        setPrecios(updatedPrecios || []);
        // Actualizar lista completa
        const allRecetas = await fetchRecetas();
        setRecetas(allRecetas || []);
      } else {
        setAlertMessage({ type: 'error', message: response.error || 'Error interno' });
      }
      setSnackbarOpen(true);
    } catch (err) {
      setAlertMessage({ type: 'error', message: `Error al eliminar ingrediente: ${err.message}` });
      setSnackbarOpen(true);
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
      copy.ingredientes[index] = {
        ...copy.ingredientes[index],
        total_cantidad: value,
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
        const response = await editarReceta({
          ID_TORTA: editedReceta.ID_TORTA,
          ID_INGREDIENTE: ing.ID_INGREDIENTE,
          total_cantidad: ing.total_cantidad,
        });
        if (response.success) {
          setAlertMessage({ type: 'success', message: 'Ingrediente editado exitosamente' });
          setSnackbarOpen(true);
          const updated = await fetchRecetas();
          setRecetas(updated || []);
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

  const obtenerPrecioPorIdTorta = (idTorta) => {
    const precioEncontrado = precios.find((p) => p.id_torta === idTorta);
    return precioEncontrado ? `$${precioEncontrado.costo_total}` : 'Precio no disponible';
  };

  return (
    <ThemeProvider theme={theme}>
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

          <Grid item xs={12} sx={{ mb: 2 }}>
            <TextField
              label="Buscar receta"
              variant="outlined"
              fullWidth
              size="small"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {recetas
            .filter((r) =>
              r.nombre_torta.toLowerCase().includes(filtro.toLowerCase())
            )
            .map((receta, index) => (
            <Grid item key={`${receta.ID_TORTA}-${index}`} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: isMobile ? '180px' : '250px',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                  },
                }}
                onClick={() => handleOpenModal(receta)}
              >
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    '&:hover img': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <img
                    src={`${baseUrl}/${receta.imagen}`}
                    alt={receta.nombre_torta}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(0, 0, 0, 0.7)',
                      p: 1,
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                    }}
                  >
                    <Typography variant={isMobile ? 'body2' : 'body1'}>
                      {receta.nombre_torta}
                    </Typography>
                    <Typography variant={isMobile ? 'body2' : 'h6'}>
                      {obtenerPrecioPorIdTorta(receta.ID_TORTA)}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}

          <Dialog
            open={modalOpen}
            onClose={handleCloseModal}
            fullWidth
            maxWidth={isMobile ? 'xs' : 'sm'}
            fullScreen={isMobile}
          >
            <DialogTitle
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              {`Ingredientes: ${editedReceta.nombre_torta || ''}`}
              <IconButton onClick={handleCloseModal}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <List dense={isMobile}>
                {editedReceta.ingredientes &&
                  editedReceta.ingredientes.map((ingrediente, idx) => (
                    <ListItem
                      key={idx}
                      sx={{
                        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: 'flex-start',
                      }}
                    >
                      <ListItemText
                        primary={ingrediente.Nombre}
                        secondary={
                          editedIngredienteIndex === idx ? (
                            <TextField
                              label="Cantidad"
                              name="total_cantidad"
                              value={ingrediente.total_cantidad}
                              onChange={(ev) => handleEditInputChange(ev, idx)}
                              margin="normal"
                              size="small"
                              fullWidth={isMobile}
                              sx={{ mt: 1 }}
                            />
                          ) : (
                            `Cantidad: ${ingrediente.total_cantidad}`
                          )
                        }
                        sx={{ flexGrow: 1 }}
                      />
                      <Box
                        sx={{
                          display: 'flex',
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
                            <SaveIcon fontSize={isMobile ? 'small' : 'medium'} />
                          </IconButton>
                        ) : (
                          <>
                            <IconButton
                              onClick={() => handleEditIngrediente(idx)}
                              color="primary"
                              size={isMobile ? 'small' : 'medium'}
                            >
                              <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteIngrediente(idx)}
                              color="error"
                              size={isMobile ? 'small' : 'medium'}
                            >
                              <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </ListItem>
                  ))}
              </List>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Agregar nuevo ingrediente
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="select-ingrediente-label">Ingrediente</InputLabel>
                  <Select
                    labelId="select-ingrediente-label"
                    id="select-ingrediente"
                    name="id_ingrediente"
                    value={newIngrediente.id_ingrediente}
                    onChange={handleInputChange}
                    size={isMobile ? 'small' : 'medium'}
                  >
                    {ingredientes.map((ing) => (
                      <MenuItem key={ing.id} value={ing.id}>
                        {ing.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Cantidad"
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
                  startIcon={<AddIcon />}
                  fullWidth={isMobile}
                  size={isMobile ? 'small' : 'medium'}
                >
                  Agregar Ingrediente
                </Button>
              </Box>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
              {/* Botón “Ver Tortas” */}
              {editedReceta && editedReceta.ID_TORTA && (
                <Button
                  onClick={handleEditarTortaDesdeReceta}
                  color="secondary"
                  size={isMobile ? 'small' : 'medium'}
                >
                  Ver Torta
                </Button>
              )}
              <Button onClick={handleCloseModal} size={isMobile ? 'small' : 'medium'}>
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default RecetasComponent;
