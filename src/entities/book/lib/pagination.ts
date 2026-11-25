import { BOOK_MAX_PAGE, type BookSearchResult } from '../model';

/** 마지막 페이지이거나 API 최대 페이지(50)에 도달하면 다음 페이지가 없다. */
export function getNextBookPage(lastPage: Pick<BookSearchResult, 'isEnd'>, lastPageParam: number) {
  if (lastPage.isEnd || lastPageParam >= BOOK_MAX_PAGE) return undefined;
  return lastPageParam + 1;
}
