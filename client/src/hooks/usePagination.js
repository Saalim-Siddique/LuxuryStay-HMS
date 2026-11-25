import { useState, useCallback } from 'react';

/**
 * usePagination – manages page/limit state for paginated lists.
 *
 * @param {number} initialLimit - rows per page (default 20)
 * @returns {{ page, limit, totalPages, totalCount, setPage, setLimit, setMeta, resetPage }}
 */
const usePagination = (initialLimit = 20) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const setMeta = useCallback((meta) => {
    if (!meta) return;
    if (meta.totalCount !== undefined) setTotalCount(meta.totalCount);
    if (meta.totalPages !== undefined) setTotalPages(meta.totalPages);
  }, []);

  const resetPage = useCallback(() => setPage(1), []);

  return { page, limit, totalCount, totalPages, setPage, setLimit, setMeta, resetPage };
};

export default usePagination;

