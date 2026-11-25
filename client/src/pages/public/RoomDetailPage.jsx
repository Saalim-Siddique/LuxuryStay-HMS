import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiCompass,
  FiHome,
  FiLayers,
  FiMaximize2,
  FiUsers,
} from 'react-icons/fi';
import { Badge, Breadcrumb, Button, EmptyState, Select } from '../../components';
import {
  AmenityList,
  DateRangeSelector,
  HotelGallery,
  PriceDisplay,
  PublicLayout,
  RoomCard,
  SectionHeading,
} from '../../components/public';
import {
  calculateStayPricing,
  checkRoomAvailability,
  getDefaultStayDates,
  getRoomBySlugs,
} from '../../data/public';
import { calcNights, formatCurrency } from '../../utils/formatters';

const GUEST_OPTIONS = [
  { value: '1', label: '1 Guest' },
  { value: '2', label: '2 Guests' },
  { value: '3', label: '3 Guests' },
  { value: '4', label: '4 Guests' },
  { value: '5', label: '5 Guests' },
  { value: '6', label: '6 Guests' },
];

/**
 * RoomDetailPage – Suite specification, gallery, live date availability check, and reservation launch (`/hotels/:hotelSlug/rooms/:roomSlug`).
 */
const RoomDetailPage = () => {
  const { hotelSlug, roomSlug } = useParams();
  const [searchParams] = useSearchParams();
  return (
    <RoomDetailView
      key={`${hotelSlug}-${roomSlug}-${searchParams.toString()}`}
      hotelSlug={hotelSlug}
      roomSlug={roomSlug}
      searchParams={searchParams}
    />
  );
};

const RoomDetailView = ({ hotelSlug, roomSlug, searchParams }) => {
  const navigate = useNavigate();

  const data = useMemo(() => getRoomBySlugs(hotelSlug, roomSlug), [hotelSlug, roomSlug]);
  const [defaults] = useState(() => getDefaultStayDates(14, 3));

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || defaults.checkIn);
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || defaults.checkOut);
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 2);
  const [roomCount, setRoomCount] = useState(Number(searchParams.get('roomCount')) || 1);

  useEffect(() => {
    document.title = data
      ? `${data.room.name} | ${data.hotel.name} — LuxuryStay`
      : 'Suite Not Found — LuxuryStay';
  }, [data]);

  const roomCountOptions = useMemo(() => {
    const maxCap = Math.min(4, data?.room?.totalInventory || 4);
    return Array.from({ length: maxCap }, (_, idx) => {
      const count = idx + 1;
      return { value: String(count), label: `${count} ${count === 1 ? 'Suite' : 'Suites'}` };
    });
  }, [data]);

  if (!data) {
    return (
      <PublicLayout>
        <section className="ls-public-section">
          <div className="ls-public-container">
            <EmptyState
              icon={<FiHome />}
              title="Suite Category Not Found"
              description="This accommodation could not be found. Browse the property’s remaining suites or return to the full collection."
              action={
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  {hotelSlug && (
                    <Link to={`/hotels/${hotelSlug}`} className="ls-btn ls-btn--outline ls-btn--sm">
                      View Hotel
                    </Link>
                  )}
                  <Link to="/hotels" className="ls-btn ls-btn--primary ls-btn--sm">
                    Browse All Hotels
                  </Link>
                </div>
              }
            />
          </div>
        </section>
      </PublicLayout>
    );
  }

  const { hotel, room, siblingRooms } = data;
  const nights = calcNights(checkIn, checkOut);
  const dateValid = Boolean(checkIn && checkOut && nights > 0);

  const availability = checkRoomAvailability(room, {
    checkIn,
    checkOut,
    guests,
    roomCount,
  });

  const pricing = calculateStayPricing({
    hotel,
    room,
    checkIn,
    checkOut,
    roomCount,
    guests,
  });

  const canProceed = dateValid && availability.isAvailable;

  const handleProceedToBooking = () => {
    if (!canProceed) return;
    const params = new URLSearchParams({
      hotel: hotel.slug,
      room: room.slug,
      checkIn,
      checkOut,
      guests: String(guests),
      roomCount: String(roomCount),
    });
    navigate(`/booking?${params.toString()}`);
  };

  const sqFeet = Math.round(room.size * 10.764);

  return (
    <PublicLayout>
      {/* Editorial Header */}
      <section className="ls-public-page-banner">
        <div className="ls-public-container">
          <Breadcrumb
            items={[
              { label: 'Home', to: '/' },
              { label: 'Hotels', to: '/hotels' },
              { label: hotel.name, to: `/hotels/${hotel.slug}` },
              { label: room.name },
            ]}
            className="mb-3"
          />

          <div className="d-flex flex-wrap align-items-end justify-content-between gap-4">
            <div>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <Badge variant="gold" size="sm">
                  {room.category}
                </Badge>
                <span className="text-slate" style={{ fontSize: 'var(--text-xs)' }}>
                  {hotel.name} · {hotel.address.city}, {hotel.address.country}
                </span>
              </div>

              <h1 className="ls-public-page-banner__title">{room.name}</h1>
              <p className="ls-public-page-banner__desc">{room.tagline}</p>
            </div>

            <PriceDisplay
              label="Base Nightly Rate"
              amount={room.basePrice}
              currency={hotel.currency}
              size="lg"
            />
          </div>

          <HotelGallery
            key={room.slug}
            images={room.images}
            title={`${room.name} — ${hotel.name}`}
            className="mt-4"
          />
        </div>
      </section>

      {/* Suite Specifications + Interactive Availability Checker */}
      <section className="ls-public-section ls-public-section--ivory ls-public-section--compact">
        <div className="ls-public-container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-7">
              {/* Architectural Specification Strip */}
              <div className="row g-3 mb-4">
                <div className="col-6 col-sm-3">
                  <div className="bg-white border p-3 h-100" style={{ borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    <FiUsers size={16} className="text-gold-aa mb-2" aria-hidden="true" />
                    <div className="text-slate" style={{ fontSize: 'var(--text-xs)' }}>Max Occupancy</div>
                    <div className="fw-semibold text-navy" style={{ fontSize: 'var(--text-sm)' }}>
                      {room.maxOccupancy} Guests
                    </div>
                  </div>
                </div>

                <div className="col-6 col-sm-3">
                  <div className="bg-white border p-3 h-100" style={{ borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    <FiMaximize2 size={16} className="text-gold-aa mb-2" aria-hidden="true" />
                    <div className="text-slate" style={{ fontSize: 'var(--text-xs)' }}>Interior Area</div>
                    <div className="fw-semibold text-navy" style={{ fontSize: 'var(--text-sm)' }}>
                      {room.size} m² ({sqFeet} ft²)
                    </div>
                  </div>
                </div>

                <div className="col-6 col-sm-3">
                  <div className="bg-white border p-3 h-100" style={{ borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    <FiLayers size={16} className="text-gold-aa mb-2" aria-hidden="true" />
                    <div className="text-slate" style={{ fontSize: 'var(--text-xs)' }}>Bed Configuration</div>
                    <div className="fw-semibold text-navy" style={{ fontSize: 'var(--text-sm)' }}>
                      {room.bedConfiguration}
                    </div>
                  </div>
                </div>

                <div className="col-6 col-sm-3">
                  <div className="bg-white border p-3 h-100" style={{ borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    <FiCompass size={16} className="text-gold-aa mb-2" aria-hidden="true" />
                    <div className="text-slate" style={{ fontSize: 'var(--text-xs)' }}>Aspect & Floor</div>
                    <div className="fw-semibold text-navy" style={{ fontSize: 'var(--text-sm)' }}>
                      {room.view}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border p-4 p-md-5 mb-4" style={{ borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <SectionHeading
                  eyebrow={room.floorRange || 'Suite Profile'}
                  title="Spatial Composition & Craft"
                  className="mb-3"
                />
                <p className="text-body mb-3" style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--leading-relaxed)' }}>
                  {room.description}
                </p>
                <p className="text-slate mb-0" style={{ fontSize: 'var(--text-sm)' }}>
                  Recommended occupancy: up to {room.maxAdults} adults
                  {room.maxChildren > 0 ? ` and ${room.maxChildren} children (max ${room.maxOccupancy} total guests)` : ' (max 2 guests)'}.
                </p>
              </div>

              {/* Amenities */}
              <div className="bg-white border p-4 p-md-5" style={{ borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <SectionHeading
                  eyebrow="Suite Inclusions"
                  title="Amenities & Bespoke Services"
                  className="mb-4"
                />
                <AmenityList amenities={room.amenities} grouped />
              </div>
            </div>

            {/* Availability Search & Direct Booking Panel */}
            <aside className="col-lg-5 ls-public-sticky-panel" aria-label="Availability and reservation panel">
              <div className="ls-public-summary-card">
                <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                  <span className="ls-eyebrow">Check Availability</span>
                  <span className="text-slate" style={{ fontSize: 'var(--text-xs)' }}>
                    {room.totalInventory} total in category
                  </span>
                </div>

                <h2 className="font-display mb-4" style={{ fontSize: '1.5rem', color: 'var(--color-navy)' }}>
                  Stay Dates & Rate Estimate
                </h2>

                <DateRangeSelector
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onCheckInChange={setCheckIn}
                  onCheckOutChange={setCheckOut}
                  checkOutError={!dateValid ? 'Check-out must be after check-in.' : ''}
                  className="mb-3"
                />

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <Select
                      label="Total Guests"
                      options={GUEST_OPTIONS}
                      value={String(guests)}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      placeholder=""
                    />
                  </div>
                  <div className="col-6">
                    <Select
                      label="Suites"
                      options={roomCountOptions}
                      value={String(roomCount)}
                      onChange={(e) => setRoomCount(Number(e.target.value))}
                      placeholder=""
                    />
                  </div>
                </div>

                {/* Live Availability Feedback */}
                {dateValid && (
                  <div
                    className="p-3 mb-4 border d-flex align-items-start gap-2"
                    role="status"
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: availability.isAvailable
                        ? 'var(--color-success-bg)'
                        : 'var(--color-warning-bg)',
                      borderColor: availability.isAvailable
                        ? 'var(--color-success-border)'
                        : 'var(--color-warning-border)',
                      color: availability.isAvailable ? 'var(--color-success)' : 'var(--color-warning)',
                      fontSize: 'var(--text-xs)',
                    }}
                  >
                    {availability.isAvailable ? (
                      <>
                        <FiCheckCircle size={15} className="flex-shrink-0 mt-1" aria-hidden="true" />
                        <div>
                          <div className="fw-semibold">
                            Available for {nights} {nights === 1 ? 'night' : 'nights'}
                          </div>
                          <div>
                            {availability.remainingRooms} {availability.remainingRooms === 1 ? 'suite' : 'suites'} remaining in this category for your selected dates.
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <FiAlertCircle size={15} className="flex-shrink-0 mt-1" aria-hidden="true" />
                        <div>
                          <div className="fw-semibold">Adjustment Required</div>
                          <div>{availability.reason}</div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Estimated Breakdown */}
                {dateValid && (
                  <div className="ls-public-price-rows mb-4">
                    <div className="ls-public-price-row">
                      <span>
                        {formatCurrency(room.basePrice, hotel.currency)} × {nights} nights
                        {roomCount > 1 ? ` × ${roomCount} suites` : ''}
                      </span>
                      <span className="fw-medium text-navy">
                        {formatCurrency(pricing.roomSubtotal, hotel.currency)}
                      </span>
                    </div>
                    <div className="ls-public-price-row">
                      <span>Estimated Taxes ({hotel.taxRate}%)</span>
                      <span>{formatCurrency(pricing.taxAmount, hotel.currency)}</span>
                    </div>
                    {pricing.additionalChargesTotal > 0 && (
                      <div className="ls-public-price-row">
                        <span>Additional Fees & City Levy</span>
                        <span>{formatCurrency(pricing.additionalChargesTotal, hotel.currency)}</span>
                      </div>
                    )}
                    <div className="ls-public-price-row ls-public-price-row--total">
                      <span>Estimated Stay Total</span>
                      <span className="font-display" style={{ fontSize: '1.35rem' }}>
                        {formatCurrency(pricing.totalAmount, hotel.currency)}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!canProceed}
                  onClick={handleProceedToBooking}
                  rightIcon={<FiArrowRight />}
                >
                  Proceed to Reservation
                </Button>

                <p className="text-slate text-center mt-3 mb-0" style={{ fontSize: 'var(--text-xs)' }}>
                  Check-in {hotel.checkInTime} · Check-out {hotel.checkOutTime} · {hotel.policies?.cancellation}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Sibling Suites */}
      {siblingRooms.length > 0 && (
        <section className="ls-public-section ls-public-section--white ls-public-section--compact">
          <div className="ls-public-container">
            <SectionHeading
              eyebrow={hotel.name}
              title="Other Suites at This Sanctuary"
              action={
                <Link to={`/hotels/${hotel.slug}`} className="ls-btn ls-btn--outline ls-btn--sm">
                  <span>Back to Hotel Overview</span>
                </Link>
              }
            />

            <div className="d-flex flex-column gap-4">
              {siblingRooms.map((alt) => (
                <RoomCard
                  key={alt._id}
                  room={alt}
                  hotelSlug={hotel.slug}
                  currency={hotel.currency}
                  stayParams={{
                    ...(dateValid ? { checkIn, checkOut } : {}),
                    guests: String(guests),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
};

export default RoomDetailPage;
