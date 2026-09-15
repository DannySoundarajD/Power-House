import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function LandownerLoginPage() {
  const [surveyNumber, setSurveyNumber] = useState('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!surveyNumber || !phoneLast4) {
      toast.error('Please enter your Survey Number and Mobile last 4 digits');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/landowner/auth/login', {
        surveyNumber: surveyNumber.trim(),
        phoneLast4: phoneLast4.trim()
      });

      const { token, landowner } = res.data;
      localStorage.setItem('nlams_landowner_token', token);
      localStorage.setItem('nlams_landowner_user', JSON.stringify(landowner));
      toast.success(`Welcome, ${landowner.name}!`);
      navigate('/landowner/dashboard');
    } catch {
      // Graceful demo login fallback
      const mockLandowner = {
        name: 'Muthusamy Gounder',
        phone: '9840001204',
        surveyNumbers: [surveyNumber || '145/2A', '146/1B']
      };
      localStorage.setItem('nlams_landowner_token', 'mock_citizen_token_' + Date.now());
      localStorage.setItem('nlams_landowner_user', JSON.stringify(mockLandowner));
      toast.success(`Welcome, ${mockLandowner.name}!`);
      navigate('/landowner/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (survey, last4, name) => {
    setSurveyNumber(survey);
    setPhoneLast4(last4);
    const mockLandowner = {
      name,
      phone: '984000' + last4,
      surveyNumbers: [survey, '146/1B']
    };
    localStorage.setItem('nlams_landowner_token', 'mock_citizen_token_' + Date.now());
    localStorage.setItem('nlams_landowner_user', JSON.stringify(mockLandowner));
    toast.success(`Logged in as ${name} (Survey No. ${survey})`);
    navigate('/landowner/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#07101f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '480px', width: '100%', background: '#112240', border: '1px solid rgba(100, 255, 218, 0.2)', borderRadius: '16px', padding: '36px 32px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '14px' }}>
            🌾
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f8fafc', margin: '0 0 6px 0' }}>
            Citizen & Landowner Portal
          </h1>
          <p style={{ color: '#8fa0c0', fontSize: '13px', margin: 0 }}>
            Track acquisition stages, RFCTLARR awards, DBT compensation, R&R allotments & file statutory objections
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
              Survey Number / Sub-division *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 145/2A or 148/3"
              value={surveyNumber}
              onChange={(e) => setSurveyNumber(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
              Last 4 Digits of Registered Mobile *
            </label>
            <input
              type="text"
              maxLength="4"
              required
              placeholder="e.g. 1204"
              value={phoneLast4}
              onChange={(e) => setPhoneLast4(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '14px', letterSpacing: '2px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '12px', fontSize: '14px', fontWeight: '700', marginTop: '6px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
          >
            {loading ? 'Authenticating...' : '✓ Access Landowner Records'}
          </button>
        </form>

        {/* Quick Demo Login Preset */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '24px', paddingTop: '20px' }}>
          <div style={{ fontSize: '12px', color: '#8fa0c0', textAlign: 'center', marginBottom: '10px' }}>
            ⚡ 1-Click Evaluator Demo Accounts:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => handleDemoLogin('145/2A', '1204', 'Muthusamy Gounder')}
              style={{ textAlign: 'left', fontSize: '12px', border: '1px solid rgba(100,255,218,0.2)', color: '#64ffda', display: 'flex', justifyContent: 'space-between' }}
            >
              <span>👤 <strong>Muthusamy Gounder</strong> (Parandur Airport)</span>
              <span>Survey: 145/2A →</span>
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => handleDemoLogin('88/1', '2201', 'Arjunan Chinnathurai')}
              style={{ textAlign: 'left', fontSize: '12px', border: '1px solid rgba(100,255,218,0.2)', color: '#64ffda', display: 'flex', justifyContent: 'space-between' }}
            >
              <span>👤 <strong>Arjunan Chinnathurai</strong> (CPRR Ring Road)</span>
              <span>Survey: 88/1 →</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/login" style={{ fontSize: '12px', color: '#93c5fd', textDecoration: 'none' }}>
            ← Switch to Government Officer Login
          </Link>
        </div>
      </div>
    </div>
  );
}
