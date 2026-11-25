const STATUS_PRESETS = {
  // Booking lifecycle
  pending:       { variant: 'warning', label: 'Pending' },
  confirmed:     { variant: 'info',    label: 'Confirmed' },
  checkedIn:     { variant: 'success', label: 'Checked In' },
  checkedOut:    { variant: 'neutral', label: 'Checked Out' },
  cancelled:     { variant: 'danger',  label: 'Cancelled' },
  noShow:        { variant: 'danger',  label: 'No Show' },

  // Room & housekeeping states
  available:     { variant: 'success', label: 'Available' },
  occupied:      { variant: 'info',    label: 'Occupied' },
  reserved:      { variant: 'gold',    label: 'Reserved' },
  maintenance:   { variant: 'warning', label: 'Maintenance' },
  outOfOrder:    { variant: 'danger',  label: 'Out of Order' },
  clean:         { variant: 'success', label: 'Clean' },
  dirty:         { variant: 'warning', label: 'Dirty' },
  inspecting:    { variant: 'info',    label: 'Inspecting' },
  outOfService:  { variant: 'danger',  label: 'Out of Service' },

  // Payments & operational tickets
  paid:          { variant: 'success', label: 'Paid' },
  completed:     { variant: 'success', label: 'Completed' },
  failed:        { variant: 'danger',  label: 'Failed' },
  refunded:      { variant: 'neutral', label: 'Refunded' },
  open:          { variant: 'warning', label: 'Open' },
  inProgress:    { variant: 'info',    label: 'In Progress' },
  resolved:      { variant: 'success', label: 'Resolved' },
  closed:        { variant: 'neutral', label: 'Closed' },
  active:        { variant: 'success', label: 'Active' },
  inactive:      { variant: 'neutral', label: 'Inactive' },
};

/**
 * Badge – Status indicator pill supporting explicit variants or HMS status auto-mapping.
 */
const Badge = ({
  status,
  variant,
  label,
  children,
  dot = false,
  size = 'md',
  icon = null,
  className = '',
}) => {
  const preset = status ? STATUS_PRESETS[status] : null;
  const resolvedVariant = variant || preset?.variant || 'neutral';
  const displayContent = children || label || preset?.label || status;

  const classes = [
    'ls-badge',
    `ls-badge--${resolvedVariant}`,
    `ls-badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {dot && <span className="ls-badge__dot" aria-hidden="true" />}
      {icon && <span className="d-inline-flex align-items-center" aria-hidden="true">{icon}</span>}
      <span>{displayContent}</span>
    </span>
  );
};

export default Badge;
