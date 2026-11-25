import { useId, useRef, useState } from 'react';

import { useDismiss } from '@/shared/hooks/useDismiss';
import { cn } from '@/shared/lib/cn';

import { ChevronDownIcon } from './icons/icons';

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type SelectProps<T extends string> = {
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  label: string;
  className?: string;
};

/** Figma 디자인처럼 선택된 값 아래로 나머지 옵션만 펼쳐지는 셀렉트. */
export function Select<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  useDismiss(containerRef, () => setIsOpen(false), isOpen);

  const selectedOption = options.find((option) => option.value === value);
  const otherOptions = options.filter((option) => option.value !== value);

  function handleSelect(nextValue: T) {
    onChange(nextValue);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-9 w-full items-center justify-between border-b border-gray px-2 text-body2 font-bold text-text-primary"
      >
        {selectedOption?.label}
        <ChevronDownIcon
          size={20}
          className={cn('text-text-subtitle transition-transform', isOpen && 'rotate-180')}
        />
      </button>
      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute top-full left-0 z-10 w-full bg-white py-1 shadow-[0_0_4px_rgba(0,0,0,0.25)]"
        >
          {otherOptions.map((option) => (
            <li key={option.value} role="option" aria-selected={false}>
              <button
                type="button"
                onClick={() => handleSelect(option.value)}
                className="w-full px-2 py-1 text-left text-body2 text-text-subtitle hover:bg-light-gray hover:text-text-primary"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
