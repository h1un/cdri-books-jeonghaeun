/**
 * 다른 탭에서 같은 localStorage 키가 바뀌면 rehydrate를 호출한다.
 * zustand persist는 다른 탭의 변경을 자동으로 반영하지 않아,
 * 그대로 두면 나중에 저장한 탭이 앞선 변경을 덮어쓸 수 있다.
 */
export function syncAcrossTabs(storageKey: string, rehydrate: () => unknown) {
  if (typeof window === 'undefined') return;

  window.addEventListener('storage', (event) => {
    if (event.key === storageKey) void rehydrate();
  });
}
