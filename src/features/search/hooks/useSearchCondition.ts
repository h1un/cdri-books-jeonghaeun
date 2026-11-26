import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import type { SearchTarget } from '@/entities/book';

import {
  parseSearchCondition,
  type SearchCondition,
  toSearchParams,
} from '../model/searchCondition';

/** 검색 조건을 URL에 둔다. 새로고침·뒤로가기·링크 공유 시에도 같은 결과를 보여주기 위해서다. */
export function useSearchCondition() {
  const [searchParams, setSearchParams] = useSearchParams();
  const condition = useMemo(() => parseSearchCondition(searchParams), [searchParams]);

  const search = useCallback(
    (nextCondition: SearchCondition) => {
      const nextSearchParams = toSearchParams(nextCondition);
      // 같은 조건으로 다시 검색하면 히스토리를 쌓지 않는다. (뒤로가기 한 번에 이전 검색으로 돌아가도록)
      const isSameCondition = nextSearchParams.toString() === searchParams.toString();
      setSearchParams(nextSearchParams, { replace: isSameCondition });
    },
    [searchParams, setSearchParams],
  );

  const searchAll = useCallback((query: string) => search({ query }), [search]);

  const searchDetail = useCallback(
    (query: string, target: SearchTarget) => search({ query, target }),
    [search],
  );

  return { condition, searchAll, searchDetail };
}
