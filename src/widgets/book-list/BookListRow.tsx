import { memo } from 'react';

import { BookListItem } from '@/entities/book';
import { type FavoriteCandidate, FavoriteIndicator, FavoriteToggle } from '@/features/favorites';

type BookListRowProps = {
  book: FavoriteCandidate;
  isExpanded: boolean;
  onToggleExpand: (bookId: string) => void;
};

/** 책 아이템에 찜 기능을 조합한다. memo로 감싸 다른 아이템의 펼침·찜 변경에 리렌더되지 않게 한다. */
function BookListRowComponent({ book, isExpanded, onToggleExpand }: BookListRowProps) {
  return (
    <BookListItem
      book={book}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      thumbnailOverlay={<FavoriteIndicator bookId={book.id} />}
      coverOverlay={<FavoriteToggle book={book} />}
    />
  );
}

export const BookListRow = memo(BookListRowComponent);
