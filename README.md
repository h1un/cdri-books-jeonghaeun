# CERTICOS BOOKS

카카오 책 검색 API로 도서를 검색하고, 마음에 드는 책을 찜해 모아 보는 서비스입니다.

- **도서 검색**: 전체 검색, 상세 검색(제목·저자명·출판사), 최근 검색어 8개
- **검색 결과**: 10개씩 무한 스크롤, 상세보기 아코디언, 구매하기(새 탭)
- **내가 찜한 책**: 찜한 시점의 데이터를 저장, 브라우저를 다시 켜도 유지

> 구현 계획과 기획 판단의 전체 내용은 [docs/PLAN.md](docs/PLAN.md), 성능 측정은 [docs/PERFORMANCE.md](docs/PERFORMANCE.md)에 정리했습니다.
> 작업은 [이슈](https://github.com/h1un/cdri-books-jeonghaeun/issues?q=is%3Aissue) 단위로 나누고, 이슈마다 [PR](https://github.com/h1un/cdri-books-jeonghaeun/pulls?q=is%3Apr)에 변경 내용과 설계 판단을 남겼습니다.

<br />

## 목차

1. [실행 방법](#1-실행-방법)
2. [폴더 구조와 주요 코드](#2-폴더-구조와-주요-코드)
3. [라이브러리 선택 이유](#3-라이브러리-선택-이유)
4. [강조하고 싶은 기능](#4-강조하고-싶은-기능)
5. [코드 컨벤션](#5-코드-컨벤션)
6. [기획 판단 사항](#6-기획-판단-사항)
7. [한계와 개선 방향](#7-한계와-개선-방향)

<br />

## 1. 실행 방법

### 요구 환경

- Node.js 22
- pnpm 9 (`corepack enable`로 `package.json`의 `packageManager` 버전 사용)

### 환경 변수

[Kakao Developers](https://developers.kakao.com) → 내 애플리케이션 → 앱 키의 **REST API 키**가 필요합니다.

```bash
cp .env.example .env
```

```dotenv
# .env
VITE_KAKAO_REST_API_KEY=발급받은_REST_API_키
```

`.env`는 `.gitignore`에 포함되어 저장소에 올라가지 않습니다. 키가 없으면 검색할 때 결과 영역에 원인과 해결 방법이 표시됩니다. (API와 무관한 단위 테스트는 키 없이 통과합니다.)

### 실행

```bash
pnpm install
pnpm dev        # http://localhost:5173
```

| 스크립트                       | 설명                                        |
| ------------------------------ | ------------------------------------------- |
| `pnpm dev`                     | 개발 서버                                   |
| `pnpm build` / `pnpm preview`  | 타입 검사 후 프로덕션 빌드 / 빌드 결과 확인 |
| `pnpm test`                    | 단위 테스트 (Vitest, 48개)                  |
| `pnpm lint` / `pnpm typecheck` | ESLint / TypeScript 검사                    |
| `pnpm format`                  | Prettier                                    |

커밋할 때 husky가 변경 파일의 ESLint·Prettier와 커밋 메시지 형식을 검사하고, PR마다 GitHub Actions가 `.env` 없이 typecheck·lint·test·build를 실행합니다.

<br />

## 2. 폴더 구조와 주요 코드

```
src/
├─ app/                      # 앱 진입: Provider, 라우터, 레이아웃
├─ pages/                    # 화면 조립만 담당
│  ├─ SearchPage.tsx
│  └─ FavoritesPage.tsx
├─ widgets/                  # 여러 기능을 조합한 화면 블록
│  ├─ header/
│  ├─ book-list/             # 가상 스크롤 목록 (검색·찜 공용)
│  ├─ search-result/         # 검색 결과 상태 분기
│  └─ favorite-book-list/
├─ features/                 # 사용자 동작 단위
│  ├─ search/                # 검색창, 최근 검색어, 상세 검색, 검색 조건(URL), 검색 쿼리
│  └─ favorites/             # 찜 스토어, 하트 토글
├─ entities/
│  └─ book/                  # 책 도메인: API·타입·mapper·가격 규칙·책 아이템 UI
└─ shared/                   # 도메인과 무관한 공통: API 클라이언트, UI, 훅, 유틸
```

**의존 방향은 `pages → widgets → features → entities → shared` 한 방향만 허용합니다.** 예를 들어 책 아이템(`entities`)은 찜(`features`)을 모르고, 하트는 슬롯으로 주입받습니다. `features`와 `entities`의 각 슬라이스는 `index.ts`로 공개할 것만 내보냅니다.

### 주요 코드

| 파일                                                                                         | 역할                                                                                                    |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [`entities/book/api/mapper.ts`](src/entities/book/api/mapper.ts)                             | API 응답을 화면용 `Book`으로 변환. `sale_price: -1`, 빈 썸네일, ISBN 형식 같은 API 규칙은 여기서만 다룸 |
| [`features/search/model/searchCondition.ts`](src/features/search/model/searchCondition.ts)   | 검색 조건 `{ query, target? }`과 URL 변환. 전체/상세 검색 상호 초기화의 근거                            |
| [`features/search/hooks/useBookSearch.ts`](src/features/search/hooks/useBookSearch.ts)       | `useInfiniteQuery`. 페이지를 합친 뒤 중복 제거, 최대 50페이지                                           |
| [`features/search/model/searchHistory.ts`](src/features/search/model/searchHistory.ts)       | 최근 검색어 규칙(최대 8개, 중복은 맨 앞으로)                                                            |
| [`features/favorites/model/favorites.ts`](src/features/favorites/model/favorites.ts)         | 찜 토글·정렬·마이그레이션 순수 로직                                                                     |
| [`features/favorites/model/favoriteStore.ts`](src/features/favorites/model/favoriteStore.ts) | zustand persist 스토어, 탭 간 동기화, 책별 selector                                                     |
| [`widgets/book-list/BookList.tsx`](src/widgets/book-list/BookList.tsx)                       | 창 스크롤 가상 스크롤 + 무한 스크롤, 펼침 상태 보관                                                     |
| [`entities/book/ui/BookListItem.tsx`](src/entities/book/ui/BookListItem.tsx)                 | 접힘/펼침 아이템 (검색·찜 공용)                                                                         |
| [`pages/FavoritesPage.tsx`](src/pages/FavoritesPage.tsx)                                     | 진입 시점 목록 고정 (해제해도 재진입 전까지 유지)                                                       |

<br />

## 3. 라이브러리 선택 이유

### 사용

| 분류            | 라이브러리                                                 | 이유                                                                                                                    |
| --------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 기반            | React 19, TypeScript, Vite                                 | 필수 스택. 빠른 개발 서버와 빌드                                                                                        |
| 서버 상태       | **TanStack Query v5**                                      | 필수 스택. `useInfiniteQuery`로 페이지 누적·캐시·로딩/에러·요청 취소를 한 번에 처리                                     |
| 클라이언트 상태 | **zustand** (`persist`)                                    | 검색 기록·찜의 localStorage 저장을 선언적으로 처리. selector로 필요한 값만 구독해 리렌더 최소화. 버전·마이그레이션 지원 |
| 가상 스크롤     | **@tanstack/react-virtual**                                | 무한 스크롤로 계속 길어지는 목록의 DOM 수를 일정하게 유지. 창 스크롤과 가변 높이(아코디언) 지원                         |
| 라우팅          | react-router                                               | `NavLink`(현재 탭), `useSearchParams`(검색 조건 ↔ URL), `lazy`(코드 분할)                                               |
| HTTP            | axios                                                      | 인스턴스 하나에 baseURL·인증 헤더·타임아웃을 모음                                                                       |
| 스타일          | Tailwind CSS v4, clsx + tailwind-merge                     | Figma 토큰을 `@theme`에 등록해 그대로 사용. 조건부 클래스를 삼항 없이 `cn()`으로 처리                                   |
| 폰트            | @fontsource/noto-sans-kr                                   | Figma와 가장 가까운 폰트를 번들에 포함                                                                                  |
| 품질            | ESLint 9, Prettier, husky, lint-staged, commitlint, Vitest | 코드·커밋 규칙 자동 검사, 순수 로직 단위 테스트                                                                         |

### 사용하지 않음

| 라이브러리      | 이유                                                       |
| --------------- | ---------------------------------------------------------- |
| Redux           | 전역 상태가 검색 기록과 찜 두 가지라 보일러플레이트가 과함 |
| react-hook-form | 입력창이 2개뿐                                             |
| UI 키트         | Figma 재현과 재사용 컴포넌트 설계 자체가 과제              |
| lodash          | Enter로만 검색해 디바운스가 필요 없음                      |

### 버전 메모

- **TypeScript 6.0**: 최신 7.x는 `typescript-eslint` 지원 범위(`< 6.1`) 밖이라, 타입 기반 린트를 위해 6.0으로 고정했습니다.
- **ESLint 9**: Vite 템플릿 기본값인 oxlint는 아래 코드 컨벤션의 커스텀 규칙(`no-restricted-syntax`)을 쓸 수 없고, `eslint-plugin-react`가 ESLint 9까지 지원합니다.

<br />

## 4. 강조하고 싶은 기능

### ① 상태를 성격에 따라 세 곳으로 나눔

| 상태                           | 위치                   | 이유                                     |
| ------------------------------ | ---------------------- | ---------------------------------------- |
| 검색 결과                      | TanStack Query         | 서버 상태: 캐시, 페이지, 로딩·에러       |
| 검색 조건 `{ query, target? }` | URL `?q=&target=`      | 새로고침·뒤로가기·링크 공유 시 같은 결과 |
| 검색 기록, 찜                  | zustand + localStorage | 브라우저를 다시 켜도 유지                |
| 펼침, 팝업, 입력값             | 컴포넌트 state         | 화면에서만 쓰는 상태                     |

같은 데이터를 두 곳에 두지 않아 동기화 코드(`useEffect`)가 필요 없습니다. 예를 들어 검색창은 조건이 바뀌면 `key`가 바뀌어 다시 마운트되고, 입력값이 자연스럽게 조건과 맞춰집니다.

### ② 전체/상세 검색 상호 초기화를 데이터 구조로 보장

검색 조건은 하나의 값입니다. 전체 검색은 `{ query }`, 상세 검색은 `{ query, target }`으로 **덮어쓰기** 때문에, Figma의 "두 검색은 동시에 진행할 수 없다"는 규칙이 별도 초기화 코드 없이 지켜집니다.

### ③ 실제 API 데이터를 보고 정한 변환 규칙

mapper 규칙을 짐작으로 정하지 않고 실제 응답 300건을 먼저 확인했습니다 ([PR #13](https://github.com/h1un/cdri-books-jeonghaeun/pull/13)).

| 실제 응답                               | 처리                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------ |
| 할인가 없음 `sale_price: -1` (16%)      | `salePrice: null` → 할인가 줄 숨김                                             |
| 정가 0원                                | `price: null` → "가격 정보 없음"                                               |
| 빈 썸네일 / 빈 책 소개                  | 대체 이미지 / "책 소개가 없습니다."                                            |
| **페이지를 이어 붙이면 같은 책이 중복** | 페이지를 합친 뒤 id로 중복 제거 (목록 key 충돌 방지)                           |
| 썸네일은 120×174만 제공 (다른 크기 403) | 펼친 표지(210×280)는 썸네일 URL 안의 원본 이미지를 사용, 실패 시 썸네일로 대체 |

### ④ 가상 스크롤과 성능 측정

창 스크롤 기반 가상 스크롤로 화면 근처의 아이템만 그립니다. 500권을 불러온 상태에서 측정한 결과입니다 (개발 모드, 3회 평균, [측정 방법](docs/PERFORMANCE.md)).

| 항목                | 가상 스크롤 | 일반 목록 + memo | 일반 목록 (memo 없음) |
| ------------------- | ----------: | ---------------: | --------------------: |
| 첫 렌더링 커밋 시간 |  **25.4ms** |          193.2ms |                     – |
| DOM 노드 수         |     **566** |            7,598 |                 7,598 |
| 아이템 펼치기       |       8.4ms |           11.5ms |            **50.2ms** |

- 첫 렌더링은 약 7.6배 빨라졌고, DOM 노드는 약 93% 줄었습니다. 대신 스크롤할 때 새 행을 마운트하는 비용(1000px당 약 8ms)이 생기는데, 한 프레임 안이라 무한 스크롤 화면에는 가상 스크롤이 유리하다고 판단했습니다.
- **펼침 상태는 목록이 보관**합니다. 아이템 내부 state로 두면 스크롤로 언마운트됐다 돌아올 때 접혀 버리기 때문입니다.
- 다음 페이지는 overscan이 아니라 **실제로 보이는 범위**를 기준으로 요청합니다. 처음엔 첫 화면에서 바로 2페이지를 요청하던 것을 측정 중 발견해 고쳤습니다.

### ⑤ 찜: 스냅샷, 해제 유지, 연타, 탭 동기화

- **스냅샷 저장**: 찜한 시점의 책 데이터를 통째로 저장합니다(Figma 주석). `Record<id, 책>`으로 저장해 찜 여부를 O(1)로 조회합니다.
- **해제해도 목록 유지**: 찜 페이지는 진입 시점의 목록을 고정합니다. 하트를 해제하면 빈 하트로 바뀌지만 새로고침·재진입 전까지 목록에 남아, 실수로 해제해도 같은 자리에서 되돌릴 수 있습니다. 바로 사라지면 아래 항목이 당겨져 연속으로 누르다 다른 책을 누르는 문제도 막습니다. 다시 찜하면 원래 순서로 돌아옵니다.
- **하트 하나만 리렌더**: 하트는 해당 책의 찜 여부만 selector로 구독합니다.
- **연타를 막지 않음**: 로컬에 동기적으로 저장되어 응답 순서가 꼬이는 문제가 구조적으로 없습니다. 누른 횟수대로 정확히 토글되는지 테스트했습니다.
- **탭 간 동기화**: zustand persist는 다른 탭의 변경을 반영하지 않아 나중에 저장한 탭이 덮어쓸 수 있습니다. `storage` 이벤트로 다시 불러옵니다.
- **저장 데이터 마이그레이션**: 펼친 표지 필드가 추가되면서 저장 버전을 v2로 올리고, 이전 데이터를 변환합니다.

### ⑥ 재사용 컴포넌트

- `BookListItem`(검색·찜 공용)은 찜 기능을 모르고, 하트를 슬롯(`thumbnailOverlay`, `coverOverlay`)으로 받습니다.
- `Button`의 변형·크기는 객체 맵으로 관리하고, "구매하기"처럼 링크(`<a>`)가 맞는 곳에도 `buttonClassName`으로 같은 스타일을 씁니다.
- `Popover`, `Select`, `EmptyState`, `ResultCount` 등은 도메인과 무관하게 `shared/ui`에 두었습니다.

<br />

## 5. 코드 컨벤션

말로만 정하지 않고, 강제할 수 있는 규칙은 ESLint로 검사합니다.

| 규칙                                                                                     | 강제 방법                                                           |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| JSX에서 `조건 ? <X /> : null` 금지, 중첩 삼항 금지                                       | `no-restricted-syntax`, `no-nested-ternary`                         |
| `&&` 등 조건식 왼쪽은 boolean만 (`{count && <X />}`에서 `0`이 렌더링되는 문제 방지)      | `@typescript-eslint/strict-boolean-expressions`                     |
| `any`, non-null 단언(`!`) 금지                                                           | `typescript-eslint` strict-type-checked                             |
| 컴포넌트는 `function` 선언문, named export                                               | `react/function-component-definition`, `import-x/no-default-export` |
| import 순서, `@/` 절대 경로                                                              | `import-x/order`                                                    |
| 분기: 화면 전체는 early return, 둘 중 하나는 컴포넌트 분리, 여러 종류는 객체 맵 + `cn()` | 리뷰                                                                |
| 계산 가능한 값은 state·`useEffect`로 만들지 않음                                         | 리뷰                                                                |
| 이름: boolean은 `is/has`, props는 `on*`, 구현은 `handle*`, 상수는 `UPPER_SNAKE`          | 리뷰                                                                |
| 주석은 "무엇"이 아니라 "왜"                                                              | 리뷰                                                                |

### Git

- 커밋: `<type>: <제목> (#이슈번호)` — type은 `feat` `fix` `refactor` `perf` `style` `design` `test` `docs` `chore`. commitlint로 검사합니다.
- 흐름: 이슈 → `<type>/#번호-설명` 브랜치 → PR(`Closes #번호`) → `main` 머지

<br />

## 6. 기획 판단 사항

Figma 유의사항("명시되지 않은 요구사항은 지원자 판단")에 따라 정한 내용입니다.

| 항목                         | 판단                                                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 메인 검색창 placeholder      | 주석은 '검색어 입력', 화면 디자인은 '검색어를 입력하세요'로 달라, 6개 화면 모두에 쓰인 화면 문구를 따름 (상세 검색 입력창은 '검색어 입력') |
| 검색 조건 URL 동기화         | 새로고침·뒤로가기·공유 시에도 같은 결과                                                                                                    |
| 상세 검색어의 검색 기록 저장 | 저장하지 않음. 기록에는 검색 기준 정보가 없어, 다시 눌렀을 때 다른 기준으로 검색되는 혼란 방지                                             |
| 상세 검색 팝업 기본값        | 셀렉트는 "제목". 상세 검색 중에 다시 열면 현재 조건 표시                                                                                   |
| 아코디언                     | 아이템마다 독립적으로, 여러 개 동시에 펼칠 수 있음                                                                                         |
| 접힌 아이템의 하트           | 찜 여부 표시 전용. 찜/해제는 펼친 표지의 하트로                                                                                            |
| 목록(접힘) 가격              | 할인가가 있으면 할인가(실제 결제 금액), 없으면 정가                                                                                        |
| 할인가가 없을 때             | 할인가 줄만 숨기고 원가는 취소선 없이 표시                                                                                                 |
| 가격 정보·책 소개가 없을 때  | "가격 정보 없음", "책 소개가 없습니다.", 표지 없음은 대체 이미지                                                                           |
| 찜 목록 정렬                 | 최근 찜한 순                                                                                                                               |
| 찜 해제                      | 새로고침·재진입 전까지 목록에 남김. "총 N건"은 실제 찜 개수                                                                                |
| 하트 연타                    | 막지 않고 누를 때마다 토글                                                                                                                 |
| 로딩·에러                    | 스켈레톤, 에러 메시지 + 다시 시도                                                                                                          |
| 반응형                       | 1920 데스크톱 디자인 기준. 본문 960px 가운데 정렬, 좁은 화면에서는 좌우 여백만 확보                                                        |

<br />

## 7. 한계와 개선 방향

- **API 키 노출**: `VITE_` 환경 변수는 빌드 시 클라이언트 번들에 포함됩니다. 과제 요구사항(저장소에 키를 올리지 않음)은 지켰지만, 실제 서비스라면 서버(BFF)나 서버리스 함수로 프록시해 키를 숨겨야 합니다.
- **찜을 서버에 저장한다면**: 지금은 로컬 동기 저장이라 연타를 막지 않습니다. 서버 연동 시에는 낙관적 업데이트로 화면을 먼저 바꾸고, 디바운스 후 최종 상태만 멱등한 `PUT` / `DELETE`로 보내며, 실패하면 롤백하도록 바꿀 계획입니다.
- **테스트 범위**: 순수 로직(검색 기록, 검색 조건, 찜 토글·마이그레이션, mapper, 가격, 페이지네이션) 48개는 단위 테스트로, 화면 동작은 브라우저에서 직접 확인했습니다. 컴포넌트 테스트(Testing Library)와 E2E(Playwright)는 다음 단계로 남겼습니다.
- **접근성**: 셀렉트의 화살표 키 탐색, 팝업 포커스 트랩은 아직 없습니다.
- **반응형**: 모바일 레이아웃은 디자인이 없어 깊게 다루지 않았습니다.
