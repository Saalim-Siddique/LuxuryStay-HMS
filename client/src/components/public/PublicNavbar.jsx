import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiArrowRight, FiMenu, FiX } from 'react-icons/fi';

const NAV_ITEMS = [
  { label: 'Collection', to: '/hotels', type: 'route' },
  { label: 'Philosophy', to: '/#philosophy', type: 'hash' },
  { label: 'Experiences', to: '/#experiences', type: 'hash' },
  { label: 'Offers', to: '/#offers', type: 'hash' },
  { label: 'Reserve', to: '/booking', type: 'route' },
];

/**
 * PublicNavbar – Responsive editorial header supporting transparent hero overlay and solid scrolled bar.
 */
const PublicNavbar = () => {
  const { pathname, hash } = useLocation();
  const isHome = pathname === '/';
  const routeKey = `${pathname}${hash}`;

  const [scrolled, setScrolled] = useState(false);
  const [openRouteKey, setOpenRouteKey] = useState(null);
  const mobileOpen = openRouteKey === routeKey;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 44);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const headerClasses = [
    'ls-public-navbar',
    isHome && 'ls-public-navbar--overlay',
    (scrolled || !isHome || mobileOpen) && 'ls-public-navbar--scrolled',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={headerClasses}>
      <div className="ls-public-container">
        <div className="ls-public-navbar__inner">
          <Link to="/" className="ls-public-brand" aria-label="LuxuryStay Home">
            <span className="ls-public-brand__mark" aria-hidden="true">
              LS
            </span>
            <span className="ls-public-brand__text">
              <span className="ls-public-brand__title">LuxuryStay</span>
              <span className="ls-public-brand__sub">Hotels & Sanctuaries</span>
            </span>
          </Link>

          <nav aria-label="Primary navigation">
            <ul className="ls-public-nav-links">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  {item.type === 'route' ? (
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        ['ls-public-nav-link', isActive && 'is-active'].filter(Boolean).join(' ')
                      }
                    >
                      {item.label}
                    </NavLink>
                  ) : (
                    <Link
                      to={item.to}
                      className={[
                        'ls-public-nav-link',
                        isHome && hash === item.to.replace('/', '') && 'is-active',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="ls-public-nav-actions">
            <Link to="/login" className="ls-public-nav-signin">
              Portal Sign In
            </Link>
            <Link to="/booking" className="ls-btn ls-btn--secondary ls-btn--sm">
              <span>Book a Stay</span>
              <FiArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>

          <button
            type="button"
            className="ls-public-nav-toggle"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="ls-public-mobile-nav"
            onClick={() => setOpenRouteKey(mobileOpen ? null : routeKey)}
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="ls-public-mobile-nav" className="ls-public-mobile-menu d-lg-none">
          <div className="ls-public-container">
            <nav aria-label="Mobile navigation" className="ls-public-mobile-menu__links">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpenRouteKey(null)}
                  className={[
                    'ls-public-mobile-menu__link',
                    pathname === item.to && 'is-active',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span>{item.label}</span>
                  <FiArrowRight size={14} className="text-gold-aa" aria-hidden="true" />
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setOpenRouteKey(null)}
                className="ls-public-mobile-menu__link"
              >
                <span>Guest & Staff Portal</span>
                <FiArrowRight size={14} className="text-gold-aa" aria-hidden="true" />
              </Link>
            </nav>

            <Link
              to="/booking"
              onClick={() => setOpenRouteKey(null)}
              className="ls-btn ls-btn--secondary ls-btn--md ls-btn--full"
            >
              <span>Reserve a Stay</span>
              <FiArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;

