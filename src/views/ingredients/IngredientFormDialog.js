import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
} from '@mui/material';

const UNIT_OPTIONS = ['unidad', 'gramos', 'kilogramos', 'litros', 'mililitros'];

const IngredientFormDialog = ({
  open,
  title,
  submitLabel,
  form,
  onSubmit,
  onClose,
  isMobile,
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre"
            fullWidth
            margin="normal"
            size={isMobile ? 'small' : 'medium'}
            {...form.getFieldProps('nombre')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal" size={isMobile ? 'small' : 'medium'}>
            <InputLabel id="unidad-label">Unidad de medida</InputLabel>
            <Select
              labelId="unidad-label"
              label="Unidad de medida"
              value={form.values.unidad_Medida}
              onChange={(event) => form.setFieldValue('unidad_Medida', event.target.value)}
            >
              {UNIT_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Tamaño del paquete"
            fullWidth
            type="number"
            margin="normal"
            size={isMobile ? 'small' : 'medium'}
            inputProps={{ min: '0', step: '0.01' }}
            {...form.getFieldProps('tamano_Paquete')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Costo"
            fullWidth
            type="number"
            margin="normal"
            size={isMobile ? 'small' : 'medium'}
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            inputProps={{ min: '0', step: '0.01' }}
            {...form.getFieldProps('costo')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Cantidad en stock"
            fullWidth
            type="number"
            margin="normal"
            size={isMobile ? 'small' : 'medium'}
            inputProps={{ min: '0', step: '1' }}
            {...form.getFieldProps('CantidadStock')}
          />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} size={isMobile ? 'small' : 'medium'}>
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
    </DialogActions>
  </Dialog>
);

export default IngredientFormDialog;
