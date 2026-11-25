import { Link } from 'react-router-dom';
import { FiArrowRight, FiMapPin, FiStar } from 'react-icons/fi';
import PriceDisplay from './PriceDisplay';
import { formatHotelLocation, getAmenityMeta } from '../../data/public';

/**
 * HotelCard – Editorial property card linking to `/hotels/:hotelSlug`.
 */
const HotelCard = ({ hotel, searchQueryString = '' }) => {
  const detailUrl = `/hotels/${hotel.slug}${searchQueryString ? `?${searchQueryString}` : ''}`;
  const location = formatHotelLocation(hotel);
  const previewAmenities = (hotel.amenities || []).slice(0, 3).map(getAmenityMeta);

  return (
    <article className="ls-public-hotel-card">
      <Link to={detailUrl} className="ls-public-hotel-card__media" aria-label={`Explore ${hotel.name}`}>
        <img
          src={hotel.coverImage}
          alt={`${hotel.name} in ${location}`}
          className="ls-public-hotel-card__img"
          loading="lazy"
        />
        <span className="ls-public-hotel-card__tag">{hotel.propertyType}</span>
      </Link>

      <div className="ls-public-hotel-card__body">
        <div className="ls-public-hotel-card__meta">
          <span className="ls-public-hotel-card__location">
            <FiMapPin size={12} aria-hidden="true" />
            <span>{location}</span>
          </span>
          <span className="ls-public-hotel-card__rating" aria-label={`Rated ${hotel.reviewScore} out of 5`}>
            <FiStar size={12} style={{ color: 'var(--color-gold-600)' }} aria-hidden="true" />
            <span>{hotel.reviewScore?.toFixed(2)}</span>
          </span>
        </div>

        <h3 className="ls-public-hotel-card__title">
          <Link to={detailUrl}>{hotel.name}</Link>
        </h3>

        <p className="ls-public-hotel-card__desc">{hotel.tagline || hotel.description}</p>

        {previewAmenities.length > 0 && (
          <div className="ls-public-hotel-card__amenities">
            {previewAmenities.map((item) => (
              <span key={item.key} className="ls-public-amenity-pill">
                {item.label}
              </span>
            ))}
          </div>
        )}

        <div className="ls-public-hotel-card__footer">
          <PriceDisplay
            label="From"
            amount={hotel.startingPrice}
            currency={hotel.currency}
            size="sm"
          />

          <Link
            to={detailUrl}
            className="ls-btn ls-btn--outline ls-btn--sm"
          >
            <span>Explore</span>
            <FiArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;

