import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  useMediaQuery,
  Alert,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import api from '../components/AxiosConfig';

const backgroundGradient = 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #312e81 100%)';
const cardBackground =
  'linear-gradient(180deg, rgba(248,250,252,0.98) 0%, rgba(241,245,249,0.98) 100%)';

const ResetPassword = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (!token) {
      setError('Token invalido o inexistente.');
    }
  }, [token]);

  const handleReset = async () => {
    if (!newPassword) {
      setError('Por favor ingresa tu nueva contrasena.');
      return;
    }
    try {
      const res = await api.post('/users/reset-password', {
        token,
        newPassword,
      });
      if (res.data.success) {
        setSuccessMsg('Contrasena restablecida. Redirigiendo al login...');
        setError('');
        setTimeout(() => navigate('/login'), 2500);
      } else {
        setError(res.data.error || 'Ocurrio un problema.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        'Error al restablecer la contrasena. Intenta nuevamente.';
      setError(msg);
      setSuccessMsg('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleReset();
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
            Restablecer contrasena
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            Ingresa tu nueva contrasena para recuperar el acceso.
          </Typography>
        </Box>

        <Stack spacing={2}>
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {successMsg && (
            <Alert severity="success" onClose={() => setSuccessMsg('')}>
              {successMsg}
            </Alert>
          )}

          <TextField
            variant="outlined"
            required
            fullWidth
            name="newPassword"
            label="Nueva contrasena"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            size={isMobile ? 'small' : 'medium'}
          />
        </Stack>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleReset}
          size={isMobile ? 'medium' : 'large'}
          sx={{
            mt: 3,
            py: isMobile ? 1 : 1.4,
            fontSize: isMobile ? '0.95rem' : '1rem',
            borderRadius: 2,
            boxShadow: '0 20px 35px rgba(37,99,235,0.25)',
          }}
        >
          Guardar nueva contrasena
        </Button>

        <Button
          component={Link}
          to="/login"
          variant="text"
          sx={{
            display: 'block',
            mt: 2,
            textTransform: 'none',
            color: '#1d4ed8',
            fontWeight: 600,
          }}
        >
          Volver al inicio de sesion
        </Button>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
