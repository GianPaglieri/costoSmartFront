import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  useMediaQuery,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';
import api from '../components/AxiosConfig';

const backgroundGradient = 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #312e81 100%)';
const cardBackground =
  'linear-gradient(180deg, rgba(248,250,252,0.98) 0%, rgba(241,245,249,0.98) 100%)';

const RegisterScreen = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setError('');
      setSuccess('');

      if (!nombre || !email || !contrasena || !confirmarContrasena) {
        setError('Todos los campos son obligatorios.');
        return;
      }

      const emailOk = /.+@.+\..+/.test(email);
      if (!emailOk) {
        setError('Ingresa un email valido.');
        return;
      }

      if (contrasena.length < 6) {
        setError('La contrasena debe tener al menos 6 caracteres.');
        return;
      }

      if (contrasena !== confirmarContrasena) {
        setError('Las contrasenas no coinciden.');
        return;
      }

      await api.post('/users/register', {
        nombre,
        email,
        contrasena,
      });

      setSuccess('Usuario creado correctamente. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const backendErrors = err?.response?.data?.errors;
      if (Array.isArray(backendErrors) && backendErrors.length) {
        setError(backendErrors.map((item) => item.msg).join('. '));
      } else {
        setError(
          err?.response?.data?.error ||
            err?.message ||
            'Error al registrar usuario'
        );
      }
    }
  };

  return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: backgroundGradient,
          px: 2,
          py: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 480,
            borderRadius: 4,
            p: isMobile ? 3 : 4,
            backgroundImage: cardBackground,
            boxShadow: '0 35px 80px rgba(15,23,42,0.55)',
            border: '1px solid rgba(148, 163, 184, 0.25)',
          }}
        >
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ letterSpacing: '0.2em', color: '#475569' }}>
              Costosmart
            </Typography>
            <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 700, color: '#0f172a' }}>
              Crear cuenta
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Accede al panel para administrar tortas, recetas y costos.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Stack spacing={2}>
            <TextField
              label='Nombre'
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              size={isMobile ? 'small' : 'medium'}
            />
            <TextField
              label='Correo electronico'
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size={isMobile ? 'small' : 'medium'}
            />
            <TextField
              label='Contrasena'
              type="password"
              fullWidth
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              size={isMobile ? 'small' : 'medium'}
            />
            <TextField
              label='Confirmar contrasena'
              type="password"
              fullWidth
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              size={isMobile ? 'small' : 'medium'}
            />
          </Stack>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 3,
              py: isMobile ? 1 : 1.4,
              fontSize: isMobile ? '0.95rem' : '1rem',
              borderRadius: 2,
              boxShadow: '0 20px 35px rgba(37,99,235,0.25)',
            }}
            onClick={handleRegister}
          >
            Registrarse
          </Button>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={1.5}>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                borderColor: 'rgba(37,99,235,0.35)',
              }}
            >
              Ya tengo una cuenta
            </Button>
            <Button
              component={Link}
              to="/"
              variant="text"
              sx={{ textTransform: 'none', color: '#1d4ed8', fontWeight: 600 }}
            >
              Volver al inicio
            </Button>
          </Stack>
        </Paper>
      </Box>
  );
};

export default RegisterScreen;
