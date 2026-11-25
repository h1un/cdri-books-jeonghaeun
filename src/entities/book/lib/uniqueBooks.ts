import type { Book } from '../model';

/**
 * 검색 결과를 페이지 단위로 이어 붙이면 같은 책(동일 ISBN·URL)이 중복으로 나오는 경우가 있어
 * 목록 key가 겹치지 않도록 처음 나온 항목만 남긴다.
 */
export function uniqueBooks(books: Book[]) {
  const seenIds = new Set<string>();
  return books.filter((book) => {
    if (seenIds.has(book.id)) return false;
    seenIds.add(book.id);
    return true;
  });
}
