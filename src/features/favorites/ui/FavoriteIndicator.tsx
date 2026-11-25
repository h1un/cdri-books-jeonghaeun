import { HeartFillIcon } from '@/shared/ui/icons/icons';

import { useIsFavorite } from '../model/favoriteStore';

type FavoriteIndicatorProps = {
  bookId: string;
};

/** 접힌 아이템 썸네일 위의 찜 표시. 표시 전용이며 찜/해제는 펼친 상태의 하트로 한다. */
export function FavoriteIndicator({ bookId }: FavoriteIndicatorProps) {
  const isFavorite = useIsFavorite(bookId);

  if (!isFavorite) return null;

  return <HeartFillIcon size={16} role="img" aria-label="찜한 책" className="text-red" />;
}
