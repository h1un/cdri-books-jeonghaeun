import { type ReactNode, useRef } from 'react';

import { useDismiss } from '@/shared/hooks/useDismiss';
import { cn } from '@/shared/lib/cn';

import { CloseIcon } from './icons/icons';

type PopoverProps = {
  /** 팝업을 여는 버튼. 트리거도 바깥 클릭 판정에서 제외되도록 Popover 안에 함께 둔다. */
  trigger: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  /** 스크린리더에 읽힐 팝업 이름 */
  label: string;
  className?: string;
  children: ReactNode;
};

/**
 * 트리거 바로 아래 가운데에 뜨는 팝업.
 * 바깥 클릭·ESC·닫기 버튼으로 닫히며, 닫히면 언마운트되어 다시 열 때 입력값이 초기화된다.
 */
export function Popover({ trigger, isOpen, onClose, label, className, children }: PopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useDismiss(containerRef, onClose, isOpen);

  return (
    <div ref={containerRef} className="relative">
      {trigger}
      {isOpen && (
        <div
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
      )}
    </div>
  );
}
