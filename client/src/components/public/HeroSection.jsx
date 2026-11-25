import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import HotelSearchForm from './HotelSearchForm';

/**
 * HeroSection – Full-width Luxury Editorial hero with twilight property photography and search bar.
 */
const HeroSection = () => {
  return (
    <section className="ls-public-hero" aria-label="LuxuryStay global sanctuaries">
      <img
        src="/images/public/hero-grand-courtyard.jpg"
        alt="The Grand Meridian twilight lakeside courtyard and limestone colonnade in Geneva"
        className="ls-public-hero__media"
      />
      <div className="ls-public-hero__scrim" aria-hidden="true" />

      <div className="ls-public-hero__content">
        <div className="ls-public-container">
          <div className="d-flex flex-wrap align-items-end justify-content-between gap-4 mb-4">
            <div>
              <span className="ls-public-hero__eyebrow">
                The LuxuryStay Collection · Nine Iconic Sanctuaries
              </span>
              <h1 className="ls-public-hero__title">
                Architecture of Quiet Grandeur
              </h1>
              <p className="ls-public-hero__desc">
                From Belle Époque lakeside palaces in Geneva to hinoki-cedar pavilions in Kyoto,
                discover intimate properties shaped by heritage stone, natural stillness, and unscripted hospitality.
              </p>
            </div>

            <Link
              to="/hotels/the-grand-meridian-geneva"
              className="d-none d-lg-inline-flex align-items-center gap-2 text-ivory text-decoration-none pb-2"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(200, 164, 93, 0.55)',
              }}
            >
              <span>Pictured: The Grand Meridian, Geneva</span>
              <FiArrowRight size={13} className="text-gold" aria-hidden="true" />
            </Link>
          </div>

          <HotelSearchForm variant="hero" submitLabel="Explore Availability" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

