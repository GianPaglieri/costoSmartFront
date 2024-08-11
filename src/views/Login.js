import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginController from '../controllers/LoginController';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [contrasena, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Obtén el objeto de navegación

  const handleLogin = async () => {
    try {
      console.log('Email:', email);
      console.log('Password:', contrasena);
      const token = await LoginController.loginUser(email, contrasena);
      console.log('Token received:', token);
      // Redirige a la página principal después del inicio de sesión exitoso
      navigate('/'); // Redirige a la ruta principal después del inicio de sesión
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Inicio de Sesión</h1>
        <input
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Contraseña"
          type="password"
          value={contrasena}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.loginButton} onClick={handleLogin}>
          Iniciar Sesión
        </button>
        <div style={styles.linksContainer}>
          <Link to="/forgot-password" style={styles.link}>¿Olvidaste tu contraseña?</Link>
          <Link to="/register" style={styles.link}>¿No tienes una cuenta? Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: '50px',
    borderWidth: '1px',
    borderColor: '#cccccc',
    borderRadius: '5px',
    padding: '0 15px',
    marginBottom: '20px',
  },
  loginButton: {
    width: '100%',
    height: '50px',
    backgroundColor: '#007bff',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
    textAlign: 'center',
  },
  linksContainer: {
    marginTop: '20px',
  },
  link: {
    display: 'block',
    textAlign: 'center',
    marginBottom: '10px',
    textDecoration: 'none',
    color: '#007bff',
    fontSize: '14px',
  },
};

export default LoginScreen;
