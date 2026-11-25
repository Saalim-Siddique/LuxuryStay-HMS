import { Link } from 'react-router-dom';

const UnauthorizedPage = () => (
  <div
    className="d-flex flex-column align-items-center justify-content-center"
    style={{ minHeight: '100vh', background: 'var(--color-ivory)' }}
  >
    <h1 className="text-navy" style={{ fontSize: '6rem', lineHeight: 1 }}>403</h1>
    <h2 className="text-navy mb-3">Access Denied</h2>
    <p className="text-muted mb-4">You do not have permission to view this page.</p>
    <Link to="/dashboard" className="btn btn-gold px-4 py-2">Go to Dashboard</Link>
  </div>
);

export default UnauthorizedPage;

