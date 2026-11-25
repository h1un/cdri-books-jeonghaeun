import { describe, expect, it } from 'vitest';

import { getNextBookPage } from './pagination';

describe('getNextBookPage', () => {
  it('마지막 페이지가 아니면 다음 페이지 번호를 돌려준다', () => {
    expect(getNextBookPage({ isEnd: false }, 1)).toBe(2);
  });

  it('마지막 페이지면 undefined', () => {
    expect(getNextBookPage({ isEnd: true }, 3)).toBeUndefined();
  });

  it('API 최대 페이지(50)에 도달하면 더 요청하지 않는다', () => {
    expect(getNextBookPage({ isEnd: false }, 50)).toBeUndefined();
  });
});
