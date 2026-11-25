import { FiInbox } from 'react-icons/fi';
import Button from './Button';

/**
 * EmptyState – Consistent placeholder view when a list, table, or search yields no results.
 */
const EmptyState = ({
  icon = <FiInbox />,
  title = 'No records found',
  description,
  message,
  action = null,
  compact = false,
  className = '',
}) => {
  const bodyText = description ?? message;

  const renderAction = () => {
    if (!action) return null;
    if (typeof action === 'object' && !('$$typeof' in action) && action.label) {
      return (
        <Button
          variant={action.variant || 'outline'}
          size="sm"
          leftIcon={action.icon}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      );
    }
    return action;
  };

  return (
    <div
      className={['ls-state-panel', compact && 'ls-state-panel--compact', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="ls-state-panel__icon" aria-hidden="true">
        {icon}
      </div>
      <h4 className="ls-state-panel__title">{title}</h4>
      {bodyText && <p className="ls-state-panel__desc">{bodyText}</p>}
      {action && <div className="ls-state-panel__action">{renderAction()}</div>}
    </div>
  );
};

export default EmptyState;
