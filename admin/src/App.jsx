import { useState } from 'react';
import { LayoutDashboard, Users, FileBarChart, LogOut, Settings } from 'lucide-react';
import './App.css';
import DashboardOverview from './pages/DashboardOverview';
import UsersList from './pages/UsersList';
import Reports from './pages/Reports';
import AdminLogin from './pages/AdminLogin';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'reports', label: 'Reports', icon: <FileBarChart size={20} /> },
  ];

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview />;
      case 'users': return <UsersList />;
      case 'reports': return <Reports />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon"><Settings size={28} /></span>
          <span className="logo-text">Artisan Hunt Admin</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar-sm">A</div>
            <div className="user-details">
              <span className="user-name">Admin</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
          <button className="nav-item" onClick={() => setIsLoggedIn(false)}>
            <span className="nav-icon"><LogOut size={20} /></span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
