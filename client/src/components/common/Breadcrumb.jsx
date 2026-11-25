import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

/**
 * Breadcrumb – Semantic navigation hierarchy trail with Router Link support.
 */
const Breadcrumb = ({ items = [], separator = <FiChevronRight size={13} />, className = '' }) => {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="ls-breadcrumb__list">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const content = (
            <>
              {item.icon && <span className="d-inline-flex align-items-center" aria-hidden="true">{item.icon}</span>}
              <span>{item.label}</span>
            </>
          );

          return (
            <li key={item.to || item.label || idx} className="ls-breadcrumb__item">
              {isLast ? (
                <span className="ls-breadcrumb__current" aria-current="page">
                  {content}
                </span>
              ) : item.to ? (
                <Link to={item.to} className="ls-breadcrumb__link">
                  {content}
                </Link>
              ) : item.href ? (
                <a href={item.href} className="ls-breadcrumb__link">
                  {content}
                </a>
              ) : (
                <span className="ls-breadcrumb__link">{content}</span>
              )}

              {!isLast && (
                <span className="ls-breadcrumb__separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

