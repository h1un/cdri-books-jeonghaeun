/// <reference types="vite/client" />

// 전역 ImportMetaEnv를 확장하려면 선언 병합이 필요해 interface를 사용한다.
/* eslint-disable @typescript-eslint/consistent-type-definitions */
interface ImportMetaEnv {
  readonly VITE_KAKAO_REST_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
