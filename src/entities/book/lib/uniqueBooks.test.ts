import { describe, expect, it } from 'vitest';

import { uniqueBooks } from './uniqueBooks';

import type { Book } from '../model';

function createBook(id: string, title = id): Book {
  return {
    id,
    title,
    authors: [],
    publisher: '',
    contents: null,
    thumbnail: null,
    url: `https://example.com/${id}`,
    price: 10000,
    salePrice: null,
  };
}

describe('uniqueBooks', () => {
  it('같은 id가 여러 번 나오면 처음 항목만 남긴다', () => {
    const books = [createBook('a', '첫 번째'), createBook('b'), createBook('a', '중복')];

    expect(uniqueBooks(books).map((book) => book.title)).toEqual(['첫 번째', 'b']);
  });

  it('중복이 없으면 순서를 그대로 유지한다', () => {
    const books = [createBook('a'), createBook('b'), createBook('c')];

    expect(uniqueBooks(books)).toEqual(books);
  });
});
