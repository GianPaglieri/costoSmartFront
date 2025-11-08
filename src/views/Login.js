import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isTokenValid } from '../utils/auth';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  useMediaQuery,
  Alert,
  Divider,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LoginController from '../controllers/LoginController';

const backgroundGradient = 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)';
const cardBackground =
  'linear-gradient(180deg, rgba(248,250,252,0.98) 0%, rgba(241,245,249,0.98) 100%)';

const LoginScreen = ({ setToken }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [contrasena, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError('');
      const trimmedEmail = email.trim();
      const trimmedPassword = contrasena.trim();

      if (!trimmedEmail || !trimmedPassword) {
        setError('Ingresa tu email y contrasena.');
        return;
      }

      const { token, user } = await LoginController.loginUser(trimmedEmail, trimmedPassword);
      if (!isTokenValid(token)) {
        throw new Error('Token invalido');
      }

      localStorage.setItem('token', token);
      if (user) {
        try {
          localStorage.setItem('userInfo', JSON.stringify(user));
        } catch (_) {}
      }
      setToken(token);
      try {
        const evt = new CustomEvent('auth:token-changed', { detail: { token } });
        window.dispatchEvent(evt);
      } catch (_) {}
      navigate('/');
    } catch (err) {
      console.error('Error completo:', err);
      setError(
        err?.response?.data?.error ||
          err?.message ||
          'No se pudo iniciar sesion'
      );
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
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
            maxWidth: 440,
            borderRadius: 4,
            p: isMobile ? 3 : 4,
            backgroundImage: cardBackground,
            boxShadow: '0 35px 80px rgba(15,23,42,0.55)',
            border: '1px solid rgba(148, 163, 184, 0.25)',
          }}
        >
          <Box
            sx={{
              mb: 3.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 0.75,
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="CostoSmart"
              sx={{
                width: isMobile ? 110 : 150,
                height: isMobile ? 110 : 150,
                objectFit: 'contain',
                display: 'block',
                mb: 0.5,
              }}
            />
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{
                fontWeight: 600,
                color: '#0f172a',
                letterSpacing: 0,
                fontFamily: '"Montserrat","Inter","Roboto","Helvetica","Arial",sans-serif',
                textTransform: 'none',
              }}
            >
              CostoSmart
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', maxWidth: 320 }}>
              Gestiona tus recetas y costos desde un solo lugar.
            </Typography>
            <Divider sx={{ width: 64, borderColor: 'rgba(15,23,42,0.15)', my: 1 }} />
            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 600, color: '#0f172a' }}>
              Inicio de Sesion
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Correo electronico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size={isMobile ? 'small' : 'medium'}
            />

            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Contrasena"
              type="password"
              id="password"
              autoComplete="current-password"
              value={contrasena}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              size={isMobile ? 'small' : 'medium'}
            />
          </Stack>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
            size={isMobile ? 'medium' : 'large'}
            sx={{
              mt: 3,
              py: isMobile ? 1 : 1.4,
              fontSize: isMobile ? '0.95rem' : '1rem',
              borderRadius: 2,
              boxShadow: '0 20px 35px rgba(37,99,235,0.25)',
            }}
          >
            Iniciar Sesion
          </Button>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={1.5}>
            <Button
              component={Link}
              to="/forgot-password"
              variant="text"
              sx={{
                textTransform: 'none',
                color: '#1d4ed8',
                fontWeight: 600,
              }}
            >
              Olvidaste tu contrasena?
            </Button>

            <Button
              component={Link}
              to="/register"
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                borderColor: 'rgba(37,99,235,0.35)',
              }}
            >
              Crear cuenta nueva
            </Button>
          </Stack>
        </Paper>
      </Box>
  );
};

export default LoginScreen;
