function readRequiredEnv(value: string | undefined, name: string) {
  if (value === undefined || value === '') {
    throw new Error(
      `${name}가 설정되지 않았습니다. .env.example을 참고해 .env 파일을 만들어 주세요.`,
    );
  }
  return value;
}

export const env = {
  kakaoRestApiKey: readRequiredEnv(
    import.meta.env.VITE_KAKAO_REST_API_KEY,
    'VITE_KAKAO_REST_API_KEY',
  ),
} as const;
