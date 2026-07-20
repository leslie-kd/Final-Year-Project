import React, { useState, useEffect } from 'react';
import api from '../api';
import './UsersList.css';

const ROLE_FILTER_OPTIONS = ['all', 'client', 'provider', 'admin'];

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      setError('Error fetching users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleVerification = async (id, currentStatus) => {
    const newStatus = currentStatus === 'verified' ? 'pending' : 'verified';
    setUpdatingId(id);
    try {
      await api.patch(`/admin/users/${id}/verify`, { status: newStatus });
      fetchUsers();
    } catch (err) {
      alert('Failed to verify user.');
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleSuspension = async (id, isSuspended) => {
    setUpdatingId(id);
    try {
      await api.patch(`/admin/users/${id}/suspend`, { isSuspended: !isSuspended, suspensionReason: 'Admin action' });
      fetchUsers();
    } catch (err) {
      alert('Failed to suspend user.');
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getRole = (user) => user.roles?.[0] || 'client';

  const filtered = users
    .filter(u => roleFilter === 'all' || getRole(u).toLowerCase() === roleFilter)
    .filter(u => {
      if (!search) return true;
      const name = `${u.firstName} ${u.lastName}`.toLowerCase();
      return name.includes(search.toLowerCase());
    });

  const roleCounts = { all: users.length };
  users.forEach(u => { 
    const role = getRole(u).toLowerCase();
    roleCounts[role] = (roleCounts[role] ?? 0) + 1; 
  });

  return (
    <div className="users-container animate-fade-in">
      <div className="page-header">
        <h1>Users</h1>
        <p>Manage all clients, providers, and administrators on the platform.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div className="filter-tabs" style={{ marginBottom: 0 }}>
          {ROLE_FILTER_OPTIONS.map(r => (
            <button
              key={r}
              className={`filter-tab ${roleFilter === r ? 'active' : ''}`}
              onClick={() => setRoleFilter(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
              <span className="filter-count">{roleCounts[r] ?? 0}</span>
            </button>
          ))}
        </div>
        <input
          className="search-input"
          placeholder="Search name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="card table-card">
        <div className="table-header">
          <span className="table-title">Users Directory</span>
          <span className="table-count">
            {loading ? 'Loading…' : error ? '⚠️ Error' : `${filtered.length} shown`}
          </span>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1.5rem', color: '#f87171', fontSize: '0.85rem' }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="table-loading">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="table-empty">No users found.</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => {
                  const role = getRole(user).toLowerCase();
                  const isSuspended = user.accountStatus?.isSuspended;
                  const isVerified = user.verification?.verificationStatus === 'verified';
                  const name = `${user.firstName} ${user.lastName}`;
                  
                  return (
                    <tr key={user._id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">{name[0] || '?'}</div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#1A4731' }}>{name}</div>
                            {user.roles.includes('provider') && (
                              <div style={{ fontSize: '0.75rem', color: isVerified ? '#10b981' : '#f59e0b' }}>
                                {isVerified ? '✓ Verified Provider' : 'Pending Verification'}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge role-${role}`}>{role}</span>
                      </td>
                      <td>
                        <span className={`status-badge status-${isSuspended ? 'suspended' : 'active'}`}>
                          {isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="date-cell">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <div className="action-buttons">
                          {user.roles.includes('provider') && (
                            <button
                              className="action-btn"
                              style={{ background: isVerified ? 'transparent' : '#10b981', color: isVerified ? '#94a3b8' : '#fff', border: isVerified ? '1px solid #334155' : 'none' }}
                              disabled={updatingId === user._id}
                              onClick={() => toggleVerification(user._id, user.verification?.verificationStatus)}
                            >
                              {updatingId === user._id ? '…' : (isVerified ? 'Unverify' : 'Verify')}
                            </button>
                          )}
                          {!isSuspended ? (
                            <button
                              className="action-btn danger"
                              disabled={updatingId === user._id || role === 'admin'}
                              title={role === 'admin' ? 'Cannot suspend admin' : ''}
                              onClick={() => toggleSuspension(user._id, isSuspended)}
                            >
                              {updatingId === user._id ? '…' : 'Suspend'}
                            </button>
                          ) : (
                            <button
                              className="action-btn approve"
                              disabled={updatingId === user._id}
                              onClick={() => toggleSuspension(user._id, isSuspended)}
                            >
                              {updatingId === user._id ? '…' : 'Activate'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
