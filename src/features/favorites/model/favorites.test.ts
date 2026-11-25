import { describe, expect, it } from 'vitest';

import type { Book } from '@/entities/book';

import { sortFavorites, toggleFavorite, type FavoritesById } from './favorites';

function createBook(id: string): Book {
  return {
    id,
    title: `책 ${id}`,
    authors: ['저자'],
    publisher: '출판사',
    contents: null,
    thumbnail: null,
    url: `https://example.com/${id}`,
    price: 10000,
    salePrice: 9000,
  };
}

describe('toggleFavorite', () => {
  it('찜하지 않은 책이면 현재 시각과 함께 추가한다', () => {
    const result = toggleFavorite({}, createBook('a'), 100);

    expect(result.a).toEqual({ ...createBook('a'), savedAt: 100 });
  });

  it('이미 찜한 책이면 제거한다', () => {
    const favorites = toggleFavorite({}, createBook('a'), 100);

    expect(toggleFavorite(favorites, createBook('a'), 200)).toEqual({});
  });

  it('여러 번 눌러도 누른 횟수대로 정확히 토글된다 (홀수: 찜, 짝수: 해제)', () => {
    const book = createBook('a');
    let favorites: FavoritesById = {};

    for (let count = 1; count <= 5; count += 1) {
      favorites = toggleFavorite(favorites, book, count);
      expect(Object.hasOwn(favorites, 'a')).toBe(count % 2 === 1);
    }
  });

  it('찜한 시점의 스냅샷을 저장해 원본 객체가 바뀌어도 영향을 받지 않는다', () => {
    const book = createBook('a');
    const favorites = toggleFavorite({}, book, 100);
    book.title = '바뀐 제목';

    expect(favorites.a?.title).toBe('책 a');
  });

  it('savedAt이 있는 책을 다시 찜하면 원래 savedAt을 유지한다 (찜 페이지 순서 유지)', () => {
    const saved = { ...createBook('a'), savedAt: 100 };

    expect(toggleFavorite({}, saved, 999).a?.savedAt).toBe(100);
  });
});

describe('sortFavorites', () => {
  it('최근에 찜한 순서로 정렬한다', () => {
    let favorites: FavoritesById = {};
    favorites = toggleFavorite(favorites, createBook('old'), 1);
    favorites = toggleFavorite(favorites, createBook('new'), 3);
    favorites = toggleFavorite(favorites, createBook('mid'), 2);

    expect(sortFavorites(favorites).map((book) => book.id)).toEqual(['new', 'mid', 'old']);
  });
});
