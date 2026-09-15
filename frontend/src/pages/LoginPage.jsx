import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const DEMO_USERS = [
  { name: 'Rajesh Kumar IAS', role: 'Central Ministry Admin', email: 'rajesh.kumar@dolr.gov.in', icon: '🏛' },
  { name: 'Priya Chandran IAS', role: 'State Officer · TN', email: 'priya.chandran@tn.gov.in', icon: '🏢' },
  { name: 'Senthil Murugan IAS', role: 'District Collector · Chennai', email: 'collector.chennai@tn.gov.in', icon: '⚖️' },
  { name: 'Kumaran Selvam', role: 'Field Officer', email: 'kumaran.s@tn.gov.in', icon: '🔍' },
  { name: 'Anand Krishnamurthy', role: 'Project Agency · AAI', email: 'anand.k@aai.aero', icon: '✈️' },
];

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate('/', { replace: true }); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (email) => {
    setForm({ email, password: 'Password@123' });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-emblem">🏛</div>
          <h1>NLAMS</h1>
          <p>National Land Acquisition & Management System</p>
          <p style={{ marginTop: 8, color: 'var(--color-accent)', fontWeight: 600, fontSize: 11 }}>
            Chennai District Prototype · Ministry of Rural Development
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Official Email ID</label>
            <input
              type="email"
              className="form-control"
              placeholder="user@gov.in"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            {loading ? 'Signing in...' : '🔐 Secure Login'}
          </button>
        </form>

        <div className="demo-users" style={{ marginTop: 24 }}>
          <h3>Demo Users — Click to auto-fill</h3>
          {DEMO_USERS.map(u => (
            <button
              key={u.email}
              className="demo-user-btn"
              onClick={() => handleDemoLogin(u.email)}
              type="button"
            >
              <span style={{ fontSize: 20 }}>{u.icon}</span>
              <div>
                <span className="demo-name">{u.name}</span>
                <span className="demo-role">{u.role}</span>
              </div>
            </button>
          ))}
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>
            Password: <span className="mono">Password@123</span> · Prototype only
          </p>
        </div>

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 16 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>🔒 TLS 1.3 Encrypted</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>🛡 JWT Auth</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>📋 Audit Logged</span>
        </div>
      </div>
    </div>
  );
}
