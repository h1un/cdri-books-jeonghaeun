/** 카카오 책 검색 API 응답 원본 타입 */
export type KakaoBookDocument = {
  title: string;
  contents: string;
  url: string;
  /** ISBN10, ISBN13이 공백으로 구분되어 오거나 둘 중 하나만 온다 */
  isbn: string;
  datetime: string;
  authors: string[];
  publisher: string;
  translators: string[];
  price: number;
  /** 할인가가 없으면 -1 */
  sale_price: number;
  thumbnail: string;
  status: string;
};

export type KakaoBookSearchResponse = {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents: KakaoBookDocument[];
};
