import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import type { SearchTarget } from '@/entities/book';

import { parseSearchCondition, toSearchParams } from '../model/searchCondition';

/** 검색 조건을 URL에 둔다. 새로고침·뒤로가기·링크 공유 시에도 같은 결과를 보여주기 위해서다. */
export function useSearchCondition() {
  const [searchParams, setSearchParams] = useSearchParams();
  const condition = useMemo(() => parseSearchCondition(searchParams), [searchParams]);

  const searchAll = useCallback(
    (query: string) => setSearchParams(toSearchParams({ query })),
    [setSearchParams],
  );

  const searchDetail = useCallback(
    (query: string, target: SearchTarget) => setSearchParams(toSearchParams({ query, target })),
    [setSearchParams],
  );

  return { condition, searchAll, searchDetail };
}
