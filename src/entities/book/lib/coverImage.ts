/**
 * 카카오 썸네일은 120×174 크기로만 제공되어, 펼친 표지(210×280)에 쓰면 확대되어 흐려진다.
 * 썸네일 URL의 fname 파라미터가 원본 이미지 주소이므로 이를 https로 바꿔 펼친 표지에 쓴다.
 * 원본 주소를 알 수 없으면 썸네일을 그대로 쓴다.
 */
export function toCoverImageUrl(thumbnail: string | null) {
  if (thumbnail === null) return null;

  try {
    const originalUrl = new URL(thumbnail).searchParams.get('fname');
    if (originalUrl === null || originalUrl === '') return thumbnail;

    const coverUrl = new URL(originalUrl);
    coverUrl.protocol = 'https:';
    return coverUrl.toString();
  } catch {
    return thumbnail;
  }
}
