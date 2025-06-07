import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from '../components/PersistentDrawer';
import LoginScreen from '../views/Login';
import RegisterScreen from '../views/Register';
import ResetPassword from '../views/ResetPassword';
import ForgotPassword from '../views/ForgotPassword';


const App = () => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken && storedToken !== 'undefined' ? storedToken : null;
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        setToken(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
+           <Route path="/reset-password/:token" element={<ResetPassword />} />
            

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
