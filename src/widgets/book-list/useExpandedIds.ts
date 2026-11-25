import { useCallback, useState } from 'react';

/** 펼친 아이템 id 집합. 아이템이 아니라 목록이 들고 있어야 스크롤로 언마운트돼도 유지된다. */
export function useExpandedIds() {
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(() => new Set());

  const toggleExpanded = useCallback((bookId: string) => {
    setExpandedIds((previous) => {
      const next = new Set(previous);
      if (next.has(bookId)) next.delete(bookId);
      else next.add(bookId);
      return next;
    });
  }, []);

  return { expandedIds, toggleExpanded };
}
