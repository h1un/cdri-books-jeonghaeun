import { type ReactNode, useRef } from 'react';

import { useDismiss } from '@/shared/hooks/useDismiss';
import { cn } from '@/shared/lib/cn';

import { CloseIcon } from './icons/icons';

type PopoverProps = {
  isOpen: boolean;
  onClose: () => void;
  /** 스크린리더에 읽힐 팝업 이름 */
  label: string;
  className?: string;
  children: ReactNode;
};

/**
 * 트리거 바로 아래에 뜨는 팝업. 부모를 `relative`로 두고 사용한다.
 * 바깥 클릭·ESC·닫기 버튼으로 닫히며, 열릴 때마다 children이 새로 마운트되어 입력값이 초기화된다.
 */
export function Popover({ isOpen, onClose, label, className, children }: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  useDismiss(popoverRef, onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      role="dialog"
      aria-label={label}
      className={cn(
        'absolute top-full left-1/2 z-20 mt-2 -translate-x-1/2 rounded-lg bg-white',
        'shadow-[0_4px_14px_6px_rgba(151,151,151,0.15)]',
        className,
      )}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute top-2 right-2 p-1 text-text-subtitle hover:text-text-secondary"
      >
        <CloseIcon size={20} />
      </button>
      {children}
    </div>
  );
}
