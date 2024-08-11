import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
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
} from '@mui/material';
import {
  fetchRecetas,
  editarReceta,
  agregarIngrediente,
  eliminarIngrediente,
  baseUrl
} from '../controllers/RecetaController';
import { fetchIngredientes } from '../controllers/IngredientController';
import { fetchListaPrecios } from '../controllers/ListaPreciosController';

const RecetasComponent = () => {
  const [recetas, setRecetas] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editedReceta, setEditedReceta] = useState({});
  const [newIngrediente, setNewIngrediente] = useState({ id_ingrediente: '', total_cantidad: '' });
  const [editedIngredienteIndex, setEditedIngredienteIndex] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recetasData = await fetchRecetas();
        setRecetas(recetasData || []);
        
        const ingredientesData = await fetchIngredientes();
        setIngredientes(ingredientesData || []);
        
        const preciosData = await fetchListaPrecios();
        setPrecios(preciosData || []);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (receta) => {
    if (receta && receta.ID_TORTA) {
      setEditedReceta(receta);
      setModalOpen(true);
    } else {
      console.error('Receta no válida:', receta);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditedIngredienteIndex(null);
  };

  const handleEditReceta = async () => {
    try {
      if (editedReceta.ID_TORTA) {
        const response = await editarReceta(editedReceta);

        if (response.success) {
          setAlertMessage({ type: 'success', message: 'Receta editada exitosamente' });
          setSnackbarOpen(true);

          const updatedRecetas = await fetchRecetas();
          setRecetas(updatedRecetas || []);
        } else {
          setAlertMessage({ type: 'error', message: response.error });
          setSnackbarOpen(true);
        }
      } else {
        console.error('ID_TORTA no definido en editedReceta.');
      }
    } catch (error) {
      setAlertMessage({ type: 'error', message: `Error al editar receta: ${error.message || 'Error interno'}` });
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAddIngrediente = async () => {
    try {
      if (editedReceta.ID_TORTA && newIngrediente.id_ingrediente && newIngrediente.total_cantidad) {
        const response = await agregarIngrediente(
          editedReceta.ID_TORTA,
          newIngrediente.id_ingrediente,
          newIngrediente.total_cantidad
        );

        if (response.success) {
          setAlertMessage({ type: 'success', message: 'Ingrediente agregado exitosamente' });
          setSnackbarOpen(true);

          // Actualiza los precios
          const updatedPrecios = await fetchListaPrecios();
          setPrecios(updatedPrecios || []);

          // Actualiza la lista de ingredientes de la receta actual
          const updatedReceta = { ...editedReceta };
          updatedReceta.ingredientes.push({
            ID_INGREDIENTE: newIngrediente.id_ingrediente,
            total_cantidad: newIngrediente.total_cantidad,
            Nombre: ingredientes.find(ingrediente => ingrediente.id === newIngrediente.id_ingrediente)?.nombre || ''
          });
          setEditedReceta(updatedReceta);

          // Limpiar los datos del nuevo ingrediente
          setNewIngrediente({ id_ingrediente: '', total_cantidad: '' });
        } else {
          setAlertMessage({ type: 'error', message: response.error });
          setSnackbarOpen(true);
        }
      } else {
        console.error('Datos insuficientes para agregar ingrediente.');
      }
    } catch (error) {
      setAlertMessage({ type: 'error', message: `Error al agregar ingrediente: ${error.message || 'Error interno'}` });
      setSnackbarOpen(true);
    }
  };

  const handleDeleteIngrediente = async (index) => {
    try {
      const ingrediente = editedReceta.ingredientes[index];
      const response = await eliminarIngrediente(editedReceta.ID_TORTA, ingrediente.ID_INGREDIENTE);

      if (response.success) {
        setAlertMessage({ type: 'success', message: 'Ingrediente eliminado exitosamente' });

        // Eliminar el ingrediente localmente de la receta
        const updatedRecetas = recetas.map((receta) => {
          if (receta.ID_TORTA === editedReceta.ID_TORTA) {
            return {
              ...receta,
              ingredientes: receta.ingredientes.filter((ing, idx) => idx !== index)
            };
          }
          return receta;
        });
        setRecetas(updatedRecetas);

        // Actualiza los precios
        const updatedPrecios = await fetchListaPrecios();
        setPrecios(updatedPrecios || []);

        // Actualiza el estado de editedReceta con la nueva lista de ingredientes
        const updatedEditedReceta = {
          ...editedReceta,
          ingredientes: editedReceta.ingredientes.filter((ing, idx) => idx !== index)
        };
        setEditedReceta(updatedEditedReceta);
      } else {
        setAlertMessage({ type: 'error', message: response.error || 'Error interno' });
      }

      setSnackbarOpen(true);
    } catch (error) {
      setAlertMessage({ type: 'error', message: `Error al eliminar el ingrediente: ${error.message || 'Error interno'}` });
      setSnackbarOpen(true);
      console.error('Error al eliminar el ingrediente:', error);
    }
  };

  const handleEditIngrediente = (index) => {
    console.log('Antes de la edición:', editedReceta);
    setEditedIngredienteIndex(index);
    console.log('Después de la edición:', editedReceta);
  };

  const handleEditInputChange = (event, index) => {
    const { value } = event.target;
    setEditedReceta((prevReceta) => {
      const updatedIngredientes = [...prevReceta.ingredientes];
      updatedIngredientes[index] = {
        ...updatedIngredientes[index],
        total_cantidad: value,
      };
      return {
        ...prevReceta,
        ingredientes: updatedIngredientes,
      };
    });
  };

  const handleSaveIngrediente = async () => {
    try {
      if (editedReceta.ID_TORTA && editedReceta.ingredientes[editedIngredienteIndex]) {
        const ingrediente = editedReceta.ingredientes[editedIngredienteIndex];
        const response = await editarReceta({
          ID_TORTA: editedReceta.ID_TORTA,
          ID_INGREDIENTE: ingrediente.ID_INGREDIENTE,
          total_cantidad: ingrediente.total_cantidad,
        });

        if (response.success) {
          setAlertMessage({ type: 'success', message: 'Ingrediente editado exitosamente' });
          setSnackbarOpen(true);

          const updatedRecetas = await fetchRecetas();
          setRecetas(updatedRecetas || []);
           // Actualiza los precios
           const updatedPrecios = await fetchListaPrecios();
           setPrecios(updatedPrecios || []);
        } else {
          setAlertMessage({ type: 'error', message: response.error });
          setSnackbarOpen(true);
        }
      } else {
        console.error('Datos insuficientes para editar ingrediente.');
      }
    } catch (error) {
      setAlertMessage({ type: 'error', message: `Error al editar ingrediente: ${error.message || 'Error interno'}` });
      setSnackbarOpen(true);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewIngrediente((prevIngrediente) => ({
      ...prevIngrediente,
      [name]: value,
    }));
  };

  const obtenerPrecioPorIdTorta = (idTorta) => {
    const precioEncontrado = precios.find((precio) => precio.id_torta === idTorta);
    return precioEncontrado ? `$${precioEncontrado.costo_total}` : 'Precio no disponible';
  };

  return (
    <Grid container spacing={2}>
      {snackbarOpen && (
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={alertMessage.type}>
            {alertMessage.message}
          </Alert>
        </Snackbar>
      )}

      {recetas.map((receta, index) => (
        <Grid item key={`${receta.ID_TORTA}-${index}`} xs={8} sm={6} md={4}>
          <Card
            sx={{
              height: '250px',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
            onClick={() => handleOpenModal(receta)}
          >
            <div style={{ position: 'relative', overflow: 'hidden', height: '100%' }}>
              <img
                src={`http://localhost:3000/${receta.imagen}`}
                alt={receta.nombre_torta}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0, 0, 0, 0.7)', padding: '8px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ textAlign: 'left' }}>
                  <Typography variant="body1">
                    {receta.nombre_torta}
                  </Typography>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Typography variant="h6" style={{ marginBottom: '8px' }}>
                    {obtenerPrecioPorIdTorta(receta.ID_TORTA)}
                  </Typography>
                </div>
              </div>
            </div>
          </Card>
        </Grid>
      ))}

      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>Detalles de la Receta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <List>
              <Typography variant="subtitle1">{`Ingredientes para ${editedReceta.nombre_torta}:`}</Typography>
              {editedReceta.ingredientes &&
                editedReceta.ingredientes.map((ingrediente, ingredienteIndex) => (
                  <ListItem key={ingredienteIndex}>
                    <ListItemText
                      primary={ingrediente.Nombre}
                      secondary={
                        editedIngredienteIndex === ingredienteIndex ? (
                          <TextField
                            label="Cantidad"
                            name="total_cantidad"
                            value={ingrediente.total_cantidad}
                            onChange={(event) => handleEditInputChange(event, ingredienteIndex)}
                            margin="normal"
                          />
                        ) : (
                          `Cantidad: ${ingrediente.total_cantidad}`
                        )
                      }
                    />
                    {editedIngredienteIndex === ingredienteIndex ? (
                      <Button onClick={handleSaveIngrediente}>Guardar</Button>
                    ) : (
                      <>
                        <Button onClick={() => handleEditIngrediente(ingredienteIndex)}>Editar</Button>
                        <Button onClick={() => handleDeleteIngrediente(ingredienteIndex)}>Eliminar</Button>
                      </>
                    )}
                  </ListItem>
                ))}
              <FormControl fullWidth>
                <InputLabel id="select-ingrediente-label">Ingrediente</InputLabel>
                <Select
                  labelId="select-ingrediente-label"
                  id="select-ingrediente"
                  name="id_ingrediente"
                  value={newIngrediente.id_ingrediente}
                  onChange={handleInputChange}
                  fullWidth
                >
                  {ingredientes.map((ingrediente) => (
                    <MenuItem key={ingrediente.id} value={ingrediente.id}>
                      {ingrediente.nombre}
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
              />
              <Button onClick={handleAddIngrediente}>Guardar Ingrediente</Button>
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default RecetasComponent;
