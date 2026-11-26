import { BookListSkeleton } from '@/entities/book';
import { type SearchCondition, useBookSearch } from '@/features/search';
import { MissingEnvError } from '@/shared/config/env';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { BookList } from '@/widgets/book-list/BookList';

import { SearchResultLayout } from './SearchResultLayout';

const EMPTY_MESSAGE = '검색된 결과가 없습니다.';
const ERROR_MESSAGE = '검색 결과를 불러오지 못했습니다.';

/** 설정 문제(API 키 누락)는 원인을 그대로 보여주고, 그 밖의 오류는 공통 문구를 보여준다. */
function getErrorMessage(error: Error) {
  if (error instanceof MissingEnvError) return error.message;
  return ERROR_MESSAGE;
}

type SearchResultProps = {
  condition: SearchCondition;
};

export function SearchResult({ condition }: SearchResultProps) {
  const {
    data,
    error,
    status,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useBookSearch(condition);

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

  // 다음 페이지만 실패했다면 status는 'error'여도 데이터가 남아 있으므로 목록을 유지한다. (목록 끝에서 재시도)
  if (data === undefined) {
    return (
      <SearchResultLayout totalCount={0}>
        <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
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
      <BookList
        books={data.books}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoadMoreError={isFetchNextPageError}
        onLoadMore={() => void fetchNextPage()}
      />
    </SearchResultLayout>
  );
}
