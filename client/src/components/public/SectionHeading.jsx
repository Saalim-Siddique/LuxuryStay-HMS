/**
 * SectionHeading – Editorial eyebrow, Playfair heading, subtle gold rule, and optional action.
 */
const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = 'left',
  as: HeadingTag = 'h2',
  action = null,
  showRule = true,
  className = '',
}) => {
  const isCentered = align === 'center';

  return (
    <div
      className={[
        'ls-public-heading',
        isCentered && 'ls-public-heading--center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="ls-public-heading__copy">
        {eyebrow && <span className="ls-eyebrow">{eyebrow}</span>}
        <HeadingTag className="ls-public-heading__title">{title}</HeadingTag>
        {showRule && (
          <hr
            className="ls-editorial-rule"
            style={isCentered ? { marginInline: 'auto' } : undefined}
          />
        )}
        {description && <p className="ls-public-heading__desc">{description}</p>}
      </div>

      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

export default SectionHeading;

