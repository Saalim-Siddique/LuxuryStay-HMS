import Breadcrumb from './Breadcrumb';

/**
 * PageHeader – Standardized editorial/executive header with breadcrumb, title, subtitle, and actions.
 */
const PageHeader = ({
  title,
  subtitle,
  eyebrow,
  breadcrumb = null,
  actions = null,
  className = '',
}) => {
  const renderBreadcrumb = () => {
    if (!breadcrumb) return null;
    if (Array.isArray(breadcrumb)) {
      return <Breadcrumb items={breadcrumb} />;
    }
    return breadcrumb;
  };

  return (
    <header className={['ls-page-header', className].filter(Boolean).join(' ')}>
      <div className="ls-page-header__meta">
        {renderBreadcrumb()}
        {eyebrow && <span className="ls-eyebrow">{eyebrow}</span>}
        {title && <h1 className="ls-page-header__title">{title}</h1>}
        {subtitle && <p className="ls-page-header__subtitle">{subtitle}</p>}
      </div>

      {actions && <div className="ls-page-header__actions">{actions}</div>}
    </header>
  );
};

export default PageHeader;

