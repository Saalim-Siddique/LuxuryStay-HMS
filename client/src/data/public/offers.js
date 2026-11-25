/**
 * Seasonal offers and editorial packages.
 * Designed so promotional rules can later be fetched from Express /api/offers.
 */
export const OFFERS_DATA = [
  {
    _id: 'offer-extended-horizon',
    slug: 'extended-horizon',
    code: 'HORIZON4',
    title: 'Extended Horizon',
    subtitle: 'Stay Four Nights, Pay Three',
    badgeLabel: '25% Savings · 4+ Nights',
    description:
      'Unwind at an unhurried cadence across our European palaces and coastal estates with your fourth consecutive night extended with our compliments.',
    discountType: 'percentage',
    discountValue: 25,
    minNights: 4,
    validThrough: '31 March 2027',
    applicableHotelSlugs: [], // empty = valid across all hotels
    eligibleCategories: [], // empty = valid on all room categories
    inclusions: [
      'Complimentary fourth night across stays of four nights or more',
      'Daily à la carte breakfast served in-suite or in the dining salon',
      'Flexible late departure until 15:00, subject to availability',
    ],
    featuredHotelSlug: 'the-grand-meridian-geneva',
    image: '/images/public/hotel-geneva-meridian.jpg',
  },
  {
    _id: 'offer-sanctuary-spa',
    slug: 'sanctuary-wellness-retreat',
    code: 'SANCTUARY15',
    title: 'The Thermal Sanctuary',
    subtitle: '15% Suite Privilege & Private Wellness Ritual',
    badgeLabel: '15% Savings · Spa Included',
    description:
      'Designed around stillness and restoration, combining preferred nightly suite rates with private thermal bathing and signature restorative bodywork.',
    discountType: 'percentage',
    discountValue: 15,
    minNights: 2,
    validThrough: '30 April 2027',
    applicableHotelSlugs: [
      'the-grand-meridian-geneva',
      'kaze-no-niwa-kyoto',
      'chalet-valmont-zermatt',
      'qasr-al-rimal-alula',
      'palazzo-aurelia-milan',
    ],
    eligibleCategories: [],
    inclusions: [
      '15% preferred privilege on stays of two nights or longer',
      'Private 90-minute botanical spa or thermal bath session for two',
      'Complimentary access to hydrotherapy pools and steam ateliers',
    ],
    featuredHotelSlug: 'kaze-no-niwa-kyoto',
    image: '/images/public/experience-thermal-spa.jpg',
  },
  {
    _id: 'offer-suite-chauffeur',
    slug: 'suite-private-arrival',
    code: 'SUITE20',
    title: 'Suite Sanctuary & Arrival',
    subtitle: '20% Off Signature Suites with Chauffeur Transfer',
    badgeLabel: '20% Savings · Suites',
    description:
      'Step seamlessly from tarmac to terrace with private chauffeured transfers, dedicated butler welcome, and cellar aperitifs in our Signature Suites and Residences.',
    discountType: 'percentage',
    discountValue: 20,
    minNights: 3,
    validThrough: '15 May 2027',
    applicableHotelSlugs: [],
    eligibleCategories: ['Signature Suite', 'Private Residence'],
    inclusions: [
      '20% privilege on Signature Suites and Private Residences (3+ nights)',
      'Round-trip chauffeured sedan airport or rail transfer',
      'Evening sommelier tasting pour upon arrival',
    ],
    featuredHotelSlug: 'villa-belvedere-ravello',
    image: '/images/public/room-presidential-sanctuary.jpg',
  },
];

