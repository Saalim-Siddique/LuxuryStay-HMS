import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Pagination – Accessible page navigation with optional item range summary.
 */
const Pagination = ({
  page = 1,
  totalPages = 1,
  totalCount = null,
  limit = 20,
  onPageChange,
  disabled = false,
  className = '',
}) => {
  if (totalPages <= 1 && totalCount == null) return null;

  const pages = [];
  const delta = 1;
  const left = Math.max(1, page - delta);
  const right = Math.min(totalPages, page + delta);

  for (let i = left; i <= right; i++) pages.push(i);

  const startItem = totalCount ? (page - 1) * limit + 1 : 0;
  const endItem = totalCount ? Math.min(page * limit, totalCount) : 0;

  return (
    <div className={['ls-pagination', className].filter(Boolean).join(' ')}>
      {totalCount !== null ? (
        <div className="ls-pagination__info">
          Showing <strong>{startItem}</strong>–<strong>{endItem}</strong> of{' '}
          <strong>{totalCount}</strong> records
        </div>
      ) : (
        <div className="ls-pagination__info">
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination">
          <ul className="ls-pagination__list">
            <li>
              <button
                type="button"
                className="ls-pagination__btn"
                disabled={disabled || page <= 1}
                onClick={() => onPageChange(page - 1)}
                aria-label="Previous page"
              >
                <FiChevronLeft size={15} />
              </button>
            </li>

            {left > 1 && (
              <>
                <li>
                  <button
                    type="button"
                    className="ls-pagination__btn"
                    disabled={disabled}
                    onClick={() => onPageChange(1)}
                  >
                    1
                  </button>
                </li>
                {left > 2 && <li className="ls-pagination__ellipsis" aria-hidden="true">…</li>}
              </>
            )}

            {pages.map((p) => (
              <li key={p}>
                <button
                  type="button"
                  className={['ls-pagination__btn', p === page && 'is-active'].filter(Boolean).join(' ')}
                  disabled={disabled}
                  aria-current={p === page ? 'page' : undefined}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </button>
              </li>
            ))}

            {right < totalPages && (
              <>
                {right < totalPages - 1 && (
                  <li className="ls-pagination__ellipsis" aria-hidden="true">…</li>
                )}
                <li>
                  <button
                    type="button"
                    className="ls-pagination__btn"
                    disabled={disabled}
                    onClick={() => onPageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </li>
              </>
            )}

            <li>
              <button
                type="button"
                className="ls-pagination__btn"
                disabled={disabled || page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                aria-label="Next page"
              >
                <FiChevronRight size={15} />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Pagination;
