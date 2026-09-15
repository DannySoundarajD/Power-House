import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProjectCreatePage from './pages/ProjectCreatePage';
import ParcelManagementPage from './pages/ParcelManagementPage';
import ProposalsPage from './pages/ProposalsPage';
import WorkflowPage from './pages/WorkflowPage';
import CompensationPage from './pages/CompensationPage';
import FamiliesPage from './pages/FamiliesPage';
import DocumentsPage from './pages/DocumentsPage';
import GrievancePage from './pages/GrievancePage';
import FieldCollectionPage from './pages/FieldCollectionPage';
import IntegrationPage from './pages/IntegrationPage';
import SuitabilityPage from './pages/SuitabilityPage';
import RippleImpactPage from './pages/RippleImpactPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';

// Landowner Portal Pages
import LandownerLayout from './pages/landowner/LandownerLayout';
import LandownerLoginPage from './pages/landowner/LandownerLoginPage';
import LandownerDashboard from './pages/landowner/LandownerDashboard';
import LandownerStatusPage from './pages/landowner/LandownerStatusPage';
import LandownerCompensationPage from './pages/landowner/LandownerCompensationPage';
import LandownerRRPage from './pages/landowner/LandownerRRPage';
import LandownerNoticesPage from './pages/landowner/LandownerNoticesPage';
import LandownerGrievancePage from './pages/landowner/LandownerGrievancePage';
import LandOfferPage from './pages/landowner/LandOfferPage';

import { Toaster } from 'react-hot-toast';
import './index.css';
import 'leaflet/dist/leaflet.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-state"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#112240',
            color: '#e8f0fe',
            border: '1px solid rgba(255,255,255,0.07)',
            fontSize: '13px',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Government Portal Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Government Portal Routes */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/new" element={<ProjectCreatePage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="parcels" element={<ParcelManagementPage />} />
            <Route path="proposals" element={<ProposalsPage />} />
            <Route path="workflow" element={<WorkflowPage />} />
            <Route path="compensation" element={<CompensationPage />} />
            <Route path="families" element={<FamiliesPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="grievances" element={<GrievancePage />} />
            <Route path="field-collection" element={<FieldCollectionPage />} />
            <Route path="integrations" element={<IntegrationPage />} />
            <Route path="innovations/suitability" element={<SuitabilityPage />} />
            <Route path="innovations/ripple" element={<RippleImpactPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>

          {/* Landowner Citizen Portal Routes */}
          <Route path="/landowner/login" element={<LandownerLoginPage />} />
          <Route path="/landowner" element={<LandownerLayout />}>
            <Route index element={<Navigate to="/landowner/dashboard" replace />} />
            <Route path="dashboard" element={<LandownerDashboard />} />
            <Route path="status" element={<LandownerStatusPage />} />
            <Route path="compensation" element={<LandownerCompensationPage />} />
            <Route path="rr" element={<LandownerRRPage />} />
            <Route path="notices" element={<LandownerNoticesPage />} />
            <Route path="grievances" element={<LandownerGrievancePage />} />
            <Route path="offer" element={<LandOfferPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
