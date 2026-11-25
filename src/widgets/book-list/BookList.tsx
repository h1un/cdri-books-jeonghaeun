import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useEffectEvent, useRef } from 'react';

import type { FavoriteCandidate } from '@/features/favorites';
import { useDocumentOffsetTop } from '@/shared/hooks/useDocumentOffsetTop';

import { BookListRow } from './BookListRow';
import { LoadingMore } from './LoadingMore';
import { useExpandedIds } from './useExpandedIds';

/** 접힌 아이템 높이. 펼친 아이템은 measureElement로 실제 높이를 잰다. */
const ESTIMATED_ROW_HEIGHT = 100;
const OVERSCAN = 5;
/** 마지막에서 몇 번째 아이템이 화면에 보일 때 다음 페이지를 미리 불러올지 (overscan 제외) */
const PREFETCH_OFFSET = 3;

type BookListProps = {
  books: readonly FavoriteCandidate[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
};

/**
 * 창 스크롤 기반 가상 스크롤 목록. 화면 근처의 아이템만 DOM에 그린다.
 * - 펼친 아이템은 높이가 달라 measureElement로 실제 높이를 측정한다.
 * - 펼침 상태는 목록이 들고 있어, 스크롤로 아이템이 언마운트됐다 돌아와도 유지된다.
 * - 마지막 아이템 근처가 화면에 보이면 다음 페이지를 요청한다.
 */
export function BookList({ books, hasNextPage, isFetchingNextPage, onLoadMore }: BookListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const scrollMargin = useDocumentOffsetTop(listRef);
  const { expandedIds, toggleExpanded } = useExpandedIds();

  const virtualizer = useWindowVirtualizer({
    count: books.length,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: OVERSCAN,
    scrollMargin,
    getItemKey: (index) => books[index]?.id ?? index,
  });

  const virtualItems = virtualizer.getVirtualItems();
  // overscan으로 미리 그린 아이템이 아니라 실제로 화면에 보이는 범위를 기준으로 판단한다.
  const lastVisibleIndex = virtualizer.range?.endIndex ?? -1;
  const isNearEnd = lastVisibleIndex >= books.length - PREFETCH_OFFSET;

  const loadMore = useEffectEvent(onLoadMore);

  useEffect(() => {
    if (isNearEnd && hasNextPage && !isFetchingNextPage) loadMore();
  }, [isNearEnd, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <ul
        ref={listRef}
        aria-label="도서 목록"
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualItems.map((virtualItem) => {
          const book = books[virtualItem.index];
          if (book === undefined) return null;

          return (
            <li
              key={virtualItem.key}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              aria-setsize={books.length}
              aria-posinset={virtualItem.index + 1}
              className="absolute top-0 left-0 w-full"
              style={{ transform: `translateY(${virtualItem.start - scrollMargin}px)` }}
            >
              <BookListRow
                book={book}
                isExpanded={expandedIds.has(book.id)}
                onToggleExpand={toggleExpanded}
              />
            </li>
          );
        })}
      </ul>
      {isFetchingNextPage && <LoadingMore />}
    </>
  );
}
