import { useState, useCallback } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  pageSize?: number;
}

export const usePagination = ({
  initialPage = 1,
  pageSize = 10,
}: UsePaginationProps = {}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, page));
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const offset = (currentPage - 1) * pageSize;

  return {
    currentPage,
    pageSize,
    offset,
    goToPage,
    nextPage,
    prevPage,
  };
};
