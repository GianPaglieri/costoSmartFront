import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from '../components/PersistentDrawer';
import LoginScreen from '../views/Login';
import RegisterScreen from '../views/Register';
import ResetPassword from '../views/ResetPassword';
import ForgotPassword from '../views/ForgotPassword';
import { isTokenValid } from '../utils/auth';


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

    if (token && !isTokenValid(token)) {
      localStorage.removeItem('token');
      setToken(null);
    }

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        {!token ? (
          <>
            {/* Si alguien entra a "/", lo mandamos a "/login" */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<LoginScreen setToken={setToken} />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* Pantalla para restablecer contraseña con token */}
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {/* Cualquier otra ruta desconocida también redirige a "/login" */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            {/* Cuando haya token, renderizamos todo el layout interno */}
            <Route path="/*" element={<Navigation />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

