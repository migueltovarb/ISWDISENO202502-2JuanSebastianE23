import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      // Redirect based on role
      if (res.data.role === 'Administrador') window.location.href = '/admin';
      else if (res.data.role === 'Empleado') window.location.href = '/employee';
      else window.location.href = '/dashboard';
    } catch (err) {
      alert('Credenciales inválidas');
    }
  };
  return (
    <div className="container">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={onSubmit}>
        <input type="email" name="email" value={email} onChange={onChange} placeholder="Correo electrónico" required />
        <input type="password" name="password" value={password} onChange={onChange} placeholder="Contraseña" required />
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
      <p>¿Olvidaste tu contraseña? <a href="/forgot-password">Recupérala aquí</a></p>
    </div>
  );
};

export default Login;