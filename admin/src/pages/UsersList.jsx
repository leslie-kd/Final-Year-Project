import './UsersList.css';

const mockUsers = [
  { id: 1, name: 'Alice Cooper', role: 'Provider', status: 'Active', joined: '2023-11-10' },
  { id: 2, name: 'Bob Builder', role: 'Provider', status: 'Pending', joined: '2023-11-12' },
  { id: 3, name: 'Charlie Prince', role: 'Client', status: 'Active', joined: '2023-11-15' },
  { id: 4, name: 'Diana Prince', role: 'Client', status: 'Suspended', joined: '2023-10-01' },
];

export default function UsersList() {
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
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{user.name}</td>
                  <td><span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span></td>
                  <td><span className={`status-badge ${user.status.toLowerCase()}`}>{user.status}</span></td>
                  <td>{user.joined}</td>
                  <td>
                    <button className="btn-action">Edit</button>
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
