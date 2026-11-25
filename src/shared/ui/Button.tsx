import { cn } from '@/shared/lib/cn';

import type { ButtonHTMLAttributes } from 'react';

const BUTTON_VARIANT = {
  primary: 'bg-primary text-white hover:brightness-95',
  gray: 'bg-light-gray text-text-secondary hover:brightness-95',
  outline: 'border border-text-subtitle bg-white text-text-subtitle hover:bg-light-gray',
} as const;

const BUTTON_SIZE = {
  md: 'h-12 rounded-lg px-5 text-caption font-medium',
  sm: 'h-[35px] rounded-lg px-2.5 text-body2 font-medium',
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANT;
export type ButtonSize = keyof typeof BUTTON_SIZE;

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/** `<a>`처럼 button이 아닌 요소에도 같은 버튼 스타일을 쓰기 위해 클래스 생성을 분리했다. */
export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonStyleOptions) {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap transition',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    'disabled:cursor-not-allowed disabled:opacity-50',
    BUTTON_VARIANT[variant],
    BUTTON_SIZE[size],
    className,
  );
}

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> &
  ButtonStyleOptions & {
    type?: 'button' | 'submit';
  };

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      // eslint-disable-next-line react/button-has-type -- props 타입에서 'button' | 'submit'으로 제한한다
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  );
}
