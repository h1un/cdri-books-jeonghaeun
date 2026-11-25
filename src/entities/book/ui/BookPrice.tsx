import { cn } from '@/shared/lib/cn';

import { formatBookPrice, hasDiscount } from '../lib/price';

import type { Book } from '../model';

type BookPriceProps = {
  book: Pick<Book, 'price' | 'salePrice'>;
};

/** 펼친 아이템의 가격 영역. 할인가가 없으면 할인가 줄을 숨기고 원가를 취소선 없이 보여준다. */
export function BookPrice({ book }: BookPriceProps) {
  const isDiscounted = hasDiscount(book);

  return (
    <dl className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <dt className="text-small font-medium text-text-subtitle">원가</dt>
        <dd className={cn('text-title3', isDiscounted && 'font-normal line-through')}>
          {formatBookPrice(book.price)}
        </dd>
      </div>
      {isDiscounted && (
        <div className="flex items-center gap-2">
          <dt className="text-small font-medium text-text-subtitle">할인가</dt>
          <dd className="text-title3 font-bold">{formatBookPrice(book.salePrice)}</dd>
        </div>
      )}
    </dl>
  );
}
