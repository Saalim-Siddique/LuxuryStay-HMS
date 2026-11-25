import { FiCalendar, FiCheckCircle, FiInfo, FiMapPin, FiUsers } from 'react-icons/fi';
import { Badge } from '../index';
import { formatHotelLocation } from '../../data/public';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * BookingSummary – Sticky itemized stay summary separating room tariff, offer privilege, taxes, and local charges.
 */
const BookingSummary = ({
  hotel,
  room,
  checkIn,
  checkOut,
  adults = 2,
  childrenCount = 0,
  roomCount = 1,
  pricing,
  className = '',
}) => {
  if (!hotel || !room || !pricing) return null;

  const {
    currency,
    nights,
    nightlyRate,
    roomSubtotal,
    discountAmount,
    appliedOffer,
    taxRate,
    taxAmount,
    resortFeeTotal,
    cityTaxTotal,
    totalAmount,
  } = pricing;

  const totalGuests = (Number(adults) || 0) + (Number(childrenCount) || 0);

  return (
    <aside className={['ls-public-summary-card', className].filter(Boolean).join(' ')} aria-label="Reservation summary">
      <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
        <span className="ls-eyebrow">Reservation Folio</span>
        <Badge variant="gold" size="sm">
          Best Direct Rate
        </Badge>
      </div>

      <div className="ls-public-summary-hotel">
        <img
          src={hotel.coverImage}
          alt={hotel.name}
          className="ls-public-summary-hotel__thumb"
        />
        <div className="min-w-0">
          <h3 className="font-display mb-1" style={{ fontSize: '1.15rem', color: 'var(--color-navy)' }}>
            {hotel.name}
          </h3>
          <div className="d-flex align-items-center gap-1 text-slate" style={{ fontSize: 'var(--text-xs)' }}>
            <FiMapPin size={12} className="text-gold-aa flex-shrink-0" aria-hidden="true" />
            <span>{formatHotelLocation(hotel)}</span>
          </div>
          <div className="mt-1 fw-medium" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-navy)' }}>
            {room.name}
          </div>
        </div>
      </div>

      <div className="d-flex flex-column gap-2 pb-3 mb-3 border-bottom" style={{ borderColor: 'var(--border-subtle)', fontSize: 'var(--text-xs)' }}>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <span className="d-inline-flex align-items-center gap-2 text-slate">
            <FiCalendar size={13} className="text-gold-aa" aria-hidden="true" />
            <span>Check-in</span>
          </span>
          <span className="fw-medium text-navy">
            {formatDate(checkIn)} · {hotel.checkInTime}
          </span>
        </div>

        <div className="d-flex align-items-center justify-content-between gap-2">
          <span className="d-inline-flex align-items-center gap-2 text-slate">
            <FiCalendar size={13} className="text-gold-aa" aria-hidden="true" />
            <span>Check-out</span>
          </span>
          <span className="fw-medium text-navy">
            {formatDate(checkOut)} · {hotel.checkOutTime}
          </span>
        </div>

        <div className="d-flex align-items-center justify-content-between gap-2">
          <span className="d-inline-flex align-items-center gap-2 text-slate">
            <FiUsers size={13} className="text-gold-aa" aria-hidden="true" />
            <span>Occupancy</span>
          </span>
          <span className="fw-medium text-navy">
            {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'} · {roomCount}{' '}
            {roomCount === 1 ? 'Suite' : 'Suites'} · {nights} {nights === 1 ? 'Night' : 'Nights'}
          </span>
        </div>
      </div>

      <div className="ls-public-price-rows">
        <div className="ls-public-price-row">
          <span>
            {formatCurrency(nightlyRate, currency)} × {nights} {nights === 1 ? 'night' : 'nights'}
            {roomCount > 1 ? ` × ${roomCount} suites` : ''}
          </span>
          <span className="fw-medium text-navy">{formatCurrency(roomSubtotal, currency)}</span>
        </div>

        {discountAmount > 0 && appliedOffer && (
          <div className="ls-public-price-row ls-public-price-row--discount">
            <span>Offer Privilege ({appliedOffer.code})</span>
            <span>−{formatCurrency(discountAmount, currency)}</span>
          </div>
        )}

        <div className="ls-public-price-row">
          <span>Hospitality VAT & Occupancy Tax ({taxRate}%)</span>
          <span>{formatCurrency(taxAmount, currency)}</span>
        </div>

        {resortFeeTotal > 0 && (
          <div className="ls-public-price-row">
            <span>Resort & Sanctuary Fee</span>
            <span>{formatCurrency(resortFeeTotal, currency)}</span>
          </div>
        )}

        {cityTaxTotal > 0 && (
          <div className="ls-public-price-row">
            <span>Municipal Tourist Levy</span>
            <span>{formatCurrency(cityTaxTotal, currency)}</span>
          </div>
        )}

        <div className="ls-public-price-row ls-public-price-row--total">
          <span>Estimated Stay Total</span>
          <span className="font-display" style={{ fontSize: '1.35rem' }}>
            {formatCurrency(totalAmount, currency)}
          </span>
        </div>
      </div>

      <div
        className="mt-4 pt-3 border-top d-flex flex-column gap-2"
        style={{ borderColor: 'var(--border-subtle)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}
      >
        <div className="d-flex align-items-start gap-2">
          <FiCheckCircle size={14} className="text-gold-aa flex-shrink-0 mt-1" aria-hidden="true" />
          <span>{hotel.policies?.cancellation}</span>
        </div>
        <div className="d-flex align-items-start gap-2">
          <FiInfo size={14} className="text-slate flex-shrink-0 mt-1" aria-hidden="true" />
          <span>Prototype reservation summary — no live payment or charge is processed.</span>
        </div>
      </div>
    </aside>
  );
};

export default BookingSummary;

