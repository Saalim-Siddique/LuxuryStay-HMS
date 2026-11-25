import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';

/**
 * Table – Responsive data table with built-in loading, error, empty, and sorting states.
 */
const Table = ({
  columns = [],
  data = [],
  loading = false,
  error = null,
  onRetry,
  emptyTitle = 'No records found',
  emptyMessage = 'There are no items matching your criteria.',
  emptyAction = null,
  sortKey = null,
  sortDirection = 'asc',
  onSort,
  onRowClick,
  rowKey = '_id',
  striped = false,
  compact = false,
  caption,
  className = '',
}) => {
  if (loading) {
    return (
      <div className="ls-table-container">
        <LoadingSpinner size="md" showLabel label="Loading records…" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={typeof error === 'string' ? error : error.message} onRetry={onRetry} />;
  }

  if (!data.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyMessage}
        action={emptyAction}
      />
    );
  }

  const tableClasses = [
    'ls-table',
    striped && 'ls-table--striped',
    compact && 'ls-table--compact',
  ]
    .filter(Boolean)
    .join(' ');

  const getAlignmentStyle = (align) =>
    align ? { textAlign: align } : undefined;

  return (
    <div className={['ls-table-container', className].filter(Boolean).join(' ')}>
      <table className={tableClasses}>
        {caption && <caption className="visually-hidden">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => {
              const isSorted = sortKey === col.key;
              return (
                <th
                  key={col.key}
                  style={{
                    width: col.width,
                    ...getAlignmentStyle(col.align),
                  }}
                >
                  {col.sortable && onSort ? (
                    <button
                      type="button"
                      className="ls-table__sort-btn"
                      onClick={() => onSort(col.key)}
                    >
                      <span>{col.label}</span>
                      <span className="d-inline-flex flex-column" aria-hidden="true">
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <FiChevronUp size={13} />
                          ) : (
                            <FiChevronDown size={13} />
                          )
                        ) : (
                          <FiChevronDown size={13} style={{ opacity: 0.35 }} />
                        )}
                      </span>
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIdx) => {
            const key = row[rowKey] ?? rowIdx;
            return (
              <tr
                key={key}
                className={onRowClick ? 'ls-table__row--clickable' : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} style={getAlignmentStyle(col.align)}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

