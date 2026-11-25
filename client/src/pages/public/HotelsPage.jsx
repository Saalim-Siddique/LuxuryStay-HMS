import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiSearch, FiSliders, FiX } from 'react-icons/fi';
import { Breadcrumb, Button, EmptyState, Pagination, Select } from '../../components';
import { HotelCard, HotelSearchForm, PublicLayout } from '../../components/public';
import { getHotelFilterOptions, queryPublicHotels } from '../../data/public';

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended Order' },
  { value: 'price-asc', label: 'Nightly Tariff: Low to High' },
  { value: 'price-desc', label: 'Nightly Tariff: High to Low' },
  { value: 'rating-desc', label: 'Guest Rating: Highest First' },
  { value: 'name-asc', label: 'Property Name: A–Z' },
];

const PAGE_LIMIT = 6;

/**
 * HotelsPage – Searchable, filterable, sortable, paginated portfolio directory at `/hotels`.
 */
const HotelsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    document.title = 'The Collection — LuxuryStay Hotels';
  }, []);

  const filterOptions = useMemo(() => getHotelFilterOptions(), []);

  // Derived filter state from URL query params for shareable links & browser navigation
  const q = searchParams.get('q') || '';
  const locationFilter = searchParams.get('location') || 'all';
  const propertyType = searchParams.get('type') || 'all';
  const amenitiesParam = searchParams.get('amenity') || '';
  const selectedAmenities = useMemo(
    () => (amenitiesParam ? amenitiesParam.split(',').filter(Boolean) : []),
    [amenitiesParam]
  );
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = Number(searchParams.get('guests')) || 0;
  const sort = searchParams.get('sort') || 'recommended';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const updateParams = (updates, resetPage = true) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val == null || val === '' || val === 'all' || (Array.isArray(val) && val.length === 0)) {
        next.delete(key);
      } else if (Array.isArray(val)) {
        next.set(key, val.join(','));
      } else {
        next.set(key, String(val));
      }
    });
    if (resetPage) {
      next.delete('page');
    }
    setSearchParams(next);
  };

  const results = useMemo(
    () =>
      queryPublicHotels({
        search: q,
        location: locationFilter,
        propertyType,
        amenities: selectedAmenities,
        guests,
        checkIn,
        checkOut,
        sort,
        page,
        limit: PAGE_LIMIT,
      }),
    [q, locationFilter, propertyType, selectedAmenities, guests, checkIn, checkOut, sort, page]
  );

  const locationSelectOptions = useMemo(
    () => [
      { value: 'all', label: 'All Destinations' },
      ...filterOptions.regions.map((region) => ({
        value: region,
        label: `Region: ${region}`,
      })),
      ...filterOptions.cities.map((city) => ({
        value: city,
        label: city,
      })),
    ],
    [filterOptions]
  );

  const propertyTypeOptions = useMemo(
    () => [
      { value: 'all', label: 'All Property Styles' },
      ...filterOptions.propertyTypes.map((type) => ({ value: type, label: type })),
    ],
    [filterOptions]
  );

  const handleSearchBarSubmit = (values) => {
    updateParams({
      q: values.search,
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      guests: values.guests,
    });
  };

  const toggleAmenity = (key) => {
    const next = selectedAmenities.includes(key)
      ? selectedAmenities.filter((item) => item !== key)
      : [...selectedAmenities, key];
    updateParams({ amenity: next });
  };

  const handleClearAll = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (nextPage) => {
    updateParams({ page: nextPage > 1 ? nextPage : null }, false);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const stayQueryString = useMemo(() => {
    const p = new URLSearchParams();
    if (checkIn) p.set('checkIn', checkIn);
    if (checkOut) p.set('checkOut', checkOut);
    if (guests) p.set('guests', String(guests));
    return p.toString();
  }, [checkIn, checkOut, guests]);

  const activeFiltersCount =
    (q ? 1 : 0) +
    (locationFilter !== 'all' ? 1 : 0) +
    (propertyType !== 'all' ? 1 : 0) +
    (guests > 0 ? 1 : 0) +
    selectedAmenities.length;

  const filterPanelContent = (
    <div className="ls-public-filter-panel">
      <div className="d-flex align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <FiSliders size={15} className="text-gold-aa" aria-hidden="true" />
          <h2 className="h6 mb-0 text-navy">Refine Collection</h2>
        </div>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="btn btn-link p-0 text-decoration-none text-gold-aa"
            style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}
          >
            Reset ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className="ls-public-filter-group">
        <Select
          label="Location / Region"
          options={locationSelectOptions}
          value={locationFilter}
          onChange={(e) => updateParams({ location: e.target.value })}
          placeholder=""
          size="md"
        />
      </div>

      <div className="ls-public-filter-group">
        <Select
          label="Property Style"
          options={propertyTypeOptions}
          value={propertyType}
          onChange={(e) => updateParams({ type: e.target.value })}
          placeholder=""
          size="md"
        />
      </div>

      <div className="ls-public-filter-group">
        <h3 className="ls-public-filter-group__title">Amenities & Facilities</h3>
        <div className="ls-public-check-list">
          {filterOptions.amenityOptions.map((amenity) => {
            const checked = selectedAmenities.includes(amenity.key);
            return (
              <label key={amenity.key} className="ls-public-check-item">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAmenity(amenity.key)}
                />
                <span>{amenity.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <PublicLayout>
      {/* Editorial Banner & Inline Search */}
      <section className="ls-public-page-banner">
        <div className="ls-public-container">
          <Breadcrumb
            items={[
              { label: 'Home', to: '/' },
              { label: 'Hotels & Sanctuaries' },
            ]}
            className="mb-3"
          />

          <div className="d-flex flex-wrap align-items-end justify-content-between gap-4 mb-4">
            <div>
              <span className="ls-eyebrow">Global Portfolio</span>
              <h1 className="ls-public-page-banner__title">
                LuxuryStay Hotels & Sanctuaries
              </h1>
              <p className="ls-public-page-banner__desc">
                Search by destination, stay dates, architectural style, or wellness facilities across our nine international properties.
              </p>
            </div>
            <div className="text-slate tabular-nums" style={{ fontSize: 'var(--text-sm)' }}>
              <strong>{results.totalCount}</strong>{' '}
              {results.totalCount === 1 ? 'property' : 'properties'} matching criteria
            </div>
          </div>

          <HotelSearchForm
            key={`${q}-${checkIn}-${checkOut}-${guests}`}
            variant="inline"
            submitLabel="Update Search"
            initialValues={{ search: q, checkIn, checkOut, guests: guests || 2 }}
            onSearch={handleSearchBarSubmit}
          />
        </div>
      </section>

      {/* Main Filter + Grid Content */}
      <section className="ls-public-section ls-public-section--ivory ls-public-section--compact">
        <div className="ls-public-container">
          {/* Mobile Filter Toggle & Sort Toolbar */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div className="d-flex flex-wrap align-items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FiFilter />}
                className="d-lg-none"
                onClick={() => setMobileFiltersOpen((prev) => !prev)}
                aria-expanded={mobileFiltersOpen}
              >
                {mobileFiltersOpen ? 'Hide Filters' : `Filters${activeFiltersCount ? ` (${activeFiltersCount})` : ''}`}
              </Button>

              {q && (
                <button
                  type="button"
                  className="ls-public-chip"
                  onClick={() => updateParams({ q: '' })}
                >
                  <span>Search: “{q}”</span>
                  <FiX size={12} aria-hidden="true" />
                </button>
              )}

              {locationFilter !== 'all' && (
                <button
                  type="button"
                  className="ls-public-chip"
                  onClick={() => updateParams({ location: 'all' })}
                >
                  <span>Location: {locationFilter}</span>
                  <FiX size={12} aria-hidden="true" />
                </button>
              )}

              {propertyType !== 'all' && (
                <button
                  type="button"
                  className="ls-public-chip"
                  onClick={() => updateParams({ type: 'all' })}
                >
                  <span>Style: {propertyType}</span>
                  <FiX size={12} aria-hidden="true" />
                </button>
              )}

              {guests > 0 && (
                <button
                  type="button"
                  className="ls-public-chip"
                  onClick={() => updateParams({ guests: null })}
                >
                  <span>{guests}+ Guests</span>
                  <FiX size={12} aria-hidden="true" />
                </button>
              )}

              {selectedAmenities.map((key) => {
                const meta = filterOptions.amenityOptions.find((a) => a.key === key);
                return (
                  <button
                    key={key}
                    type="button"
                    className="ls-public-chip"
                    onClick={() => toggleAmenity(key)}
                  >
                    <span>{meta?.label || key}</span>
                    <FiX size={12} aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            <div style={{ minWidth: '235px' }}>
              <Select
                aria-label="Sort properties"
                options={SORT_OPTIONS}
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                placeholder=""
                size="sm"
              />
            </div>
          </div>

          {mobileFiltersOpen && (
            <div className="d-lg-none mb-4">{filterPanelContent}</div>
          )}

          <div className="row g-4 align-items-start">
            <aside className="col-lg-3 d-none d-lg-block ls-public-sticky-panel" aria-label="Property filters">
              {filterPanelContent}
            </aside>

            <div className="col-lg-9">
              {results.items.length === 0 ? (
                <EmptyState
                  icon={<FiSearch />}
                  title="No properties match your criteria"
                  description="Try clearing one or more amenity filters, broadening your destination search, or adjusting your guest capacity."
                  action={{
                    label: 'Reset All Filters',
                    variant: 'primary',
                    onClick: handleClearAll,
                  }}
                />
              ) : (
                <>
                  <div className="row g-4">
                    {results.items.map((hotel) => (
                      <div key={hotel._id} className="col-md-6">
                        <HotelCard hotel={hotel} searchQueryString={stayQueryString} />
                      </div>
                    ))}
                  </div>

                  {results.totalPages > 1 && (
                    <Pagination
                      page={results.page}
                      totalPages={results.totalPages}
                      totalCount={results.totalCount}
                      limit={results.limit}
                      onPageChange={handlePageChange}
                      className="mt-5 pt-3 border-top"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HotelsPage;
