import { Outlet } from 'react-router';

export function Layout() {
  return (
    <main className="mx-auto w-full max-w-[960px] px-4 py-20">
      <Outlet />
    </main>
  );
}
