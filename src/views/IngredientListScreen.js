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
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { fetchIngredientes, agregarIngrediente, editarIngrediente, borrarIngrediente } from '../controllers/IngredientController';

const IngredientList = () => {
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
      // Ordenar los ingredientes alfabéticamente según el nombre
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
    <div style={{ maxWidth: 900, margin: '0 auto', marginBottom: 20 }}>
      <TextField
        label="Buscar"
        variant="outlined"
        fullWidth
        margin="normal"
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
      <Button variant="contained" color="primary" onClick={handleOpenAddModal}>
        Agregar Nuevo Ingrediente
      </Button>
      <TableContainer component={Paper} elevation={3} style={{ border: '1px solid #ddd' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Unidad de Medida</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Tamaño del Paquete</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Costo</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Stock</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredientes.filter(filtrarIngredientes).map((ingrediente) => (
              <TableRow key={ingrediente.id} style={{ borderBottom: '1px solid #ddd' }}>
                <TableCell>{ingrediente.nombre}</TableCell>
                <TableCell>{ingrediente.unidad_Medida}</TableCell>
                <TableCell>{ingrediente.tamano_Paquete}</TableCell>
                <TableCell>{ingrediente.costo}</TableCell>
                <TableCell>{ingrediente.CantidadStock}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenEditModal(ingrediente)}>Editar</Button>
                  <Button onClick={() => handleDeleteIngrediente(ingrediente.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editModalOpen} onClose={handleCloseEditModal}>
        <DialogTitle>Editar Ingrediente</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name="nombre"
            value={editedIngrediente.nombre}
            onChange={(event) => setEditedIngrediente({ ...editedIngrediente, nombre: event.target.value })}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Unidad de medida"
            name="unidad_Medida"
            value={editedIngrediente.unidad_Medida}
            onChange={(event) => setEditedIngrediente({ ...editedIngrediente, unidad_Medida: event.target.value })}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Tamaño del paquete"
            name="tamano_Paquete"
            value={editedIngrediente.tamano_Paquete}
            onChange={(event) => setEditedIngrediente({ ...editedIngrediente, tamano_Paquete: event.target.value })}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Costo"
            name="costo"
            value={editedIngrediente.costo}
            onChange={(event) => setEditedIngrediente({ ...editedIngrediente, costo: event.target.value })}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Cantidad en Stock"
            name="CantidadStock"
            value={editedIngrediente.CantidadStock}
            onChange={(event) => setEditedIngrediente({ ...editedIngrediente, CantidadStock: event.target.value })}
            margin="normal"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditIngrediente}>Guardar Cambios</Button>
          <Button onClick={handleCloseEditModal}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addModalOpen} onClose={handleCloseAddModal}>
        <DialogTitle>Agregar Nuevo Ingrediente</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name="nombre"
            value={newIngrediente.nombre}
            onChange={(event) => setNewIngrediente({ ...newIngrediente, nombre: event.target.value })}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Unidad de medida"
            name="unidad_Medida"
            value={newIngrediente.unidad_Medida}
            onChange={(event) => setNewIngrediente({ ...newIngrediente, unidad_Medida: event.target.value })}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Tamaño del paquete"
            name="tamano_Paquete"
            value={newIngrediente.tamano_Paquete}
            onChange={(event) => setNewIngrediente({ ...newIngrediente, tamano_Paquete: event.target.value })}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Costo"
            name="costo"
            value={newIngrediente.costo}
            onChange={(event) => setNewIngrediente({ ...newIngrediente, costo: event.target.value })}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Cantidad en Stock"
            name="CantidadStock"
            value={newIngrediente.CantidadStock}
            onChange={(event) => setNewIngrediente({ ...newIngrediente, CantidadStock: event.target.value })}
            margin="normal"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddIngrediente}>Agregar Ingrediente</Button>
          <Button onClick={handleCloseAddModal}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showConfirmation} onClose={() => setShowConfirmation(false)}>
        <DialogTitle>Confirmación de Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este ingrediente?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmarEliminar} color="primary">
            Confirmar
          </Button>
          <Button onClick={() => setShowConfirmation(false)} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default IngredientList;
