import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Grid, Snackbar, Alert, useMediaQuery, useTheme } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import useDialogState from '../hooks/useDialogState';
import useGlobalSearch from '../hooks/useGlobalSearch';
import useEntityForm from '../hooks/useEntityForm';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import IngredientTable from './ingredients/IngredientTable';
import IngredientFormDialog from './ingredients/IngredientFormDialog';
import {
  fetchIngredientes,
  agregarIngrediente,
  editarIngrediente,
  borrarIngrediente,
} from '../controllers/IngredientController';

const INGREDIENT_INITIAL_VALUES = {
  nombre: '',
  unidad_Medida: 'unidad',
  tamano_Paquete: '',
  costo: '',
  CantidadStock: '',
};

const ingredientValidators = {
  nombre: (value) => (!value ? 'Ingresá el nombre del ingrediente.' : null),
  unidad_Medida: (value) => (!value ? 'Seleccioná la unidad de medida.' : null),
  tamano_Paquete: (value) => {
    if (value === '') return 'Ingresá el tamaño del paquete.';
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed <= 0) return 'Ingresá un tamaño válido.';
    return null;
  },
  costo: (value) => {
    if (value === '') return 'Ingresá el costo.';
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed <= 0) return 'Ingresá un costo válido.';
    return null;
  },
  CantidadStock: (value) => {
    if (value === '') return 'Ingresá la cantidad en stock.';
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 0) return 'El stock no puede ser negativo.';
    return null;
  },
};

const LOW_STOCK_THRESHOLD = 5;

const toFormValues = (ingrediente = INGREDIENT_INITIAL_VALUES) => ({
  ...ingrediente,
  tamano_Paquete: ingrediente.tamano_Paquete !== undefined ? String(ingrediente.tamano_Paquete) : '',
  costo: ingrediente.costo !== undefined ? String(ingrediente.costo) : '',
  CantidadStock:
    ingrediente.CantidadStock !== undefined ? String(ingrediente.CantidadStock) : '',
});

const toPayload = (values) => ({
  ...values,
  tamano_Paquete: Number(values.tamano_Paquete),
  costo: Number(values.costo),
  CantidadStock: Number(values.CantidadStock),
});

const IngredientList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [ingredientes, setIngredientes] = useState([]);
  const [alert, setAlert] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const addDialog = useDialogState(false);
  const editDialog = useDialogState(false);
  const deleteDialog = useDialogState(false);

  const addForm = useEntityForm(INGREDIENT_INITIAL_VALUES, ingredientValidators);
  const editForm = useEntityForm(INGREDIENT_INITIAL_VALUES, ingredientValidators);

  const [editingIngredient, setEditingIngredient] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const [searchQuery] = useGlobalSearch('');

  const notify = (type, message) => {
    setAlert({ type, message });
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => setSnackbarOpen(false);

  const loadIngredientes = async () => {
    try {
      const data = await fetchIngredientes();
      const sorted = [...data].sort((a, b) => a.nombre.localeCompare(b.nombre));
      setIngredientes(sorted);
    } catch (error) {
      console.error('Error al obtener los ingredientes:', error);
      notify('error', 'No se pudieron cargar los ingredientes.');
    }
  };

  useEffect(() => {
    loadIngredientes();
  }, []);

  const filteredIngredientes = useMemo(() => {
    if (!searchQuery) return ingredientes;
    const term = searchQuery.toLowerCase();
    return ingredientes.filter((ingrediente) => {
      return (
        ingrediente.nombre.toLowerCase().includes(term) ||
        ingrediente.unidad_Medida.toLowerCase().includes(term) ||
        String(ingrediente.tamano_Paquete ?? '').includes(term) ||
        String(ingrediente.costo ?? '').includes(term) ||
        String(ingrediente.CantidadStock ?? '').includes(term)
      );
    });
  }, [ingredientes, searchQuery]);

  const handleOpenAddModal = () => {
    addForm.resetForm(INGREDIENT_INITIAL_VALUES);
    addDialog.handleOpen();
  };

  const handleAddIngrediente = async () => {
    const { isValid } = addForm.validate();
    if (!isValid) {
      notify('error', 'Revisá los campos marcados antes de continuar.');
      return;
    }

    try {
      await agregarIngrediente(toPayload(addForm.values));
      await loadIngredientes();
      notify('success', 'Ingrediente agregado exitosamente.');
      addDialog.handleClose();
      addForm.resetForm(INGREDIENT_INITIAL_VALUES);
    } catch (error) {
      console.error('Error al agregar el ingrediente:', error);
      notify('error', 'Error al agregar el ingrediente.');
    }
  };

  const handleOpenEditModal = (ingrediente) => {
    setEditingIngredient(ingrediente);
    editForm.resetForm(toFormValues(ingrediente));
    editDialog.handleOpen();
  };

  const handleEditIngrediente = async () => {
    const { isValid } = editForm.validate();
    if (!isValid) {
      notify('error', 'Revisá los campos marcados antes de continuar.');
      return;
    }

    try {
      await editarIngrediente({
        ...editingIngredient,
        ...toPayload(editForm.values),
      });
      await loadIngredientes();
      notify('success', 'Ingrediente editado exitosamente.');
      editDialog.handleClose();
    } catch (error) {
      console.error('Error al editar el ingrediente:', error);
      notify('error', 'Error al editar el ingrediente.');
    }
  };

  const handleRequestDelete = (id) => {
    setPendingDeleteId(id);
    deleteDialog.handleOpen();
  };

  const handleConfirmDelete = async () => {
    try {
      if (!pendingDeleteId) return;

      const response = await borrarIngrediente(pendingDeleteId);
      if (response.success) {
        await loadIngredientes();
        notify('success', 'Ingrediente eliminado exitosamente.');
      } else {
        let message = response.error || 'Error al eliminar el ingrediente.';
        if (Array.isArray(response.recetas) && response.recetas.length) {
          const listado = response.recetas
            .map((receta) => receta.tortaNombre || `Torta ID ${receta.tortaId}`)
            .join(', ');
          message = `${message} Usado en: ${listado}.`;
        }
        notify('error', message);
      }
    } catch (error) {
      console.error('Error al eliminar el ingrediente:', error);
      notify('error', 'Error al eliminar el ingrediente.');
    } finally {
      deleteDialog.handleClose();
      setPendingDeleteId(null);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        p: isMobile ? 1 : 3,
        maxWidth: 1200,
        mx: 'auto',
      }}
    >
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4} md={3} sx={{ ml: 'auto' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddModal}
            fullWidth
            startIcon={<AddRoundedIcon />}
            size={isMobile ? 'medium' : 'large'}
          >
            {isMobile ? 'Agregar' : 'Nuevo Ingrediente'}
          </Button>
        </Grid>
      </Grid>

      <IngredientTable
        items={filteredIngredientes}
        onEdit={handleOpenEditModal}
        onDelete={handleRequestDelete}
        isMobile={isMobile}
        lowStockThreshold={LOW_STOCK_THRESHOLD}
      />

      <IngredientFormDialog
        open={addDialog.open}
        title="Agregar nuevo ingrediente"
        submitLabel="Agregar"
        form={addForm}
        onSubmit={handleAddIngrediente}
        onClose={addDialog.handleClose}
        isMobile={isMobile}
      />

      <IngredientFormDialog
        open={editDialog.open}
        title="Editar ingrediente"
        submitLabel="Guardar cambios"
        form={editForm}
        onSubmit={handleEditIngrediente}
        onClose={() => {
          editDialog.handleClose();
          setEditingIngredient(null);
        }}
        isMobile={isMobile}
      />

      <ConfirmDeleteDialog
        open={deleteDialog.open}
        title="Confirmar eliminación"
        message="¿Estás seguro de eliminar este ingrediente?"
        onCancel={() => {
          deleteDialog.handleClose();
          setPendingDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: isMobile ? 'bottom' : 'top', horizontal: 'center' }}
      >
        {alert ? (
          <Alert onClose={closeSnackbar} severity={alert.type} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        ) : null}
      </Snackbar>
    </Box>
  );
};

export default IngredientList;
