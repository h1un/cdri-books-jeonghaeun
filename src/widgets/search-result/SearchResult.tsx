import { BookListSkeleton } from '@/entities/book';
import { type SearchCondition, useBookSearch } from '@/features/search';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { BookList } from '@/widgets/book-list/BookList';

import { SearchResultLayout } from './SearchResultLayout';

const EMPTY_MESSAGE = '검색된 결과가 없습니다.';

type SearchResultProps = {
  condition: SearchCondition;
};

export function SearchResult({ condition }: SearchResultProps) {
  const { data, status, refetch } = useBookSearch(condition);

  if (condition.query === '') {
    return (
      <SearchResultLayout totalCount={0}>
        <EmptyState message={EMPTY_MESSAGE} />
      </SearchResultLayout>
    );
  }

  if (status === 'pending') {
    return (
      <SearchResultLayout totalCount={0}>
        <BookListSkeleton />
      </SearchResultLayout>
    );
  }

  if (status === 'error') {
    return (
      <SearchResultLayout totalCount={0}>
        <ErrorState message="검색 결과를 불러오지 못했습니다." onRetry={() => void refetch()} />
      </SearchResultLayout>
    );
  }

  if (data.books.length === 0) {
    return (
      <SearchResultLayout totalCount={0}>
        <EmptyState message={EMPTY_MESSAGE} />
      </SearchResultLayout>
    );
  }

  return (
    <SearchResultLayout totalCount={data.totalCount}>
      <BookList books={data.books} />
    </SearchResultLayout>
  );
}
