import type { SearchTarget } from '../model';

export const bookQueryKeys = {
  all: ['books'] as const,
  search: (condition: { query: string; target?: SearchTarget }) =>
    [...bookQueryKeys.all, 'search', condition] as const,
};
