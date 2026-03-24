import { useState } from 'react';
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

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">ServiPro</div>
        <nav className="nav-links">
          <button 
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Manage Users
          </button>
          <button 
            className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            System Reports
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        <header className="header">
          <h1 className="page-title">
            {activeTab === 'dashboard' && 'Platform Overview'}
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'reports' && 'Review Reports'}
          </h1>
          <div className="user-profile">
            <span style={{color: 'var(--text-secondary)', fontWeight: 500}}>Admin</span>
            <div className="avatar">A</div>
          </div>
        </header>

        <main className="main-content animate-fade-in">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'users' && <UsersList />}
          {activeTab === 'reports' && <Reports />}
        </main>
      </div>
    </div>
  );
}

export default App;
