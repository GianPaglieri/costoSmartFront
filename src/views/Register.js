import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP

const RegisterScreen = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Obtén el objeto de navegación

  const handleRegister = async () => {
    try {
      // Validar que los campos no estén vacíos
      if (!nombre || !email || !contrasena || !confirmarContrasena) {
        setError('Todos los campos son obligatorios');
        return;
      }

      // Validar que las contraseñas coincidan
      if (contrasena !== confirmarContrasena) {
        setError('Las contraseñas no coinciden');
        return;
      }

      // Enviar los datos al backend
      const response = await axios.post('http://localhost:3000/users', {
        nombre,
        email,
        contrasena,
      });

      console.log('Respuesta del servidor:', response.data);

      // Redirige a la página de inicio después del registro exitoso
      navigate('/login');
    } catch (error) {
      setError(error.response.data.error || 'Error al registrar usuario');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Registro</h1>
        <input
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
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
          onChange={(e) => setContrasena(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Confirmar contraseña"
          type="password"
          value={confirmarContrasena}
          onChange={(e) => setConfirmarContrasena(e.target.value)}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.registerButton} onClick={handleRegister}>
          Registrarse
        </button>
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
  registerButton: {
    width: '100%',
    height: '50px',
    backgroundColor: '#28a745',
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
};

export default RegisterScreen;
