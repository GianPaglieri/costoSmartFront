import React from 'react';
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const IngredientTable = ({
  items,
  onEdit,
  onDelete,
  isMobile,
  lowStockThreshold,
}) => (
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
        {items.map((ingrediente) => {
          const stockActual = Number(ingrediente.CantidadStock ?? 0);
          const isOutOfStock = stockActual <= 0;
          const isLowStock = !isOutOfStock && stockActual <= lowStockThreshold;

          return (
            <TableRow
              key={ingrediente.id}
              hover
              sx={{
                backgroundColor: isOutOfStock
                  ? 'rgba(248,113,113,0.12)'
                  : isLowStock
                  ? 'rgba(248,113,113,0.06)'
                  : 'inherit',
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: isOutOfStock
                    ? 'rgba(248,113,113,0.18)'
                    : isLowStock
                    ? 'rgba(248,113,113,0.1)'
                    : 'rgba(148,163,184,0.08)',
                },
              }}
            >
              <TableCell>{ingrediente.nombre}</TableCell>
              {!isMobile && (
                <>
                  <TableCell>{ingrediente.unidad_Medida}</TableCell>
                  <TableCell>{ingrediente.tamano_Paquete}</TableCell>
                </>
              )}
              <TableCell align="right">${ingrediente.costo}</TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                  <Typography>{stockActual}</Typography>
                  {(isOutOfStock || isLowStock) && (
                    <Chip
                      label={isOutOfStock ? 'Sin stock' : 'Stock bajo'}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: 'rgba(239, 68, 68, 0.35)',
                        color: '#b91c1c',
                        backgroundColor: 'rgba(254, 226, 226, 0.6)',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(ingrediente)} color="primary" size="small">
                  <EditOutlinedIcon fontSize={isMobile ? 'small' : 'medium'} />
                </IconButton>
                <IconButton onClick={() => onDelete(ingrediente.id)} color="error" size="small">
                  <DeleteOutlineIcon fontSize={isMobile ? 'small' : 'medium'} />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

export default IngredientTable;
