/**
 * Card – LuxuryStay surface container supporting editorial, ivory, navy, and outlined variants.
 */
const Card = ({
  title,
  subtitle,
  eyebrow,
  actions = null,
  footer = null,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  bodyClassName = '',
  children,
  ...rest
}) => {
  const cardClasses = [
    'ls-card',
    variant !== 'default' && `ls-card--${variant}`,
    hoverable && 'ls-card--hoverable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasHeader = Boolean(title || subtitle || eyebrow || actions);

  return (
    <section className={cardClasses} {...rest}>
      {hasHeader && (
        <div className="ls-card__header">
          <div>
            {eyebrow && <span className="ls-eyebrow mb-1">{eyebrow}</span>}
            {title && <h3 className="ls-card__title">{title}</h3>}
            {subtitle && <p className="ls-card__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="d-flex align-items-center gap-2 flex-shrink-0">{actions}</div>}
        </div>
      )}

      <div className={`ls-card__body--${padding} ${bodyClassName}`.trim()}>
        {children}
      </div>

      {footer && <div className="ls-card__footer">{footer}</div>}
    </section>
  );
};

export default Card;

