import type { FavoriteBook } from '@/features/favorites';
import { EmptyState } from '@/shared/ui/EmptyState';
import { BookList } from '@/widgets/book-list/BookList';
import { useClientPagination } from '@/widgets/book-list/useClientPagination';

type FavoriteBookListProps = {
  books: readonly FavoriteBook[];
};

export function FavoriteBookList({ books }: FavoriteBookListProps) {
  const { visibleItems, hasNextPage, loadMore } = useClientPagination(books);

  if (books.length === 0) return <EmptyState message="찜한 책이 없습니다." />;

  return (
    <BookList
      books={visibleItems}
      hasNextPage={hasNextPage}
      isFetchingNextPage={false}
      onLoadMore={loadMore}
    />
  );
}
