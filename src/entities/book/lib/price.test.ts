import { describe, expect, it } from 'vitest';

import { formatBookPrice, getDisplayPrice, hasDiscount } from './price';

describe('hasDiscount', () => {
  it('할인가가 있으면 true', () => {
    expect(hasDiscount({ salePrice: 13500 })).toBe(true);
  });

  it('할인가가 없으면 false', () => {
    expect(hasDiscount({ salePrice: null })).toBe(false);
  });
});

describe('getDisplayPrice', () => {
  it('할인가가 있으면 할인가를 보여준다', () => {
    expect(getDisplayPrice({ price: 16000, salePrice: 13500 })).toBe(13500);
  });

  it('할인가가 없으면 정가를 보여준다', () => {
    expect(getDisplayPrice({ price: 16000, salePrice: null })).toBe(16000);
  });

  it('둘 다 없으면 null', () => {
    expect(getDisplayPrice({ price: null, salePrice: null })).toBeNull();
  });
});

describe('formatBookPrice', () => {
  it('가격을 원 단위로 표시한다', () => {
    expect(formatBookPrice(13500)).toBe('13,500원');
  });

  it('가격이 없으면 대체 문구를 보여준다', () => {
    expect(formatBookPrice(null)).toBe('가격 정보 없음');
  });
});
