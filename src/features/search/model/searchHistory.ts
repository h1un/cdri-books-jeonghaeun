export const MAX_SEARCH_HISTORY = 8;

/** 최신 검색어를 맨 앞에 두고, 같은 검색어는 맨 앞으로 옮기며, 8개를 넘으면 오래된 것부터 지운다. */
export function addSearchHistory(histories: readonly string[], query: string) {
  return [query, ...histories.filter((history) => history !== query)].slice(0, MAX_SEARCH_HISTORY);
}

export function removeSearchHistory(histories: readonly string[], query: string) {
  return histories.filter((history) => history !== query);
}
