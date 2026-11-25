import { describe, expect, it } from 'vitest';

import { toBook, toBookSearchResult } from './mapper';

import type { KakaoBookDocument } from './kakaoBook.dto';

function createDocument(overrides: Partial<KakaoBookDocument> = {}): KakaoBookDocument {
  return {
    title: '노르웨이의 숲',
    contents: '무라카미 하루키의 대표작',
    url: 'https://search.daum.net/search?w=bookpage&bookId=1',
    isbn: '8937434482 9788937434488',
    datetime: '2017-08-07T00:00:00.000+09:00',
    authors: ['무라카미 하루키'],
    publisher: '민음사',
    translators: ['양억관'],
    price: 17000,
    sale_price: 15300,
    thumbnail: 'https://search1.kakaocdn.net/thumb/1.jpg',
    status: '정상판매',
    ...overrides,
  };
}

describe('toBook', () => {
  it('응답을 camelCase 앱 타입으로 변환한다', () => {
    expect(toBook(createDocument())).toEqual({
      id: '9788937434488',
      title: '노르웨이의 숲',
      authors: ['무라카미 하루키'],
      publisher: '민음사',
      contents: '무라카미 하루키의 대표작',
      thumbnail: 'https://search1.kakaocdn.net/thumb/1.jpg',
      coverImage: 'https://search1.kakaocdn.net/thumb/1.jpg',
      url: 'https://search.daum.net/search?w=bookpage&bookId=1',
      price: 17000,
      salePrice: 15300,
    });
  });

  describe('id', () => {
    it('ISBN10과 ISBN13이 함께 오면 ISBN13을 사용한다', () => {
      expect(toBook(createDocument({ isbn: '8937434482 9788937434488' })).id).toBe('9788937434488');
    });

    it('ISBN이 하나만 오면 그 값을 사용한다', () => {
      expect(toBook(createDocument({ isbn: '9788937434488' })).id).toBe('9788937434488');
    });

    it('ISBN이 없으면 상세페이지 URL을 사용한다', () => {
      const url = 'https://search.daum.net/search?w=bookpage&bookId=2';
      expect(toBook(createDocument({ isbn: '', url })).id).toBe(url);
    });
  });

  it('할인가가 없으면(-1) salePrice는 null이다', () => {
    expect(toBook(createDocument({ sale_price: -1 })).salePrice).toBeNull();
  });

  it('정가가 0이면 가격 정보 없음(null)으로 본다', () => {
    expect(toBook(createDocument({ price: 0 })).price).toBeNull();
  });

  it('빈 썸네일과 빈 책 소개는 null로 바꾼다', () => {
    const book = toBook(createDocument({ thumbnail: '', contents: '  ' }));
    expect(book.thumbnail).toBeNull();
    expect(book.coverImage).toBeNull();
    expect(book.contents).toBeNull();
  });
});

describe('toBookSearchResult', () => {
  it('meta에서 총 건수와 마지막 페이지 여부를 꺼낸다', () => {
    const result = toBookSearchResult({
      meta: { total_count: 21, pageable_count: 21, is_end: false },
      documents: [createDocument()],
    });

    expect(result.totalCount).toBe(21);
    expect(result.isEnd).toBe(false);
    expect(result.books).toHaveLength(1);
  });
});
