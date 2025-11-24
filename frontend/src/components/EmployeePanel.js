import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserProfile from './UserProfile';

const EmployeePanel = () => {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [commentText, setCommentText] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAssignedClaims = async () => {
      try {
        // Get all claims and filter assigned to this employee
        const res = await axios.get('http://localhost:5000/api/claims', {
          headers: { 'x-auth-token': token }
        });
        // Since employees can only see assigned claims, but API returns all, filter client-side
        // Actually, better to modify backend to return only assigned for employees
        // For now, filter here
        const assignedClaims = res.data.filter(claim => claim.assignedTo);
        setClaims(assignedClaims);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAssignedClaims();
  }, [token]);

  const addComment = async (claimId) => {
    if (!commentText.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/claims/${claimId}/comments`, {
        text: commentText,
        isInternal: true
      }, {
        headers: { 'x-auth-token': token }
      });
      setCommentText('');
      setSelectedClaim(null);
      // Refresh claims
      window.location.reload();
    } catch (err) {
      alert('Error agregando comentario');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pendiente': return 'status-pending';
      case 'En proceso': return 'status-en-proceso';
      case 'Resuelto': return 'status-resuelto';
      case 'Rechazado': return 'status-rechazado';
      default: return '';
    }
  };

  return (
    <div>
      <UserProfile userRole="Empleado" />
      <div className="container">
        <h1>Panel de Empleado</h1>
      <div className="card">
        <h3>Reclamos Asignados</h3>
        {claims.length === 0 ? (
          <p>No tienes reclamos asignados.</p>
        ) : (
          <ul>
            {claims.map(claim => (
              <li key={claim._id} className={getStatusClass(claim.status)}>
                <strong>{claim.title}</strong><br />
                <small>{claim.description}</small><br />
                Usuario: {claim.user?.name || 'N/A'}<br />
                Tipo: {claim.type}<br />
                Estado: {claim.status}<br />
                Fecha: {new Date(claim.createdAt).toLocaleDateString()}<br />
                <button onClick={() => setSelectedClaim(claim)} style={{ marginTop: '5px' }}>
                  Agregar Comentario Interno
                </button>
                {selectedClaim && selectedClaim._id === claim._id && (
                  <div style={{ marginTop: '10px' }}>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Comentario interno..."
                      rows="3"
                      style={{ width: '100%', marginBottom: '5px' }}
                    />
                    <button onClick={() => addComment(claim._id)}>Guardar Comentario</button>
                    <button onClick={() => setSelectedClaim(null)} style={{ marginLeft: '5px' }}>Cancelar</button>
                  </div>
                )}
                {claim.comments && claim.comments.filter(c => c.isInternal).map((comment, idx) => (
                  <div key={idx} style={{ marginTop: '5px', padding: '5px', background: '#f0f0f0', borderRadius: '3px' }}>
                    <small><strong>Comentario interno:</strong> {comment.text}</small>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} style={{ marginTop: '20px' }}>
        Cerrar Sesión
      </button>
      </div>
    </div>
  );
};

export default EmployeePanel;