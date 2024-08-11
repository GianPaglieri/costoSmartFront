import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { obtenerVentas } from '../controllers/VentaController';

const VentasScreen = () => {
  const [ventas, setVentas] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerVentas();
        // Ordenar los datos por ID de forma ascendente
        const ventasOrdenadas = data.sort((a, b) => b.ID - a.ID);
        setVentas(ventasOrdenadas);
      } catch (error) {
        console.error('Error al obtener las ventas:', error);
      }
    };

    fetchData();
  }, []);

  const filtrarVentas = (venta) => {
    return (
      venta.ID.toString().includes(filtro) ||
      venta.Torta.nombre_torta.toLowerCase().includes(filtro.toLowerCase()) ||
      venta.precio_torta.toString().includes(filtro) ||
      venta.fecha_venta.includes(filtro)
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
      <TableContainer component={Paper} elevation={3} style={{ border: '1px solid #ddd' }}>
        <Table>
          <TableHead>
            <TableRow>
              
              <TableCell style={{ fontWeight: 'bold' }}>Nombre Torta</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Precio</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Fecha de Venta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventas.filter(filtrarVentas).map((venta) => (
              <TableRow key={venta.ID}>
             
                <TableCell>{venta.Torta.nombre_torta}</TableCell>
                <TableCell>{venta.precio_torta}</TableCell>
                <TableCell>{venta.fecha_venta}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default VentasScreen;
