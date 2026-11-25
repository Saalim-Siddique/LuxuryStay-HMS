import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiArrowRight, FiCheck, FiCopy } from 'react-icons/fi';
import { Button, Modal } from '../../components';
import {
  HeroSection,
  HotelCard,
  PublicLayout,
  SectionHeading,
} from '../../components/public';
import {
  EDITORIAL_GALLERY,
  EXPERIENCES_DATA,
  OFFERS_DATA,
  PHILOSOPHY_PILLARS,
  getFeaturedHotels,
} from '../../data/public';

/**
 * HomePage – Public Luxury Editorial landing page for LuxuryStay Hospitality.
 */
const HomePage = () => {
  const featuredHotels = getFeaturedHotels();
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);

  useEffect(() => {
    document.title = 'LuxuryStay — Hotels & Sanctuaries';
  }, []);

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Offer code ${code} copied to clipboard`);
    } catch {
      toast.success(`Use code ${code} during reservation`);
    }
  };

  return (
    <PublicLayout>
      {/* 1. Full-width Hero & Integrated Search */}
      <HeroSection />

      {/* 2. Featured Hotel Properties */}
      <section className="ls-public-section ls-public-section--ivory" aria-labelledby="featured-hotels-heading">
        <div className="ls-public-container">
          <SectionHeading
            eyebrow="Featured Sanctuaries"
            title="Places Shaped by Stillness & Light"
            description="Three signature openings from our nine-property collection across Europe, Japan, and the Mediterranean coast."
            action={
              <Link to="/hotels" className="ls-btn ls-btn--outline ls-btn--md">
                <span>View All 9 Hotels</span>
                <FiArrowRight size={15} aria-hidden="true" />
              </Link>
            }
          />

          <div className="row g-4" id="featured-hotels-heading">
            {featuredHotels.map((hotel) => (
              <div key={hotel._id} className="col-md-6 col-lg-4">
                <HotelCard hotel={hotel} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Brand Introduction & Hospitality Philosophy */}
      <section
        id="philosophy"
        className="ls-public-section ls-public-section--white"
        aria-labelledby="philosophy-heading"
      >
        <div className="ls-public-container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <div className="ls-public-philosophy-frame">
                <img
                  src="/images/public/editorial-lobby-salon.jpg"
                  alt="Wood-panelled reading salon and heritage library inside a LuxuryStay townhouse"
                />
              </div>
              <p
                className="text-slate mt-3 mb-0"
                style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.04em' }}
              >
                The Private Reading Salon — Restored heritage joinery and curated art monographs.
              </p>
            </div>

            <div className="col-lg-7">
              <SectionHeading
                eyebrow="Hospitality Philosophy"
                title="An Architecture of Unhurried Belonging"
                description="LuxuryStay was founded on a quiet conviction: true luxury lives in spatial calm, honest regional materials, and service that anticipates without intrusion."
                className="mb-4"
              />

              <p
                id="philosophy-heading"
                className="text-slate mb-4"
                style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)', maxWidth: '62ch' }}
              >
                Rather than replicating a uniform formula across continents, each sanctuary belongs
                exclusively to its landscape—whether a nineteenth-century limestone residence on Lake
                Geneva, a charred-cedar ryokan courtyard in Kyoto, or a rammed-earth canyon villa in AlUla.
              </p>

              <div className="ls-public-pillar-list">
                {PHILOSOPHY_PILLARS.map((pillar) => (
                  <div key={pillar.number} className="ls-public-pillar-item">
                    <span className="ls-public-pillar-num">{pillar.number}</span>
                    <div>
                      <h3
                        className="font-display mb-1"
                        style={{ fontSize: '1.2rem', color: 'var(--color-navy)' }}
                      >
                        {pillar.title}
                      </h3>
                      <p
                        className="text-slate mb-0"
                        style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}
                      >
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 d-flex flex-wrap gap-3">
                <Link to="/hotels" className="ls-btn ls-btn--primary ls-btn--md">
                  <span>Explore the Collection</span>
                  <FiArrowRight size={15} aria-hidden="true" />
                </Link>
                <Link to="/booking" className="ls-btn ls-btn--outline ls-btn--md">
                  <span>Begin a Reservation</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Experiences & Signature Amenities */}
      <section
        id="experiences"
        className="ls-public-section ls-public-section--navy"
        aria-labelledby="experiences-heading"
      >
        <div className="ls-public-container">
          <SectionHeading
            eyebrow="Curated Experiences"
            title="Rituals Rooted in Place"
            description="Subterranean mineral thermal waters, private wooden coastal launches, and open-hearth cellar tables tailored for resident guests."
            action={
              <Link to="/hotels" className="ls-btn ls-btn--secondary ls-btn--md">
                <span>Browse by Experience</span>
                <FiArrowRight size={15} aria-hidden="true" />
              </Link>
            }
          />

          <div className="row g-4" id="experiences-heading">
            {EXPERIENCES_DATA.map((exp) => (
              <div key={exp._id} className="col-sm-6 col-xl-3">
                <article className="ls-public-exp-card">
                  <div className="ls-public-exp-card__media">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="ls-public-exp-card__img"
                      loading="lazy"
                    />
                  </div>

                  <div className="ls-public-exp-card__body">
                    <span className="ls-public-exp-card__cat">{exp.category}</span>
                    <h3 className="ls-public-exp-card__title">{exp.title}</h3>
                    <p className="ls-public-exp-card__desc">{exp.description}</p>

                    <Link
                      to={`/hotels?amenity=${encodeURIComponent(exp.amenityFilter)}`}
                      className="ls-public-exp-card__link"
                    >
                      <span>Explore Properties</span>
                      <FiArrowRight size={13} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Special Offers */}
      <section
        id="offers"
        className="ls-public-section ls-public-section--ivory"
        aria-labelledby="offers-heading"
      >
        <div className="ls-public-container">
          <SectionHeading
            eyebrow="Seasonal Privileges"
            title="Extended Stays & Private Retreats"
            description="Direct-reservation privileges available exclusively through LuxuryStay across participating suites and seasons."
          />

          <div className="row g-4" id="offers-heading">
            {OFFERS_DATA.map((offer) => (
              <div key={offer._id} className="col-lg-4">
                <article className="ls-public-offer-card">
                  <div className="ls-public-offer-card__top">
                    <span className="ls-eyebrow">{offer.badgeLabel}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(offer.code)}
                      className="ls-public-offer-code d-inline-flex align-items-center gap-1"
                      title="Copy privilege code"
                      aria-label={`Copy offer code ${offer.code}`}
                    >
                      <span>{offer.code}</span>
                      <FiCopy size={11} aria-hidden="true" />
                    </button>
                  </div>

                  <h3 className="font-display mb-1" style={{ fontSize: '1.5rem', color: 'var(--color-navy)' }}>
                    {offer.title}
                  </h3>
                  <p className="fw-medium mb-3" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-accent)' }}>
                    {offer.subtitle}
                  </p>
                  <p className="text-slate mb-0" style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
                    {offer.description}
                  </p>

                  <ul className="ls-public-offer-inclusions">
                    {offer.inclusions.map((inc) => (
                      <li key={inc}>
                        <FiCheck size={14} className="text-gold-aa flex-shrink-0" aria-hidden="true" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="text-slate" style={{ fontSize: 'var(--text-xs)' }}>
                      Valid through {offer.validThrough}
                    </span>
                    <Link
                      to={`/booking?hotel=${encodeURIComponent(offer.featuredHotelSlug)}&offer=${encodeURIComponent(offer.code)}`}
                      className="ls-btn ls-btn--primary ls-btn--sm"
                    >
                      <span>Reserve Offer</span>
                      <FiArrowRight size={13} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Editorial Photography Showcase */}
      <section className="ls-public-section ls-public-section--white" aria-labelledby="editorial-heading">
        <div className="ls-public-container">
          <SectionHeading
            eyebrow="Architectural Monograph"
            title="Atmospheric Study Across Continents"
            description="Select any plate below to inspect architectural notes and explore the corresponding property."
          />

          <div className="ls-public-editorial-grid" id="editorial-heading">
            {EDITORIAL_GALLERY.map((item) => {
              const tileClass = [
                'ls-public-editorial-tile',
                item.variant === 'lead' && 'ls-public-editorial-tile--lead',
                item.variant === 'wide' && 'ls-public-editorial-tile--wide',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <button
                  key={item.id}
                  type="button"
                  className={tileClass}
                  onClick={() => setSelectedGalleryItem(item)}
                  aria-label={`Inspect ${item.title} (${item.location})`}
                >
                  <img src={item.image} alt={`${item.title} — ${item.location}`} loading="lazy" />
                  <div className="ls-public-editorial-tile__caption">
                    <span className="ls-public-editorial-tile__loc">{item.location}</span>
                    <span className="ls-public-editorial-tile__title">{item.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <Modal
        isOpen={Boolean(selectedGalleryItem)}
        onClose={() => setSelectedGalleryItem(null)}
        title={selectedGalleryItem?.title}
        subtitle={selectedGalleryItem?.location}
        size="lg"
        footer={
          selectedGalleryItem ? (
            <div className="w-100 d-flex align-items-center justify-content-between gap-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedGalleryItem(null)}>
                Close
              </Button>
              <Link
                to={`/hotels/${selectedGalleryItem.hotelSlug}`}
                className="ls-btn ls-btn--primary ls-btn--sm"
                onClick={() => setSelectedGalleryItem(null)}
              >
                <span>Explore Property</span>
                <FiArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          ) : null
        }
      >
        {selectedGalleryItem && (
          <div>
            <div
              className="overflow-hidden mb-3"
              style={{ borderRadius: 'var(--radius-sm)', aspectRatio: '16 / 10' }}
            >
              <img
                src={selectedGalleryItem.image}
                alt={selectedGalleryItem.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <p className="text-slate mb-0" style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
              {selectedGalleryItem.caption}
            </p>
          </div>
        )}
      </Modal>
    </PublicLayout>
  );
};

export default HomePage;
