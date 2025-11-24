import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserProfile from './UserProfile';

const Dashboard = () => {
  const [claims, setClaims] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', type: '' });
  const { title, description, type } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/claims', {
          headers: { 'x-auth-token': token }
        });
        setClaims(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchClaims();
  }, [token]);

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/claims', formData, {
        headers: { 'x-auth-token': token }
      });
      alert('Reclamo creado exitosamente');
      window.location.reload();
    } catch (err) {
      alert('Error al crear el reclamo');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pendiente': return 'status-pending';
      case 'En proceso': return 'status-in-process';
      case 'Resuelto': return 'status-resolved';
      case 'Rechazado': return 'status-rejected';
      default: return '';
    }
  };

  return (
    <div>
      <UserProfile userRole="Cliente" />
      <div className="container">
        <h1>Panel de Cliente</h1>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Crear Nuevo Reclamo</h3>
          <form onSubmit={onSubmit}>
            <input type="text" name="title" value={title} onChange={onChange} placeholder="Título del reclamo" required />
            <textarea name="description" value={description} onChange={onChange} placeholder="Descripción detallada del reclamo" rows="4" required></textarea>
            <select name="type" value={type} onChange={onChange} required>
              <option value="">Seleccionar tipo</option>
              <option value="Técnico">Técnico</option>
              <option value="Facturación">Facturación</option>
              <option value="Servicio">Servicio</option>
              <option value="Otro">Otro</option>
            </select>
            <button type="submit">Crear Reclamo</button>
          </form>
        </div>
        <div className="card">
          <h3>Mis Reclamos</h3>
          {claims.length === 0 ? (
            <p>No tienes reclamos registrados.</p>
          ) : (
            <ul>
              {claims.map(claim => (
                <li key={claim._id} className={getStatusClass(claim.status)}>
                  <strong>{claim.title}</strong><br />
                  <small>{claim.description}</small><br />
                  Tipo: {claim.type}<br />
                  Estado: {claim.status}<br />
                  Fecha: {new Date(claim.createdAt).toLocaleDateString()}
                  {claim.comments && claim.comments.length > 0 && (
                    <div style={{ marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '5px' }}>
                      <strong>Comentarios del empleado:</strong>
                      {claim.comments.map((comment, idx) => (
                        <div key={idx} style={{
                          marginTop: '5px',
                          padding: '5px',
                          background: 'white',
                          borderRadius: '3px',
                          borderLeft: '3px solid #007bff'
                        }}>
                          <small>{comment.text}</small>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} style={{ marginTop: '20px' }}>
        Cerrar Sesión
      </button>
      </div>
    </div>
  );
};

export default Dashboard;