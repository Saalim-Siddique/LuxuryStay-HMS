/**
 * Curated LuxuryStay amenities catalog.
 * Keys map cleanly to future Express /api/amenities or hotel/room string arrays.
 */
export const AMENITIES_CATALOG = [
  { key: 'thermal-spa', label: 'Thermal Spa & Hammam', category: 'Wellness & Sanctuary', iconKey: 'droplet' },
  { key: 'infinity-pool', label: 'Heated Infinity Pool', category: 'Wellness & Sanctuary', iconKey: 'sun' },
  { key: 'fitness-pavilion', label: 'Private Fitness Pavilion', category: 'Wellness & Sanctuary', iconKey: 'activity' },
  { key: 'private-onsen', label: 'Private Cedar Onsen', category: 'Wellness & Sanctuary', iconKey: 'wind' },
  { key: 'michelin-dining', label: 'Signature Fine Dining', category: 'Dining & Cellar', iconKey: 'award' },
  { key: 'wine-cellar', label: 'Sommelier Wine Cellar', category: 'Dining & Cellar', iconKey: 'coffee' },
  { key: 'in-suite-dining', label: '24-Hour In-Suite Dining', category: 'Dining & Cellar', iconKey: 'clock' },
  { key: 'butler-service', label: 'Dedicated Butler Service', category: 'Concierge & Transfers', iconKey: 'bell' },
  { key: 'airport-transfer', label: 'Chauffeur Airport Transfer', category: 'Concierge & Transfers', iconKey: 'navigation' },
  { key: 'concierge-desk', label: '24-Hour Les Clefs Concierge', category: 'Concierge & Transfers', iconKey: 'compass' },
  { key: 'helipad-dock', label: 'Private Boat Dock / Helipad', category: 'Concierge & Transfers', iconKey: 'anchor' },
  { key: 'private-terrace', label: 'Private Terrace or Loggia', category: 'In-Suite Comfort', iconKey: 'maximize' },
  { key: 'marble-bath', label: 'Deep Soaking Marble Bath', category: 'In-Suite Comfort', iconKey: 'shield' },
  { key: 'fireplace', label: 'Wood-Burning Fireplace', category: 'In-Suite Comfort', iconKey: 'sun' },
  { key: 'high-speed-wifi', label: 'High-Speed Fibre Wi-Fi', category: 'In-Suite Comfort', iconKey: 'wifi' },
  { key: 'valet-parking', label: 'Valet & EV Charging', category: 'Concierge & Transfers', iconKey: 'mapPin' },
];

export const AMENITY_MAP = Object.fromEntries(
  AMENITIES_CATALOG.map((item) => [item.key, item])
);

export const FILTERABLE_AMENITY_KEYS = [
  'thermal-spa',
  'infinity-pool',
  'michelin-dining',
  'butler-service',
  'airport-transfer',
  'private-terrace',
  'fitness-pavilion',
  'wine-cellar',
];

