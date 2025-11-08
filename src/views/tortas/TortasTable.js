import React from 'react';
import {
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

const TortasTable = ({ tortas, onEdit, onDelete, isMobile }) => (
  <TableContainer
    component={Paper}
    elevation={0}
    sx={{
      width: '100%',
      overflowX: 'auto',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      maxHeight: isMobile ? '70vh' : '75vh',
    }}
  >
    <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Torta</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }} align="right">
            Acciones
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tortas.map((torta) => (
          <TableRow key={torta.ID_TORTA} hover>
            <TableCell>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {torta.nombre_torta}
              </Typography>
              {torta.descripcion_torta && (
                <Typography variant="body2" color="text.secondary">
                  {torta.descripcion_torta}
                </Typography>
              )}
            </TableCell>
            <TableCell align="right">
              <IconButton
                onClick={() => onEdit(torta)}
                color="primary"
                size="small"
                title="Editar"
              >
                <EditOutlinedIcon fontSize={isMobile ? 'small' : 'medium'} />
              </IconButton>
              <IconButton
                onClick={() => onDelete(torta.ID_TORTA)}
                color="error"
                size="small"
                title="Eliminar"
              >
                <DeleteOutlineIcon fontSize={isMobile ? 'small' : 'medium'} />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default TortasTable;
