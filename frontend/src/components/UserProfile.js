import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = ({ userRole }) => {
  const [userInfo, setUserInfo] = useState({});
  const [claimsCount, setClaimsCount] = useState(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchClaimsCount = async () => {
      try {
        // Decode token to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserInfo({
          name: payload.user.name,
          email: payload.user.email
        });

        // Get claims count based on role
        const claimsRes = await axios.get('http://localhost:5000/api/claims', {
          headers: { 'x-auth-token': token }
        });

        let count = 0;
        if (userRole === 'Administrador') {
          count = claimsRes.data.length;
        } else if (userRole === 'Empleado') {
          // Count claims assigned today
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          count = claimsRes.data.filter(claim =>
            claim.assignedTo && claim.assignedTo._id === payload.user.id &&
            claim.assignedAt && new Date(claim.assignedAt) >= today
          ).length;
        } else if (userRole === 'Cliente') {
          count = claimsRes.data.filter(claim => claim.user === payload.user.id).length;
        }
        setClaimsCount(count);

      } catch (err) {
        console.log('Error fetching claims count:', err);
      }
    };

    if (token) {
      fetchClaimsCount();
    }
  }, [token, userRole]);

  return (
    <div className="user-profile">
      <div className="profile-avatar">
        <div className="avatar-circle">
          {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>
      <div className="profile-info">
        <div className="profile-name">{userInfo.name || 'Usuario'}</div>
        <div className="profile-email">{userInfo.email || 'email@ejemplo.com'}</div>
        <div className="profile-role">Rol: {userRole}</div>
        <div className="profile-claims">
          {userRole === 'Empleado' && `Reclamos asignados: ${claimsCount}`}
          {userRole === 'Cliente' && `Mis reclamos: ${claimsCount}`}
          {userRole === 'Administrador' && `Total reclamos: ${claimsCount}`}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;