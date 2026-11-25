import { describe, expect, it } from 'vitest';

import { addSearchHistory, MAX_SEARCH_HISTORY, removeSearchHistory } from './searchHistory';

describe('addSearchHistory', () => {
  it('새 검색어를 맨 앞에 추가한다', () => {
    expect(addSearchHistory(['하루키'], '노르웨이의 숲')).toEqual(['노르웨이의 숲', '하루키']);
  });

  it('이미 있는 검색어는 중복 없이 맨 앞으로 옮긴다', () => {
    expect(addSearchHistory(['a', 'b', 'c'], 'c')).toEqual(['c', 'a', 'b']);
  });

  it(`최대 ${MAX_SEARCH_HISTORY}개까지 저장하고, 넘치면 가장 오래된 검색어를 지운다`, () => {
    const histories = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const result = addSearchHistory(histories, '9');

    expect(result).toHaveLength(MAX_SEARCH_HISTORY);
    expect(result[0]).toBe('9');
    expect(result).not.toContain('1');
  });

  it('원본 배열을 변경하지 않는다', () => {
    const histories = ['a'];
    addSearchHistory(histories, 'b');

    expect(histories).toEqual(['a']);
  });
});

describe('removeSearchHistory', () => {
  it('해당 검색어만 지운다', () => {
    expect(removeSearchHistory(['a', 'b', 'c'], 'b')).toEqual(['a', 'c']);
  });
});
