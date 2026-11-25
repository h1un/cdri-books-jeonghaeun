import { type Book, toCoverImageUrl } from '@/entities/book';

/** 찜한 시점의 책 데이터 스냅샷. (Figma: 찜한 시점의 데이터를 가지므로 API 결과와 다를 수 있음) */
export type FavoriteBook = Book & {
  savedAt: number;
};

export type FavoritesById = Record<string, FavoriteBook>;

/** 찜 페이지에서 해제했다가 다시 찜하면 원래 순서를 유지하도록 savedAt을 함께 받을 수 있다. */
export type FavoriteCandidate = Book & {
  savedAt?: number;
};

function omitFavorite(favoritesById: FavoritesById, bookId: string): FavoritesById {
  return Object.fromEntries(Object.entries(favoritesById).filter(([id]) => id !== bookId));
}

export function toggleFavorite(
  favoritesById: FavoritesById,
  book: FavoriteCandidate,
  now: number,
): FavoritesById {
  if (Object.hasOwn(favoritesById, book.id)) return omitFavorite(favoritesById, book.id);

  return {
    ...favoritesById,
    [book.id]: { ...book, savedAt: book.savedAt ?? now },
  };
}

/** 최근에 찜한 책이 먼저 오도록 정렬한다. */
export function sortFavorites(favoritesById: FavoritesById): FavoriteBook[] {
  return Object.values(favoritesById).toSorted((a, b) => b.savedAt - a.savedAt);
}

type FavoriteBookV1 = Omit<FavoriteBook, 'coverImage'> & { coverImage?: string | null };

/** v1에는 펼친 표지용 coverImage가 없어, 저장된 썸네일에서 원본 이미지 주소를 채운다. */
export function migrateFavoritesV1(favoritesById: Record<string, FavoriteBookV1>): FavoritesById {
  return Object.fromEntries(
    Object.entries(favoritesById).map(([id, book]) => [
      id,
      { ...book, coverImage: book.coverImage ?? toCoverImageUrl(book.thumbnail) },
    ]),
  );
}
