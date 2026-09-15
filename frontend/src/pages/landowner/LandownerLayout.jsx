import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';

export default function LandownerLayout() {
  const navigate = useNavigate();
  const landownerData = JSON.parse(localStorage.getItem('nlams_landowner_user') || 'null') || {
    name: 'Muthusamy Gounder',
    surveyNumbers: ['145/2A', '146/1B']
  };

  const handleLogout = () => {
    localStorage.removeItem('nlams_landowner_token');
    localStorage.removeItem('nlams_landowner_user');
    navigate('/landowner/login');
  };

  const navLinks = [
    { path: '/landowner/dashboard', label: 'Overview', icon: '📊' },
    { path: '/landowner/status', label: 'Acquisition Stages', icon: '🧭' },
    { path: '/landowner/compensation', label: 'My Compensation', icon: '₹' },
    { path: '/landowner/rr', label: 'R&R Benefits', icon: '🏡' },
    { path: '/landowner/notices', label: 'Gazette Notices', icon: '📄' },
    { path: '/landowner/grievances', label: 'File Grievance', icon: '⚖️' },
    { path: '/landowner/offer', label: '🤝 Offer My Land (Innovation)', icon: '🌟' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#07101f', color: '#e8f0fe', display: 'flex', flexDirection: 'column' }}>
      {/* Top Banner */}
      <header style={{ background: '#0a192f', borderBottom: '1px solid rgba(100, 255, 218, 0.2)', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
            🌾
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#64ffda', letterSpacing: '0.5px' }}>
              NLAMS Citizen & Landowner Portal
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Tamil Nadu State Land Acquisition & Citizen Direct Benefit Portal
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 12px', fontSize: '12px' }}>
            <span style={{ color: '#8fa0c0' }}>Landowner:</span> <strong style={{ color: '#fff' }}>{landownerData.name}</strong>
            <span style={{ margin: '0 8px', color: '#475569' }}>|</span>
            <span style={{ color: '#64ffda' }}>Parcels: {landownerData.surveyNumbers?.join(', ')}</span>
          </div>

          <Link to="/" style={{ fontSize: '12px', color: '#93c5fd', textDecoration: 'none', background: 'rgba(59,130,246,0.15)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(59,130,246,0.3)' }}>
            🏛 Switch to Govt Portal
          </Link>

          <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ fontSize: '12px' }}>
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Sub-Bar */}
      <nav style={{ background: '#112240', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 28px', display: 'flex', gap: '4px', overflowX: 'auto' }}>
        {navLinks.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            style={({ isActive }) => ({
              padding: '14px 18px',
              fontSize: '13px',
              fontWeight: isActive ? '700' : '500',
              color: isActive ? '#64ffda' : '#94a3b8',
              borderBottom: isActive ? '2px solid #64ffda' : '2px solid transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            })}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Main Body */}
      <main style={{ flex: 1, padding: '24px 28px', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
        <Outlet />
      </main>

      {/* Citizen Helpline Footer */}
      <footer style={{ background: '#0a192f', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 28px', fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          DoLR · Department of Land Resources | Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013
        </div>
        <div>
          Toll-Free Grievance Helpline: <strong style={{ color: '#64ffda' }}>1800-425-4646</strong>
        </div>
      </footer>
    </div>
  );
}
