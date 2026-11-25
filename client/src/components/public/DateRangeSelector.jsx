import { FiCalendar } from 'react-icons/fi';
import { Input, Badge } from '../index';
import { calcNights } from '../../utils/formatters';
import { TODAY_ISO, toIsoDate } from '../../data/public';

/**
 * DateRangeSelector – Accessible check-in / check-out pair with built-in date validation and night count.
 */
const DateRangeSelector = ({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  checkInError = '',
  checkOutError = '',
  size = 'md',
  showNightsBadge = true,
  layout = 'row',
  className = '',
}) => {
  const getMinCheckOut = () => {
    if (!checkIn) return TODAY_ISO;
    const base = new Date(checkIn);
    if (Number.isNaN(base.getTime())) return TODAY_ISO;
    base.setDate(base.getDate() + 1);
    return toIsoDate(base);
  };

  const nights = calcNights(checkIn, checkOut);
  const minCheckOut = getMinCheckOut();

  const handleCheckIn = (e) => {
    const nextIn = e.target.value;
    onCheckInChange?.(nextIn);
    if (nextIn && checkOut && new Date(checkOut) <= new Date(nextIn)) {
      const bumped = new Date(nextIn);
      bumped.setDate(bumped.getDate() + 1);
      onCheckOutChange?.(toIsoDate(bumped));
    }
  };

  const handleCheckOut = (e) => {
    onCheckOutChange?.(e.target.value);
  };

  const colClass = layout === 'stack' ? 'col-12' : 'col-sm-6';

  return (
    <div className={className}>
      <div className="row g-3">
        <div className={colClass}>
          <Input
            label="Check-in Date"
            type="date"
            size={size}
            min={TODAY_ISO}
            value={checkIn || ''}
            onChange={handleCheckIn}
            error={checkInError}
            leftIcon={<FiCalendar />}
            required
          />
        </div>
        <div className={colClass}>
          <Input
            label="Check-out Date"
            type="date"
            size={size}
            min={minCheckOut}
            value={checkOut || ''}
            onChange={handleCheckOut}
            error={checkOutError}
            leftIcon={<FiCalendar />}
            required
          />
        </div>
      </div>

      {showNightsBadge && nights > 0 && (
        <div className="mt-2">
          <Badge variant="gold" size="sm">
            {nights} {nights === 1 ? 'Night' : 'Nights'} Selected
          </Badge>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;

