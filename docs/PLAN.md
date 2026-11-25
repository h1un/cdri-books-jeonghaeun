# CERTICOS BOOKS 구현 계획

카카오 책 검색 API로 **도서 검색(전체/상세)과 찜하기**를 구현한다.
검색 결과는 React Query, 검색 기록·찜은 zustand(localStorage), 검색 조건은 URL로 나누어 관리하고,
긴 목록은 가상 스크롤로 성능을 확보한다.

> **[판단]** 표시는 Figma에 명시되지 않아 지원자 판단으로 정한 내용이다.
> (Figma 유의사항: "명시되지 않은 요구사항은 지원자 개인의 판단에 따라 작업합니다.")

---

## 1. 라이브러리

### 사용

| 분류            | 라이브러리                                         | 선택 이유                                                                                              |
| --------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 기반            | React 19, TypeScript (strict), Vite                | 필수 스택. 빠른 개발 서버                                                                              |
| 서버 상태       | @tanstack/react-query v5                           | 필수 스택. `useInfiniteQuery`로 페이지 누적·캐시·로딩/에러 처리                                        |
| 클라이언트 상태 | zustand (`persist`)                                | localStorage 영속화를 선언적으로 처리. selector 구독으로 리렌더 최소화. 서버/클라이언트 상태 역할 분리 |
| 가상 스크롤     | @tanstack/react-virtual                            | 무한 스크롤로 최대 500개까지 쌓이는 목록의 DOM 수를 줄임                                               |
| 라우팅          | react-router                                       | `NavLink`로 현재 탭 표시, `useSearchParams`로 검색 조건 ↔ URL 동기화                                   |
| HTTP            | axios                                              | 인스턴스 하나에 baseURL과 인증 헤더를 모음                                                             |
| 스타일          | Tailwind CSS v4, clsx + tailwind-merge (`cn()`)    | Figma 토큰을 `@theme`에 등록해 디자인 값을 그대로 사용. 조건부 클래스를 삼항 없이 처리                 |
| 폰트            | @fontsource/noto-sans-kr                           | Figma와 가장 가까운 폰트를 번들에 포함                                                                 |
| 품질            | ESLint 9, Prettier, husky, lint-staged, commitlint | 코드·커밋 규칙을 자동으로 강제                                                                         |
| 테스트          | Vitest                                             | 검색 기록·찜 토글·가격 규칙 같은 순수 로직 검증                                                        |

### 사용하지 않음

| 라이브러리      | 이유                                               |
| --------------- | -------------------------------------------------- |
| Redux           | 이 규모에는 보일러플레이트가 과함                  |
| react-hook-form | 입력창이 2개뿐                                     |
| UI 키트         | Figma 재현과 재사용 컴포넌트 설계 자체가 평가 대상 |
| lodash          | Enter로만 검색하므로 디바운스가 필요 없음          |

### 버전 메모

- TypeScript는 `typescript-eslint`가 지원하는 범위(`< 6.1`)에 맞춰 **6.0**으로 고정했다.
- ESLint는 `eslint-plugin-react`가 지원하는 **9.x**를 사용한다.

---

## 2. 기능 명세

### 공통

- 헤더: `CERTICOS BOOKS` 로고, "도서 검색" / "내가 찜한 책" 탭. 현재 탭에 밑줄.
- 라우트: `/` 도서 검색, `/favorites` 내가 찜한 책
- 1920 데스크톱 기준, 본문 960px 가운데 정렬. **[판단]** 좁은 화면에서도 깨지지 않을 정도로만 대응.

### 도서 검색 `/`

| 기능                   | 동작                                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| 검색                   | Enter로 실행. 앞뒤 공백 제거, 빈 검색어는 무시                                                                 |
| placeholder            | `검색어를 입력하세요` **[판단]** 주석('검색어 입력')과 화면 문구가 달라, 6개 화면 모두에 쓰인 화면 문구를 따름 |
| URL 동기화 **[판단]**  | `?q=&target=`. 새로고침·뒤로가기·공유 시 결과 유지                                                             |
| 검색 기록              | 최대 8개, 최신이 위, 같은 검색어는 맨 위로 이동, 넘치면 오래된 것부터 삭제. 브라우저 재시작 후에도 유지        |
| 기록 드롭다운          | 포커스 + 기록 1개 이상이면 열림. 바깥 클릭·ESC·검색 시 닫힘. 항목 클릭 시 바로 검색, X는 해당 항목만 삭제      |
| 결과 수                | "도서 검색 결과 총 N건" (`total_count`)                                                                        |
| 목록                   | 10개씩 무한 스크롤 + 가상 스크롤                                                                               |
| 결과 없음 / 첫 화면    | 책 아이콘 + "검색된 결과가 없습니다."                                                                          |
| 로딩 / 에러 **[판단]** | 스켈레톤 / 에러 메시지 + 다시 시도                                                                             |

### 상세 검색 팝업

| 기능                 | 동작                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------- |
| 열기                 | "상세검색" 버튼 바로 아래에 노출                                                          |
| 구성                 | 셀렉트(제목 / 저자명 / 출판사) + 입력창(placeholder `검색어 입력`) + "검색하기" + X       |
| 닫기                 | X, 바깥 클릭, ESC, 검색하기                                                               |
| 상호 초기화          | 상세 검색 시 메인 검색창 초기화 / 전체 검색 시 상세 조건 초기화 (동시 진행 불가)          |
| 기본값 **[판단]**    | 셀렉트 기본값 "제목". 다시 열면 현재 적용 중인 조건 표시                                  |
| 기록 저장 **[판단]** | 상세 검색어는 검색 기록에 저장하지 않음. 기록에 검색 기준 정보가 없어 재검색 시 혼란 방지 |

### 책 목록 아이템 (검색 / 찜 공용)

| 상태                   | 구성                                                                              |
| ---------------------- | --------------------------------------------------------------------------------- |
| 접힘                   | 썸네일(찜한 책은 오른쪽 위 작은 하트), 제목, 저자, 가격, `구매하기`, `상세보기 ▾` |
| 펼침                   | 큰 표지 + 하트, 제목·저자, "책 소개", 원가·할인가, `구매하기`, `상세보기 ▴`       |
| 접힘 하트 **[판단]**   | 찜 여부 표시 전용. 찜/해제는 펼친 상태의 큰 하트로                                |
| 아코디언 **[판단]**    | 아이템마다 독립적으로 펼침, 여러 개 동시 펼침 가능                                |
| 구매하기               | 새 탭으로 책 상세페이지(`url`) 열기 (`noopener,noreferrer`)                       |
| 할인가 없음            | 할인가 줄만 숨기고 원가는 취소선 없이 표시                                        |
| 접힘 가격 **[판단]**   | 할인가가 있으면 할인가, 없으면 정가 (실제 결제 금액)                              |
| 썸네일 없음 **[판단]** | 대체 이미지                                                                       |

### 내가 찜한 책 `/favorites`

| 기능            | 동작                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------- |
| 저장            | 찜한 시점의 책 데이터 전체를 저장(스냅샷). API 결과와 달라질 수 있음. 브라우저 재시작 후에도 유지 |
| 정렬 **[판단]** | 최근 찜한 순                                                                                      |
| 표시            | "찜한 책 총 N건"(N = 실제 찜 개수) + 10개씩 무한 스크롤                                           |
| 해제 **[판단]** | 목록에 그대로 남고 빈 하트로 바뀜. 새로고침·재진입 시 제거. 실수 복구와 레이아웃 밀림 방지 목적   |
| 다시 찜         | 원래 순서(`savedAt`) 유지                                                                         |
| 비었을 때       | 진입 시 0건이면 "찜한 책이 없습니다."                                                             |

### 하트 동작 **[판단]**

- 연타해도 막지 않고 누를 때마다 토글한다. 로컬에서 동기적으로 처리되어 경쟁 상태가 없다.
- `select-none`, `touch-action: manipulation`, 짧은 transition, `aria-pressed` / `aria-label`.
- 여러 탭 동기화: `storage` 이벤트를 받으면 스토어를 `rehydrate`한다.
- 서버 연동 시 설계(README에 서술): 낙관적 업데이트 + 디바운스 후 최종 상태만 전송, 멱등한 `PUT`/`DELETE`, 실패 시 롤백.

---

## 3. 상태 설계

| 상태                           | 위치                                         | 이유                                   |
| ------------------------------ | -------------------------------------------- | -------------------------------------- |
| 검색 결과                      | React Query (`useInfiniteQuery`)             | 서버 상태                              |
| 검색 조건 `{ query, target? }` | URL                                          | 새로고침·공유·뒤로가기                 |
| 검색 기록                      | zustand persist                              | 재시작 후 유지, 여러 컴포넌트에서 사용 |
| 찜 목록                        | zustand persist (`Record<id, FavoriteBook>`) | 유지 필요, 찜 여부 O(1) 조회           |
| 찜 페이지에 보이는 목록        | 페이지 `useState` (진입 시 복사)             | 해제해도 목록 유지                     |
| 아코디언 펼침                  | `BookList`의 `useState<Set<id>>`             | 가상 스크롤로 언마운트돼도 상태 유지   |
| 팝업 열림, 입력값              | 각 컴포넌트 내부                             | UI 지역 상태                           |

원칙: 같은 데이터를 두 곳에 저장하지 않고, 전역에는 꼭 필요한 것만 둔다.

---

## 4. 핵심 로직

```ts
// 검색 기록 추가
next = [query, ...prev.filter((q) => q !== query)].slice(0, MAX_SEARCH_HISTORY); // 8

// 검색 조건 전환 (상호 초기화)
fullSearch(query)           → { query }
detailSearch(query, target) → { query, target }
searchInputValue = condition.target ? '' : condition.query

// 쿼리 키 / 다음 페이지
queryKey = ['books', 'search', { query, target }]
getNextPageParam = (last, _all, lastPageParam) => (last.meta.isEnd ? undefined : lastPageParam + 1)
totalCount = data.pages[0].meta.totalCount

// API → 앱 타입 변환 (mapper)
salePrice = raw.sale_price > 0 ? raw.sale_price : null
id        = raw.isbn.split(' ').at(-1) || raw.url

// 가격
hasDiscount  = book.salePrice !== null
displayPrice = book.salePrice ?? book.price

// 찜 토글 (다시 찜하면 원래 순서 유지)
toggle(book) = book.id in favoritesById
  ? omit(favoritesById, book.id)
  : { ...favoritesById, [book.id]: { ...book, savedAt: book.savedAt ?? Date.now() } }

// 찜 페이지: 진입 시점 목록을 고정
const [displayedBooks] = useState(() => selectSortedFavorites(useFavoriteStore.getState()));

// 가상 스크롤 + 무한 스크롤
const lastItem = virtualItems.at(-1);
const isNearEnd = lastItem !== undefined && lastItem.index >= items.length - PREFETCH_OFFSET;
if (isNearEnd && hasNextPage && !isFetchingNextPage) fetchNextPage();
```

- React Query 기본값: `staleTime 5분`, `retry 1`, `refetchOnWindowFocus false`
- localStorage 키: `cdri-books:search-history`, `cdri-books:favorites`
- 카카오 API: `GET https://dapi.kakao.com/v3/search/book`, `Authorization: KakaoAK {key}`, `query`, `target`(title | person | publisher), `page`(1–50), `size=10`

---

## 5. 폴더 구조

```
src/
├─ app/          # providers, router, Layout, RouteFallback
├─ pages/        # SearchPage, FavoritesPage (조립만 담당)
├─ widgets/      # header, book-list(가상 스크롤), search-result, favorite-book-list
├─ features/
│  ├─ search/    # 검색창·검색 기록·상세 검색, 검색 조건(URL), useBookSearch
│  └─ favorites/ # 찜 스토어, FavoriteToggle, FavoriteIndicator
├─ entities/
│  └─ book/      # api(client 호출, dto, mapper, queryKeys), model, lib(가격·중복·표지), ui(BookListItem 등)
└─ shared/       # api client, config, ui, hooks, lib
```

의존 방향은 `pages → widgets → features → entities → shared` 한 방향만 허용한다.

---

## 6. 코드 컨벤션

| 규칙                                                                                     | 강제 방법                                                           |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| JSX에서 `조건 ? <X /> : null` 금지, 중첩 삼항 금지                                       | `no-restricted-syntax`, `no-nested-ternary`                         |
| `&&`·조건식 왼쪽은 boolean만 (`0`이 렌더링되는 문제 방지)                                | `@typescript-eslint/strict-boolean-expressions`                     |
| 분기: 화면 전체는 early return, 둘 중 하나는 컴포넌트 분리, 여러 종류는 객체 맵 + `cn()` | 리뷰                                                                |
| `any`, non-null 단언(`!`) 금지, `as`는 API 경계에서만                                    | typescript-eslint (strict-type-checked)                             |
| 계산 가능한 값은 state·`useEffect`로 만들지 않음                                         | 리뷰                                                                |
| 컴포넌트는 `function` 선언문, named export, 파일당 컴포넌트 하나                         | `react/function-component-definition`, `import-x/no-default-export` |
| 네이밍: `is/has` 불리언, props는 `on*`, 구현은 `handle*`, 상수는 `UPPER_SNAKE`           | 리뷰                                                                |
| `??` 우선, 템플릿 리터럴, 주석은 "왜"만                                                  | `prefer-nullish-coalescing`, `prefer-template`                      |
| import 순서, `@/` 절대 경로, Prettier                                                    | `import-x/order`, Prettier                                          |

---

## 7. 성능

| 항목    | 방법                                                                     |
| ------- | ------------------------------------------------------------------------ |
| 긴 목록 | `useWindowVirtualizer` + `measureElement`로 가변 높이·아코디언 대응      |
| 요청    | Enter로만 검색, 쿼리 키 캐시, `staleTime`, 끝에 가까워지면 미리 불러오기 |
| 리렌더  | `BookListItem` 메모이제이션, 하트는 `FavoriteToggle`만 selector로 구독   |
| 이미지  | `loading="lazy"`, 크기 고정, 대체 이미지                                 |
| 번들    | 찜 페이지 코드 분할                                                      |
| 측정    | 500개 로드 상태에서 가상 스크롤 전후 DOM 노드 수·Profiler 커밋 시간 비교 |

---

## 8. 디자인 토큰

| 토큰                                | 값                                |
| ----------------------------------- | --------------------------------- |
| primary                             | `#4880EE`                         |
| red                                 | `#E84118`                         |
| gray / light-gray                   | `#DADADA` / `#F2F4F6`             |
| black / white                       | `#222222` / `#FFFFFF`             |
| text-primary / secondary / subtitle | `#353C49` / `#6D7582` / `#8D94A0` |

텍스트(크기/행간): title1 24/24 · title2 22/24 · title3 18/18 · body1 20/20 · body2 14/14 · caption 16/16 · small 10/10

---

## 9. Git 규칙

- 커밋: `<type>: <제목> (#이슈번호)` — scope 없음. 본문에는 "왜"를 적는다.
- type: `feat` `fix` `refactor` `perf` `style` `design` `test` `docs` `chore`
- 흐름: 이슈 생성 → `<type>/#N-<slug>` 브랜치 → PR(`Closes #N`) → `main` 머지
- husky: 커밋 시 lint-staged(ESLint·Prettier), 메시지는 commitlint로 검사

---

## 10. 구현 중 바뀌거나 추가된 판단

| 항목                      | 내용                                                                                                                  | 이슈   |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------ |
| 린터                      | Vite 템플릿 기본 oxlint 대신 ESLint 9 (커스텀 selector 규칙이 필요)                                                   | #1     |
| TypeScript                | 7.x 대신 6.0 고정 (`typescript-eslint` 지원 범위 `< 6.1`)                                                             | #1     |
| boolean `&&` 규칙         | `react/jsx-no-leaked-render`는 타입을 보지 않아 boolean 변수까지 막음 → 타입 기반 `strict-boolean-expressions`로 교체 | #1     |
| 가격 정보 없음 **[판단]** | 실제 응답에 정가 0원인 책이 있어 "가격 정보 없음"으로 표시                                                            | #2, #4 |
| 책 소개 없음 **[판단]**   | 실제 응답에 빈 소개가 있어 "책 소개가 없습니다."로 표시                                                               | #2, #4 |
| 중복 제거                 | 페이지를 이어 붙이면 같은 책이 중복되어, 페이지를 합친 뒤 id 기준으로 제거                                            | #2, #6 |
| widgets 레이어            | 찜 기능과 책 아이템을 조합하는 목록(`BookListRow`)을 두기 위해 추가 (`entities`가 `features`에 의존하지 않도록)       | #6     |
| 프리페치 기준             | overscan 포함 기준이면 첫 화면에서 바로 2페이지를 요청 → 실제 보이는 범위 기준으로 변경                               | #7     |
| Popover 트리거            | 트리거가 팝업 밖에 있으면 다시 누를 때 닫혔다 열림 → 트리거를 Popover 안에 포함                                       | #8     |
| 펼친 표지 이미지          | 썸네일(120×174)이 흐려 원본 이미지 사용, 실패 시 썸네일로 대체. 찜 저장 데이터 v2 마이그레이션                        | #10    |
| 지연 로딩 진입 화면       | `/favorites` 직접 진입 시 빈 화면·경고 → `HydrateFallback` 추가                                                       | #22    |
