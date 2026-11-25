import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiInfo,
  FiPrinter,
  FiTag,
} from 'react-icons/fi';
import { Badge, Breadcrumb, Button, Input, Select, Textarea } from '../../components';
import { BookingSummary, DateRangeSelector, PublicLayout } from '../../components/public';
import {
  OFFERS_DATA,
  calculateStayPricing,
  checkRoomAvailability,
  formatFullAddress,
  getAllActiveHotels,
  getDefaultStayDates,
  getOfferByIdentifier,
  getRoomTypesForHotel,
} from '../../data/public';
import { calcNights, formatCurrency, formatDate } from '../../utils/formatters';

const ARRIVAL_WINDOWS = [
  { value: '15:00 - 17:00', label: '15:00 – 17:00 (Standard Arrival)' },
  { value: '17:00 - 20:00', label: '17:00 – 20:00 (Evening Arrival)' },
  { value: '20:00 - 23:00', label: '20:00 – 23:00 (Late Evening Arrival)' },
  { value: 'early-request', label: 'Prior to 15:00 (Early Check-in Request)' },
];

const COUNTRY_OPTIONS = [
  'Switzerland',
  'United Kingdom',
  'United States',
  'France',
  'Italy',
  'Germany',
  'Japan',
  'United Arab Emirates',
  'Saudi Arabia',
  'Spain',
  'Singapore',
  'Canada',
  'Australia',
  'Other',
];

const ADULTS_OPTIONS = [1, 2, 3, 4, 5, 6].map((n) => ({
  value: String(n),
  label: `${n} ${n === 1 ? 'Adult' : 'Adults'}`,
}));

const CHILDREN_OPTIONS = [0, 1, 2, 3, 4].map((n) => ({
  value: String(n),
  label: n === 0 ? 'No Children' : `${n} ${n === 1 ? 'Child' : 'Children'}`,
}));

const INITIAL_GUEST = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: 'Switzerland',
  arrivalWindow: '15:00 - 17:00',
  specialRequests: '',
  acceptedTerms: false,
};

/**
 * BookingPage – Complete reservation interface with live pricing breakdown, validation, and confirmation folio (`/booking`).
 */
const BookingPage = () => {
  const [searchParams] = useSearchParams();
  return <BookingFlow key={searchParams.toString()} searchParams={searchParams} />;
};

const BookingFlow = ({ searchParams }) => {
  const hotels = useMemo(() => getAllActiveHotels(), []);
  const [defaults] = useState(() => getDefaultStayDates(14, 3));

  const initialHotelSlug = searchParams.get('hotel') || hotels[0]?.slug;
  const matchedInitialHotel =
    hotels.find((h) => h.slug === initialHotelSlug) || hotels[0];

  const [selectedHotelSlug, setSelectedHotelSlug] = useState(matchedInitialHotel.slug);

  const hotelRooms = useMemo(
    () => getRoomTypesForHotel(selectedHotelSlug),
    [selectedHotelSlug]
  );

  const initialRoomSlug = searchParams.get('room');
  const [selectedRoomSlug, setSelectedRoomSlug] = useState(() => {
    const found = hotelRooms.find((r) => r.slug === initialRoomSlug);
    return (found || hotelRooms[0])?.slug || '';
  });

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || defaults.checkIn);
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || defaults.checkOut);
  const [adults, setAdults] = useState(() => {
    const paramGuests = Number(searchParams.get('guests'));
    return paramGuests > 0 ? Math.min(6, paramGuests) : 2;
  });
  const [childrenCount, setChildrenCount] = useState(0);
  const [roomCount, setRoomCount] = useState(() => {
    const paramRooms = Number(searchParams.get('roomCount'));
    return paramRooms > 0 ? Math.min(4, paramRooms) : 1;
  });

  const initialOffer = getOfferByIdentifier(searchParams.get('offer') || '');
  const [offerCodeInput, setOfferCodeInput] = useState(initialOffer?.code || '');
  const [activeOffer, setActiveOffer] = useState(initialOffer);

  const [guest, setGuest] = useState(INITIAL_GUEST);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  useEffect(() => {
    document.title = confirmedReservation
      ? `Folio ${confirmedReservation.reference} — LuxuryStay`
      : 'Reserve a Stay — LuxuryStay';
  }, [confirmedReservation]);

  const selectedHotel = useMemo(
    () => hotels.find((h) => h.slug === selectedHotelSlug) || hotels[0],
    [hotels, selectedHotelSlug]
  );

  const selectedRoom = useMemo(
    () => hotelRooms.find((r) => r.slug === selectedRoomSlug) || hotelRooms[0],
    [hotelRooms, selectedRoomSlug]
  );

  const totalGuests = adults + childrenCount;
  const nights = calcNights(checkIn, checkOut);
  const datesValid = Boolean(checkIn && checkOut && nights > 0);

  const availability = useMemo(
    () =>
      checkRoomAvailability(selectedRoom, {
        checkIn,
        checkOut,
        guests: totalGuests,
        roomCount,
      }),
    [selectedRoom, checkIn, checkOut, totalGuests, roomCount]
  );

  const pricing = useMemo(
    () =>
      calculateStayPricing({
        hotel: selectedHotel,
        room: selectedRoom,
        checkIn,
        checkOut,
        roomCount,
        guests: totalGuests,
        offer: activeOffer,
      }),
    [selectedHotel, selectedRoom, checkIn, checkOut, roomCount, totalGuests, activeOffer]
  );

  const hotelOptions = useMemo(
    () =>
      hotels.map((h) => ({
        value: h.slug,
        label: `${h.name} — ${h.address.city}, ${h.address.country}`,
      })),
    [hotels]
  );

  const roomOptions = useMemo(
    () =>
      hotelRooms.map((r) => ({
        value: r.slug,
        label: `${r.name} (${formatCurrency(r.basePrice, selectedHotel.currency)}/night · max ${r.maxOccupancy} guests)`,
      })),
    [hotelRooms, selectedHotel]
  );

  const roomCountOptions = useMemo(() => {
    const maxInv = Math.min(4, selectedRoom?.totalInventory || 4);
    return Array.from({ length: maxInv }, (_, idx) => {
      const c = idx + 1;
      return { value: String(c), label: `${c} ${c === 1 ? 'Suite' : 'Suites'}` };
    });
  }, [selectedRoom]);

  const handleHotelChange = (e) => {
    const nextSlug = e.target.value;
    setSelectedHotelSlug(nextSlug);
    const nextRooms = getRoomTypesForHotel(nextSlug);
    setSelectedRoomSlug(nextRooms[0]?.slug || '');
    setRoomCount(1);
    setErrors((prev) => ({ ...prev, stay: '' }));
  };

  const handleRoomChange = (e) => {
    setSelectedRoomSlug(e.target.value);
    setRoomCount(1);
    setErrors((prev) => ({ ...prev, stay: '' }));
  };

  const handleApplyOffer = () => {
    const trimmed = offerCodeInput.trim();
    if (!trimmed) {
      setActiveOffer(null);
      return;
    }
    const found = getOfferByIdentifier(trimmed);
    if (!found) {
      toast.error('Privilege code not recognized. Try HORIZON4, SANCTUARY15, or SUITE20.');
      return;
    }
    setActiveOffer(found);
    setOfferCodeInput(found.code);
    toast.success(`Privilege code ${found.code} selected`);
  };

  const handleGuestChange = (field, value) => {
    setGuest((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!datesValid) {
      nextErrors.checkOut = 'Check-out date must be at least one night after check-in.';
    }
    if (!availability.isAvailable) {
      nextErrors.stay = availability.reason || 'Selected suite or dates require adjustment.';
    }
    if (!guest.firstName.trim()) {
      nextErrors.firstName = 'Please enter the primary guest’s first name.';
    }
    if (!guest.lastName.trim()) {
      nextErrors.lastName = 'Please enter the primary guest’s last name.';
    }
    if (!guest.email.trim()) {
      nextErrors.email = 'Please enter a valid email address for the folio summary.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email.trim())) {
      nextErrors.email = 'Please enter a properly formatted email address.';
    }
    if (!guest.phone.trim()) {
      nextErrors.phone = 'Please enter a contact telephone number.';
    } else if (guest.phone.replace(/\D/g, '').length < 7) {
      nextErrors.phone = 'Please enter at least 7 digits for telephone contact.';
    }
    if (!guest.acceptedTerms) {
      nextErrors.acceptedTerms = 'Please confirm the prototype reservation terms to continue.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please review highlighted fields before submitting.');
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      const refNum = `LS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedReservation({
        reference: refNum,
        createdAt: new Date().toISOString(),
        hotel: selectedHotel,
        room: selectedRoom,
        checkIn,
        checkOut,
        adults,
        childrenCount,
        roomCount,
        guest: { ...guest },
        pricing: { ...pricing },
      });
      setSubmitting(false);
      toast.success(`Reservation preview ${refNum} prepared`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 450);
  };

  return (
    <PublicLayout>
      {/* Banner */}
      <section className="ls-public-page-banner">
        <div className="ls-public-container">
          <Breadcrumb
            items={[
              { label: 'Home', to: '/' },
              { label: 'Hotels', to: '/hotels' },
              { label: confirmedReservation ? 'Confirmation Folio' : 'Reservation' },
            ]}
            className="mb-3"
          />

          <div className="d-flex flex-wrap align-items-end justify-content-between gap-3">
            <div>
              <span className="ls-eyebrow">Direct Reservations</span>
              <h1 className="ls-public-page-banner__title">
                {confirmedReservation ? 'Reservation Request Recorded' : 'Complete Your Reservation'}
              </h1>
              <p className="ls-public-page-banner__desc">
                {confirmedReservation
                  ? 'Review your itemized stay folio below. No payment has been processed in this frontend prototype.'
                  : 'Confirm your sanctuary, suite selection, stay dates, and guest preferences with transparent tax and local fee itemization.'}
              </p>
            </div>

            <Badge variant="gold" size="md">
              Frontend Prototype · No Real Payment Processed
            </Badge>
          </div>
        </div>
      </section>

      <section className="ls-public-section ls-public-section--ivory ls-public-section--compact">
        <div className="ls-public-container">
          {confirmedReservation ? (
            /* ── Confirmed Folio View ──────────────────────────────────────── */
            <div className="row justify-content-center">
              <div className="col-lg-9">
                <div className="ls-public-folio-confirmation">
                  <div className="d-flex flex-wrap align-items-start justify-content-between gap-4 pb-4 mb-4 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div>
                      <div className="d-inline-flex align-items-center gap-2 text-success fw-semibold mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                        <FiCheckCircle size={18} aria-hidden="true" />
                        <span>Reservation Summary Confirmed (Prototype)</span>
                      </div>
                      <h2 className="font-display mb-1" style={{ fontSize: '2rem', color: 'var(--color-navy)' }}>
                        {confirmedReservation.hotel.name}
                      </h2>
                      <p className="text-slate mb-0" style={{ fontSize: 'var(--text-sm)' }}>
                        {formatFullAddress(confirmedReservation.hotel)}
                      </p>
                    </div>

                    <div className="text-md-end">
                      <div className="ls-eyebrow">Reference Number</div>
                      <div className="font-display fw-semibold text-navy" style={{ fontSize: '1.65rem', letterSpacing: '0.02em' }}>
                        {confirmedReservation.reference}
                      </div>
                      <div className="text-slate" style={{ fontSize: 'var(--text-xs)' }}>
                        Prepared for {confirmedReservation.guest.firstName} {confirmedReservation.guest.lastName}
                      </div>
                    </div>
                  </div>

                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <h3 className="h6 text-uppercase ls-eyebrow mb-3" style={{ color: 'var(--color-navy)' }}>
                        Stay Itinerary
                      </h3>
                      <div className="d-flex flex-column gap-2" style={{ fontSize: 'var(--text-sm)' }}>
                        <div>
                          <span className="text-slate">Suite:</span>{' '}
                          <strong className="text-navy">{confirmedReservation.room.name}</strong> ({confirmedReservation.roomCount}{' '}
                          {confirmedReservation.roomCount === 1 ? 'suite' : 'suites'})
                        </div>
                        <div>
                          <span className="text-slate">Check-in:</span>{' '}
                          <strong className="text-navy">{formatDate(confirmedReservation.checkIn)}</strong> from{' '}
                          {confirmedReservation.hotel.checkInTime}
                        </div>
                        <div>
                          <span className="text-slate">Check-out:</span>{' '}
                          <strong className="text-navy">{formatDate(confirmedReservation.checkOut)}</strong> until{' '}
                          {confirmedReservation.hotel.checkOutTime}
                        </div>
                        <div>
                          <span className="text-slate">Duration & Guests:</span>{' '}
                          <strong className="text-navy">
                            {confirmedReservation.pricing.nights} nights · {confirmedReservation.adults} adults
                            {confirmedReservation.childrenCount > 0 ? `, ${confirmedReservation.childrenCount} children` : ''}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <h3 className="h6 text-uppercase ls-eyebrow mb-3" style={{ color: 'var(--color-navy)' }}>
                        Guest Details
                      </h3>
                      <div className="d-flex flex-column gap-2" style={{ fontSize: 'var(--text-sm)' }}>
                        <div>
                          <span className="text-slate">Primary Guest:</span>{' '}
                          <strong className="text-navy">
                            {confirmedReservation.guest.firstName} {confirmedReservation.guest.lastName}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate">Email:</span>{' '}
                          <strong className="text-navy">{confirmedReservation.guest.email}</strong>
                        </div>
                        <div>
                          <span className="text-slate">Telephone:</span>{' '}
                          <strong className="text-navy">{confirmedReservation.guest.phone}</strong>
                        </div>
                        <div>
                          <span className="text-slate">Estimated Arrival:</span>{' '}
                          <strong className="text-navy">{confirmedReservation.guest.arrivalWindow}</strong>
                        </div>
                        {confirmedReservation.guest.specialRequests && (
                          <div>
                            <span className="text-slate">Preferences:</span>{' '}
                            <span>{confirmedReservation.guest.specialRequests}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Itemized Folio Breakdown */}
                  <div className="bg-ivory p-4 border mb-4" style={{ borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    <h3 className="h6 text-uppercase ls-eyebrow mb-3" style={{ color: 'var(--color-navy)' }}>
                      Folio & Charge Breakdown
                    </h3>
                    <div className="ls-public-price-rows">
                      <div className="ls-public-price-row">
                        <span>
                          Room Charges ({formatCurrency(confirmedReservation.pricing.nightlyRate, confirmedReservation.pricing.currency)} ×{' '}
                          {confirmedReservation.pricing.nights} nights × {confirmedReservation.roomCount}{' '}
                          {confirmedReservation.roomCount === 1 ? 'suite' : 'suites'})
                        </span>
                        <span className="fw-medium text-navy">
                          {formatCurrency(confirmedReservation.pricing.roomSubtotal, confirmedReservation.pricing.currency)}
                        </span>
                      </div>

                      {confirmedReservation.pricing.discountAmount > 0 && confirmedReservation.pricing.appliedOffer && (
                        <div className="ls-public-price-row ls-public-price-row--discount">
                          <span>Seasonal Privilege ({confirmedReservation.pricing.appliedOffer.code})</span>
                          <span>
                            −{formatCurrency(confirmedReservation.pricing.discountAmount, confirmedReservation.pricing.currency)}
                          </span>
                        </div>
                      )}

                      <div className="ls-public-price-row">
                        <span>Hospitality VAT & Occupancy Tax ({confirmedReservation.pricing.taxRate}%)</span>
                        <span>
                          {formatCurrency(confirmedReservation.pricing.taxAmount, confirmedReservation.pricing.currency)}
                        </span>
                      </div>

                      {confirmedReservation.pricing.resortFeeTotal > 0 && (
                        <div className="ls-public-price-row">
                          <span>Resort & Sanctuary Fee</span>
                          <span>
                            {formatCurrency(confirmedReservation.pricing.resortFeeTotal, confirmedReservation.pricing.currency)}
                          </span>
                        </div>
                      )}

                      {confirmedReservation.pricing.cityTaxTotal > 0 && (
                        <div className="ls-public-price-row">
                          <span>Municipal Tourist Levy</span>
                          <span>
                            {formatCurrency(confirmedReservation.pricing.cityTaxTotal, confirmedReservation.pricing.currency)}
                          </span>
                        </div>
                      )}

                      <div className="ls-public-price-row ls-public-price-row--total">
                        <span>Total Estimated Folio (Payable at Property)</span>
                        <span className="font-display" style={{ fontSize: '1.45rem' }}>
                          {formatCurrency(confirmedReservation.pricing.totalAmount, confirmedReservation.pricing.currency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="p-3 mb-4 border d-flex align-items-start gap-2"
                    style={{
                      backgroundColor: 'var(--color-info-bg)',
                      borderColor: 'var(--color-info-border)',
                      color: 'var(--color-info)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                    }}
                  >
                    <FiInfo size={16} className="flex-shrink-0 mt-1" aria-hidden="true" />
                    <span>
                      This confirmation view is part of the LuxuryStay public frontend prototype. No reservation record has been written to a database and no payment card has been charged.
                    </span>
                  </div>

                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="md"
                        leftIcon={<FiPrinter />}
                        onClick={() => window.print()}
                      >
                        Print Folio
                      </Button>
                      <Button
                        variant="ghost"
                        size="md"
                        onClick={() => setConfirmedReservation(null)}
                      >
                        Modify Reservation
                      </Button>
                    </div>

                    <Link to="/hotels" className="ls-btn ls-btn--primary ls-btn--md">
                      <span>Explore More Sanctuaries</span>
                      <FiArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── Interactive Reservation Form & Sticky Summary ─────────────── */
            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-5 align-items-start">
                <div className="col-lg-7">
                  {/* Step 1: Stay Configuration */}
                  <div className="bg-white border p-4 p-md-5 mb-4" style={{ borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    <span className="ls-eyebrow">Step 01</span>
                    <h2 className="font-display mt-1 mb-4" style={{ fontSize: '1.65rem', color: 'var(--color-navy)' }}>
                      Sanctuary, Suite & Dates
                    </h2>

                    <div className="row g-3 mb-3">
                      <div className="col-12">
                        <Select
                          label="Selected Hotel Property"
                          options={hotelOptions}
                          value={selectedHotelSlug}
                          onChange={handleHotelChange}
                          placeholder=""
                          required
                        />
                      </div>

                      <div className="col-12">
                        <Select
                          label="Suite or Room Category"
                          options={roomOptions}
                          value={selectedRoomSlug}
                          onChange={handleRoomChange}
                          placeholder=""
                          required
                        />
                      </div>
                    </div>

                    <DateRangeSelector
                      checkIn={checkIn}
                      checkOut={checkOut}
                      onCheckInChange={(val) => {
                        setCheckIn(val);
                        setErrors((prev) => ({ ...prev, checkOut: '', stay: '' }));
                      }}
                      onCheckOutChange={(val) => {
                        setCheckOut(val);
                        setErrors((prev) => ({ ...prev, checkOut: '', stay: '' }));
                      }}
                      checkOutError={errors.checkOut}
                      className="mb-3"
                    />

                    <div className="row g-3 mb-3">
                      <div className="col-sm-4">
                        <Select
                          label="Adults"
                          options={ADULTS_OPTIONS}
                          value={String(adults)}
                          onChange={(e) => {
                            setAdults(Number(e.target.value));
                            setErrors((prev) => ({ ...prev, stay: '' }));
                          }}
                          placeholder=""
                          required
                        />
                      </div>

                      <div className="col-sm-4">
                        <Select
                          label="Children"
                          options={CHILDREN_OPTIONS}
                          value={String(childrenCount)}
                          onChange={(e) => {
                            setChildrenCount(Number(e.target.value));
                            setErrors((prev) => ({ ...prev, stay: '' }));
                          }}
                          placeholder=""
                        />
                      </div>

                      <div className="col-sm-4">
                        <Select
                          label="Suites"
                          options={roomCountOptions}
                          value={String(roomCount)}
                          onChange={(e) => {
                            setRoomCount(Number(e.target.value));
                            setErrors((prev) => ({ ...prev, stay: '' }));
                          }}
                          placeholder=""
                          required
                        />
                      </div>
                    </div>

                    {/* Availability & Capacity Status */}
                    {datesValid && (
                      <div
                        className="p-3 border d-flex align-items-start gap-2 mb-4"
                        role="status"
                        style={{
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: availability.isAvailable
                            ? 'var(--color-success-bg)'
                            : 'var(--color-danger-bg)',
                          borderColor: availability.isAvailable
                            ? 'var(--color-success-border)'
                            : 'var(--color-danger-border)',
                          color: availability.isAvailable ? 'var(--color-success)' : 'var(--color-danger)',
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        {availability.isAvailable ? (
                          <>
                            <FiCheck size={15} className="flex-shrink-0 mt-1" aria-hidden="true" />
                            <span>
                              {availability.remainingRooms} {availability.remainingRooms === 1 ? 'suite' : 'suites'} available · Max party capacity {availability.maxAllowedGuests} guests.
                            </span>
                          </>
                        ) : (
                          <>
                            <FiAlertCircle size={15} className="flex-shrink-0 mt-1" aria-hidden="true" />
                            <span>{errors.stay || availability.reason}</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Seasonal Privilege Code */}
                    <div className="pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                      <div className="row g-2 align-items-end">
                        <div className="col-sm-8">
                          <Input
                            label="Seasonal Privilege Code (Optional)"
                            placeholder="e.g. HORIZON4, SANCTUARY15, SUITE20"
                            value={offerCodeInput}
                            onChange={(e) => setOfferCodeInput(e.target.value.toUpperCase())}
                            leftIcon={<FiTag />}
                            hint={
                              pricing.offerIneligibleReason ||
                              (pricing.appliedOffer
                                ? `${pricing.appliedOffer.title} applied (${pricing.appliedOffer.badgeLabel})`
                                : 'Available codes: HORIZON4, SANCTUARY15, SUITE20')
                            }
                          />
                        </div>
                        <div className="col-sm-4 d-flex gap-2">
                          <Button variant="outline" size="md" fullWidth onClick={handleApplyOffer}>
                            Apply
                          </Button>
                          {activeOffer && (
                            <Button
                              variant="ghost"
                              size="md"
                              onClick={() => {
                                setActiveOffer(null);
                                setOfferCodeInput('');
                              }}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </div>

                      {!activeOffer && (
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {OFFERS_DATA.map((offer) => (
                            <button
                              key={offer._id}
                              type="button"
                              className="ls-public-chip"
                              onClick={() => {
                                setOfferCodeInput(offer.code);
                                setActiveOffer(offer);
                                toast.success(`Privilege ${offer.code} selected`);
                              }}
                            >
                              <span>Use {offer.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 2: Guest Information */}
                  <div className="bg-white border p-4 p-md-5" style={{ borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    <span className="ls-eyebrow">Step 02</span>
                    <h2 className="font-display mt-1 mb-4" style={{ fontSize: '1.65rem', color: 'var(--color-navy)' }}>
                      Primary Guest Details
                    </h2>

                    <div className="row g-3">
                      <div className="col-sm-6">
                        <Input
                          label="First Name"
                          placeholder="Eleanor"
                          value={guest.firstName}
                          onChange={(e) => handleGuestChange('firstName', e.target.value)}
                          error={errors.firstName}
                          required
                        />
                      </div>

                      <div className="col-sm-6">
                        <Input
                          label="Last Name"
                          placeholder="Vance"
                          value={guest.lastName}
                          onChange={(e) => handleGuestChange('lastName', e.target.value)}
                          error={errors.lastName}
                          required
                        />
                      </div>

                      <div className="col-sm-6">
                        <Input
                          label="Email Address"
                          type="email"
                          placeholder="eleanor.vance@example.com"
                          value={guest.email}
                          onChange={(e) => handleGuestChange('email', e.target.value)}
                          error={errors.email}
                          required
                        />
                      </div>

                      <div className="col-sm-6">
                        <Input
                          label="Telephone Number"
                          type="tel"
                          placeholder="+41 22 555 0144"
                          value={guest.phone}
                          onChange={(e) => handleGuestChange('phone', e.target.value)}
                          error={errors.phone}
                          required
                        />
                      </div>

                      <div className="col-sm-6">
                        <Select
                          label="Country of Residence"
                          options={COUNTRY_OPTIONS}
                          value={guest.country}
                          onChange={(e) => handleGuestChange('country', e.target.value)}
                          placeholder=""
                        />
                      </div>

                      <div className="col-sm-6">
                        <Select
                          label="Estimated Arrival Window"
                          options={ARRIVAL_WINDOWS}
                          value={guest.arrivalWindow}
                          onChange={(e) => handleGuestChange('arrivalWindow', e.target.value)}
                          placeholder=""
                        />
                      </div>

                      <div className="col-12">
                        <Textarea
                          label="Bespoke Preferences & Special Requests"
                          placeholder="Dietary preferences, hypoallergenic bedding, airport chauffeur arrival flight number…"
                          value={guest.specialRequests}
                          onChange={(e) => handleGuestChange('specialRequests', e.target.value)}
                          maxLength={300}
                          showCount
                          rows={3}
                        />
                      </div>

                      <div className="col-12 pt-2">
                        <label className="d-flex align-items-start gap-2 cursor-pointer" style={{ fontSize: 'var(--text-sm)' }}>
                          <input
                            type="checkbox"
                            checked={guest.acceptedTerms}
                            onChange={(e) => handleGuestChange('acceptedTerms', e.target.checked)}
                            style={{ width: '17px', height: '17px', marginTop: '2px', accentColor: 'var(--color-navy)' }}
                          />
                          <span>
                            I acknowledge the property’s cancellation terms and understand this is a frontend reservation prototype where no live payment is charged.
                          </span>
                        </label>
                        {errors.acceptedTerms && (
                          <div className="ls-field__error mt-2" role="alert">
                            <FiAlertCircle aria-hidden="true" />
                            <span>{errors.acceptedTerms}</span>
                          </div>
                        )}
                      </div>

                      <div className="col-12 pt-3">
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          fullWidth
                          loading={submitting}
                          rightIcon={<FiArrowRight />}
                        >
                          Confirm Reservation Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Right Summary */}
                <div className="col-lg-5 ls-public-sticky-panel">
                  <BookingSummary
                    hotel={selectedHotel}
                    room={selectedRoom}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    adults={adults}
                    childrenCount={childrenCount}
                    roomCount={roomCount}
                    pricing={pricing}
                  />
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default BookingPage;
