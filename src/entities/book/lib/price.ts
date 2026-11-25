import type { Book } from '../model';

/** 할인가가 있으면 원가·할인가를 함께 보여준다. (Figma: 할인가가 없으면 미노출) */
export function hasDiscount(book: Pick<Book, 'salePrice'>) {
  return book.salePrice !== null;
}

/** 목록(접힌 상태)에 보여줄 가격: 실제 결제 금액인 할인가를 우선한다. */
export function getDisplayPrice(book: Pick<Book, 'price' | 'salePrice'>) {
  return book.salePrice ?? book.price;
}
