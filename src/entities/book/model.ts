export const SEARCH_TARGET = {
  title: '제목',
  person: '저자명',
  publisher: '출판사',
} as const;

export type SearchTarget = keyof typeof SEARCH_TARGET;

export const BOOK_PAGE_SIZE = 10;

/** 화면에서 사용하는 책 데이터. API 응답 형태(snake_case, -1 등)를 숨긴다. */
export type Book = {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  /** 책 소개. API가 빈 문자열을 주면 null */
  contents: string | null;
  /** 썸네일 URL. 없으면 null */
  thumbnail: string | null;
  /** 책 상세페이지(다음 책) URL */
  url: string;
  /** 정가. 0 이하(가격 정보 없음)면 null */
  price: number | null;
  /** 할인가. 할인가가 없으면(-1) null */
  salePrice: number | null;
};

export type BookSearchParams = {
  query: string;
  target?: SearchTarget;
  page: number;
  size?: number;
};

export type BookSearchResult = {
  books: Book[];
  totalCount: number;
  isEnd: boolean;
};
