import LoadingSpinner from './LoadingSpinner';

/**
 * Button – LuxuryStay action button supporting semantic variants, sizes, icons, and loading state.
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  as: Component = 'button',
  className = '',
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const classes = [
    'ls-btn',
    `ls-btn--${variant}`,
    `ls-btn--${size}`,
    fullWidth && 'ls-btn--full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const spinnerVariant =
    variant === 'primary' || variant === 'danger' ? 'white' : 'navy';

  const componentProps =
    Component === 'button'
      ? { type, disabled: isDisabled }
      : { 'aria-disabled': isDisabled || undefined };

  return (
    <Component className={classes} {...componentProps} {...rest}>
      {loading ? (
        <LoadingSpinner size="xs" variant={spinnerVariant} inline label="Processing…" />
      ) : (
        leftIcon && <span className="d-inline-flex align-items-center" aria-hidden="true">{leftIcon}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && rightIcon && (
        <span className="d-inline-flex align-items-center" aria-hidden="true">{rightIcon}</span>
      )}
    </Component>
  );
};

export default Button;

