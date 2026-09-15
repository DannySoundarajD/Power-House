import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_CORE = [
  { path: '/', icon: '⊞', label: 'Dashboard', exact: true, roles: ['all'] },
  { path: '/map', icon: '🗺', label: 'GIS Map', roles: ['all'] },
  { path: '/projects', icon: '🏗', label: 'Projects', roles: ['all'] },
  { path: '/parcels', icon: '📐', label: 'Parcels (RoR)', roles: ['all'] },
  { path: '/proposals', icon: '📋', label: 'Proposals', roles: ['all'] },
  { path: '/workflow', icon: '⟳', label: '9-Stage Workflow', roles: ['central_admin', 'state_officer', 'district_collector'] },
  { path: '/compensation', icon: '₹', label: 'Compensation', roles: ['all'] },
  { path: '/families', icon: '👥', label: 'Families & R&R', roles: ['all'] },
  { path: '/documents', icon: '📁', label: 'Documents', roles: ['all'] },
  { path: '/grievances', icon: '⚖️', label: 'Grievance / Hearing', roles: ['all'] },
  { path: '/field-collection', icon: '📍', label: 'Field GPS Survey', roles: ['all'] },
  { path: '/alerts', icon: '🔔', label: 'Alerts', badge: true, roles: ['all'] },
  { path: '/reports', icon: '📊', label: 'MIS Reports', roles: ['central_admin', 'state_officer', 'district_collector'] },
  { path: '/integrations', icon: '🔌', label: 'National APIs', roles: ['central_admin', 'state_officer', 'district_collector'] },
];

const NAV_INNOVATIONS = [
  { path: '/innovations/suitability', icon: '🌟', label: 'AI Land Suitability', roles: ['all'] },
  { path: '/innovations/ripple', icon: '⚡', label: 'Ripple Impact Analysis', roles: ['all'] },
];

const ROLE_LABELS = {
  central_admin: 'Central Ministry Admin',
  state_officer: 'State Officer · TN',
  district_collector: 'District Collector · Chennai',
  field_officer: 'Field Officer',
  project_agency: 'Project Agency',
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const filterItems = (items) => items.filter(item =>
    item.roles.includes('all') || item.roles.includes(user?.role)
  );

  const allNav = [...NAV_CORE, ...NAV_INNOVATIONS];
  const currentNav = allNav.find(n => n.path === location.pathname);
  const pageTitle = currentNav?.label || 'Dashboard';

  return (
    <div className="app-layout">
      <aside className="sidebar" style={{ overflowY: 'auto' }}>
        <div className="sidebar-logo">
          <div className="logo-emblem">🏛</div>
          <h1>NLAMS</h1>
          <p>National Land Acquisition & Management System</p>
        </div>

        {/* Citizen Portal Direct Switch Card */}
        <div style={{ padding: '0 16px', marginBottom: '14px' }}>
          <Link
            to="/landowner/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '8px',
              padding: '10px 14px',
              textDecoration: 'none',
              color: '#a7f3d0',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            <span>🌾 Citizen Landowner Portal</span>
            <span style={{ fontSize: '14px' }}>→</span>
          </Link>
        </div>

        {/* Core Modules Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">Core Modules</div>
          <nav className="sidebar-nav">
            {filterItems(NAV_CORE).map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">5</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Innovations Section */}
        <div className="sidebar-section" style={{ marginTop: '12px' }}>
          <div className="sidebar-section-label" style={{ color: '#64ffda' }}>
            Innovations
          </div>
          <nav className="sidebar-nav">
            {filterItems(NAV_INNOVATIONS).map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                style={({ isActive }) => isActive ? { background: 'rgba(100, 255, 218, 0.15)', borderColor: '#64ffda' } : {}}
              >
                <span className="nav-icon">{item.icon}</span>
                <span style={{ fontWeight: '600', color: '#e2e8f0' }}>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-user" style={{ marginTop: 'auto', paddingTop: '16px' }}>
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="name">{user?.name}</div>
              <div className="role-badge">{ROLE_LABELS[user?.role] || user?.role}</div>
            </div>
            <button className="btn btn-ghost btn-sm btn-icon" onClick={handleLogout} title="Logout">
              ⏻
            </button>
          </div>
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-title">{pageTitle}</div>
            <div className="topbar-subtitle">National Digital Governance · Real-Time Decision Support</div>
          </div>
          <div className="topbar-right">
            <div className="topbar-badge">
              <span className="dot" />
              Live PostGIS Cadastral Layer
            </div>
            <div className="topbar-badge">
              🇮🇳 DoLR · MoRD
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
