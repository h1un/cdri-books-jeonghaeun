import { NavLink } from 'react-router';

import { ROUTE_PATH } from '@/shared/config/routePath';
import { cn } from '@/shared/lib/cn';

const NAV_ITEMS = [
  { to: ROUTE_PATH.search, label: '도서 검색' },
  { to: ROUTE_PATH.favorites, label: '내가 찜한 책' },
] as const;

export function Header() {
  return (
    <header className="grid h-20 grid-cols-[1fr_auto_1fr] items-center px-6 xl:px-40">
      <h1 className="text-title1 font-bold text-black">CERTICOS BOOKS</h1>
      <nav aria-label="주요 메뉴">
        <ul className="flex gap-14">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end
                className={({ isActive }) =>
                  cn(
                    'block border-b pb-1 text-body1 font-medium text-black transition-colors',
                    isActive ? 'border-primary' : 'border-transparent hover:border-gray',
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
