import { formatPrice } from '@/shared/lib/formatPrice';

import type { Book } from '../model';

const PRICE_UNAVAILABLE_TEXT = '가격 정보 없음';

/**
 * 할인가가 정가보다 낮을 때만 할인으로 보고 원가·할인가를 함께 보여준다. (Figma: 할인가가 없으면 미노출)
 * 실제 응답에는 할인가가 정가와 같거나 더 비싼 책도 있어, 할인가가 있다는 것만으로는 판단하지 않는다.
 */
export function hasDiscount(book: Pick<Book, 'price' | 'salePrice'>) {
  return book.salePrice !== null && book.price !== null && book.salePrice < book.price;
}

/** 목록(접힌 상태)에 보여줄 가격. 펼친 화면의 최종 가격과 같도록 할인 중이면 할인가, 아니면 정가를 쓴다. */
export function getDisplayPrice(book: Pick<Book, 'price' | 'salePrice'>) {
  return hasDiscount(book) ? book.salePrice : book.price;
}

/** 가격이 없는 책(정가 0원)도 있어 대체 문구를 함께 처리한다. */
export function formatBookPrice(price: number | null) {
  if (price === null) return PRICE_UNAVAILABLE_TEXT;
  return formatPrice(price);
}
