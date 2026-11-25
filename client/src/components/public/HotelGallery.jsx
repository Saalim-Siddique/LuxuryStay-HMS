import { useEffect, useState } from 'react';
import { FiCamera, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Button, Modal } from '../index';

/**
 * HotelGallery – Editorial multi-frame gallery with interactive thumbnail strip and keyboard lightbox Modal.
 */
const HotelGallery = ({ images = [], title = 'Property Gallery', className = '' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const normalized = images.map((img, idx) =>
    typeof img === 'string'
      ? { url: img, caption: `${title} — View ${idx + 1}` }
      : { url: img.url, caption: img.caption || `${title} — View ${idx + 1}` }
  );

  const total = normalized.length;
  const activeImage = normalized[activeIndex] || normalized[0];

  const handleNext = () => {
    if (total > 0) setActiveIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    if (total > 0) setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (!lightboxOpen || total <= 1) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') setActiveIndex((prev) => (prev + 1) % total);
      if (e.key === 'ArrowLeft') setActiveIndex((prev) => (prev - 1 + total) % total);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, total]);

  if (!total) return null;

  const sideImages = normalized.slice(1, 3);

  return (
    <div className={className}>
      {total >= 3 ? (
        <div className="ls-public-gallery-grid">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="ls-public-gallery-main border-0 p-0 text-start cursor-pointer"
            aria-label={`Open full gallery for ${title}`}
          >
            <img src={activeImage.url} alt={activeImage.caption} />
            <span className="ls-public-gallery-more-btn">
              <span className="ls-btn ls-btn--primary ls-btn--sm">
                <FiCamera size={13} aria-hidden="true" />
                <span>View {total} Photos</span>
              </span>
            </span>
          </button>

          <div className="ls-public-gallery-side">
            {sideImages.map((img, idx) => {
              const actualIdx = idx + 1;
              return (
                <button
                  key={`${img.url}-${actualIdx}`}
                  type="button"
                  className="ls-public-gallery-thumb-btn"
                  onClick={() => {
                    setActiveIndex(actualIdx);
                    setLightboxOpen(true);
                  }}
                  aria-label={`View ${img.caption}`}
                >
                  <img src={img.url} alt={img.caption} />
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="ls-public-gallery-main w-100 border-0 p-0 cursor-pointer"
          aria-label={`Open full gallery for ${title}`}
        >
          <img src={activeImage.url} alt={activeImage.caption} />
        </button>
      )}

      {total > 1 && (
        <div className="ls-public-gallery-strip" role="tablist" aria-label="Select gallery image">
          {normalized.map((img, idx) => (
            <button
              key={`${img.url}-thumb-${idx}`}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Select photo ${idx + 1}: ${img.caption}`}
              className={['ls-public-gallery-strip-item', idx === activeIndex && 'is-active']
                .filter(Boolean)
                .join(' ')}
              onClick={() => setActiveIndex(idx)}
            >
              <img src={img.url} alt="" />
            </button>
          ))}
        </div>
      )}

      <Modal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={title}
        subtitle={`${activeIndex + 1} of ${total} — ${activeImage.caption}`}
        size="xl"
        footer={
          total > 1 ? (
            <div className="w-100 d-flex align-items-center justify-content-between gap-2">
              <Button variant="outline" size="sm" leftIcon={<FiChevronLeft />} onClick={handlePrev}>
                Previous
              </Button>
              <span className="text-slate tabular-nums" style={{ fontSize: 'var(--text-xs)' }}>
                {activeIndex + 1} / {total}
              </span>
              <Button variant="outline" size="sm" rightIcon={<FiChevronRight />} onClick={handleNext}>
                Next
              </Button>
            </div>
          ) : null
        }
      >
        <div
          className="w-100 overflow-hidden"
          style={{
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-navy-950)',
            aspectRatio: '16 / 10',
          }}
        >
          <img
            src={activeImage.url}
            alt={activeImage.caption}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default HotelGallery;

