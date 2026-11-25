import { useId } from 'react';
import FieldShell from './FieldShell';

/**
 * Textarea – Multi-line accessible text input with optional live character counter.
 */
const Textarea = ({
  id,
  label,
  rows = 4,
  value,
  maxLength,
  showCount = false,
  error = '',
  hint = '',
  required = false,
  disabled = false,
  readOnly = false,
  resize = 'vertical',
  className = '',
  textareaClassName = '',
  ...rest
}) => {
  const generatedId = useId();
  const textareaId = id || generatedId;

  const currentLength = typeof value === 'string' ? value.length : 0;
  const countText =
    showCount || maxLength
      ? maxLength
        ? `${currentLength} / ${maxLength}`
        : `${currentLength} chars`
      : '';

  const controlClasses = [
    'ls-control',
    'ls-textarea',
    error && 'ls-control--error',
    textareaClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldShell
      id={textareaId}
      label={label}
      required={required}
      error={error}
      hint={hint}
      countText={countText}
      className={className}
    >
      {({ describedBy }) => (
        <textarea
          id={textareaId}
          rows={rows}
          value={value}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={controlClasses}
          style={{ resize }}
          {...rest}
        />
      )}
    </FieldShell>
  );
};

export default Textarea;

