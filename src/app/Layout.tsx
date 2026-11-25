import { Outlet } from 'react-router';

import { Header } from '@/widgets/header/Header';

export function Layout() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[960px] px-4 pt-20 pb-20 lg:px-0">
        <Outlet />
      </main>
    </>
  );
}
