import { type SubmitEvent, useState } from 'react';

import type { SearchTarget } from '@/entities/book';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';

import { SEARCH_TARGET_OPTIONS } from '../model/searchTargetOptions';

type DetailSearchFormProps = {
  defaultTarget: SearchTarget;
  defaultQuery: string;
  onSubmit: (query: string, target: SearchTarget) => void;
};

export function DetailSearchForm({ defaultTarget, defaultQuery, onSubmit }: DetailSearchFormProps) {
  const [target, setTarget] = useState(defaultTarget);
  const [query, setQuery] = useState(defaultQuery);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery === '') return;
    onSubmit(trimmedQuery, target);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-end gap-1">
        <Select
          value={target}
          options={SEARCH_TARGET_OPTIONS}
          onChange={setTarget}
          label="검색 기준"
          className="w-[100px] shrink-0"
        />
        <input
          // 사용자가 버튼으로 직접 연 팝업이므로 바로 입력할 수 있게 포커스를 옮긴다.
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="검색어 입력"
          aria-label="상세 검색어"
          className="h-9 min-w-0 flex-1 border-b border-primary px-2 text-body2 font-medium text-text-primary outline-none placeholder:text-text-subtitle"
        />
      </div>
      <Button type="submit" size="sm" className="h-9 w-full">
        검색하기
      </Button>
    </form>
  );
}
