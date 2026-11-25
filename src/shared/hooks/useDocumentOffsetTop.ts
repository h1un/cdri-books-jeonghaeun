import { type RefObject, useLayoutEffect, useState } from 'react';

/**
 * 요소가 문서 맨 위에서 얼마나 떨어져 있는지(px). 창 스크롤 기반 가상 스크롤의 scrollMargin으로 쓴다.
 * 목록 위 영역(헤더·검색창)의 높이가 바뀌는 경우를 대비해 창 크기 변화에도 다시 잰다.
 */
export function useDocumentOffsetTop(ref: RefObject<HTMLElement | null>) {
  const [offsetTop, setOffsetTop] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (element === null) return;

    function measure() {
      if (element === null) return;
      setOffsetTop(element.getBoundingClientRect().top + window.scrollY);
    }

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [ref]);

  return offsetTop;
}
