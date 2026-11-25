import { describe, expect, it } from 'vitest';

import { getFullSearchQuery, parseSearchCondition, toSearchParams } from './searchCondition';

describe('parseSearchCondition', () => {
  it('q만 있으면 전체 검색', () => {
    expect(parseSearchCondition(new URLSearchParams('q=하루키'))).toEqual({ query: '하루키' });
  });

  it('q와 올바른 target이 있으면 상세 검색', () => {
    expect(parseSearchCondition(new URLSearchParams('q=하루키&target=person'))).toEqual({
      query: '하루키',
      target: 'person',
    });
  });

  it('알 수 없는 target은 무시한다', () => {
    expect(parseSearchCondition(new URLSearchParams('q=하루키&target=isbn'))).toEqual({
      query: '하루키',
    });
  });

  it('검색어가 비어 있으면 검색하지 않는 상태', () => {
    expect(parseSearchCondition(new URLSearchParams('q=%20%20&target=title'))).toEqual({
      query: '',
    });
  });
});

describe('toSearchParams', () => {
  it('전체 검색은 target을 넣지 않는다', () => {
    expect(toSearchParams({ query: '하루키' }).toString()).toBe(
      new URLSearchParams({ q: '하루키' }).toString(),
    );
  });

  it('상세 검색은 target을 함께 넣는다', () => {
    expect(toSearchParams({ query: '민음사', target: 'publisher' }).get('target')).toBe(
      'publisher',
    );
  });
});

describe('getFullSearchQuery', () => {
  it('전체 검색 중이면 검색어를 보여준다', () => {
    expect(getFullSearchQuery({ query: '하루키' })).toBe('하루키');
  });

  it('상세 검색 중이면 메인 검색창을 비운다 (상호 초기화)', () => {
    expect(getFullSearchQuery({ query: '하루키', target: 'person' })).toBe('');
  });
});
