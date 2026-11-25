import { CloseIcon } from '@/shared/ui/icons/icons';

type SearchHistoryListProps = {
  histories: readonly string[];
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
};

export function SearchHistoryList({ histories, onSelect, onRemove }: SearchHistoryListProps) {
  return (
    <ul aria-label="최근 검색어" className="pb-4">
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
