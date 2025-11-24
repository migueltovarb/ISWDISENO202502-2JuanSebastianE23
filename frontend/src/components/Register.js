import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { name, email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Registro exitoso');
      window.location.href = '/login';
    } catch (err) {
      console.log('Error details:', err.response?.data);
      alert('Error en el registro: ' + (err.response?.data?.msg || 'Verifica que el backend esté corriendo'));
    }
  };
  return (
    <div className="container">
      <h1>Registro de Usuario</h1>
      <form onSubmit={onSubmit}>
        <input type="text" name="name" value={name} onChange={onChange} placeholder="Nombre completo" required />
        <input type="email" name="email" value={email} onChange={onChange} placeholder="Correo electrónico" required />
        <input type="password" name="password" value={password} onChange={onChange} placeholder="Contraseña (mínimo 8 caracteres)" required />
        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
      <p style={{ fontSize: '12px', color: '#666' }}>
        Para empleados: usa email @empleado.com<br />
        Para clientes: usa email normal (gmail, hotmail, etc.)
      </p>
    </div>
  );
};

export default Register;