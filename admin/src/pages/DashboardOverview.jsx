import React, { useState, useEffect } from 'react';
import api from '../api';
import './DashboardOverview.css';
import { Users, Wrench, Calendar, AlertTriangle } from 'lucide-react';

const mockActivity = [
  { id: 1, action: 'New Provider Registration', user: 'John Doe (Plumber)', time: '2 mins ago' },
  { id: 2, action: 'Booking Completed', user: 'Alice & Bob (Electrician)', time: '15 mins ago' },
  { id: 3, action: 'User Reported', user: 'Client flagged a review', time: '1 hour ago' },
  { id: 4, action: 'Service Added', user: 'Sarah (Hairdresser) added "Bridal Hair"', time: '3 hours ago' },
];

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api.get('/admin/analytics')
      .then(res => {
        setStats(res.data);
      })
      .catch(() => setError('Could not load stats'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const cards = [
    { title: 'Total Users', value: stats?.totalUsers, icon: <Users size={20} />, color: '#2D728F' },
    { title: 'Active Providers', value: stats?.activeProviders, icon: <Wrench size={20} />, color: '#1A4731' },
    { title: 'Bookings Today', value: stats?.bookingsToday, icon: <Calendar size={20} />, color: '#C5A059' },
    { title: 'Pending Reports', value: stats?.pendingReports, icon: <AlertTriangle size={20} />, color: '#EF4444' },
  ];

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Dashboard</h1>
            <p>Platform overview — live data from the database.</p>
          </div>
          <button className="refresh-btn" onClick={load} disabled={loading}>
            {loading ? '↻ Loading…' : '↻ Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">⚠️ {error}</div>
      )}

      <div className="dashboard-grid">
        {cards.map((card, i) => (
          <div key={i} className="card stat-card">
            <div className="stat-top">
              <span className="stat-icon" style={{ background: card.color + '22', color: card.color }}>
                {card.icon}
              </span>
            </div>
            <div className="stat-value">
              {loading ? <span className="stat-skeleton" /> : (card.value ?? 0)}
            </div>
            <div className="stat-title">{card.title}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-row">
        <div className="card" style={{ flex: 1 }}>
          <h2 className="section-title">Revenue & Activity Overview</h2>
          <div style={{ 
            height: '250px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#94A3B8', 
            border: '2px dashed #EBE8E0', 
            borderRadius: '0.75rem',
            background: '#FAF9F6',
            marginTop: '1rem'
          }}>
            <p style={{ opacity: 0.7, fontWeight: 500 }}>[ Interactive Chart Placeholder ]</p>
          </div>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <h2 className="section-title">Recent Activity</h2>
          <div className="booking-stats" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {mockActivity.map(item => (
              <div key={item.id} className="activity-item">
                <div className="activity-info">
                  <div className="activity-user">{item.action}</div>
                  <div className="activity-action">{item.user}</div>
                </div>
                <span className="activity-time">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
