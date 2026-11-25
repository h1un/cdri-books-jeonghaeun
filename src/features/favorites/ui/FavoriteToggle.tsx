import { cn } from '@/shared/lib/cn';
import { HeartFillIcon, HeartLineIcon } from '@/shared/ui/icons/icons';

import { useIsFavorite, useToggleFavorite } from '../model/favoriteStore';

import type { FavoriteCandidate } from '../model/favorites';

type FavoriteToggleProps = {
  book: FavoriteCandidate;
};

/**
 * 펼친 아이템 표지 위의 찜 버튼.
 * 로컬 저장소에 동기적으로 반영되어 경쟁 상태가 없으므로 연타를 막지 않고 누를 때마다 토글한다.
 */
export function FavoriteToggle({ book }: FavoriteToggleProps) {
  const isFavorite = useIsFavorite(book.id);
  const toggleFavorite = useToggleFavorite();
  const Icon = isFavorite ? HeartFillIcon : HeartLineIcon;

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={`${book.title} 찜하기`}
      onClick={() => toggleFavorite(book)}
      className={cn(
        'flex touch-manipulation items-center justify-center text-red select-none',
        'transition-transform duration-150 active:scale-90',
        'drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]',
      )}
    >
      <Icon size={24} />
    </button>
  );
}
