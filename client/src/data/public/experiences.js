/**
 * Editorial brand narrative, featured experiences, and visual gallery showcase.
 */
export const PHILOSOPHY_PILLARS = [
  {
    number: '01',
    title: 'Architectural Permanence',
    description:
      'Every property begins with materials shaped by its geography—carved alpine granite, Ravello travertine, Kyoto hinoki cedar, and hand-trowelled lime.',
  },
  {
    number: '02',
    title: 'Intimate Scale',
    description:
      'Deliberately capped key counts preserve quiet corridors, private terraces, and unhurried morning salons free from crowd or clamor.',
  },
  {
    number: '03',
    title: 'Unscripted Anticipation',
    description:
      'Our concierges and dedicated butlers learn preferences discreetly before arrival—temperature, pillow composition, cellar notes, and pace.',
  },
  {
    number: '04',
    title: 'Rooted Gastronomic Craft',
    description:
      'Kitchens partner directly with lakeside fishermen, mountain cheesemakers, and heritage vineyards within eighty kilometers of each threshold.',
  },
];

export const EXPERIENCES_DATA = [
  {
    _id: 'exp-thermal',
    slug: 'mineral-thermal-sanctuaries',
    category: 'Wellness & Restoration',
    title: 'Limestone Thermal Sanctuaries',
    description:
      'Subterranean mineral plunge pools, cedar saunas, and bespoke botanical rituals calibrated to seasonal circadian rhythms.',
    amenityFilter: 'thermal-spa',
    hotelSlug: 'the-grand-meridian-geneva',
    image: '/images/public/experience-thermal-spa.jpg',
  },
  {
    _id: 'exp-culinary',
    slug: 'cellar-and-hearth-tables',
    category: 'Culinary & Cellar',
    title: 'The Sommelier’s Hearth Table',
    description:
      'Intimate candlelit tasting menus shaped around rare vertical vintages and open-hearth regional harvests.',
    amenityFilter: 'michelin-dining',
    hotelSlug: 'palazzo-aurelia-milan',
    image: '/images/public/experience-fine-dining.jpg',
  },
  {
    _id: 'exp-coastal',
    slug: 'mediterranean-private-waters',
    category: 'Coastal & Alpine Excursions',
    title: 'Private Wooden Riva & Coastal Coves',
    description:
      'Dawn departures along secluded Tyrrhenian and Balearic headlands aboard bespoke Riva launches crewed by our harbour captains.',
    amenityFilter: 'infinity-pool',
    hotelSlug: 'villa-belvedere-ravello',
    image: '/images/public/hotel-amalfi-belvedere.jpg',
  },
  {
    _id: 'exp-desert',
    slug: 'nocturnal-canyon-observatories',
    category: 'Cultural Immersion',
    title: 'Stargazing & Sandstone Quietude',
    description:
      'Private desert astronomy evenings and lantern-lit canyon walks guided by local historians and astrophysicists.',
    amenityFilter: 'butler-service',
    hotelSlug: 'qasr-al-rimal-alula',
    image: '/images/public/hotel-alula-rimal.jpg',
  },
];

export const EDITORIAL_GALLERY = [
  {
    id: 'ed-1',
    title: 'The Lakefront Colonnade at Twilight',
    location: 'Geneva · The Grand Meridian',
    caption: 'Eighteenth-century limestone arches reflected across the evening waters of Lake Geneva.',
    hotelSlug: 'the-grand-meridian-geneva',
    image: '/images/public/hero-grand-courtyard.jpg',
    variant: 'lead',
  },
  {
    id: 'ed-2',
    title: 'The Drawing Room & Hearth Salon',
    location: 'Paris · Maison Lumière',
    caption: 'Travertine hearths, curated art monographs, and soft linen lounges reserved exclusively for resident guests.',
    hotelSlug: 'maison-lumiere-paris',
    image: '/images/public/editorial-lobby-salon.jpg',
    variant: 'standard',
  },
  {
    id: 'ed-3',
    title: 'Quietude in Aged Hinoki',
    location: 'Kyoto · Kaze-no-Niwa Sanctuary',
    caption: 'Private cedar onsen chambers framed by moss gardens and soft morning mist.',
    hotelSlug: 'kaze-no-niwa-kyoto',
    image: '/images/public/room-ryokan-suite.jpg',
    variant: 'standard',
  },
  {
    id: 'ed-4',
    title: 'Cantilevered Sea Horizon',
    location: 'Ravello · Villa Belvedere',
    caption: 'Golden hour across cliffside travertine terraces suspended above the Amalfi Coast.',
    hotelSlug: 'villa-belvedere-ravello',
    image: '/images/public/hotel-amalfi-belvedere.jpg',
    variant: 'wide',
  },
];

