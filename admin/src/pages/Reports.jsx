import React, { useState, useEffect } from 'react';
import api from '../api';
import './UsersList.css';

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/admin/reports');
      setReports(res.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const resolveReport = async (id, currentStatus) => {
    if (currentStatus === 'resolved') return;
    try {
      await api.patch(`/admin/reports/${id}/resolve`, { status: 'resolved', resolutionNotes: 'Resolved by admin' });
      fetchReports();
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  return (
    <div className="animate-fade-in users-container">
      <div className="glass-card table-card">
        <div className="table-header">
          <h2>System Reports</h2>
        </div>
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Reporter</th>
                <th>Reported User</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(rep => (
                <tr key={rep._id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{rep._id.substring(0, 8)}...</td>
                  <td>{rep.reporterId?.firstName} {rep.reporterId?.lastName}</td>
                  <td>{rep.reportedUserId?.firstName} {rep.reportedUserId?.lastName}</td>
                  <td>{rep.reason}</td>
                  <td><span className={`status-badge ${rep.status?.toLowerCase() || 'pending'}`}>{rep.status || 'Pending'}</span></td>
                  <td>
                    {rep.status !== 'resolved' && (
                      <button className="btn-action" onClick={() => resolveReport(rep._id, rep.status)}>
                        Mark Resolved
                      </button>
                    )}
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
