import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import UserProfile from './UserProfile';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [reportFilters, setReportFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    user: ''
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get('http://localhost:5000/api/users', {
          headers: { 'x-auth-token': token }
        });
        setUsers(usersRes.data);

        // For admin, get all claims
        const claimsRes = await axios.get('http://localhost:5000/api/claims', {
          headers: { 'x-auth-token': token }
        });
        setClaims(claimsRes.data);

        // Calculate assigned claims per employee (today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const employeeMap = {};
        claimsRes.data.forEach(claim => {
          if (claim.assignedTo && claim.assignedTo._id && claim.assignedAt) {
            const assignedDate = new Date(claim.assignedAt);
            if (assignedDate >= today) {
              employeeMap[claim.assignedTo._id] = (employeeMap[claim.assignedTo._id] || 0) + 1;
            }
          }
        });

        const employeesWithCount = usersRes.data
          .filter(user => user.role === 'Empleado' && user.isActive)
          .map(emp => ({
            ...emp,
            assignedClaimsCount: employeeMap[emp._id] || 0
          }))
          .filter(emp => emp.assignedClaimsCount < 20) // Only show employees with less than 20 claims today
          .sort((a, b) => a.assignedClaimsCount - b.assignedClaimsCount); // Sort by workload

        setEmployees(employeesWithCount);

        const statsRes = await axios.get('http://localhost:5000/api/reports/stats', {
          headers: { 'x-auth-token': token }
        });
        setStats(statsRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [token]);

  const toggleUserStatus = async (id, isActive) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, { isActive: !isActive }, {
        headers: { 'x-auth-token': token }
      });
      setUsers(users.map(user => user._id === id ? { ...user, isActive: !isActive } : user));
      alert('Estado del usuario actualizado');
    } catch (err) {
      alert('Error al actualizar el usuario');
    }
  };

  const assignClaim = async (claimId, employeeId) => {
    console.log('Assigning claim', claimId, 'to employee', employeeId);
    if (!employeeId) {
      alert('Selecciona un empleado primero');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5000/api/claims/${claimId}/assign`, { assignedTo: employeeId }, {
        headers: { 'x-auth-token': token }
      });
      console.log('Assign response:', response.data);
      setClaims(claims.map(claim => claim._id === claimId ? { ...claim, assignedTo: employees.find(e => e._id === employeeId) } : claim));
      alert('Reclamo asignado exitosamente');
      // Refresh the page to update counts
      window.location.reload();
    } catch (err) {
      console.error('Assign error:', err.response?.data);
      alert('Error al asignar reclamo: ' + (err.response?.data?.msg || 'Error desconocido'));
    }
  };

  const updateClaimStatus = async (claimId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/claims/${claimId}/status`, { status }, {
        headers: { 'x-auth-token': token }
      });
      setClaims(claims.map(claim => claim._id === claimId ? { ...claim, status } : claim));
      alert('Estado del reclamo actualizado');
    } catch (err) {
      alert('Error al actualizar estado');
    }
  };

  const exportReport = async (format) => {
    try {
      const params = new URLSearchParams();
      if (reportFilters.startDate) params.append('startDate', reportFilters.startDate);
      if (reportFilters.endDate) params.append('endDate', reportFilters.endDate);
      if (reportFilters.status) params.append('status', reportFilters.status);
      if (reportFilters.user) params.append('user', reportFilters.user);
      params.append('format', format);

      const response = await axios.get(`http://localhost:5000/api/reports?${params}`, {
        headers: { 'x-auth-token': token },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `reporte-reclamos-${date}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Error al generar el reporte');
    }
  };

  const deleteOldClaims = async () => {
    if (!window.confirm('¿Estás seguro de eliminar todos los reclamos mayores a 1 año? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/claims/old', {
        headers: { 'x-auth-token': token }
      });

      const oldClaims = response.data;
      if (oldClaims.length === 0) {
        alert('No hay reclamos antiguos para eliminar.');
        return;
      }

      let deletedCount = 0;
      for (const claim of oldClaims) {
        try {
          await axios.delete(`http://localhost:5000/api/claims/${claim._id}`, {
            headers: { 'x-auth-token': token }
          });
          deletedCount++;
        } catch (err) {
          console.error('Error deleting claim:', claim._id);
        }
      }

      alert(`Se eliminaron ${deletedCount} reclamos antiguos.`);
      window.location.reload();
    } catch (err) {
      alert('Error al obtener reclamos antiguos');
    }
  };

  const viewUserDetails = (userId) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      const userClaims = claims.filter(c => c.user && c.user._id === userId);
      alert(`Detalles de ${user.name}:
Email: ${user.email}
Rol: ${user.role}
Estado: ${user.isActive ? 'Activo' : 'Inactivo'}
Fecha de registro: ${new Date(user.createdAt).toLocaleDateString()}
Total de reclamos: ${userClaims.length}
Reclamos resueltos: ${userClaims.filter(c => c.status === 'Resuelto').length}
Reclamos pendientes: ${userClaims.filter(c => c.status === 'Pendiente').length}`);
    }
  };

  return (
    <div>
      <UserProfile userRole="Administrador" />
      <div className="container">
        <h1>Panel de Administrador</h1>
      
      <div className="card" style={{ marginBottom: '30px' }}>
        <h3>Estadísticas de Reclamos</h3>
        <div className="stats">
          <div className="stat-item">
            <div className="stat-number">{stats.totalClaims || 0}</div>
            <div>Total</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.pending || 0}</div>
            <div>Pendientes</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.inProcess || 0}</div>
            <div>En Proceso</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.resolved || 0}</div>
            <div>Resueltos</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.rejected || 0}</div>
            <div>Rechazados</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {stats.monthlyStats && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>Gráficos de Análisis</h3>
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div>
              <h4>Tendencia Mensual de Reclamos</h4>
              <LineChart width={400} height={300} data={stats.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#667eea" strokeWidth={2} />
              </LineChart>
            </div>
            <div>
              <h4>Distribución por Estado</h4>
              <PieChart width={400} height={300}>
                <Pie
                  data={[
                    { name: 'Pendientes', value: stats.pending || 0, fill: '#ffc107' },
                    { name: 'En Proceso', value: stats.inProcess || 0, fill: '#17a2b8' },
                    { name: 'Resueltos', value: stats.resolved || 0, fill: '#28a745' },
                    { name: 'Rechazados', value: stats.rejected || 0, fill: '#dc3545' }
                  ]}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#ffc107" />
                  <Cell fill="#17a2b8" />
                  <Cell fill="#28a745" />
                  <Cell fill="#dc3545" />
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '30px' }}>
        <h3>Generar Reportes</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div>
            <label>Fecha Inicio:</label>
            <input
              type="date"
              value={reportFilters.startDate}
              onChange={(e) => setReportFilters({...reportFilters, startDate: e.target.value})}
              style={{ marginLeft: '5px' }}
            />
          </div>
          <div>
            <label>Fecha Fin:</label>
            <input
              type="date"
              value={reportFilters.endDate}
              onChange={(e) => setReportFilters({...reportFilters, endDate: e.target.value})}
              style={{ marginLeft: '5px' }}
            />
          </div>
          <div>
            <label>Estado:</label>
            <select
              value={reportFilters.status}
              onChange={(e) => setReportFilters({...reportFilters, status: e.target.value})}
              style={{ marginLeft: '5px' }}
            >
              <option value="">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En proceso">En proceso</option>
              <option value="Resuelto">Resuelto</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </div>
          <div>
            <label>Usuario:</label>
            <select
              value={reportFilters.user}
              onChange={(e) => setReportFilters({...reportFilters, user: e.target.value})}
              style={{ marginLeft: '5px' }}
            >
              <option value="">Todos</option>
              {users.filter(u => u.role === 'Cliente').map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => exportReport('excel')} style={{ background: '#217346' }}>
            📊 Exportar Excel
          </button>
          <button onClick={() => exportReport('pdf')} style={{ background: '#dc3545' }}>
            📄 Exportar PDF
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h3>Mantenimiento de Base de Datos</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button onClick={deleteOldClaims} style={{ background: '#dc3545' }}>
            Eliminar Reclamos Antiguos menores a (1 año)
          </button>
        </div>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          Los reclamos antiguos se eliminan automáticamente y se notifica a los usuarios afectados.
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Gestión de Usuarios</h3>
          {users.length === 0 ? (
            <p>No hay usuarios registrados.</p>
          ) : (
            <ul>
              {users.map(user => (
                <li key={user._id} className={user.isActive ? '' : 'status-rejected'}>
                  <strong>{user.name}</strong><br />
                  Email: {user.email}<br />
                  Rol: {user.role}<br />
                  Estado: {user.isActive ? 'Activo' : 'Inactivo'}<br />
                  <button onClick={() => toggleUserStatus(user._id, user.isActive)} style={{ marginTop: '5px' }}>
                    {user.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-grid">
          <div className="card">
            <h3>Reclamos Sin Asignar</h3>
            {claims.filter(claim => !claim.assignedTo).length === 0 ? (
              <p>No hay reclamos sin asignar.</p>
            ) : (
              <ul>
                {claims.filter(claim => !claim.assignedTo).map(claim => (
                  <li key={claim._id} className={`status-${claim.status.toLowerCase().replace(' ', '-')}`}>
                    <strong>{claim.title}</strong><br />
                    <small>{claim.description}</small><br />
                    Usuario: {claim.user?.name || 'N/A'}<br />
                    Estado: {claim.status}<br />
                    Fecha: {new Date(claim.createdAt).toLocaleDateString()}<br />
                    <div style={{ marginTop: '10px' }}>
                      <select
                        value={selectedEmployee[claim._id] || ''}
                        onChange={(e) => setSelectedEmployee({ ...selectedEmployee, [claim._id]: e.target.value })}
                        style={{ marginRight: '10px' }}
                      >
                        <option value="">Seleccionar empleado disponible</option>
                        {employees.map(emp => (
                          <option key={emp._id} value={emp._id}>
                            {emp.name} ({emp.assignedClaimsCount} reclamos asignados hoy)
                          </option>
                        ))}
                      </select>
                      <button onClick={() => assignClaim(claim._id, selectedEmployee[claim._id])}>
                        Asignar Reclamo
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card">
            <h3>Reclamos Asignados</h3>
            {claims.filter(claim => claim.assignedTo).length === 0 ? (
              <p>No hay reclamos asignados.</p>
            ) : (
              <ul>
                {claims.filter(claim => claim.assignedTo).map(claim => (
                  <li key={claim._id} className={`status-${claim.status.toLowerCase().replace(' ', '-')}`}>
                    <strong>{claim.title}</strong><br />
                    <small>{claim.description}</small><br />
                    Usuario: {claim.user?.name || 'N/A'}<br />
                    Asignado a: {claim.assignedTo?.name || 'N/A'}<br />
                    Estado: {claim.status}<br />
                    Fecha: {new Date(claim.createdAt).toLocaleDateString()}<br />
                    {claim.comments && claim.comments.length > 0 && (
                      <div style={{ marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '5px' }}>
                        <strong>Comentarios:</strong>
                        {claim.comments.map((comment, idx) => (
                          <div key={idx} style={{
                            marginTop: '5px',
                            padding: '5px',
                            background: comment.isInternal ? '#fff3cd' : 'white',
                            borderRadius: '3px',
                            borderLeft: comment.isInternal ? '3px solid #ffc107' : '3px solid #007bff'
                          }}>
                            <small>
                              <strong>{comment.isInternal ? 'Interno' : 'Público'}:</strong> {comment.text}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ marginTop: '10px' }}>
                      <select
                        value={claim.status}
                        onChange={(e) => updateClaimStatus(claim._id, e.target.value)}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Resuelto">Resuelto</option>
                        <option value="Rechazado">Rechazado</option>
                      </select>
                      <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
                        Cambiar estado después de respuesta del empleado
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} style={{ marginTop: '20px' }}>
        Cerrar Sesión
      </button>
      </div>
    </div>
  );
};

export default AdminPanel;