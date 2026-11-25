import { type ReactNode, useState } from 'react';

import { cn } from '@/shared/lib/cn';
import { BookIllustration } from '@/shared/ui/icons/icons';

const THUMBNAIL_SIZE = {
  sm: { width: 48, height: 68, fallbackIcon: 24 },
  lg: { width: 210, height: 280, fallbackIcon: 64 },
} as const;

type BookThumbnailProps = {
  src: string | null;
  alt: string;
  size: keyof typeof THUMBNAIL_SIZE;
  /** 표지 위 오른쪽 상단에 겹쳐 놓을 요소 (찜 하트 등) */
  overlay?: ReactNode;
};

/** 크기를 고정해 이미지 로딩 전후로 레이아웃이 밀리지 않게 하고, 이미지가 없거나 깨지면 대체 이미지를 보여준다. */
export function BookThumbnail({ src, alt, size, overlay }: BookThumbnailProps) {
  const [hasError, setHasError] = useState(false);
  const { width, height, fallbackIcon } = THUMBNAIL_SIZE[size];
  const isImageAvailable = src !== null && !hasError;

  return (
    <div className="relative shrink-0 bg-light-gray" style={{ width, height }}>
      {isImageAvailable && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          className="size-full object-cover"
        />
      )}
      {!isImageAvailable && (
        <div
          role="img"
          aria-label={`${alt} (표지 없음)`}
          className="flex size-full items-center justify-center"
        >
          <BookIllustration size={fallbackIcon} />
        </div>
      )}
      {overlay !== undefined && (
        <div className={cn('absolute', size === 'sm' ? 'top-0 right-0' : 'top-2 right-2')}>
          {overlay}
        </div>
      )}
    </div>
  );
}
