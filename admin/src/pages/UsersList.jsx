import React, { useState, useEffect } from 'react';
import api from '../api';
import './UsersList.css';

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const toggleVerification = async (id, currentStatus) => {
    const newStatus = currentStatus === 'verified' ? 'pending' : 'verified';
    try {
      await api.patch(`/admin/users/${id}/verify`, { status: newStatus });
      fetchUsers();
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  const toggleSuspension = async (id, isSuspended) => {
    try {
      await api.patch(`/admin/users/${id}/suspend`, { isSuspended: !isSuspended, suspensionReason: 'Admin action' });
      fetchUsers();
    } catch (error) {
      console.error('Error suspending user:', error);
    }
  };

  return (
    <div className="animate-fade-in users-container">
      <div className="glass-card table-card">
        <div className="table-header">
          <h2>Manage Users</h2>
          <button className="btn-primary">Add User</button>
        </div>
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Verification</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{user.firstName} {user.lastName}</td>
                  <td><span className={`role-badge ${user.roles[0]?.toLowerCase()}`}>{user.roles.join(', ')}</span></td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: user.verification?.verificationStatus === 'verified' ? '#10b981' : 'var(--text-secondary)' }}>
                      {user.verification?.verificationStatus || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.accountStatus?.isSuspended ? 'suspended' : 'active'}`}>
                      {user.accountStatus?.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    {user.roles.includes('provider') && (
                      <button 
                        className="btn-action" 
                        onClick={() => toggleVerification(user._id, user.verification?.verificationStatus)}
                      >
                        {user.verification?.verificationStatus === 'verified' ? 'Unverify' : 'Verify'}
                      </button>
                    )}
                    <button 
                      className="btn-action" 
                      style={{ color: '#ef4444' }}
                      onClick={() => toggleSuspension(user._id, user.accountStatus?.isSuspended)}
                    >
                      {user.accountStatus?.isSuspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
