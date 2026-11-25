import { getFullSearchQuery, SearchBar, useSearchCondition } from '@/features/search';
import { SearchResult } from '@/widgets/search-result/SearchResult';

export function SearchPage() {
  const { condition, searchAll } = useSearchCondition();
  const fullSearchQuery = getFullSearchQuery(condition);
  // 조건이 바뀌면(뒤로가기, 상세 검색 등) 검색창을 새로 마운트해 입력값을 조건과 맞춘다.
  const searchBarKey = `${condition.target ?? 'all'}:${condition.query}`;

  return (
    <>
      <h2 className="text-title2 font-bold">도서 검색</h2>
      <div className="mt-7 flex items-center gap-4">
        <SearchBar key={searchBarKey} defaultQuery={fullSearchQuery} onSearch={searchAll} />
      </div>
      <SearchResult key={searchBarKey} condition={condition} />
    </>
  );
}
