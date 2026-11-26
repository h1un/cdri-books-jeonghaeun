import { CloseIcon } from '@/shared/ui/icons/icons';

type SearchHistoryListProps = {
  histories: readonly string[];
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
};

export function SearchHistoryList({ histories, onSelect, onRemove }: SearchHistoryListProps) {
  return (
    // Safari·macOS Firefox는 버튼을 클릭해도 포커스를 주지 않아, 검색창이 먼저 blur되며 목록이 닫히고
    // click이 사라진다. mousedown 기본 동작을 막아 클릭하는 동안 검색창 포커스를 유지한다.
    <ul aria-label="최근 검색어" onMouseDown={(event) => event.preventDefault()} className="pb-4">
      {histories.map((history) => (
        <li key={history} className="flex h-10 items-center gap-4 pr-6 pl-[51px]">
          <button
            type="button"
            onClick={() => onSelect(history)}
            className="min-w-0 flex-1 truncate text-left text-caption text-text-subtitle hover:text-text-primary"
          >
            {history}
          </button>
          <button
            type="button"
            aria-label={`${history} 검색 기록 삭제`}
            onClick={() => onRemove(history)}
            className="shrink-0 text-text-primary hover:text-text-secondary"
          >
            <CloseIcon size={24} />
          </button>
        </li>
      ))}
    </ul>
  );
}
