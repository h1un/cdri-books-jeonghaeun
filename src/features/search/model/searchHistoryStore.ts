import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { syncAcrossTabs } from '@/shared/lib/syncAcrossTabs';

import { addSearchHistory, removeSearchHistory } from './searchHistory';

export const SEARCH_HISTORY_STORAGE_KEY = 'cdri-books:search-history';

type SearchHistoryState = {
  histories: string[];
  add: (query: string) => void;
  remove: (query: string) => void;
};

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      histories: [],
      add: (query) => {
        set((state) => ({ histories: addSearchHistory(state.histories, query) }));
      },
      remove: (query) => {
        set((state) => ({ histories: removeSearchHistory(state.histories, query) }));
      },
    }),
    {
      name: SEARCH_HISTORY_STORAGE_KEY,
      version: 1,
      partialize: (state) => ({ histories: state.histories }),
    },
  ),
);

syncAcrossTabs(SEARCH_HISTORY_STORAGE_KEY, () => useSearchHistoryStore.persist.rehydrate());
