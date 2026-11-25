/**
 * StatCard – Executive KPI summary block (flat Navy or Light surface with gold hairline rule).
 */
const StatCard = ({
  label,
  value,
  icon = null,
  trend,
  trendPositive = true,
  variant = 'navy',
  className = '',
}) => (
  <div
    className={[
      'hms-stat-card',
      variant === 'light' && 'hms-stat-card--light',
      'h-100',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <div className="d-flex justify-content-between align-items-start gap-3">
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value ?? '—'}</div>
        {trend && (
          <div
            className="mt-2 tabular-nums"
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-medium)',
              color: trendPositive
                ? variant === 'navy'
                  ? '#6CE9A6'
                  : 'var(--color-success)'
                : variant === 'navy'
                  ? '#FDA29B'
                  : 'var(--color-danger)',
            }}
          >
            {trend}
          </div>
        )}
      </div>
      {icon && (
        <div
          aria-hidden="true"
          style={{
            fontSize: '1.35rem',
            color: variant === 'navy' ? 'var(--color-gold)' : 'var(--color-navy)',
            opacity: 0.85,
          }}
        >
          {icon}
        </div>
      )}
    </div>
  </div>
);

export default StatCard;
