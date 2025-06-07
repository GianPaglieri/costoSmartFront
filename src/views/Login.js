import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import LoginController from '../controllers/LoginController';

// Crear tema responsive
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#ffffff', // Fondo blanco por defecto
    },
  },
});

const LoginScreen = ({ setToken }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [contrasena, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Componente LoginScreen montado!");
    const handleGlobalError = (e) => {
      console.error('Error global capturado:', e.error);
    };
    window.addEventListener('error', handleGlobalError);
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  const handleLogin = async () => {
    try {
      const token = await LoginController.loginUser(email, contrasena);
      localStorage.setItem('token', token);
      setToken(token); 
      navigate('/');
      console.log('Token received:', token);
    } catch (error) {
      console.error('Error completo:', error);
      setError(error.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
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
          backgroundColor: '#ffffff', // Fondo blanco sólido
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
            backgroundColor: 'transparent', // Contenedor transparente
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
              backgroundColor: '#ffffff', // Fondo blanco para el Paper
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
              Inicio de Sesión
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
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size={isMobile ? 'small' : 'medium'}
              sx={{ mb: 2 }}
            />
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={contrasena}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              size={isMobile ? 'small' : 'medium'}
              sx={{ mb: 3 }}
            />
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogin}
              size={isMobile ? 'medium' : 'large'}
              sx={{
                mb: 2,
                py: isMobile ? 1 : 1.5,
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}
            >
              Iniciar Sesión
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
              <Link 
                to="/forgot-password" 
                style={{ 
                  textDecoration: 'none',
                  marginBottom: '10px'
                }}
              >
                <Typography 
                  variant="body2" 
                  color="primary"
                  sx={{ '&:hover': { textDecoration: 'underline' } }}
                >
                  ¿Olvidaste tu contraseña?
                </Typography>
              </Link>
              
              <Link 
                to="/register" 
                style={{ textDecoration: 'none' }}
              >
                <Typography 
                  variant="body2" 
                  color="primary"
                  sx={{ '&:hover': { textDecoration: 'underline' } }}
                >
                  ¿No tienes cuenta? Regístrate aquí
                </Typography>
              </Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginScreen;