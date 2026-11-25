import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiSearch } from 'react-icons/fi';
import { Button, Input, Select } from '../index';
import { TODAY_ISO, getDefaultStayDates, toIsoDate } from '../../data/public';
import { calcNights } from '../../utils/formatters';

const GUEST_OPTIONS = [
  { value: '1', label: '1 Guest' },
  { value: '2', label: '2 Guests' },
  { value: '3', label: '3 Guests' },
  { value: '4', label: '4 Guests' },
  { value: '5', label: '5 Guests' },
  { value: '6', label: '6 Guests' },
];

/**
 * HotelSearchForm – Destination, stay dates, and guest search bar.
 * Routes cleanly to `/hotels` with query params or fires custom `onSearch`.
 */
const HotelSearchForm = ({
  initialValues = {},
  onSearch = null,
  variant = 'hero',
  submitLabel = 'Search Hotels',
  className = '',
}) => {
  const navigate = useNavigate();
  const [defaults] = useState(() => getDefaultStayDates(14, 3));

  const [destination, setDestination] = useState(initialValues.search ?? '');
  const [checkIn, setCheckIn] = useState(initialValues.checkIn || defaults.checkIn);
  const [checkOut, setCheckOut] = useState(initialValues.checkOut || defaults.checkOut);
  const [guests, setGuests] = useState(String(initialValues.guests || '2'));
  const [error, setError] = useState('');

  const handleCheckInChange = (e) => {
    const nextIn = e.target.value;
    setCheckIn(nextIn);
    setError('');
    if (nextIn && checkOut && new Date(checkOut) <= new Date(nextIn)) {
      const bumped = new Date(nextIn);
      bumped.setDate(bumped.getDate() + 1);
      setCheckOut(toIsoDate(bumped));
    }
  };

  const handleCheckOutChange = (e) => {
    setCheckOut(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (checkIn && checkOut && calcNights(checkIn, checkOut) < 1) {
      setError('Check-out date must be at least one night after check-in.');
      return;
    }

    const payload = {
      search: destination.trim(),
      checkIn,
      checkOut,
      guests: Number(guests) || 2,
    };

    if (onSearch) {
      onSearch(payload);
      return;
    }

    const params = new URLSearchParams();
    if (payload.search) params.set('q', payload.search);
    if (payload.checkIn) params.set('checkIn', payload.checkIn);
    if (payload.checkOut) params.set('checkOut', payload.checkOut);
    if (payload.guests) params.set('guests', String(payload.guests));

    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={[
        'ls-public-search-bar',
        variant === 'inline' && 'ls-public-search-bar--inline',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      noValidate
    >
      <div className="ls-public-search-grid">
        <div className="ls-public-search-field ls-public-search-field--destination">
          <Input
            label="Destination or Property"
            placeholder="Geneva, Kyoto, Paris, Ravello…"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            leftIcon={<FiMapPin />}
            size="md"
          />
        </div>

        <div className="ls-public-search-field">
          <Input
            label="Check-in"
            type="date"
            min={TODAY_ISO}
            value={checkIn}
            onChange={handleCheckInChange}
            leftIcon={<FiCalendar />}
            size="md"
          />
        </div>

        <div className="ls-public-search-field">
          <Input
            label="Check-out"
            type="date"
            min={checkIn || TODAY_ISO}
            value={checkOut}
            onChange={handleCheckOutChange}
            leftIcon={<FiCalendar />}
            size="md"
          />
        </div>

        <div className="ls-public-search-field">
          <Select
            label="Guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            options={GUEST_OPTIONS}
            placeholder=""
            size="md"
          />
        </div>

        <div className="ls-public-search-field">
          <Button
            type="submit"
            variant="secondary"
            size="md"
            fullWidth
            leftIcon={<FiSearch />}
            style={{ height: '40px' }}
          >
            {submitLabel}
          </Button>
        </div>
      </div>

      {error && (
        <div className="ls-public-search-error" role="alert">
          {error}
        </div>
      )}
    </form>
  );
};

export default HotelSearchForm;

