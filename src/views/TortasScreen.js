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
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { fetchTortas, agregarTorta, editarTorta, borrarTorta } from '../controllers/TortaController';

const TortasScreen = () => {
  const [tortas, setTortas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editedTorta, setEditedTorta] = useState(null);
  const [deletedTortaId, setDeletedTortaId] = useState(null);
  const [newTorta, setNewTorta] = useState({
    nombre_torta: '',
    descripcion_torta: '',
    imagen: null,
  });
  const [filtro, setFiltro] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerTortas();
  }, []);

  
  const obtenerTortas = async () => {
    try {
      const data = await fetchTortas();
      // Ordenar los ingredientes alfabéticamente según el nombre
      const sortedTortas = data.sort((a, b) => a.nombre_torta.localeCompare(b.nombre_torta));
      setTortas(sortedTortas);
    } catch (error) {
      console.error('Error al obtener las tortas:', error);
    }
  };

  const handleOpenAddModal = (torta = null) => {
    if (torta) {
      setEditedTorta(torta);
      setNewTorta({ ...torta, imagen: null }); // Update newTorta with existing torta data
    } else {
      setEditedTorta(null);
      setNewTorta({ nombre_torta: '', descripcion_torta: '', imagen: null });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setDeletedTortaId(null);
    setNewTorta({ nombre_torta: '', descripcion_torta: '', imagen: null });
    setError('');
  };

  const handleAddTorta = async () => {
    if (!newTorta.nombre_torta || !newTorta.descripcion_torta) {
      setError('Por favor complete todos los campos.');
      return;
    }

    try {
      await agregarTorta(newTorta);
      const data = await fetchTortas();
      setTortas(data);
    } catch (error) {
      console.error('Error al agregar la torta:', error);
    }

    handleCloseModal();
  };

  const handleEditTorta = async () => {
    if (!newTorta.nombre_torta || !newTorta.descripcion_torta) {
      setError('Por favor complete todos los campos.');
      return;
    }

    try {
      await editarTorta(newTorta);
      const data = await fetchTortas();
      setTortas(data);
    } catch (error) {
      console.error('Error al editar la torta:', error);
    }

    handleCloseModal();
  };

  const handleDeleteTorta = async (id) => {
    try {
      await borrarTorta(id);
      const data = await fetchTortas();
      setTortas(data);
    } catch (error) {
      console.error('Error al eliminar la torta:', error);
    }

    handleCloseModal();
  };

  const filtrarTortas = (torta) => {
    return (
      torta.nombre_torta.toLowerCase().includes(filtro.toLowerCase()) ||
      torta.descripcion_torta.toLowerCase().includes(filtro.toLowerCase())
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', marginBottom: 20 }}>
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
      <Button variant="contained" color="primary" onClick={() => handleOpenAddModal()}>
        Agregar Nueva Torta
      </Button>

      <TableContainer component={Paper} elevation={3} style={{ border: '1px solid #ddd' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Nombre Torta</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Descripción Torta</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          
  {tortas && tortas.filter(filtrarTortas).map((torta) => (
    <TableRow key={torta.ID_TORTA} style={{ borderBottom: '1px solid #ddd' }}>
      <TableCell>{torta.nombre_torta}</TableCell>
      <TableCell>{torta.descripcion_torta}</TableCell>
      <TableCell>
        <Button onClick={() => handleOpenAddModal(torta)}>Editar</Button>
        <Button onClick={() => handleDeleteTorta(torta.ID_TORTA)}>Eliminar</Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
        </Table>
      </TableContainer>

      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>{editedTorta ? 'Editar Torta' : 'Agregar Torta'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextField
              label="Nombre"
              name="nombre_torta"
              value={newTorta.nombre_torta}
              onChange={(event) => setNewTorta({ ...newTorta, nombre_torta: event.target.value })}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Descripción"
              name="descripcion_torta"
              value={newTorta.descripcion_torta}
              onChange={(event) => setNewTorta({ ...newTorta, descripcion_torta: event.target.value })}
              margin="normal"
              fullWidth
            />
            <input
              type="file"
              name="imagen"
              onChange={(event) => setNewTorta({ ...newTorta, imagen: event.target.files[0] })}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={editedTorta ? handleEditTorta : handleAddTorta}>
            {editedTorta ? 'Editar Torta' : 'Agregar Torta'}
          </Button>
          <Button onClick={handleCloseModal}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TortasScreen;
