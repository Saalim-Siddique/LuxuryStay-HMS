import { Link } from 'react-router-dom';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { CURRENT_YEAR } from '../../data/public';

const FLAGSHIP_LINKS = [
  { label: 'The Grand Meridian · Geneva', to: '/hotels/the-grand-meridian-geneva' },
  { label: 'Kaze-no-Niwa Sanctuary · Kyoto', to: '/hotels/kaze-no-niwa-kyoto' },
  { label: 'Villa Belvedere · Ravello', to: '/hotels/villa-belvedere-ravello' },
  { label: 'Maison Lumière · Paris', to: '/hotels/maison-lumiere-paris' },
  { label: 'Qasr Al-Rimal · AlUla', to: '/hotels/qasr-al-rimal-alula' },
];

/**
 * PublicFooter – Executive Navy footer with collection links, reservations, and concierge details.
 */
const PublicFooter = () => {
  return (
    <footer className="ls-public-footer">
      <div className="ls-public-container">
        <div className="row g-5">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="ls-public-brand__mark" aria-hidden="true">
                LS
              </span>
              <div>
                <div className="font-display text-white" style={{ fontSize: '1.35rem', lineHeight: 1.1 }}>
                  LuxuryStay
                </div>
                <div
                  style={{
                    fontSize: '0.625rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--color-gold)',
                    marginTop: '3px',
                  }}
                >
                  Hotels & Sanctuaries
                </div>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', maxWidth: '36ch' }}>
              An international collection of nine architectural palaces, alpine chalets,
              and cultural sanctuaries dedicated to unhurried pace and enduring craft.
            </p>
          </div>

          <div className="col-6 col-md-4 col-lg-3">
            <h4 className="ls-public-footer__heading">The Collection</h4>
            <ul className="ls-public-footer__links">
              <li>
                <Link to="/hotels" className="ls-public-footer__link">
                  All Nine Properties
                </Link>
              </li>
              {FLAGSHIP_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="ls-public-footer__link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <h4 className="ls-public-footer__heading">Reservations</h4>
            <ul className="ls-public-footer__links">
              <li>
                <Link to="/booking" className="ls-public-footer__link">
                  Book a Stay
                </Link>
              </li>
              <li>
                <Link to="/#offers" className="ls-public-footer__link">
                  Seasonal Offers
                </Link>
              </li>
              <li>
                <Link to="/#experiences" className="ls-public-footer__link">
                  Curated Experiences
                </Link>
              </li>
              <li>
                <Link to="/#philosophy" className="ls-public-footer__link">
                  Hospitality Ethos
                </Link>
              </li>
              <li>
                <Link to="/login" className="ls-public-footer__link">
                  Guest & Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4 col-lg-3">
            <h4 className="ls-public-footer__heading">Global Concierge</h4>
            <ul className="ls-public-footer__links">
              <li className="d-flex align-items-start gap-2" style={{ fontSize: 'var(--text-sm)' }}>
                <FiMapPin size={15} className="text-gold flex-shrink-0 mt-1" aria-hidden="true" />
                <span>Quai du Mont-Blanc 28, 1201 Geneva, Switzerland</span>
              </li>
              <li className="d-flex align-items-center gap-2" style={{ fontSize: 'var(--text-sm)' }}>
                <FiPhone size={15} className="text-gold flex-shrink-0" aria-hidden="true" />
                <a href="tel:+41225550100" className="ls-public-footer__link">
                  +41 22 555 0100
                </a>
              </li>
              <li className="d-flex align-items-center gap-2" style={{ fontSize: 'var(--text-sm)' }}>
                <FiMail size={15} className="text-gold flex-shrink-0" aria-hidden="true" />
                <a href="mailto:concierge@luxurystay.com" className="ls-public-footer__link">
                  concierge@luxurystay.com
                </a>
              </li>
              <li style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.58)', marginTop: '0.25rem' }}>
                Private Reservations Desk open 24 hours daily across all time zones.
              </li>
            </ul>
          </div>
        </div>

        <div className="ls-public-footer__bottom">
          <span>
            © {CURRENT_YEAR} LuxuryStay Hospitality HMS. Frontend public showcase prototype.
          </span>
          <div className="d-flex align-items-center gap-4">
            <Link to="/hotels" className="ls-public-footer__link">
              Directory
            </Link>
            <Link to="/booking" className="ls-public-footer__link">
              Direct Reservations
            </Link>
            {import.meta.env.DEV && (
              <Link to="/design-system" className="ls-public-footer__link">
                Design System
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;

