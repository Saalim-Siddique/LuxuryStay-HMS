import {
  FiActivity,
  FiAnchor,
  FiAward,
  FiBell,
  FiCheck,
  FiClock,
  FiCoffee,
  FiCompass,
  FiDroplet,
  FiMapPin,
  FiMaximize2,
  FiNavigation,
  FiShield,
  FiSun,
  FiWifi,
  FiWind,
} from 'react-icons/fi';
import { getAmenityMeta } from '../../data/public';

const ICON_MAP = {
  droplet: FiDroplet,
  sun: FiSun,
  activity: FiActivity,
  wind: FiWind,
  award: FiAward,
  coffee: FiCoffee,
  clock: FiClock,
  bell: FiBell,
  navigation: FiNavigation,
  compass: FiCompass,
  anchor: FiAnchor,
  maximize: FiMaximize2,
  shield: FiShield,
  wifi: FiWifi,
  mapPin: FiMapPin,
  check: FiCheck,
};

/**
 * AmenityList – Structured hotel & suite amenity matrix with uniform Feather icons.
 */
const AmenityList = ({ amenities = [], grouped = false, limit = null, className = '' }) => {
  const resolved = (limit ? amenities.slice(0, limit) : amenities).map(getAmenityMeta);

  if (!resolved.length) return null;

  if (!grouped) {
    return (
      <div className={['ls-public-amenities-grid', className].filter(Boolean).join(' ')}>
        {resolved.map((item) => {
          const IconComponent = ICON_MAP[item.iconKey] || FiCheck;
          return (
            <div key={item.key} className="ls-public-amenity-item">
              <span className="ls-public-amenity-item__icon" aria-hidden="true">
                <IconComponent size={15} />
              </span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  const byCategory = resolved.reduce((acc, item) => {
    const cat = item.category || 'Amenities';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className={['row g-4', className].filter(Boolean).join(' ')}>
      {Object.entries(byCategory).map(([category, items]) => (
        <div key={category} className="col-md-6">
          <h4 className="h6 text-uppercase ls-eyebrow mb-3" style={{ color: 'var(--color-navy)' }}>
            {category}
          </h4>
          <div className="d-flex flex-column gap-1">
            {items.map((item) => {
              const IconComponent = ICON_MAP[item.iconKey] || FiCheck;
              return (
                <div key={item.key} className="ls-public-amenity-item">
                  <span className="ls-public-amenity-item__icon" aria-hidden="true">
                    <IconComponent size={15} />
                  </span>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AmenityList;

