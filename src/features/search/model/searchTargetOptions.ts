import { SEARCH_TARGET, type SearchTarget } from '@/entities/book';
import type { SelectOption } from '@/shared/ui/Select';

export const DEFAULT_SEARCH_TARGET: SearchTarget = 'title';

export const SEARCH_TARGET_OPTIONS: readonly SelectOption<SearchTarget>[] = [
  { value: 'title', label: SEARCH_TARGET.title },
  { value: 'person', label: SEARCH_TARGET.person },
  { value: 'publisher', label: SEARCH_TARGET.publisher },
];
