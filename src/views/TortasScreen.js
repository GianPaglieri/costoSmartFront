import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Grid,
  Snackbar,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useLocation, useNavigate } from 'react-router-dom';

import useDialogState from '../hooks/useDialogState';
import useGlobalSearch from '../hooks/useGlobalSearch';
import useEntityForm from '../hooks/useEntityForm';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import TortasTable from './tortas/TortasTable';
import TortaFormDialog from './tortas/TortaFormDialog';
import { fetchTortas, agregarTorta, editarTorta, borrarTorta } from '../controllers/TortaController';
import api from '../components/AxiosConfig';

const sanitizePercentInput = (value = '') => String(value).replace(/[^0-9.,-]/g, '');

const parsePercentValue = (value = '') => {
  if (value === null || value === undefined || value === '') return 0;
  const normalized = String(value).replace(',', '.');
  const parsed = parseFloat(normalized);
  return Number.isNaN(parsed) ? NaN : parsed;
};

const TORTA_INITIAL_VALUES = {
  nombre_torta: '',
  descripcion_torta: '',
  porcentaje_ganancia: '0',
  imagen: null,
};

const tortaValidators = {
  nombre_torta: (value) => (!value ? 'Ingresá el nombre de la torta.' : null),
  descripcion_torta: (value) => (!value ? 'Ingresá una descripción.' : null),
  porcentaje_ganancia: (value) => {
    const parsed = parsePercentValue(value);
    if (Number.isNaN(parsed) || parsed < 0) return 'Ingresá un porcentaje válido.';
    return null;
  },
};

const uploadsBase = api?.defaults?.baseURL
  ? api.defaults.baseURL === '/api'
    ? '/api'
    : api.defaults.baseURL
  : '';

const buildImg = (relativePath) => {
  if (!relativePath) return null;
  if (/^https?:\/\//i.test(relativePath)) return relativePath;
  const base = uploadsBase.replace(/\/$/, '');
  const normalized = String(relativePath).replace(/^\/+/, '');
  return `${base}/${normalized}`;
};

const TortasScreen = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const [tortas, setTortas] = useState([]);
  const [alert, setAlert] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentTorta, setCurrentTorta] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const modalDialog = useDialogState(false);
  const deleteDialog = useDialogState(false);

  const tortaForm = useEntityForm(TORTA_INITIAL_VALUES, tortaValidators);
  const [searchQuery] = useGlobalSearch('');

  const notify = (type, message) => {
    setAlert({ type, message });
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => setSnackbarOpen(false);

  const loadTortas = async () => {
    try {
      const data = await fetchTortas();
      const sorted = [...data].sort((a, b) => a.nombre_torta.localeCompare(b.nombre_torta));
      setTortas(sorted);
      return sorted;
    } catch (error) {
      console.error('Error al obtener las tortas:', error);
      notify('error', 'No se pudieron cargar las tortas.');
      return [];
    }
  };

  useEffect(() => {
    loadTortas();
  }, []);

  const filteredTortas = useMemo(() => {
    if (!searchQuery) return tortas;
    const term = searchQuery.toLowerCase();
    return tortas.filter(
      (torta) =>
        (torta.nombre_torta || '').toLowerCase().includes(term) ||
        (torta.descripcion_torta || '').toLowerCase().includes(term)
    );
  }, [tortas, searchQuery]);

  const isEditing = Boolean(currentTorta);
  const marginValue = parsePercentValue(tortaForm.values.porcentaje_ganancia);
  const costoReferencia = currentTorta?.costo_total ?? 0;
  const precioActual = currentTorta
    ? currentTorta.precio_lista ?? currentTorta.costo_total ?? 0
    : null;
  const previewPrecio =
    isEditing && Number.isFinite(marginValue)
      ? (currentTorta?.costo_total ?? 0) * (1 + marginValue / 100)
      : null;

  useEffect(() => {
    let urlToRevoke = null;
    const currentImage = tortaForm.values.imagen;
    if (currentImage instanceof File) {
      urlToRevoke = URL.createObjectURL(currentImage);
      setImagePreview(urlToRevoke);
    } else if (typeof currentImage === 'string' && currentImage) {
      setImagePreview(buildImg(currentImage));
    } else if (isEditing && currentTorta?.imagen) {
      setImagePreview(buildImg(currentTorta.imagen));
    } else {
      setImagePreview(null);
    }

    return () => {
      if (urlToRevoke) {
        URL.revokeObjectURL(urlToRevoke);
      }
    };
  }, [tortaForm.values.imagen, isEditing, currentTorta]);

  const handleOpenModal = (torta = null) => {
    if (torta) {
      setCurrentTorta(torta);
      tortaForm.resetForm({
        nombre_torta: torta.nombre_torta ?? '',
        descripcion_torta: torta.descripcion_torta ?? '',
        porcentaje_ganancia: String(torta.porcentaje_ganancia ?? 0),
        imagen: torta.imagen ?? null,
      });
    } else {
      setCurrentTorta(null);
      tortaForm.resetForm(TORTA_INITIAL_VALUES);
    }
    modalDialog.handleOpen();
  };

  const handleCloseModal = () => {
    modalDialog.handleClose();
    setCurrentTorta(null);
    tortaForm.resetForm(TORTA_INITIAL_VALUES);
    navigate('/tortas', { replace: true, state: {} });
  };

  const handleMarginChange = (value) => {
    tortaForm.setFieldValue('porcentaje_ganancia', sanitizePercentInput(value));
  };

  const handleImageSelect = (file) => {
    tortaForm.setFieldValue('imagen', file);
  };

  const handleImageRemove = () => {
    tortaForm.setFieldValue('imagen', null);
  };

  const handleCreateTorta = async () => {
    const { isValid } = tortaForm.validate();
    if (!isValid) {
      notify('error', 'Revisá los campos marcados antes de continuar.');
      return;
    }

    try {
      await agregarTorta({
        ...tortaForm.values,
        porcentaje_ganancia: parsePercentValue(tortaForm.values.porcentaje_ganancia) ?? 0,
      });
      await loadTortas();
      notify('success', 'Torta agregada exitosamente.');
      handleCloseModal();
    } catch (error) {
      console.error('Error al agregar la torta:', error);
      notify('error', 'Error al agregar la torta.');
    }
  };

  const handleUpdateTorta = async () => {
    const { isValid } = tortaForm.validate();
    if (!isValid) {
      notify('error', 'Revisá los campos marcados antes de continuar.');
      return;
    }
    if (!currentTorta) return;

    try {
      await editarTorta({
        ...currentTorta,
        ...tortaForm.values,
        porcentaje_ganancia: parsePercentValue(tortaForm.values.porcentaje_ganancia) ?? 0,
      });
      await loadTortas();
      notify('success', 'Torta editada exitosamente.');
      handleCloseModal();
    } catch (error) {
      console.error('Error al editar la torta:', error);
      notify('error', 'Error al editar la torta.');
    }
  };

  const handleSubmitForm = () => {
    if (isEditing) {
      handleUpdateTorta();
    } else {
      handleCreateTorta();
    }
  };

  const handleRequestDelete = (id) => {
    setPendingDeleteId(id);
    deleteDialog.handleOpen();
  };

  const handleConfirmDelete = async () => {
    try {
      if (!pendingDeleteId) return;
      const response = await borrarTorta(pendingDeleteId);
      if (response.success) {
        await loadTortas();
        notify('success', 'Torta eliminada correctamente.');
      } else {
        const message =
          typeof response.error === 'string'
            ? response.error
            : response.error?.message || 'Error al eliminar la torta.';
        notify('error', message);
      }
    } catch (error) {
      console.error('Error al eliminar la torta:', error);
      notify('error', 'Error al eliminar la torta.');
    } finally {
      deleteDialog.handleClose();
      setPendingDeleteId(null);
    }
  };

  const handleViewRecipe = () => {
    if (currentTorta?.ID_TORTA) {
      navigate('/recetas', { state: { recetaTortaId: currentTorta.ID_TORTA } });
    }
  };

  useEffect(() => {
    const stateId = location.state?.editTortaId;
    if (!stateId) return;

    const existing = tortas.find((t) => t.ID_TORTA === stateId);
    if (existing) {
      handleOpenModal(existing);
    } else {
      (async () => {
        const data = await loadTortas();
        const found = data.find((t) => t.ID_TORTA === stateId);
        if (found) {
          handleOpenModal(found);
        }
      })();
    }
  }, [location.state, tortas]);

  return (
      <Box
        sx={{
          width: '100%',
          p: isMobile ? 2 : 3,
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4} md={3} sx={{ ml: 'auto' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenModal()}
              fullWidth
              startIcon={<AddRoundedIcon />}
              size={isMobile ? 'medium' : 'large'}
            >
              {isMobile ? 'Agregar' : 'Nueva Torta'}
            </Button>
          </Grid>
        </Grid>

        <TortasTable
          tortas={filteredTortas}
          onEdit={handleOpenModal}
          onDelete={handleRequestDelete}
          isMobile={isMobile}
        />

        <TortaFormDialog
          open={modalDialog.open}
          onClose={handleCloseModal}
          onSubmit={handleSubmitForm}
          onViewRecipe={handleViewRecipe}
          isMobile={isMobile}
          isEditing={isEditing}
          form={tortaForm}
          onMarginChange={handleMarginChange}
          costoReferencia={costoReferencia}
          precioActual={precioActual}
          previewPrecio={previewPrecio}
          previewImage={imagePreview}
          onImageSelect={handleImageSelect}
          onImageRemove={handleImageRemove}
          title={isEditing ? 'Editar torta' : 'Agregar torta'}
          submitLabel={isEditing ? 'Guardar cambios' : 'Agregar torta'}
        />

        <ConfirmDeleteDialog
          open={deleteDialog.open}
          title="Confirmar eliminación"
          message="¿Estás seguro de que querés eliminar esta torta?"
          onCancel={() => {
            deleteDialog.handleClose();
            setPendingDeleteId(null);
          }}
          onConfirm={handleConfirmDelete}
        />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={closeSnackbar}
          anchorOrigin={{
            vertical: isMobile ? 'bottom' : 'top',
            horizontal: 'center',
          }}
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

export default TortasScreen;
