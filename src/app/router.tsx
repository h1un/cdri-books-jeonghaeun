import { createBrowserRouter } from 'react-router';

import { Layout } from '@/app/Layout';
import { ROUTE_PATH } from '@/app/routePath';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { SearchPage } from '@/pages/SearchPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: ROUTE_PATH.search, element: <SearchPage /> },
      { path: ROUTE_PATH.favorites, element: <FavoritesPage /> },
    ],
  },
]);
