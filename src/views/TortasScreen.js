import React, { useState, useEffect } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Grid,
  IconButton,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  Box,
  Typography,
  Avatar
} from '@mui/material';
import { 
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Cancel as CancelIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchTortas, agregarTorta, editarTorta, borrarTorta } from '../controllers/TortaController';

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

const TortasScreen = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const [tortas, setTortas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editedTorta, setEditedTorta] = useState(null);
  const [newTorta, setNewTorta] = useState({
    nombre_torta: '',
    descripcion_torta: '',
    imagen: null,
  });
  const [filtro, setFiltro] = useState('');
  const [error, setError] = useState('');

  // 1) Cargar lista de tortas al montar la pantalla
  useEffect(() => {
    obtenerTortas();
  }, []);

  const obtenerTortas = async () => {
    try {
      const data = await fetchTortas();
      const sortedTortas = data.sort((a, b) =>
        a.nombre_torta.localeCompare(b.nombre_torta)
      );
      setTortas(sortedTortas);
    } catch (err) {
      console.error('Error al obtener las tortas:', err);
    }
  };

  // 2) Si venimos de Recetas con state.editTortaId → abrimos el modal de esa torta
  useEffect(() => {
    if (location.state && location.state.editTortaId) {
      const idParaEditar = location.state.editTortaId;
      // Si la lista ya está cargada, buscamos la torta
      const tortaEncontrada = tortas.find((t) => t.ID_TORTA === idParaEditar);
      if (tortaEncontrada) {
        setEditedTorta(tortaEncontrada);
        setNewTorta({ ...tortaEncontrada, imagen: null });
        setModalOpen(true);
      } else {
        // Si todavía no llegó la lista, la recargamos y luego intentamos de nuevo
        (async () => {
          const data = await fetchTortas();
          const sorted = data.sort((a, b) => a.nombre_torta.localeCompare(b.nombre_torta));
          setTortas(sorted);
          const t2 = sorted.find((t) => t.ID_TORTA === idParaEditar);
          if (t2) {
            setEditedTorta(t2);
            setNewTorta({ ...t2, imagen: null });
            setModalOpen(true);
          }
        })();
      }
    }
  }, [location.state, tortas]);

  // 3) Abrir modal para “Agregar” o “Editar” manualmente
  const handleOpenAddModal = (torta = null) => {
    if (torta) {
      setEditedTorta(torta);
      setNewTorta({ ...torta, imagen: null });
    } else {
      setEditedTorta(null);
      setNewTorta({ nombre_torta: '', descripcion_torta: '', imagen: null });
    }
    setError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditedTorta(null);
    setNewTorta({ nombre_torta: '', descripcion_torta: '', imagen: null });
    setError('');
    // Limpiar el state para que no se reabra solo si recargamos
    navigate('/tortas', { replace: true, state: {} });
  };

  const handleAddTorta = async () => {
    if (!newTorta.nombre_torta || !newTorta.descripcion_torta) {
      setError('Por favor complete todos los campos.');
      return;
    }
    try {
      await agregarTorta(newTorta);
      await obtenerTortas();
      alert('Torta agregada exitosamente');
      handleCloseModal();
    } catch (err) {
      console.error('Error al agregar la torta:', err);
      setError('Error al agregar la torta');
    }
  };

  const handleEditTorta = async () => {
    if (!newTorta.nombre_torta || !newTorta.descripcion_torta) {
      setError('Por favor complete todos los campos.');
      return;
    }
    try {
      await editarTorta(newTorta);
      await obtenerTortas();
      alert('Torta editada exitosamente');
      handleCloseModal();
    } catch (err) {
      console.error('Error al editar la torta:', err);
      setError('Error al editar la torta');
    }
  };

  const handleDeleteTorta = async (id) => {
    try {
      await borrarTorta(id);
      await obtenerTortas();
      alert('Torta eliminada exitosamente');
    } catch (err) {
      console.error('Error al eliminar la torta:', err);
    }
  };

  // 4) Botón “Ver Recetas” → navega a /recetas2 con el ID_TORTA para abrir el modal allí
  const handleVerReceta = () => {
    if (editedTorta && editedTorta.ID_TORTA) {
      navigate('/recetas2', { state: { recetaTortaId: editedTorta.ID_TORTA } });
      setModalOpen(false);
    }
  };

  const filtrarTortas = (torta) => {
    return (
      torta.nombre_torta.toLowerCase().includes(filtro.toLowerCase()) ||
      torta.descripcion_torta.toLowerCase().includes(filtro.toLowerCase())
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: '100%',
          p: isMobile ? 2 : 3,
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        {/* Barra de búsqueda y botón Agregar Tortas */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={8} md={9}>
            <TextField
              label="Buscar tortas"
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
          <Grid item xs={12} sm={4} md={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenAddModal()}
              fullWidth
              startIcon={<AddIcon />}
              size={isMobile ? 'medium' : 'large'}
            >
              {isMobile ? 'Agregar' : 'Nueva Torta'}
            </Button>
          </Grid>
        </Grid>

        {/* Tabla de tortas */}
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            width: '100%',
            overflowX: 'auto',
            border: '1px solid #ddd',
            maxHeight: isMobile ? '70vh' : '75vh',
          }}
        >
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                {!isMobile && (
                  <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                )}
                <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tortas &&
                tortas.filter(filtrarTortas).map((torta) => (
                  <TableRow key={torta.ID_TORTA} hover>
                    <TableCell>{torta.nombre_torta}</TableCell>
                    {!isMobile && <TableCell>{torta.descripcion_torta}</TableCell>}
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenAddModal(torta)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteTorta(torta.ID_TORTA)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal para agregar/editar torta */}
        <Dialog
          open={modalOpen}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="sm"
          fullScreen={isMobile}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 1,
            }}
          >
            {editedTorta ? 'Editar Torta' : 'Agregar Torta'}
            <IconButton onClick={handleCloseModal} size="small">
              <CancelIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <Box sx={{ mt: 1 }}>
              <TextField
                label="Nombre"
                name="nombre_torta"
                value={newTorta.nombre_torta}
                onChange={(e) =>
                  setNewTorta({ ...newTorta, nombre_torta: e.target.value })
                }
                margin="normal"
                fullWidth
                size={isMobile ? 'small' : 'medium'}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Descripción"
                name="descripcion_torta"
                value={newTorta.descripcion_torta}
                onChange={(e) =>
                  setNewTorta({ ...newTorta, descripcion_torta: e.target.value })
                }
                margin="normal"
                fullWidth
                multiline
                rows={isMobile ? 3 : 4}
                size={isMobile ? 'small' : 'medium'}
                sx={{ mb: 2 }}
              />

              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  fullWidth={isMobile}
                  size={isMobile ? 'small' : 'medium'}
                >
                  Subir Imagen
                  <input
                    type="file"
                    name="imagen"
                    hidden
                    onChange={(e) =>
                      setNewTorta({ ...newTorta, imagen: e.target.files[0] })
                    }
                  />
                </Button>

                {newTorta.imagen && (
                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar
                      src={
                        editedTorta && !newTorta.imagen.name
                          ? `http://149.50.131.253/uploads/${newTorta.imagen}`
                          : URL.createObjectURL(newTorta.imagen)
                      }
                      variant="rounded"
                      sx={{
                        width: isMobile ? 150 : 200,
                        height: isMobile ? 150 : 200,
                        mb: 1,
                      }}
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        setNewTorta({ ...newTorta, imagen: null })
                      }
                      size={isMobile ? 'small' : 'medium'}
                      startIcon={<DeleteIcon />}
                    >
                      Eliminar
                    </Button>
                  </Box>
                )}
              </Box>

              {error && (
                <Typography color="error" sx={{ mt: 1, textAlign: 'center' }}>
                  {error}
                </Typography>
              )}
            </Box>
          </DialogContent>

          <DialogActions
            sx={{ p: 2, justifyContent: 'space-between' }}
          >
            {/* Botón “Ver Recetas” */}
            {editedTorta && (
              <Button
                onClick={handleVerReceta}
                color="secondary"
                size={isMobile ? 'small' : 'medium'}
              >
                Ver Receta
              </Button>
            )}

            <Box>
              <Button
                onClick={handleCloseModal}
                size={isMobile ? 'small' : 'medium'}
                sx={{ mr: 1 }}
              >
                Cancelar
              </Button>
              <Button
                onClick={editedTorta ? handleEditTorta : handleAddTorta}
                variant="contained"
                color="primary"
                size={isMobile ? 'small' : 'medium'}
              >
                {editedTorta ? 'Guardar Cambios' : 'Agregar Torta'}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default TortasScreen;
