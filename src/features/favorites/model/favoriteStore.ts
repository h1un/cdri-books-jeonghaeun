import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { syncAcrossTabs } from '@/shared/lib/syncAcrossTabs';

import {
  sortFavorites,
  toggleFavorite,
  type FavoriteCandidate,
  type FavoritesById,
} from './favorites';

export const FAVORITES_STORAGE_KEY = 'cdri-books:favorites';

type FavoriteState = {
  favoritesById: FavoritesById;
  toggle: (book: FavoriteCandidate) => void;
};

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set) => ({
      favoritesById: {},
      toggle: (book) => {
        set((state) => ({
          favoritesById: toggleFavorite(state.favoritesById, book, Date.now()),
        }));
      },
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      version: 1,
      partialize: (state) => ({ favoritesById: state.favoritesById }),
    },
  ),
);

syncAcrossTabs(FAVORITES_STORAGE_KEY, () => useFavoriteStore.persist.rehydrate());

/** 해당 책의 찜 여부만 구독해, 다른 책의 하트가 바뀌어도 리렌더되지 않는다. */
export function useIsFavorite(bookId: string) {
  return useFavoriteStore((state) => Object.hasOwn(state.favoritesById, bookId));
}

export function useFavoriteCount() {
  return useFavoriteStore((state) => Object.keys(state.favoritesById).length);
}

export function useToggleFavorite() {
  return useFavoriteStore((state) => state.toggle);
}

/** 컴포넌트 밖이나 초기값 계산처럼 구독이 필요 없는 곳에서 현재 찜 목록을 읽는다. */
export function getSortedFavorites() {
  return sortFavorites(useFavoriteStore.getState().favoritesById);
}
