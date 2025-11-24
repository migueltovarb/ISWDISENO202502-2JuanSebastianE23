import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error al enviar el enlace de recuperación');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Recuperar Contraseña</h1>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
        </button>
      </form>
      {message && <p style={{ marginTop: '20px', textAlign: 'center' }}>{message}</p>}
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        <a href="/login">Volver al inicio de sesión</a>
      </p>
    </div>
  );
};

export default ForgotPassword;