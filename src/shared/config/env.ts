export class MissingEnvError extends Error {
  constructor(name: string) {
    super(`${name}가 설정되지 않았습니다. .env.example을 참고해 .env 파일을 만들어 주세요.`);
    this.name = 'MissingEnvError';
  }
}

/**
 * 카카오 REST API 키를 읽는다.
 * 모듈을 불러오는 시점이 아니라 호출 시점에 읽어, 키가 없어도 앱 시작이나 API와 무관한 테스트가 실패하지 않게 한다.
 */
export function getKakaoRestApiKey() {
  const apiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;
  if (apiKey === undefined || apiKey === '') {
    throw new MissingEnvError('VITE_KAKAO_REST_API_KEY');
  }
  return apiKey;
}
