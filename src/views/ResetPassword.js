// src/views/ResetPassword.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Container,
  useMediaQuery,
  ThemeProvider,
  createTheme
} from '@mui/material';
import axios from 'axios';

// Crear tema responsive (igual que en LoginScreen)
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },
  palette: {
    primary: {
      main: '#1976d2'
    },
    background: {
      default: '#ffffff'
    }
  }
});

const ResetPassword = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (!token) {
      setError('Token inválido o inexistente.');
    }
  }, [token]);

  const handleReset = async () => {
    if (!newPassword) {
      setError('Por favor ingresa tu nueva contraseña.');
      return;
    }
    try {
      // Ajusta la URL base si tu API corre en otro puerto
       const res = await axios.post('http://149.50.131.253/api/users/reset-password', {
        token,
        newPassword
      });
      if (res.data.success) {
        setSuccessMsg('Contraseña restablecida. Redirigiendo al login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(res.data.error || 'Ocurrió un problema.');
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.error ||
        'Error al restablecer la contraseña. Intenta nuevamente.';
      setError(msg);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleReset();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          backgroundColor: '#ffffff'
        }}
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: isMobile ? 2 : 3,
            backgroundColor: 'transparent'
          }}
        >
          <Paper
            elevation={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: isMobile ? 3 : 4,
              width: '100%',
              borderRadius: 2,
              backgroundColor: '#ffffff'
            }}
          >
            <Typography
              component="h1"
              variant={isMobile ? 'h5' : 'h4'}
              sx={{
                mb: 3,
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              Restablecer Contraseña
            </Typography>

            {error && (
              <Typography
                color="error"
                sx={{
                  mb: 2,
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                {error}
              </Typography>
            )}

            {successMsg && (
              <Typography
                color="primary"
                sx={{
                  mb: 2,
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                {successMsg}
              </Typography>
            )}

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="Nueva Contraseña"
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              size={isMobile ? 'small' : 'medium'}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleReset}
              size={isMobile ? 'medium' : 'large'}
              sx={{
                mb: 2,
                py: isMobile ? 1 : 1.5,
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}
            >
              Guardar Nueva Contraseña
            </Button>

            <Box
              sx={{
                width: '100%',
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ '&:hover': { textDecoration: 'underline' } }}
                >
                  Volver al Inicio de Sesión
                </Typography>
              </Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ResetPassword;
