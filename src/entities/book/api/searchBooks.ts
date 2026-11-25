import { kakaoClient } from '@/shared/api/kakaoClient';

import { BOOK_PAGE_SIZE, type BookSearchParams, type BookSearchResult } from '../model';
import { toBookSearchResult } from './mapper';

import type { KakaoBookSearchResponse } from './kakaoBook.dto';

export async function searchBooks({
  query,
  target,
  page,
  size = BOOK_PAGE_SIZE,
  signal,
}: BookSearchParams): Promise<BookSearchResult> {
  const { data } = await kakaoClient.get<KakaoBookSearchResponse>('/v3/search/book', {
    params: { query, target, page, size },
    signal,
  });
  return toBookSearchResult(data);
}
