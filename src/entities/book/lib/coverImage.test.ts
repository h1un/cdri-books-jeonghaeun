import { describe, expect, it } from 'vitest';

import { toCoverImageUrl } from './coverImage';

const THUMBNAIL =
  'https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F540378%3Ftimestamp%3D20240101';

describe('toCoverImageUrl', () => {
  it('썸네일의 원본 이미지 주소(fname)를 https로 바꿔 돌려준다', () => {
    expect(toCoverImageUrl(THUMBNAIL)).toBe(
      'https://t1.daumcdn.net/lbook/image/540378?timestamp=20240101',
    );
  });

  it('fname이 없으면 썸네일을 그대로 쓴다', () => {
    const thumbnail = 'https://search1.kakaocdn.net/thumb/R120x174.q85/';
    expect(toCoverImageUrl(thumbnail)).toBe(thumbnail);
  });

  it('주소 형식이 잘못되면 썸네일을 그대로 쓴다', () => {
    expect(toCoverImageUrl('not-a-url')).toBe('not-a-url');
  });

  it('썸네일이 없으면 null', () => {
    expect(toCoverImageUrl(null)).toBeNull();
  });
});
