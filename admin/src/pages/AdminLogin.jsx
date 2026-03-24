import { useState } from 'react';
import './AdminLogin.css';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="admin-login-container">
      <div className="glass-card login-card animate-fade-in">
        <h1 className="login-title">ServiPro Admin</h1>
        <p className="login-subtitle">Sign in to the management dashboard</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="admin@servipro.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="login-btn">Secure Login</button>
        </form>
      </div>
    </div>
  );
}
