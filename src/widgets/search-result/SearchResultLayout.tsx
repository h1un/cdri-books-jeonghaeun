import { ResultCount } from '@/shared/ui/ResultCount';

import type { ReactNode } from 'react';

type SearchResultLayoutProps = {
  totalCount: number;
  children: ReactNode;
};

export function SearchResultLayout({ totalCount, children }: SearchResultLayoutProps) {
  return (
    <section aria-label="도서 검색 결과" className="mt-6">
      <ResultCount label="도서 검색 결과" count={totalCount} />
      <div className="mt-9">{children}</div>
    </section>
  );
}
