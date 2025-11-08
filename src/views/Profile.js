import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import UserController from '../controllers/UserController';

const InfoRow = ({ label, value }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ fontWeight: 600 }}>
      {value || '—'}
    </Typography>
  </Box>
);

const Profile = () => {
  const navigate = useNavigate();
  const tokenUser = getCurrentUser();
  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem('userInfo')) || null;
  } catch (_) {
    storedUser = null;
  }

  const user = useMemo(() => {
    if (!tokenUser && !storedUser) return null;
    return {
      ...storedUser,
      ...tokenUser,
      name: tokenUser?.name || storedUser?.name || storedUser?.nombre || null,
      email: tokenUser?.email || storedUser?.email || null,
      role: tokenUser?.role || storedUser?.role || 'Administrador',
    };
  }, [tokenUser, storedUser]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setFeedback(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setFeedback({ type: 'error', message: 'Completá todos los campos.' });
      return;
    }

    if (newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'La nueva contraseña y su confirmación deben coincidir.' });
      return;
    }

    setSubmitting(true);
    try {
      await UserController.changePassword({ currentPassword, newPassword });
      setFeedback({ type: 'success', message: 'Contraseña actualizada correctamente.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data?.error ||
        error?.message ||
        'No se pudo actualizar la contraseña.';
      setFeedback({ type: 'error', message: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: 3, px: { xs: 1.5, md: 3 }, maxWidth: 720, margin: '0 auto', width: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Mi perfil
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Estos son los datos asociados a tu cuenta. Si necesitás volver al panel principal, podés hacerlo cuando quieras.
      </Typography>

      <Stack spacing={3}>
        <Card elevation={0} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Datos principales
            </Typography>
            <InfoRow label="Nombre" value={user?.name || user?.nombre} />
            <InfoRow label="Correo electrónico" value={user?.email} />
            <InfoRow label="Rol" value={user?.role} />
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Cambiar contraseña
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Ingresá tu contraseña actual y definí una nueva para mantener tu cuenta segura.
            </Typography>

            {feedback && (
              <Alert severity={feedback.type} sx={{ mb: 2 }} onClose={() => setFeedback(null)}>
                {feedback.message}
              </Alert>
            )}

            <Box component="form" onSubmit={handlePasswordChange} noValidate sx={{ display: 'grid', gap: 2 }}>
              <TextField
                label="Contraseña actual"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Nueva contraseña"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                fullWidth
                helperText="Debe tener al menos 6 caracteres."
              />
              <TextField
                label="Confirmar nueva contraseña"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => navigate('/')}>Volver al inicio</Button>
                <Button type="submit" variant="contained" disabled={submitting}>
                  {submitting ? 'Actualizando…' : 'Actualizar contraseña'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default Profile;

