import type { FavoriteCandidate } from '@/features/favorites';

import { BookListRow } from './BookListRow';
import { useExpandedIds } from './useExpandedIds';

type BookListProps = {
  books: readonly FavoriteCandidate[];
};

export function BookList({ books }: BookListProps) {
  const { expandedIds, toggleExpanded } = useExpandedIds();

  return (
    <ul aria-label="도서 목록">
      {books.map((book) => (
        <li key={book.id}>
          <BookListRow
            book={book}
            isExpanded={expandedIds.has(book.id)}
            onToggleExpand={toggleExpanded}
          />
        </li>
      ))}
    </ul>
  );
}
