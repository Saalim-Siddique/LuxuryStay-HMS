import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/public.css';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

/**
 * PublicLayout – Shared public shell handling scoped CSS, scroll-to-top, and hash section scrolling.
 */
const PublicLayout = ({ children }) => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return (
    <div className="ls-public-shell">
      <a href="#main-content" className="visually-hidden-focusable p-3 bg-navy text-white">
        Skip to main content
      </a>

      <PublicNavbar />

      <main id="main-content" className="ls-public-main">
        {children}
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicLayout;

