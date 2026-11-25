import { HOTELS_DATA } from './hotels';
import { ROOM_TYPES_DATA } from './roomTypes';
import { AMENITIES_CATALOG, AMENITY_MAP, FILTERABLE_AMENITY_KEYS } from './amenities';
import { OFFERS_DATA } from './offers';
import { PHILOSOPHY_PILLARS, EXPERIENCES_DATA, EDITORIAL_GALLERY } from './experiences';
import { calcNights } from '../../utils/formatters';

export {
  HOTELS_DATA,
  ROOM_TYPES_DATA,
  AMENITIES_CATALOG,
  AMENITY_MAP,
  FILTERABLE_AMENITY_KEYS,
  OFFERS_DATA,
  PHILOSOPHY_PILLARS,
  EXPERIENCES_DATA,
  EDITORIAL_GALLERY,
};

/**
 * Format hotel address into a concise display string ("Geneva, Switzerland").
 */
export const formatHotelLocation = (hotel) => {
  if (!hotel?.address) return '';
  const { city, country } = hotel.address;
  return [city, country].filter(Boolean).join(', ');
};

/**
 * Format full postal address for property info panels.
 */
export const formatFullAddress = (hotel) => {
  if (!hotel?.address) return '';
  const { street, city, postalCode, country } = hotel.address;
  return [street, [postalCode, city].filter(Boolean).join(' '), country].filter(Boolean).join(', ');
};

/**
 * Compute starting nightly rate for a hotel from its active room types.
 */
export const getHotelStartingPrice = (hotelId) => {
  const rooms = ROOM_TYPES_DATA.filter((rt) => rt.hotelId === hotelId && rt.isActive);
  if (!rooms.length) return 0;
  return Math.min(...rooms.map((rt) => rt.basePrice));
};

/**
 * Enrich a hotel object with derived presentation helpers (`startingPrice`, `roomCount`).
 */
const enrichHotel = (hotel) => {
  const rooms = ROOM_TYPES_DATA.filter((rt) => rt.hotelId === hotel._id && rt.isActive);
  return {
    ...hotel,
    startingPrice: rooms.length ? Math.min(...rooms.map((r) => r.basePrice)) : 0,
    roomTypeCount: rooms.length,
  };
};

/**
 * Fetch active featured properties for the Homepage.
 */
export const getFeaturedHotels = () =>
  HOTELS_DATA.filter((h) => h.isActive && h.isFeatured).map(enrichHotel);

/**
 * Check whether two date strings [aStart, aEnd) and [bStart, bEnd) overlap.
 */
const rangesOverlap = (aStart, aEnd, bStart, bEnd) => {
  const s1 = new Date(aStart).getTime();
  const e1 = new Date(aEnd).getTime();
  const s2 = new Date(bStart).getTime();
  const e2 = new Date(bEnd).getTime();
  if (Number.isNaN(s1) || Number.isNaN(e1) || Number.isNaN(s2) || Number.isNaN(e2)) {
    return false;
  }
  return s1 < e2 && e1 > s2;
};

/**
 * Evaluate room-type inventory availability for a date range, guest count, and room count.
 */
export const checkRoomAvailability = (
  roomType,
  { checkIn, checkOut, guests = 2, roomCount = 1 } = {}
) => {
  if (!roomType || !roomType.isActive) {
    return {
      isAvailable: false,
      remainingRooms: 0,
      capacitySupported: false,
      maxAllowedGuests: 0,
      reason: 'This room category is currently unavailable.',
    };
  }

  const normalizedRoomCount = Math.max(1, Number(roomCount) || 1);
  const normalizedGuests = Math.max(1, Number(guests) || 1);
  const maxAllowedGuests = roomType.maxOccupancy * normalizedRoomCount;
  const capacitySupported = normalizedGuests <= maxAllowedGuests;

  let maxBookedOverlap = 0;
  if (checkIn && checkOut && calcNights(checkIn, checkOut) > 0) {
    for (const hold of roomType.bookedDateRanges || []) {
      if (rangesOverlap(checkIn, checkOut, hold.checkIn, hold.checkOut)) {
        maxBookedOverlap = Math.max(maxBookedOverlap, hold.roomsBooked || 0);
      }
    }
  }

  const remainingRooms = Math.max(0, (roomType.totalInventory || 0) - maxBookedOverlap);
  const hasInventory = remainingRooms >= normalizedRoomCount;

  let reason = '';
  if (!hasInventory) {
    reason =
      remainingRooms === 0
        ? 'No rooms of this category remain for your selected dates. Please adjust dates or explore another suite.'
        : `Only ${remainingRooms} ${remainingRooms === 1 ? 'room' : 'rooms'} left for these dates.`;
  } else if (!capacitySupported) {
    reason = `Maximum capacity is ${roomType.maxOccupancy} guests per suite (${maxAllowedGuests} across ${normalizedRoomCount} ${normalizedRoomCount === 1 ? 'room' : 'rooms'}).`;
  }

  return {
    isAvailable: hasInventory && capacitySupported,
    hasInventory,
    remainingRooms,
    capacitySupported,
    maxAllowedGuests,
    reason,
  };
};

/**
 * Filter, search, sort, and paginate hotels (mirrors future GET /api/hotels query API).
 */
export const queryPublicHotels = ({
  search = '',
  location = 'all',
  propertyType = 'all',
  amenities = [],
  guests = 0,
  checkIn = '',
  checkOut = '',
  sort = 'recommended',
  page = 1,
  limit = 6,
} = {}) => {
  let list = HOTELS_DATA.filter((h) => h.isActive).map(enrichHotel);

  const normalizedSearch = search.trim().toLowerCase();
  if (normalizedSearch) {
    list = list.filter((h) => {
      const hay = [
        h.name,
        h.tagline,
        h.propertyType,
        h.region,
        h.address?.city,
        h.address?.country,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(normalizedSearch);
    });
  }

  if (location && location !== 'all') {
    list = list.filter(
      (h) =>
        h.address?.city?.toLowerCase() === location.toLowerCase() ||
        h.address?.country?.toLowerCase() === location.toLowerCase() ||
        h.region?.toLowerCase() === location.toLowerCase()
    );
  }

  if (propertyType && propertyType !== 'all') {
    list = list.filter((h) => h.propertyType === propertyType);
  }

  if (Array.isArray(amenities) && amenities.length > 0) {
    list = list.filter((h) => amenities.every((key) => h.amenities.includes(key)));
  }

  const parsedGuests = Number(guests) || 0;
  if (parsedGuests > 0 || (checkIn && checkOut)) {
    list = list.filter((hotel) => {
      const rooms = ROOM_TYPES_DATA.filter((rt) => rt.hotelId === hotel._id && rt.isActive);
      return rooms.some((rt) => {
        const guestOk = parsedGuests <= 0 || rt.maxOccupancy >= parsedGuests;
        if (!guestOk) return false;
        if (checkIn && checkOut && calcNights(checkIn, checkOut) > 0) {
          return checkRoomAvailability(rt, { checkIn, checkOut, guests: parsedGuests || 1, roomCount: 1 })
            .isAvailable;
        }
        return true;
      });
    });
  }

  switch (sort) {
    case 'price-asc':
      list.sort((a, b) => a.startingPrice - b.startingPrice);
      break;
    case 'price-desc':
      list.sort((a, b) => b.startingPrice - a.startingPrice);
      break;
    case 'rating-desc':
      list.sort((a, b) => b.reviewScore - a.reviewScore);
      break;
    case 'name-asc':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.reviewScore - a.reviewScore);
      break;
  }

  const totalCount = list.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;
  const items = list.slice(start, start + limit);

  return {
    items,
    totalCount,
    totalPages,
    page: safePage,
    limit,
  };
};

/**
 * Distinct filter dropdown values derived dynamically from active hotels.
 */
export const getHotelFilterOptions = () => {
  const activeHotels = HOTELS_DATA.filter((h) => h.isActive);
  const cities = Array.from(
    new Set(activeHotels.map((h) => h.address?.city).filter(Boolean))
  ).sort();
  const countries = Array.from(
    new Set(activeHotels.map((h) => h.address?.country).filter(Boolean))
  ).sort();
  const regions = Array.from(
    new Set(activeHotels.map((h) => h.region).filter(Boolean))
  ).sort();
  const propertyTypes = Array.from(
    new Set(activeHotels.map((h) => h.propertyType).filter(Boolean))
  ).sort();

  const amenityOptions = FILTERABLE_AMENITY_KEYS.map((key) => AMENITY_MAP[key]).filter(Boolean);

  return { cities, countries, regions, propertyTypes, amenityOptions };
};

/**
 * Fetch a single hotel by slug along with its active room types.
 */
export const getHotelBySlug = (hotelSlug) => {
  const hotel = HOTELS_DATA.find((h) => h.slug === hotelSlug && h.isActive);
  if (!hotel) return null;
  const enriched = enrichHotel(hotel);
  const rooms = ROOM_TYPES_DATA.filter((rt) => rt.hotelId === hotel._id && rt.isActive).sort(
    (a, b) => a.basePrice - b.basePrice
  );
  return { ...enriched, rooms };
};

/**
 * Fetch all active hotels (enriched) for selectors.
 */
export const getAllActiveHotels = () => HOTELS_DATA.filter((h) => h.isActive).map(enrichHotel);

/**
 * Fetch room types belonging to a hotel slug or id.
 */
export const getRoomTypesForHotel = (hotelIdentifier) =>
  ROOM_TYPES_DATA.filter(
    (rt) =>
      rt.isActive &&
      (rt.hotelId === hotelIdentifier || rt.hotelSlug === hotelIdentifier)
  ).sort((a, b) => a.basePrice - b.basePrice);

/**
 * Fetch a specific room type + parent hotel by slugs.
 */
export const getRoomBySlugs = (hotelSlug, roomSlug) => {
  const hotel = getHotelBySlug(hotelSlug);
  if (!hotel) return null;
  const room = hotel.rooms.find((r) => r.slug === roomSlug);
  if (!room) return null;
  const siblingRooms = hotel.rooms.filter((r) => r.slug !== roomSlug);
  return { hotel, room, siblingRooms };
};

/**
 * Look up an offer by code or slug.
 */
export const getOfferByIdentifier = (identifier) => {
  if (!identifier) return null;
  const norm = identifier.trim().toLowerCase();
  return (
    OFFERS_DATA.find(
      (o) => o.code.toLowerCase() === norm || o.slug.toLowerCase() === norm
    ) || null
  );
};

/**
 * Validate whether an offer applies to the selected hotel, room category, and nights.
 */
export const evaluateOfferEligibility = (offer, { hotel, room, nights }) => {
  if (!offer) return { eligible: false, reason: '' };

  if (
    offer.applicableHotelSlugs.length > 0 &&
    hotel &&
    !offer.applicableHotelSlugs.includes(hotel.slug)
  ) {
    return {
      eligible: false,
      reason: `${offer.code} applies to participating Sanctuary properties only.`,
    };
  }

  if (
    offer.eligibleCategories.length > 0 &&
    room &&
    !offer.eligibleCategories.includes(room.category)
  ) {
    return {
      eligible: false,
      reason: `${offer.code} applies exclusively to ${offer.eligibleCategories.join(' & ')} categories.`,
    };
  }

  if (nights < offer.minNights) {
    return {
      eligible: false,
      reason: `${offer.code} requires a minimum stay of ${offer.minNights} nights.`,
    };
  }

  return { eligible: true, reason: '' };
};

/**
 * Compute detailed reservation pricing with taxes & additional charges itemized separately.
 */
export const calculateStayPricing = ({
  hotel,
  room,
  checkIn,
  checkOut,
  roomCount = 1,
  guests = 2,
  offer = null,
}) => {
  const nights = calcNights(checkIn, checkOut);
  const safeRooms = Math.max(1, Number(roomCount) || 1);
  const safeGuests = Math.max(1, Number(guests) || 1);
  const nightlyRate = room?.basePrice || 0;
  const roomSubtotal = roundCurrency(nightlyRate * nights * safeRooms);

  const offerCheck = evaluateOfferEligibility(offer, { hotel, room, nights });
  let discountAmount = 0;
  if (offer && offerCheck.eligible && nights > 0) {
    if (offer.discountType === 'percentage') {
      discountAmount = roundCurrency((roomSubtotal * offer.discountValue) / 100);
    } else if (offer.discountType === 'fixed') {
      discountAmount = roundCurrency(Math.min(roomSubtotal, offer.discountValue));
    }
  }

  const taxableSubtotal = roundCurrency(Math.max(0, roomSubtotal - discountAmount));
  const taxRate = hotel?.taxRate || 0;
  const taxAmount = roundCurrency((taxableSubtotal * taxRate) / 100);

  const resortFeeTotal = roundCurrency((hotel?.resortFeePerNight || 0) * nights * safeRooms);
  const cityTaxTotal = roundCurrency((hotel?.cityTaxPerGuestNight || 0) * safeGuests * nights);
  const additionalChargesTotal = roundCurrency(resortFeeTotal + cityTaxTotal);

  const totalAmount = roundCurrency(taxableSubtotal + taxAmount + additionalChargesTotal);

  return {
    currency: hotel?.currency || 'USD',
    nights,
    roomCount: safeRooms,
    guests: safeGuests,
    nightlyRate,
    roomSubtotal,
    discountAmount,
    appliedOffer: offerCheck.eligible ? offer : null,
    offerIneligibleReason: offer && !offerCheck.eligible ? offerCheck.reason : '',
    taxableSubtotal,
    taxRate,
    taxAmount,
    resortFeeTotal,
    cityTaxTotal,
    additionalChargesTotal,
    totalAmount,
  };
};

const roundCurrency = (value) => Math.round((Number(value) || 0) * 100) / 100;

/**
 * Default future check-in / check-out date strings relative to today (YYYY-MM-DD).
 */
export const getDefaultStayDates = (offsetDays = 7, stayNights = 3) => {
  const start = new Date();
  start.setDate(start.getDate() + offsetDays);
  const end = new Date(start);
  end.setDate(end.getDate() + stayNights);

  return {
    checkIn: toIsoDate(start),
    checkOut: toIsoDate(end),
  };
};

export const toIsoDate = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const TODAY_ISO = toIsoDate(new Date());
export const CURRENT_YEAR = new Date().getFullYear();

export const getAmenityMeta = (key) =>
  AMENITY_MAP[key] || { key, label: key, category: 'Amenities', iconKey: 'check' };

