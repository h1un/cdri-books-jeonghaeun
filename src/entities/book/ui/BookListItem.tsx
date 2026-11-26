import { type ReactNode, useId } from 'react';

import { cn } from '@/shared/lib/cn';
import { Button, buttonClassName } from '@/shared/ui/Button';
import { ChevronDownIcon } from '@/shared/ui/icons/icons';

import { formatBookPrice, getDisplayPrice } from '../lib/price';
import { BookPrice } from './BookPrice';
import { BookThumbnail } from './BookThumbnail';

import type { Book } from '../model';

const CONTENTS_FALLBACK_TEXT = '책 소개가 없습니다.';

/** 접힘/펼침에 따라 바뀌는 배치 */
const ITEM_LAYOUT = {
  collapsed: {
    article: 'h-[100px] items-center pr-4 pl-10',
    thumbnailSize: 'sm',
    actions: 'flex shrink-0 gap-2',
    purchaseWidth: 'w-[115px]',
  },
  expanded: {
    article: 'pt-6 pr-4 pb-[39px] pl-[54px]',
    thumbnailSize: 'lg',
    actions: 'ml-12 flex w-[240px] shrink-0 flex-col items-end justify-between',
    purchaseWidth: 'w-[240px]',
  },
} as const;

type BookListItemProps = {
  book: Book;
  /** 펼침 상태는 목록이 관리한다. (가상 스크롤로 아이템이 언마운트돼도 상태를 유지하기 위해) */
  isExpanded: boolean;
  onToggleExpand: (bookId: string) => void;
  /** 접힌 상태의 썸네일 위 표시 (찜 여부) */
  thumbnailOverlay?: ReactNode;
  /** 펼친 상태의 표지 위 동작 (찜 토글) */
  coverOverlay?: ReactNode;
};

/**
 * 접힘과 펼침을 하나의 트리로 그린다. 상세보기 버튼이 두 상태에서 같은 자리(액션 영역의 두 번째 자식)에 있어야
 * React가 같은 DOM을 재사용해, 키보드로 펼치거나 접어도 포커스가 버튼에 남는다.
 * (상태마다 따로 그리면 버튼이 새로 만들어지면서 포커스가 body로 빠진다)
 */
export function BookListItem({
  book,
  isExpanded,
  onToggleExpand,
  thumbnailOverlay,
  coverOverlay,
}: BookListItemProps) {
  const detailId = useId();
  const authorText = book.authors.join(', ');
  const layout = ITEM_LAYOUT[isExpanded ? 'expanded' : 'collapsed'];
  // 상세 영역은 펼쳤을 때만 존재하므로, 그때만 aria-controls로 가리킨다.
  const detailControlsId = isExpanded ? detailId : undefined;

  const purchaseLink = (
    <a
      href={book.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${book.title} 구매하기 (새 탭)`}
      className={buttonClassName({ className: layout.purchaseWidth })}
    >
      구매하기
    </a>
  );

  return (
    <article aria-label={book.title} className={cn('flex border-b border-gray', layout.article)}>
      <BookThumbnail
        // 펼친 표지는 원본 이미지를 쓰고, 불러오지 못하면 썸네일로 대체한다.
        src={isExpanded ? book.coverImage : book.thumbnail}
        fallbackSrc={book.thumbnail}
        alt={book.title}
        size={layout.thumbnailSize}
        overlay={isExpanded ? coverOverlay : thumbnailOverlay}
      />
      {isExpanded && (
        <div id={detailId} className="ml-8 min-w-0 flex-1 pt-5">
          <h3 className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-title3 font-bold">{book.title}</span>
            <span className="shrink-0 text-body2 text-text-secondary">{authorText}</span>
          </h3>
          <p className="mt-4 text-body2 font-bold">책 소개</p>
          <p className="mt-3 max-w-[360px] text-small leading-4 whitespace-pre-line">
            {book.contents ?? CONTENTS_FALLBACK_TEXT}
          </p>
        </div>
      )}
      {!isExpanded && (
        <>
          <h3 className="ml-12 flex min-w-0 flex-1 items-center gap-4">
            <span className="truncate text-title3 font-bold">{book.title}</span>
            <span className="shrink-0 truncate text-body2 text-text-secondary">{authorText}</span>
          </h3>
          <p className="mx-14 shrink-0 text-title3 font-bold">
            {formatBookPrice(getDisplayPrice(book))}
          </p>
        </>
      )}
      <div className={layout.actions}>
        {!isExpanded && purchaseLink}
        <Button
          variant="gray"
          aria-expanded={isExpanded}
          aria-controls={detailControlsId}
          onClick={() => onToggleExpand(book.id)}
          className="w-[115px]"
        >
          상세보기
          <ChevronDownIcon
            size={20}
            className={cn('transition-transform', isExpanded && 'rotate-180')}
          />
        </Button>
        {isExpanded && (
          <div className="flex w-full flex-col items-end gap-7">
            <BookPrice book={book} />
            {purchaseLink}
          </div>
        )}
      </div>
    </article>
  );
}
