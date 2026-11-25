import { BookListSkeleton } from '@/entities/book';
import { Header } from '@/widgets/header/Header';

/** 지연 로딩되는 페이지(찜 페이지)로 바로 진입했을 때, 청크를 불러오는 동안 보여줄 화면 */
export function RouteFallback() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[960px] px-4 pt-20 pb-20 lg:px-0">
        <BookListSkeleton />
      </main>
    </>
  );
}
