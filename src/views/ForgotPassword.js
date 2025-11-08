import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
  useMediaQuery,
  Stack,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ForgotPasswordController from '../controllers/ForgotPasswordController';

const backgroundGradient = 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #312e81 100%)';
const cardBackground =
  'linear-gradient(180deg, rgba(248,250,252,0.98) 0%, rgba(241,245,249,0.98) 100%)';

export default function ForgotPassword() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setStatus({ type: 'error', message: 'Por favor ingresa tu email.' });
      setOpen(true);
      return;
    }
    try {
      const data = await ForgotPasswordController.requestPasswordReset(email);
      setStatus({ type: 'success', message: data.message || 'Revisa tu correo.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Ocurrio un error.' });
    } finally {
      setOpen(true);
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
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ letterSpacing: '0.2em', color: '#475569' }}>
              Costosmart
            </Typography>
            <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 700, color: '#0f172a' }}>
              Recuperar acceso
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Te enviaremos un correo para que puedas restablecer tu contrasena.
            </Typography>
          </Box>

          <Stack spacing={2}>
            <TextField
              label="Correo electronico"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size={isMobile ? 'small' : 'medium'}
            />
          </Stack>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              mt: 3,
              py: isMobile ? 1 : 1.4,
              borderRadius: 2,
              boxShadow: '0 20px 35px rgba(37,99,235,0.25)',
            }}
          >
            Enviar enlace
          </Button>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={1.5}>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                borderColor: 'rgba(37,99,235,0.35)',
              }}
            >
              Volver al login
            </Button>
          </Stack>
        </Paper>
        <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
          <Alert onClose={() => setOpen(false)} severity={status.type || 'info'} sx={{ width: '100%' }}>
            {status.message}
          </Alert>
        </Snackbar>
      </Box>
  );
}
