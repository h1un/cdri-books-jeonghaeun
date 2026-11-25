import { toCoverImageUrl } from '../lib/coverImage';

import type { Book, BookSearchResult } from '../model';
import type { KakaoBookDocument, KakaoBookSearchResponse } from './kakaoBook.dto';

/** ISBN13을 우선 사용하고, ISBN이 없으면 상세페이지 URL로 식별한다. */
function toBookId({ isbn, url }: Pick<KakaoBookDocument, 'isbn' | 'url'>) {
  const isbns = isbn.split(' ').filter((value) => value !== '');
  return isbns.at(-1) ?? url;
}

function toPositivePrice(price: number) {
  return price > 0 ? price : null;
}

function toNonEmptyString(value: string) {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

export function toBook(document: KakaoBookDocument): Book {
  const thumbnail = toNonEmptyString(document.thumbnail);

  return {
    id: toBookId(document),
    title: document.title,
    authors: document.authors,
    publisher: document.publisher,
    contents: toNonEmptyString(document.contents),
    thumbnail,
    coverImage: toCoverImageUrl(thumbnail),
    url: document.url,
    price: toPositivePrice(document.price),
    salePrice: toPositivePrice(document.sale_price),
  };
}

export function toBookSearchResult(response: KakaoBookSearchResponse): BookSearchResult {
  return {
    books: response.documents.map(toBook),
    totalCount: response.meta.total_count,
    isEnd: response.meta.is_end,
  };
}
