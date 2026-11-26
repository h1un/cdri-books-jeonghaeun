import { type ReactNode, useId } from 'react';

import { cn } from '@/shared/lib/cn';
import { Button, buttonClassName } from '@/shared/ui/Button';
import { ChevronDownIcon } from '@/shared/ui/icons/icons';

import { formatBookPrice, getDisplayPrice } from '../lib/price';
import { BookPrice } from './BookPrice';
import { BookThumbnail } from './BookThumbnail';

import type { Book } from '../model';

const CONTENTS_FALLBACK_TEXT = '책 소개가 없습니다.';

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

export function BookListItem({
  book,
  isExpanded,
  onToggleExpand,
  thumbnailOverlay,
  coverOverlay,
}: BookListItemProps) {
  const detailId = useId();
  const authorText = book.authors.join(', ');

  /** 상세 영역은 펼쳤을 때만 존재하므로, 그때만 aria-controls로 가리킨다. */
  const renderDetailToggle = (controlsId?: string) => (
    <Button
      variant="gray"
      aria-expanded={isExpanded}
      aria-controls={controlsId}
      onClick={() => onToggleExpand(book.id)}
      className="w-[115px]"
    >
      상세보기
      <ChevronDownIcon
        size={20}
        className={cn('transition-transform', isExpanded && 'rotate-180')}
      />
    </Button>
  );

  const purchaseLink = (
    <a
      href={book.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${book.title} 구매하기 (새 탭)`}
      className={buttonClassName({ className: isExpanded ? 'w-[240px]' : 'w-[115px]' })}
    >
      구매하기
    </a>
  );

  if (isExpanded) {
    return (
      <article
        aria-label={book.title}
        className="flex border-b border-gray pt-6 pr-4 pb-[39px] pl-[54px]"
      >
        <BookThumbnail
          src={book.coverImage}
          fallbackSrc={book.thumbnail}
          alt={book.title}
          size="lg"
          overlay={coverOverlay}
        />
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
        <div className="ml-12 flex w-[240px] shrink-0 flex-col items-end justify-between">
          {renderDetailToggle(detailId)}
          <div className="flex w-full flex-col items-end gap-7">
            <BookPrice book={book} />
            {purchaseLink}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      aria-label={book.title}
      className="flex h-[100px] items-center border-b border-gray pr-4 pl-10"
    >
      <BookThumbnail src={book.thumbnail} alt={book.title} size="sm" overlay={thumbnailOverlay} />
      <h3 className="ml-12 flex min-w-0 flex-1 items-center gap-4">
        <span className="truncate text-title3 font-bold">{book.title}</span>
        <span className="shrink-0 truncate text-body2 text-text-secondary">{authorText}</span>
      </h3>
      <p className="mx-14 shrink-0 text-title3 font-bold">
        {formatBookPrice(getDisplayPrice(book))}
      </p>
      <div className="flex shrink-0 gap-2">
        {purchaseLink}
        {renderDetailToggle()}
      </div>
    </article>
  );
}
