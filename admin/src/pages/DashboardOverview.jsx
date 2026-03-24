import './DashboardOverview.css';

const stats = [
  { id: 1, title: 'Total Users', value: '12,450' },
  { id: 2, title: 'Active Providers', value: '3,842' },
  { id: 3, title: 'Bookings Today', value: '428' },
  { id: 4, title: 'Pending Reports', value: '15' }
];

const mockActivity = [
  { id: 1, action: 'New Provider Registration', user: 'John Doe (Plumber)', time: '2 mins ago' },
  { id: 2, action: 'Booking Completed', user: 'Alice & Bob (Electrician)', time: '15 mins ago' },
  { id: 3, action: 'User Reported', user: 'Client flagged a review', time: '1 hour ago' },
  { id: 4, action: 'Service Added', user: 'Sarah (Hairdresser) added "Bridal Hair"', time: '3 hours ago' },
];

export default function DashboardOverview() {
  return (
    <div className="animate-fade-in">
      <div className="dashboard-grid">
        {stats.map(stat => (
          <div key={stat.id} className="glass-card stat-card">
            <span className="stat-title">{stat.title}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="chart-section">
        <div className="glass-card">
          <h2 style={{ marginBottom: '1.5rem', fontWeight: 600, fontSize: '1.4rem' }}>Revenue & Activity Overview</h2>
          <div style={{ 
            height: '350px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'var(--text-secondary)', 
            border: '2px dashed var(--glass-border)', 
            borderRadius: '0.75rem',
            background: 'rgba(0,0,0,0.2)'
          }}>
            <p style={{ opacity: 0.7, fontWeight: 500 }}>[ Interactive Chart Placeholder ]</p>
          </div>
        </div>

        <div className="glass-card">
          <h2 style={{ fontWeight: 600, fontSize: '1.4rem' }}>Recent Activity</h2>
          <div className="recent-activity">
            {mockActivity.map(item => (
              <div key={item.id} className="activity-item">
                <div className="activity-info">
                  <h4>{item.action}</h4>
                  <p>{item.user}</p>
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
