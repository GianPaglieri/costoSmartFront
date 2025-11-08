import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

import DashboardLayout from '../components/DashboardLayout';
import LoginScreen from '../views/Login';
import RegisterScreen from '../views/Register';
import ResetPassword from '../views/ResetPassword';
import ForgotPassword from '../views/ForgotPassword';
import HomeScreen from '../views/HomeScreen';
import IngredientListScreen from '../views/IngredientListScreen';
import TortasScreen from '../views/TortasScreen';
import RecetasScreen from '../views/RecetasScreen';
import VentasScreen from '../views/VentasScreen';
import ProfileScreen from '../views/Profile';
import { isTokenValid } from '../utils/auth';
import theme from '../theme';

const App = () => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken && storedToken !== 'undefined' && isTokenValid(storedToken)
      ? storedToken
      : null;
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        const newToken = e.newValue;
        if (newToken && isTokenValid(newToken)) {
          setToken(newToken);
        } else {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Escuchar cambios de token en la misma pestaña (logout programático)
    const handleAuthEvent = (e) => {
      const newToken = e?.detail?.token || null;
      if (newToken && isTokenValid(newToken)) {
        setToken(newToken);
      } else {
        localStorage.removeItem('token');
        setToken(null);
      }
    };
    window.addEventListener('auth:token-changed', handleAuthEvent);

    if (token && !isTokenValid(token)) {
      localStorage.removeItem('token');
      setToken(null);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:token-changed', handleAuthEvent);
    };
  }, [token]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {!token ? (
            <>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginScreen setToken={setToken} />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<HomeScreen />} />
                <Route path="ingredientes" element={<IngredientListScreen />} />
                <Route path="tortas" element={<TortasScreen />} />
                <Route path="recetas" element={<RecetasScreen />} />
                <Route path="ventas" element={<VentasScreen />} />
                <Route path="perfil" element={<ProfileScreen />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </>
          )}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
