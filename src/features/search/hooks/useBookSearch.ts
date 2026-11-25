import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import {
  bookQueryKeys,
  type BookSearchResult,
  getNextBookPage,
  searchBooks,
  uniqueBooks,
} from '@/entities/book';

import type { SearchCondition } from '../model/searchCondition';

/** 페이지를 이어 붙인 뒤 중복을 제거한다. (실제 응답에서 페이지 간 같은 책이 중복으로 내려옴) */
function selectBookSearchData(data: InfiniteData<BookSearchResult, number>) {
  return {
    books: uniqueBooks(data.pages.flatMap((page) => page.books)),
    totalCount: data.pages[0]?.totalCount ?? 0,
  };
}

export function useBookSearch(condition: SearchCondition) {
  return useInfiniteQuery({
    queryKey: bookQueryKeys.search(condition),
    queryFn: ({ pageParam, signal }) => searchBooks({ ...condition, page: pageParam, signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      getNextBookPage(lastPage, lastPageParam),
    enabled: condition.query !== '',
    select: selectBookSearchData,
  });
}
