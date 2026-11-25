import { useState } from 'react';

import { BOOK_PAGE_SIZE } from '@/entities/book';

/** 이미 가지고 있는 목록을 페이지 크기(10개)씩 늘려 보여준다. (찜 목록: 페이지 당 10개 아이템) */
export function useClientPagination<T>(items: readonly T[], pageSize = BOOK_PAGE_SIZE) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  return {
    visibleItems: items.slice(0, visibleCount),
    hasNextPage: visibleCount < items.length,
    loadMore: () => setVisibleCount((count) => count + pageSize),
  };
}
