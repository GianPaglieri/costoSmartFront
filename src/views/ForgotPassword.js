// src/views/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Container,
  Snackbar,
  Alert,
  useMediaQuery,
  ThemeProvider,
  createTheme
} from '@mui/material';
import ForgotPasswordController from '../controllers/ForgotPasswordController';

const theme = createTheme({
  breakpoints: { values: { xs:0, sm:600, md:900, lg:1200, xl:1536 } },
  palette: { primary: { main: '#1976d2' }, background: { default: '#fff' } }
});

export default function ForgotPassword() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setStatus({ type: 'error', message: 'Por favor ingresa tu email.' });
      return setOpen(true);
    }
    try {
      const data = await ForgotPasswordController.requestPasswordReset(email);
      setStatus({ type: 'success', message: data.message || 'Revisa tu correo.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Ocurrió un error.' });
    } finally {
      setOpen(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        display:'flex', justifyContent:'center', alignItems:'center',
        minHeight:'100vh', p: isMobile?2:3, bgcolor:'#fff'
      }}>
        <Container maxWidth="xs">
          <Paper elevation={3} sx={{ p: isMobile?3:4 }}>
            <Typography variant={isMobile?'h5':'h4'} gutterBottom align="center">
              Recuperar Contraseña
            </Typography>
            <TextField
              label="Tu correo electrónico"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={e => setEmail(e.target.value)}
              size={isMobile?'small':'medium'}
            />
            <Button
              variant="contained" fullWidth
              onClick={handleSubmit}
              sx={{ mt:2, py:isMobile?1:1.5 }}
            >
              Enviar enlace
            </Button>
            <Box sx={{ mt:2, textAlign:'center' }}>
              <Typography variant="body2">
                <RouterLink to="/login" style={{ textDecoration:'none' }}>
                  Volver al inicio de sesión
                </RouterLink>
              </Typography>
            </Box>
          </Paper>
        </Container>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
        >
          <Alert
            onClose={() => setOpen(false)}
            severity={status.type || 'info'}
            sx={{ width:'100%' }}
          >
            {status.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
