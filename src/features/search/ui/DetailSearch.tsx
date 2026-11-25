import { useState } from 'react';

import type { SearchTarget } from '@/entities/book';
import { Button } from '@/shared/ui/Button';
import { Popover } from '@/shared/ui/Popover';

import { getDetailSearchDefaults, type SearchCondition } from '../model/searchCondition';
import { DetailSearchForm } from './DetailSearchForm';

type DetailSearchProps = {
  condition: SearchCondition;
  onSearch: (query: string, target: SearchTarget) => void;
};

/** "상세검색" 버튼과 팝업. 검색하면 팝업을 닫고 상세 조건으로 검색한다. */
export function DetailSearch({ condition, onSearch }: DetailSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const defaults = getDetailSearchDefaults(condition);

  function handleSubmit(query: string, target: SearchTarget) {
    setIsOpen(false);
    onSearch(query, target);
  }

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      label="상세 검색"
      className="w-[360px] px-6 pt-9 pb-9"
      trigger={
        <Button
          variant="outline"
          size="sm"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="w-[72px]"
        >
          상세검색
        </Button>
      }
    >
      <DetailSearchForm
        defaultTarget={defaults.target}
        defaultQuery={defaults.query}
        onSubmit={handleSubmit}
      />
    </Popover>
  );
}
