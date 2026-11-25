import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** 조건부 클래스(clsx)를 합치고, 충돌하는 Tailwind 클래스는 뒤의 것을 남긴다(tailwind-merge). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
