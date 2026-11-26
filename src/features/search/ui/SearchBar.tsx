import { type FocusEvent, type SubmitEvent, useRef, useState } from 'react';

import { useDismiss } from '@/shared/hooks/useDismiss';
import { cn } from '@/shared/lib/cn';
import { SearchIcon } from '@/shared/ui/icons/icons';

import { useSearchHistoryStore } from '../model/searchHistoryStore';
import { SearchHistoryList } from './SearchHistoryList';

type SearchBarProps = {
  defaultQuery: string;
  onSearch: (query: string) => void;
};

/**
 * 메인 검색창. Enter로 검색하고, 포커스되면 최근 검색어를 보여준다.
 * 검색 조건이 바뀌면 부모가 key를 바꿔 입력값을 다시 초기화한다. (동기화용 useEffect 없이)
 */
export function SearchBar({ defaultQuery, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const histories = useSearchHistoryStore((state) => state.histories);
  const addHistory = useSearchHistoryStore((state) => state.add);
  const removeHistory = useSearchHistoryStore((state) => state.remove);

  const isHistoryVisible = isHistoryOpen && histories.length > 0;
  useDismiss(containerRef, () => setIsHistoryOpen(false), isHistoryOpen);

  function search(rawQuery: string) {
    const trimmedQuery = rawQuery.trim();
    if (trimmedQuery === '') return;

    addHistory(trimmedQuery);
    setQuery(trimmedQuery);
    setIsHistoryOpen(false);
    inputRef.current?.blur();
    onSearch(trimmedQuery);
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    search(query);
  }

  /** 키보드(Tab)로 검색창 밖으로 나가면 기록을 닫는다. */
  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const nextFocused = event.relatedTarget;
    if (nextFocused instanceof Node && event.currentTarget.contains(nextFocused)) return;
    setIsHistoryOpen(false);
  }

  return (
    <div ref={containerRef} onBlur={handleBlur} className="relative h-[50px] w-full max-w-[480px]">
      <form
        role="search"
        onSubmit={handleSubmit}
        className={cn(
          'absolute inset-x-0 top-0 rounded-[25px] bg-light-gray',
          isHistoryVisible && 'z-30 rounded-3xl shadow-sm',
        )}
      >
        <div className="flex h-[50px] items-center gap-[11px] px-2.5">
          <SearchIcon size={30} className="shrink-0 text-text-primary" />
          <input
            ref={inputRef}
            // type="search"는 ESC를 누르면 입력값을 비우는 기본 동작이 있어, 기록 목록을 닫으려던 입력까지 지워진다.
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setIsHistoryOpen(true)}
            onClick={() => setIsHistoryOpen(true)}
            placeholder="검색어를 입력하세요"
            aria-label="도서 검색어"
            enterKeyHint="search"
            className="h-full min-w-0 flex-1 bg-transparent text-caption font-medium text-text-primary outline-none placeholder:text-text-subtitle"
          />
        </div>
        {isHistoryVisible && (
          <SearchHistoryList histories={histories} onSelect={search} onRemove={removeHistory} />
        )}
      </form>
    </div>
  );
}
