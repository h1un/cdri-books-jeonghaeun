import { SEARCH_TARGET, type SearchTarget } from '@/entities/book';

import { DEFAULT_SEARCH_TARGET } from './searchTargetOptions';

/**
 * 검색 조건. 전체 검색은 `{ query }`, 상세 검색은 `{ query, target }`.
 * 하나의 값으로 덮어쓰기 때문에 두 검색이 동시에 적용되는 상태가 생기지 않는다. (Figma: 동시 진행 불가)
 */
export type SearchCondition = {
  query: string;
  target?: SearchTarget;
};

const QUERY_PARAM = 'q';
const TARGET_PARAM = 'target';

function isSearchTarget(value: string | null): value is SearchTarget {
  return value !== null && Object.hasOwn(SEARCH_TARGET, value);
}

/** URL의 검색 조건을 읽는다. 알 수 없는 target은 무시하고 전체 검색으로 본다. */
export function parseSearchCondition(searchParams: URLSearchParams): SearchCondition {
  const query = (searchParams.get(QUERY_PARAM) ?? '').trim();
  const target = searchParams.get(TARGET_PARAM);

  if (query === '') return { query: '' };
  if (isSearchTarget(target)) return { query, target };
  return { query };
}

export function toSearchParams({ query, target }: SearchCondition) {
  const searchParams = new URLSearchParams({ [QUERY_PARAM]: query });
  if (target !== undefined) searchParams.set(TARGET_PARAM, target);
  return searchParams;
}

/** 메인 검색창에 보여줄 값. 상세 검색 중이면 메인 검색창은 비운다. */
export function getFullSearchQuery(condition: SearchCondition) {
  if (condition.target !== undefined) return '';
  return condition.query;
}

/** 상세 검색 팝업의 초기값. 상세 검색 중이면 현재 조건을, 아니면 기본값(제목, 빈 검색어)을 쓴다. */
export function getDetailSearchDefaults(condition: SearchCondition) {
  if (condition.target === undefined) return { target: DEFAULT_SEARCH_TARGET, query: '' };
  return { target: condition.target, query: condition.query };
}
