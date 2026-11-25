import { createBrowserRouter } from 'react-router';

import { Layout } from '@/app/Layout';
import { RouteFallback } from '@/app/RouteFallback';
import { ROUTE_PATH } from '@/app/routePath';
import { SearchPage } from '@/pages/SearchPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    hydrateFallbackElement: <RouteFallback />,
    children: [
      { path: ROUTE_PATH.search, element: <SearchPage /> },
      {
        path: ROUTE_PATH.favorites,
        // 첫 화면(검색)에 필요 없는 찜 페이지는 별도 청크로 나눠 필요할 때 불러온다.
        lazy: async () => {
          const { FavoritesPage } = await import('@/pages/FavoritesPage');
          return { Component: FavoritesPage };
        },
      },
    ],
  },
]);
