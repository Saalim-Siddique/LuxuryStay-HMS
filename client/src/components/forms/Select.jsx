import { useId } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import FieldShell from './FieldShell';

/**
 * Select – Accessible styled select dropdown with uniform LuxuryStay chevron and states.
 */
const Select = ({
  id,
  label,
  options = [],
  placeholder = 'Select an option…',
  size = 'md',
  error = '',
  hint = '',
  required = false,
  disabled = false,
  className = '',
  selectClassName = '',
  children,
  ...rest
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  const controlClasses = [
    'ls-control',
    'ls-select',
    `ls-control--${size}`,
    error && 'ls-control--error',
    selectClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldShell
      id={selectId}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      {({ describedBy }) => (
        <div className="ls-input-wrap">
          <select
            id={selectId}
            required={required}
            disabled={disabled}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            className={controlClasses}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled={required}>
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              const normalized =
                typeof opt === 'object' ? opt : { value: opt, label: String(opt) };
              return (
                <option
                  key={normalized.value}
                  value={normalized.value}
                  disabled={normalized.disabled}
                >
                  {normalized.label}
                </option>
              );
            })}
            {children}
          </select>

          <span
            className="ls-input-icon"
            style={{ right: '0.75rem' }}
            aria-hidden="true"
          >
            <FiChevronDown />
          </span>
        </div>
      )}
    </FieldShell>
  );
};

export default Select;

