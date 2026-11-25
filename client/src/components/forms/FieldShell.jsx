import { FiAlertCircle } from 'react-icons/fi';

/**
 * FieldShell – Shared accessible wrapper for form labels, hints, errors, and counters.
 */
const FieldShell = ({
  id,
  label,
  required = false,
  error = '',
  hint = '',
  countText = '',
  className = '',
  children,
}) => {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = !error && hint ? `${id}-hint` : undefined;
  const describedBy = errorId || hintId;

  return (
    <div className={['ls-field', className].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={id} className="ls-field__label">
          <span>{label}</span>
          {required && (
            <span className="ls-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {typeof children === 'function' ? children({ describedBy }) : children}

      {(error || hint || countText) && (
        <div className="ls-field__meta">
          {error ? (
            <span id={errorId} className="ls-field__error" role="alert">
              <FiAlertCircle aria-hidden="true" />
              <span>{error}</span>
            </span>
          ) : hint ? (
            <span id={hintId} className="ls-field__hint">
              {hint}
            </span>
          ) : (
            <span />
          )}

          {countText && <span className="ls-field__count">{countText}</span>}
        </div>
      )}
    </div>
  );
};

export default FieldShell;

