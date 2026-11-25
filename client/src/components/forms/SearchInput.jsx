import { useId } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import FieldShell from './FieldShell';

/**
 * SearchInput – Search bar input with clear button, loading indicator, and Enter trigger.
 */
const SearchInput = ({
  id,
  label,
  ariaLabel = 'Search',
  value = '',
  onChange,
  onClear,
  onSearch,
  placeholder = 'Search…',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...rest
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      e.preventDefault();
      onSearch(value);
    }
    if (e.key === 'Escape' && value && onClear) {
      onClear();
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  const controlClasses = [
    'ls-control',
    `ls-control--${size}`,
    'ls-control--with-left-icon',
    (value || loading) && 'ls-control--with-right-slot',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldShell id={inputId} label={label} className={className}>
      <div className="ls-input-wrap">
        <span className="ls-input-icon ls-input-icon--left" aria-hidden="true">
          <FiSearch />
        </span>

        <input
          id={inputId}
          type="search"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={!label ? ariaLabel : undefined}
          className={controlClasses}
          {...rest}
        />

        {(loading || (value && !disabled)) && (
          <div className="ls-input-slot--right">
            {loading ? (
              <LoadingSpinner size="xs" variant="gold" inline label="Searching…" />
            ) : (
              <button
                type="button"
                className="ls-input-clear"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>
        )}
      </div>
    </FieldShell>
  );
};

export default SearchInput;

