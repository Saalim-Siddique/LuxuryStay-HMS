import { Link } from 'react-router-dom';
import { FiArrowRight, FiCompass, FiMaximize2, FiUsers } from 'react-icons/fi';
import { Badge } from '../index';
import PriceDisplay from './PriceDisplay';
import { checkRoomAvailability, getAmenityMeta } from '../../data/public';

/**
 * RoomCard – Editorial suite presentation card for HotelDetailPage & sibling room lists.
 */
const RoomCard = ({
  room,
  hotelSlug,
  currency = 'USD',
  stayParams = null,
}) => {
  const queryString = stayParams ? new URLSearchParams(stayParams).toString() : '';
  const roomUrl = `/hotels/${hotelSlug}/rooms/${room.slug}${queryString ? `?${queryString}` : ''}`;

  const bookingQuery = new URLSearchParams({
    hotel: hotelSlug,
    room: room.slug,
    ...(stayParams || {}),
  }).toString();
  const bookingUrl = `/booking?${bookingQuery}`;

  const coverImage = room.images?.[0]?.url || '/images/public/room-classic-garden.jpg';
  const coverAlt = room.images?.[0]?.caption || room.name;
  const previewAmenities = (room.amenities || []).slice(0, 4).map(getAmenityMeta);

  const availability = stayParams?.checkIn && stayParams?.checkOut
    ? checkRoomAvailability(room, {
        checkIn: stayParams.checkIn,
        checkOut: stayParams.checkOut,
        guests: Number(stayParams.guests) || 2,
        roomCount: 1,
      })
    : null;

  return (
    <article className="ls-public-room-card">
      <Link to={roomUrl} className="ls-public-room-card__media" aria-label={`Inspect ${room.name}`}>
        <img src={coverImage} alt={coverAlt} loading="lazy" />
      </Link>

      <div className="ls-public-room-card__body">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
          <span className="ls-eyebrow">{room.category}</span>
          {availability && (
            <Badge
              variant={
                !availability.isAvailable
                  ? 'danger'
                  : availability.remainingRooms <= 2
                    ? 'warning'
                    : 'success'
              }
              size="sm"
              dot
            >
              {!availability.isAvailable
                ? availability.hasInventory
                  ? `Max ${room.maxOccupancy} Guests`
                  : 'Sold Out for Dates'
                : availability.remainingRooms <= 2
                  ? `Only ${availability.remainingRooms} Left`
                  : 'Available'}
            </Badge>
          )}
        </div>

        <h3 className="font-display mb-2" style={{ fontSize: '1.5rem', color: 'var(--color-navy)' }}>
          <Link to={roomUrl} style={{ color: 'inherit', textDecoration: 'none' }}>
            {room.name}
          </Link>
        </h3>

        <p className="text-slate mb-0" style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
          {room.description}
        </p>

        <div className="ls-public-room-card__specs">
          <span className="ls-public-room-card__spec">
            <FiUsers size={14} className="text-gold-aa" aria-hidden="true" />
            <span>Up to {room.maxOccupancy} guests</span>
          </span>
          <span className="ls-public-room-card__spec">
            <FiMaximize2 size={14} className="text-gold-aa" aria-hidden="true" />
            <span>{room.size} m²</span>
          </span>
          <span className="ls-public-room-card__spec">
            <span>{room.bedConfiguration}</span>
          </span>
          {room.view && (
            <span className="ls-public-room-card__spec">
              <FiCompass size={14} className="text-gold-aa" aria-hidden="true" />
              <span>{room.view}</span>
            </span>
          )}
        </div>

        {previewAmenities.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {previewAmenities.map((item) => (
              <span key={item.key} className="ls-public-amenity-pill">
                {item.label}
              </span>
            ))}
          </div>
        )}

        <div className="ls-public-room-card__footer">
          <PriceDisplay
            label="Nightly Tariff"
            amount={room.basePrice}
            currency={currency}
            size="md"
          />

          <div className="d-flex flex-wrap align-items-center gap-2">
            <Link to={roomUrl} className="ls-btn ls-btn--outline ls-btn--sm">
              <span>Room Details</span>
            </Link>
            <Link to={bookingUrl} className="ls-btn ls-btn--primary ls-btn--sm">
              <span>Reserve Suite</span>
              <FiArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;

