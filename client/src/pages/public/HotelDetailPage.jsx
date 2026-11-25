import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiHome,
  FiMail,
  FiMapPin,
  FiPhone,
  FiStar,
} from 'react-icons/fi';
import { Badge, Breadcrumb, EmptyState, Select } from '../../components';
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
  formatFullAddress,
  getDefaultStayDates,
  getHotelBySlug,
} from '../../data/public';
import { calcNights } from '../../utils/formatters';

const GUEST_OPTIONS = [
  { value: '1', label: '1 Guest' },
  { value: '2', label: '2 Guests' },
  { value: '3', label: '3 Guests' },
  { value: '4', label: '4 Guests' },
  { value: '5', label: '5 Guests' },
];

/**
 * HotelDetailPage – Editorial property dossier with gallery, highlights, amenities, rooms, and policies (`/hotels/:hotelSlug`).
 */
const HotelDetailPage = () => {
  const { hotelSlug } = useParams();
  const [searchParams] = useSearchParams();
  const hotel = useMemo(() => getHotelBySlug(hotelSlug), [hotelSlug]);

  const defaults = useMemo(() => getDefaultStayDates(14, 3), []);
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || defaults.checkIn);
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || defaults.checkOut);
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');

  useEffect(() => {
    document.title = hotel ? `${hotel.name} — LuxuryStay` : 'Property Not Found — LuxuryStay';
  }, [hotel]);

  if (!hotel) {
    return (
      <PublicLayout>
        <section className="ls-public-section">
          <div className="ls-public-container">
            <EmptyState
              icon={<FiHome />}
              title="Property Not Found"
              description="The hotel sanctuary you requested could not be located in our current collection."
              action={
                <Link to="/hotels" className="ls-btn ls-btn--primary ls-btn--sm">
                  Return to All Hotels
                </Link>
              }
            />
          </div>
        </section>
      </PublicLayout>
    );
  }

  const nights = calcNights(checkIn, checkOut);
  const stayParams = {
    ...(checkIn && nights > 0 ? { checkIn, checkOut } : {}),
    guests,
  };

  const primaryBookingRoom = hotel.rooms?.[0];
  const quickBookingUrl = `/booking?${new URLSearchParams({
    hotel: hotel.slug,
    ...(primaryBookingRoom ? { room: primaryBookingRoom.slug } : {}),
    ...stayParams,
  }).toString()}`;

  return (
    <PublicLayout>
      {/* Editorial Property Header */}
      <section className="ls-public-page-banner">
        <div className="ls-public-container">
          <Breadcrumb
            items={[
              { label: 'Home', to: '/' },
              { label: 'Hotels', to: '/hotels' },
              { label: hotel.name },
            ]}
            className="mb-3"
          />

          <div className="d-flex flex-wrap align-items-end justify-content-between gap-4">
            <div>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <Badge variant="gold" size="sm">
                  {hotel.propertyType}
                </Badge>
                <span
                  className="d-inline-flex align-items-center gap-1 fw-medium text-navy"
                  style={{ fontSize: 'var(--text-xs)' }}
                >
                  <FiStar size={12} className="text-gold-aa" aria-hidden="true" />
                  <span>
                    {hotel.reviewScore?.toFixed(2)} ({hotel.reviewCount} guest reviews)
                  </span>
                </span>
              </div>

              <h1 className="ls-public-page-banner__title">{hotel.name}</h1>

              <p className="d-flex align-items-center gap-2 text-slate mb-0" style={{ fontSize: 'var(--text-sm)' }}>
                <FiMapPin size={14} className="text-gold-aa flex-shrink-0" aria-hidden="true" />
                <span>{formatFullAddress(hotel)}</span>
              </p>
            </div>

            <div className="d-flex flex-wrap align-items-end gap-4">
              <PriceDisplay
                label="Suites From"
                amount={hotel.startingPrice}
                currency={hotel.currency}
                size="lg"
              />
              <a href="#rooms" className="ls-btn ls-btn--outline ls-btn--md">
                <span>View Suites</span>
              </a>
              <Link to={quickBookingUrl} className="ls-btn ls-btn--primary ls-btn--md">
                <span>Reserve Stay</span>
                <FiArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <HotelGallery
            key={hotel.slug}
            images={hotel.images}
            title={hotel.name}
            className="mt-4"
          />
        </div>
      </section>

      {/* Story, Highlights, Amenities, Rooms & Sticky Booking Info */}
      <section className="ls-public-section ls-public-section--ivory ls-public-section--compact">
        <div className="ls-public-container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-8">
              {/* Overview & Narrative */}
              <div className="bg-white border p-4 p-md-5 mb-4" style={{ borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <SectionHeading
                  eyebrow="The Sanctuary"
                  title={hotel.tagline}
                  className="mb-3"
                />
                <p className="text-body mb-3" style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--leading-relaxed)' }}>
                  {hotel.description}
                </p>
                <p className="text-slate mb-0" style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' }}>
                  {hotel.editorialStory}
                </p>

                {hotel.highlights?.length > 0 && (
                  <div className="mt-4 pt-4 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                    <h3 className="h6 text-uppercase ls-eyebrow mb-3" style={{ color: 'var(--color-navy)' }}>
                      Property Highlights
                    </h3>
                    <div className="row g-3">
                      {hotel.highlights.map((highlight) => (
                        <div key={highlight} className="col-md-6">
                          <div className="d-flex align-items-start gap-2" style={{ fontSize: 'var(--text-sm)' }}>
                            <FiCheck size={15} className="text-gold-aa flex-shrink-0 mt-1" aria-hidden="true" />
                            <span>{highlight}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Amenities & Facilities */}
              <div className="bg-white border p-4 p-md-5 mb-5" style={{ borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <SectionHeading
                  eyebrow="Amenities & Facilities"
                  title="Resident Privileges"
                  className="mb-4"
                />
                <AmenityList amenities={hotel.amenities} grouped />
              </div>

              {/* Available Room Types */}
              <div id="rooms">
                <SectionHeading
                  eyebrow="Accommodations"
                  title="Suites & Private Residences"
                  description="Select check-in and check-out dates to verify suite availability across this sanctuary."
                  className="mb-4"
                />

                <div
                  className="bg-white border p-4 mb-4"
                  style={{ borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}
                >
                  <div className="row g-3 align-items-end">
                    <div className="col-md-8">
                      <DateRangeSelector
                        checkIn={checkIn}
                        checkOut={checkOut}
                        onCheckInChange={setCheckIn}
                        onCheckOutChange={setCheckOut}
                        showNightsBadge={false}
                      />
                    </div>
                    <div className="col-md-4">
                      <Select
                        label="Party Size"
                        options={GUEST_OPTIONS}
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column gap-4">
                  {hotel.rooms.map((room) => (
                    <RoomCard
                      key={room._id}
                      room={room}
                      hotelSlug={hotel.slug}
                      currency={hotel.currency}
                      stayParams={stayParams}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Reservations & Check-in Info Sidebar */}
            <aside className="col-lg-4 ls-public-sticky-panel" aria-label="Property reservation and policy summary">
              <div className="ls-public-summary-card mb-4">
                <span className="ls-eyebrow">Direct Booking</span>
                <h2 className="font-display mt-1 mb-2" style={{ fontSize: '1.5rem', color: 'var(--color-navy)' }}>
                  Plan Your Stay
                </h2>
                <p className="text-slate mb-4" style={{ fontSize: 'var(--text-sm)' }}>
                  Best direct rate guaranteed with complimentary modification privileges and personalized pre-arrival concierge setup.
                </p>

                <PriceDisplay
                  label="Nightly Rates Starting From"
                  amount={hotel.startingPrice}
                  currency={hotel.currency}
                  size="lg"
                  className="mb-4"
                />

                <div className="d-grid gap-2">
                  <Link to={quickBookingUrl} className="ls-btn ls-btn--primary ls-btn--lg ls-btn--full">
                    <span>Reserve at {hotel.name}</span>
                    <FiArrowRight size={16} aria-hidden="true" />
                  </Link>
                  <a href="#rooms" className="ls-btn ls-btn--outline ls-btn--md ls-btn--full">
                    <span>Compare {hotel.rooms.length} Room Types</span>
                  </a>
                </div>
              </div>

              <div
                className="bg-white border p-4"
                style={{ borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}
              >
                <h3 className="h6 text-uppercase ls-eyebrow mb-3" style={{ color: 'var(--color-navy)' }}>
                  Check-in & Property Information
                </h3>

                <div className="d-flex flex-column gap-3" style={{ fontSize: 'var(--text-sm)' }}>
                  <div className="d-flex align-items-start gap-2">
                    <FiClock size={15} className="text-gold-aa flex-shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <div className="fw-medium text-navy">Arrival & Departure</div>
                      <div className="text-slate" style={{ fontSize: 'var(--text-xs)' }}>
                        Check-in from {hotel.checkInTime} · Check-out until {hotel.checkOutTime}
                      </div>
                    </div>
                  </div>

                  <div className="border-top pt-3" style={{ borderColor: 'var(--border-subtle)', fontSize: 'var(--text-xs)' }}>
                    <div className="fw-semibold text-navy mb-1">Cancellation Policy</div>
                    <p className="text-slate mb-2">{hotel.policies?.cancellation}</p>
                    <div className="fw-semibold text-navy mb-1">Taxes & Levies</div>
                    <p className="text-slate mb-2">
                      Local hospitality tax ({hotel.taxRate}%)
                      {hotel.resortFeePerNight > 0 ? ` and resort fee ($${hotel.resortFeePerNight}/night)` : ''}
                      {hotel.cityTaxPerGuestNight > 0 ? ` plus municipal levy ($${hotel.cityTaxPerGuestNight}/guest/night)` : ''}
                      {' '}displayed transparently at checkout.
                    </p>
                    <div className="fw-semibold text-navy mb-1">Family & Pets</div>
                    <p className="text-slate mb-0">{hotel.policies?.children} {hotel.policies?.pets}</p>
                  </div>

                  <div className="border-top pt-3 d-flex flex-column gap-2" style={{ borderColor: 'var(--border-subtle)', fontSize: 'var(--text-xs)' }}>
                    <div className="d-flex align-items-center gap-2 text-navy">
                      <FiPhone size={13} className="text-gold-aa" aria-hidden="true" />
                      <span>{hotel.phone}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-navy">
                      <FiMail size={13} className="text-gold-aa" aria-hidden="true" />
                      <span>{hotel.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HotelDetailPage;
