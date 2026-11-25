import { useState } from 'react';

import { getSortedFavorites, useFavoriteCount } from '@/features/favorites';
import { ResultCount } from '@/shared/ui/ResultCount';
import { FavoriteBookList } from '@/widgets/favorite-book-list/FavoriteBookList';

export function FavoritesPage() {
  // 페이지에 들어온 시점의 찜 목록을 고정한다. 하트를 해제해도 새로고침·재진입 전까지 목록에 남아
  // 실수로 해제했을 때 같은 자리에서 되돌릴 수 있고, 아래 항목이 당겨지며 잘못 누르는 일도 막는다.
  const [displayedBooks] = useState(getSortedFavorites);
  const favoriteCount = useFavoriteCount();

  return (
    <>
      <h2 className="text-title2 font-bold">내가 찜한 책</h2>
      <section aria-label="찜한 책 목록" className="mt-2">
        <ResultCount label="찜한 책" count={favoriteCount} />
        <div className="mt-6">
          <FavoriteBookList books={displayedBooks} />
        </div>
      </section>
    </>
  );
}
