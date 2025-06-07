import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterScreen = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (!nombre || !email || !contrasena || !confirmarContrasena) {
        setError('Todos los campos son obligatorios');
        return;
      }

      if (contrasena !== confirmarContrasena) {
        setError('Las contraseñas no coinciden');
        return;
      }

      const response = await axios.post('http://149.50.131.253/api/users/register', {
        nombre,
        email,
        contrasena,
      });

      console.log('Respuesta del servidor:', response.data);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.error || 'Error al registrar usuario');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: '#f4f6f8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
          Registrarse
        </Typography>

        <TextField
          label="Nombre"
          fullWidth
          margin="normal"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <TextField
          label="Correo electrónico"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <TextField
          label="Confirmar contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={confirmarContrasena}
          onChange={(e) => setConfirmarContrasena(e.target.value)}
        />

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleRegister}
        >
          Registrarse
        </Button>
         <Link 
                        to="/" 
                        style={{ textDecoration: 'none' , textAlign: 'center' }}
                      >
                        <Typography 
                          variant="body2" 
                          color="primary"
                          sx={{ '&:hover': { textDecoration: 'underline'} }}
                        >
                          Volver
                        </Typography>
                      </Link>
      </Paper>
    </Box>
  );
};

export default RegisterScreen;
