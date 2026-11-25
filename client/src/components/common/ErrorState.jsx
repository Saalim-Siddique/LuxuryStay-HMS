import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import Button from './Button';

/**
 * ErrorState – Recoverable error presentation panel with optional retry trigger.
 */
const ErrorState = ({
  icon = <FiAlertTriangle />,
  title = 'Unable to load data',
  message = 'An unexpected error occurred while retrieving this information.',
  onRetry,
  retryLabel = 'Try Again',
  compact = false,
  className = '',
}) => {
  return (
    <div
      className={[
        'ls-state-panel',
        'ls-state-panel--error',
        compact && 'ls-state-panel--compact',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="alert"
    >
      <div className="ls-state-panel__icon" aria-hidden="true">
        {icon}
      </div>
      <h4 className="ls-state-panel__title">{title}</h4>
      {message && <p className="ls-state-panel__desc">{message}</p>}
      {onRetry && (
        <div className="ls-state-panel__action">
          <Button variant="outline" size="sm" leftIcon={<FiRefreshCw />} onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;

