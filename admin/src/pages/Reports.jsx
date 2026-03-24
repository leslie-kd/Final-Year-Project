import './UsersList.css';

const mockReports = [
  { id: 101, reporter: 'Charlie Prince', reportedUser: 'Bob Builder', reason: 'No-show for booking', status: 'Open' },
  { id: 102, reporter: 'Diana Prince', reportedUser: 'Alice Cooper', reason: 'Rude behavior', status: 'Resolved' },
];

export default function Reports() {
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
              {mockReports.map(rep => (
                <tr key={rep.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>#{rep.id}</td>
                  <td>{rep.reporter}</td>
                  <td>{rep.reportedUser}</td>
                  <td>{rep.reason}</td>
                  <td><span className={`status-badge ${rep.status.toLowerCase()}`}>{rep.status}</span></td>
                  <td>
                    <button className="btn-action">Review</button>
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
