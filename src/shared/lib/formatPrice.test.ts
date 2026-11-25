import { describe, expect, it } from 'vitest';

import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('천 단위 구분 기호와 "원"을 붙인다', () => {
    expect(formatPrice(13500)).toBe('13,500원');
    expect(formatPrice(1234567)).toBe('1,234,567원');
  });

  it('1,000 미만은 구분 기호 없이 표시한다', () => {
    expect(formatPrice(900)).toBe('900원');
  });
});
