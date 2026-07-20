import React, { useState, useEffect } from 'react';
import api from '../api';
import './Reports.css';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resolvingId, setResolvingId] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/reports');
      setReports(res.data);
    } catch (err) {
      setError('Error fetching reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const resolveReport = async (id, currentStatus) => {
    if (currentStatus === 'resolved') return;
    setResolvingId(id);
    try {
      await api.patch(`/admin/reports/${id}/resolve`, { status: 'resolved', resolutionNotes: 'Resolved by admin' });
      fetchReports();
    } catch (err) {
      alert('Failed to resolve report.');
      console.error(err);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="animate-fade-in reports-container">
      <div className="page-header">
        <h1>Reports</h1>
        <p>Review and resolve system reports flagged by users.</p>
      </div>

      <div className="card table-card" style={{ marginTop: '1.5rem' }}>
        <div className="table-header">
          <span className="table-title">System Reports</span>
          <span className="table-count">
            {loading ? 'Loading…' : error ? '⚠️ Error' : `${reports.length} total`}
          </span>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1.5rem', color: '#f87171', fontSize: '0.85rem' }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="table-loading">Loading reports…</div>
        ) : reports.length === 0 ? (
          <div className="table-empty">No reports found.</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
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
                {reports.map(rep => {
                  const isResolved = rep.status === 'resolved';
                  return (
                    <tr key={rep._id}>
                      <td style={{ fontWeight: 600, color: '#6B7280', fontSize: '0.85rem' }}>
                        {rep._id.substring(0, 8)}...
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1A4731' }}>
                          {rep.reporterId?.firstName} {rep.reporterId?.lastName}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1A4731' }}>
                          {rep.reportedUserId?.firstName} {rep.reportedUserId?.lastName}
                        </div>
                      </td>
                      <td style={{ color: '#4B5563' }}>{rep.reason}</td>
                      <td>
                        <span className={`status-badge status-${rep.status?.toLowerCase() || 'pending'}`}>
                          {rep.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {!isResolved && (
                            <button 
                              className="action-btn approve" 
                              disabled={resolvingId === rep._id}
                              onClick={() => resolveReport(rep._id, rep.status)}
                            >
                              {resolvingId === rep._id ? '…' : 'Mark Resolved'}
                            </button>
                          )}
                          {isResolved && (
                            <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 500 }}>
                              ✓ Resolved
                            </span>
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
