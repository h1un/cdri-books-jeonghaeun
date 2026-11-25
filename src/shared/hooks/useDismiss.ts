import { type RefObject, useEffect, useEffectEvent } from 'react';

/**
 * 요소 바깥을 누르거나 ESC를 누르면 onDismiss를 호출한다. (팝업·드롭다운 닫기)
 * isEnabled가 false면 리스너를 등록하지 않는다.
 */
export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  onDismiss: () => void,
  isEnabled: boolean,
) {
  const handleDismiss = useEffectEvent(onDismiss);

  useEffect(() => {
    if (!isEnabled) return;

    function handlePointerDown(event: PointerEvent) {
      const element = ref.current;
      if (element === null) return;
      if (event.target instanceof Node && element.contains(event.target)) return;
      handleDismiss();
    }

    function handleKeyDown(event: KeyboardEvent) {
      // 안쪽 요소(예: 팝업 안의 셀렉트)가 ESC를 먼저 처리했다면 바깥 팝업까지 닫지 않는다.
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      handleDismiss();
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, isEnabled]);
}
