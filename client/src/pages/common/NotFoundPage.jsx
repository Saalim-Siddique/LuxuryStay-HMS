import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div
    className="d-flex flex-column align-items-center justify-content-center"
    style={{ minHeight: '100vh', background: 'var(--color-ivory)' }}
  >
    <h1 className="text-navy" style={{ fontSize: '6rem', lineHeight: 1 }}>404</h1>
    <h2 className="text-navy mb-3">Page Not Found</h2>
    <p className="text-muted mb-4">The page you are looking for does not exist.</p>
    <Link to="/" className="btn btn-gold px-4 py-2">Return Home</Link>
  </div>
);

export default NotFoundPage;

