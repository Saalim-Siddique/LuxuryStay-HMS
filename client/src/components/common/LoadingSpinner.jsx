/**
 * LoadingSpinner – LuxuryStay loading indicator with size, color, and layout variants.
 */
const LoadingSpinner = ({
  size = 'md',
  variant = 'gold',
  label = 'Loading…',
  showLabel = false,
  fullPage = false,
  inline = false,
  className = '',
}) => {
  const wrapClasses = [
    'ls-spinner-wrap',
    inline && 'ls-spinner-wrap--inline',
    fullPage && 'ls-spinner-wrap--full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const spinnerClasses = [
    'ls-spinner',
    `ls-spinner--${size}`,
    variant !== 'gold' && `ls-spinner--${variant}`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapClasses} role="status" aria-live="polite">
      <span className={spinnerClasses} aria-hidden="true" />
      {showLabel ? (
        <span className="ls-spinner__label">{label}</span>
      ) : (
        <span className="visually-hidden">{label}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;

