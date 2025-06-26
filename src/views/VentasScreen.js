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
  Button,
} from '@mui/material';
import { Search as SearchIcon, SaveAlt as SaveAltIcon } from '@mui/icons-material';
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

  const handleExport = () => {
    const headers = ['Nombre Torta', 'Precio', 'Fecha de Venta'];
    const rows = ventas.map((v) => [v.Torta.nombre_torta, v.precio_torta, v.fecha_venta]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ventas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <TextField
          label="Buscar"
          variant="outlined"
          fullWidth
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleExport}
          startIcon={<SaveAltIcon />}
        >
          Exportar
        </Button>
      </div>
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
