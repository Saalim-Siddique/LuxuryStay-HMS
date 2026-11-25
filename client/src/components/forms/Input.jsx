import { useId, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import FieldShell from './FieldShell';

/**
 * Input – Accessible LuxuryStay text input with icon, password toggle, and validation feedback.
 */
const Input = ({
  id,
  label,
  type = 'text',
  size = 'md',
  error = '',
  hint = '',
  required = false,
  disabled = false,
  readOnly = false,
  leftIcon = null,
  rightElement = null,
  className = '',
  inputClassName = '',
  ...rest
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const hasRightSlot = Boolean(rightElement || isPassword);

  const controlClasses = [
    'ls-control',
    `ls-control--${size}`,
    leftIcon && 'ls-control--with-left-icon',
    hasRightSlot && 'ls-control--with-right-slot',
    error && 'ls-control--error',
    inputClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldShell
      id={inputId}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      {({ describedBy }) => (
        <div className="ls-input-wrap">
          {leftIcon && (
            <span className="ls-input-icon ls-input-icon--left" aria-hidden="true">
              {leftIcon}
            </span>
          )}

          <input
            id={inputId}
            type={resolvedType}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            className={controlClasses}
            {...rest}
          />

          {hasRightSlot && (
            <div className="ls-input-slot--right">
              {rightElement}
              {isPassword && !disabled && (
                <button
                  type="button"
                  className="ls-input-clear"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </FieldShell>
  );
};

export default Input;

