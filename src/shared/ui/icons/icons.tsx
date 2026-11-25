import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function createIconProps({ size = 24, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    'aria-hidden': true,
    focusable: false,
    ...props,
  } as const;
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...createIconProps(props)}>
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...createIconProps(props)}>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...createIconProps(props)}>
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const HEART_PATH =
  'M12 20.5s-7.6-4.6-9.5-9.4C1 7.3 3.3 4 6.7 4c2.1 0 3.6 1.1 5.3 3 1.7-1.9 3.2-3 5.3-3 3.4 0 5.7 3.3 4.2 7.1-1.9 4.8-9.5 9.4-9.5 9.4Z';

export function HeartFillIcon(props: IconProps) {
  return (
    <svg {...createIconProps(props)}>
      <path d={HEART_PATH} fill="currentColor" />
    </svg>
  );
}

export function HeartLineIcon(props: IconProps) {
  return (
    <svg {...createIconProps(props)}>
      <path d={HEART_PATH} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/** 빈 결과 화면용 일러스트. Figma NoData 아이콘의 색을 그대로 쓴다. */
export function BookIllustration({ size = 80, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden
      focusable={false}
      {...props}
    >
      <circle cx="40" cy="40" r="40" fill="#6CC4C9" />
      <path d="M26 22h24a4 4 0 0 1 4 4v32H30a4 4 0 0 1-4-4V22Z" fill="#FFC93C" />
      <path d="M26 22h4v36h-4z" fill="#F0A92A" />
      <path d="M30 54h24v4H30a2 2 0 0 1 0-4Z" fill="#FFFFFF" />
      <path d="M54 54v4" stroke="#F0A92A" strokeWidth="2" />
    </svg>
  );
}
