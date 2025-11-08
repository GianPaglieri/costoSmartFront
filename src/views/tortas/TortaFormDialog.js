import React from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CancelIcon from '@mui/icons-material/Cancel';

import { formatCurrency } from '../../utils/formatters';

const TortaFormDialog = ({
  open,
  onClose,
  onSubmit,
  onViewRecipe,
  isMobile,
  isEditing,
  form,
  onMarginChange,
  costoReferencia,
  precioActual,
  previewPrecio,
  previewImage,
  onImageSelect,
  onImageRemove,
  title,
  submitLabel,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
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
      {title}
      <IconButton onClick={onClose} size="small">
        <CancelIcon />
      </IconButton>
    </DialogTitle>

    <DialogContent dividers>
      <Box sx={{ mt: 1 }}>
        <TextField
          label="Nombre"
          margin="normal"
          fullWidth
          size={isMobile ? 'small' : 'medium'}
          {...form.getFieldProps('nombre_torta')}
        />

        <TextField
          label="Descripción"
          margin="normal"
          fullWidth
          multiline
          rows={isMobile ? 3 : 4}
          size={isMobile ? 'small' : 'medium'}
          {...form.getFieldProps('descripcion_torta')}
        />

        <TextField
          label="Porcentaje de ganancia (%)"
          margin="normal"
          fullWidth
          size={isMobile ? 'small' : 'medium'}
          value={form.values.porcentaje_ganancia}
          onChange={(event) => onMarginChange(event.target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          error={Boolean(form.errors.porcentaje_ganancia)}
          helperText={form.errors.porcentaje_ganancia || ' '}
        />

        {isEditing ? (
          <Paper
            variant="outlined"
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: 'grey.50',
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Resumen de costos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Costo base: {formatCurrency(costoReferencia)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Precio actual: {precioActual !== null ? formatCurrency(precioActual) : 'Sin calcular'}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
              Precio estimado: {previewPrecio !== null ? formatCurrency(previewPrecio) : 'N/A'}
            </Typography>
          </Paper>
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            El precio se calculará automáticamente cuando cargues ingredientes a la receta.
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<ImageIcon />}
            fullWidth={isMobile}
            size={isMobile ? 'small' : 'medium'}
          >
            Subir imagen
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(event) => onImageSelect(event.target.files?.[0] ?? null)}
            />
          </Button>

          {previewImage && (
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar
                src={previewImage}
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
                onClick={onImageRemove}
                size={isMobile ? 'small' : 'medium'}
                startIcon={<DeleteOutlineIcon />}
              >
                Eliminar
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </DialogContent>

    <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
      {isEditing ? (
        <Button onClick={onViewRecipe} color="secondary" size={isMobile ? 'small' : 'medium'}>
          Ver receta
        </Button>
      ) : (
        <Box />
      )}
      <Box>
        <Button onClick={onClose} size={isMobile ? 'small' : 'medium'} sx={{ mr: 1 }}>
          Cancelar
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          size={isMobile ? 'small' : 'medium'}
        >
          {submitLabel}
        </Button>
      </Box>
    </DialogActions>
  </Dialog>
);

export default TortaFormDialog;
