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
  Typography,
  InputAdornment,
  Grid,
  IconButton,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon 
} from '@mui/icons-material';
import { fetchIngredientes, agregarIngrediente, editarIngrediente, borrarIngrediente } from '../controllers/IngredientController';

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

const IngredientList = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [ingredientes, setIngredientes] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editedIngrediente, setEditedIngrediente] = useState({
    nombre: '',
    unidad_Medida: '',
    tamano_Paquete: '',
    costo: '',
    CantidadStock: '',
  });
  const [newIngrediente, setNewIngrediente] = useState({
    nombre: '',
    unidad_Medida: '',
    tamano_Paquete: '',
    costo: '',
    CantidadStock: '',
  });
  const [deletedIngredienteId, setDeletedIngredienteId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    obtenerIngredientes();
  }, []);

  const obtenerIngredientes = async () => {
    try {
      const data = await fetchIngredientes();
      const sortedIngredientes = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setIngredientes(sortedIngredientes);
    } catch (error) {
      console.error('Error al obtener los ingredientes:', error);
    }
  };

  const handleOpenEditModal = (ingrediente) => {
    setEditedIngrediente({ ...ingrediente });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setDeletedIngredienteId(null);
  };

  const handleOpenAddModal = () => {
    setNewIngrediente({
      nombre: '',
      unidad_Medida: '',
      tamano_Paquete: '',
      costo: '',
      CantidadStock: '',
    });
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };

  const handleAddIngrediente = async () => {
    // Validar los campos del formulario antes de enviarlos al servidor
    if (!validateForm(newIngrediente)) {
      return;
    }

    try {
      await agregarIngrediente(newIngrediente);
      const updatedIngredientes = await fetchIngredientes();
      setIngredientes(updatedIngredientes);
      alert('Ingrediente agregado exitosamente');
      handleCloseAddModal();
    } catch (error) {
      console.error('Error al agregar el ingrediente:', error);
    }
  };

  const handleEditIngrediente = async () => {
    // Validar los campos del formulario antes de enviarlos al servidor
    if (!validateForm(editedIngrediente)) {
      return;
    }

    try {
      await editarIngrediente(editedIngrediente);
      const data = await fetchIngredientes();
      setIngredientes(data);
      alert('Ingrediente editado exitosamente');
    } catch (error) {
      console.error('Error al editar el ingrediente:', error);
    }

    handleCloseEditModal();
  };

  const handleDeleteIngrediente = async (ingredienteId) => {
    setDeletedIngredienteId(ingredienteId);
    setShowConfirmation(true);
  };

  const handleConfirmarEliminar = async () => {
    try {
      if (!deletedIngredienteId) {
        console.error('Invalid deletedIngredienteId');
        return;
      }

      const response = await borrarIngrediente(deletedIngredienteId);

      if (response.success) {
        const updatedIngredientes = await fetchIngredientes();
        setIngredientes(updatedIngredientes);
        alert('Ingrediente eliminado exitosamente');
      } else {
        console.error('Error al eliminar el ingrediente:', response.error);
      }
    } catch (error) {
      console.error('Error al eliminar el ingrediente:', error);
    }

    setShowConfirmation(false);
    handleCloseEditModal();
  };

  const filtrarIngredientes = (ingrediente) => {
    return (
      ingrediente.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      ingrediente.unidad_Medida.toLowerCase().includes(filtro.toLowerCase()) ||
      ingrediente.tamano_Paquete.toString().includes(filtro) ||
      ingrediente.costo.toString().includes(filtro) ||
      ingrediente.CantidadStock.toString().includes(filtro)
    );
  };

  const validateForm = (ingrediente) => {
    // Validar campos individuales
    if (!ingrediente.nombre || !ingrediente.unidad_Medida || !ingrediente.tamano_Paquete ||
        isNaN(ingrediente.tamano_Paquete) || ingrediente.tamano_Paquete <= 0 ||
        isNaN(ingrediente.costo) || ingrediente.costo <= 0 ||
        isNaN(ingrediente.CantidadStock) || ingrediente.CantidadStock < 0) {
      alert('Por favor, complete todos los campos correctamente.');
      return false;
    }

    return true;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        width: '100%',
        p: isMobile ? 1 : 3,
        maxWidth: 1200,
        mx: 'auto'
      }}>
        {/* Barra de búsqueda y botón agregar */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={8} md={9}>
            <TextField
              label="Buscar ingrediente"
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
              onClick={handleOpenAddModal}
              fullWidth
              startIcon={<AddIcon />}
              size={isMobile ? 'medium' : 'large'}
            >
              {isMobile ? 'Agregar' : 'Nuevo Ingrediente'}
            </Button>
          </Grid>
        </Grid>

        {/* Tabla de ingredientes */}
        <TableContainer 
  component={Paper} 
  elevation={3} 
  sx={{ 
    width: '100%',
    overflowX: 'auto',
    border: '1px solid #ddd',
    maxHeight: isMobile ? '70vh' : '75vh'
  }}
>
  <Table size={isMobile ? 'small' : 'medium'} stickyHeader>
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: 'bold', minWidth: isMobile ? 100 : 150 }}>Nombre</TableCell>
        {!isMobile && (
          <>
            <TableCell sx={{ fontWeight: 'bold' }}>Unidad</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Tamaño</TableCell>
          </>
        )}
        <TableCell sx={{ fontWeight: 'bold' }} align="right">Costo</TableCell>
        <TableCell sx={{ fontWeight: 'bold' }} align="right">Stock</TableCell>
        <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {ingredientes.filter(filtrarIngredientes).map((ingrediente) => (
        <TableRow key={ingrediente.id} hover>
          <TableCell>{ingrediente.nombre}</TableCell>
          {!isMobile && (
            <>
              <TableCell>{ingrediente.unidad_Medida}</TableCell>
              <TableCell>{ingrediente.tamano_Paquete}</TableCell>
            </>
          )}
          <TableCell align="right">${ingrediente.costo}</TableCell>
          <TableCell align="right">{ingrediente.CantidadStock}</TableCell>
          <TableCell>
            <IconButton 
              onClick={() => handleOpenEditModal(ingrediente)}
              color="primary"
              size="small"
            >
              <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>
            <IconButton 
              onClick={() => handleDeleteIngrediente(ingrediente.id)}
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

        {/* Modal para editar ingrediente */}
        <Dialog 
          open={editModalOpen} 
          onClose={handleCloseEditModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Editar Ingrediente</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombre"
                  fullWidth
                  value={editedIngrediente.nombre}
                  onChange={(e) => setEditedIngrediente({...editedIngrediente, nombre: e.target.value})}
                  margin="normal"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" size={isMobile ? 'small' : 'medium'}>
                  <InputLabel id="unidad-edit-label">Unidad de medida</InputLabel>
                  <Select
                    labelId="unidad-edit-label"
                    label="Unidad de medida"
                    value={editedIngrediente.unidad_Medida}
                    onChange={(e) =>
                      setEditedIngrediente({
                        ...editedIngrediente,
                        unidad_Medida: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="unidad">Unidad</MenuItem>
                    <MenuItem value="gramos">Gramos</MenuItem>
                    <MenuItem value="kilogramos">Kilogramos</MenuItem>
                    <MenuItem value="litros">Litros</MenuItem>
                    <MenuItem value="mililitros">Mililitros</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tamaño del paquete"
                  fullWidth
                  value={editedIngrediente.tamano_Paquete}
                  onChange={(e) => setEditedIngrediente({...editedIngrediente, tamano_Paquete: e.target.value})}
                  margin="normal"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Costo"
                  fullWidth
                  value={editedIngrediente.costo}
                  onChange={(e) => setEditedIngrediente({...editedIngrediente, costo: e.target.value})}
                  margin="normal"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Cantidad en Stock"
                  fullWidth
                  value={editedIngrediente.CantidadStock}
                  onChange={(e) => setEditedIngrediente({...editedIngrediente, CantidadStock: e.target.value})}
                  margin="normal"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseEditModal}
              size={isMobile ? 'small' : 'medium'}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleEditIngrediente} 
              color="primary"
              variant="contained"
              size={isMobile ? 'small' : 'medium'}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal para agregar nuevo ingrediente - COMPLETO Y FUNCIONAL */}
        <Dialog 
          open={addModalOpen} 
          onClose={handleCloseAddModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Agregar Nuevo Ingrediente</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombre"
                  fullWidth
                  value={newIngrediente.nombre}
                  onChange={(e) => setNewIngrediente({...newIngrediente, nombre: e.target.value})}
                  margin="normal"
                  size={isMobile ? 'small' : 'medium'}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" size={isMobile ? 'small' : 'medium'}>
                  <InputLabel id="unidad-add-label">Unidad de medida</InputLabel>
                  <Select
                    labelId="unidad-add-label"
                    label="Unidad de medida"
                    value={newIngrediente.unidad_Medida}
                    onChange={(e) =>
                      setNewIngrediente({
                        ...newIngrediente,
                        unidad_Medida: e.target.value,
                      })
                    }
                    required
                  >
                    <MenuItem value="unidad">Unidad</MenuItem>
                    <MenuItem value="gramos">Gramos</MenuItem>
                    <MenuItem value="kilogramos">Kilogramos</MenuItem>
                    <MenuItem value="litros">Litros</MenuItem>
                    <MenuItem value="mililitros">Mililitros</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tamaño del paquete"
                  fullWidth
                  type="number"
                  value={newIngrediente.tamano_Paquete}
                  onChange={(e) => setNewIngrediente({...newIngrediente, tamano_Paquete: e.target.value})}
                  margin="normal"
                  size={isMobile ? 'small' : 'medium'}
                  inputProps={{ min: "0", step: "0.01" }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Costo"
                  fullWidth
                  type="number"
                  value={newIngrediente.costo}
                  onChange={(e) => setNewIngrediente({...newIngrediente, costo: e.target.value})}
                  margin="normal"
                  size={isMobile ? 'small' : 'medium'}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ min: "0", step: "0.01" }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Cantidad en Stock"
                  fullWidth
                  type="number"
                  value={newIngrediente.CantidadStock}
                  onChange={(e) => setNewIngrediente({...newIngrediente, CantidadStock: e.target.value})}
                  margin="normal"
                  size={isMobile ? 'small' : 'medium'}
                  inputProps={{ min: "0" }}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseAddModal}
              size={isMobile ? 'small' : 'medium'}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddIngrediente} 
              color="primary"
              variant="contained"
              size={isMobile ? 'small' : 'medium'}
            >
              Agregar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de confirmación para eliminar */}
        <Dialog 
          open={showConfirmation} 
          onClose={() => setShowConfirmation(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <Typography>¿Estás seguro de que deseas eliminar este ingrediente?</Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setShowConfirmation(false)}
              size={isMobile ? 'small' : 'medium'}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmarEliminar} 
              color="error"
              variant="contained"
              size={isMobile ? 'small' : 'medium'}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default IngredientList;