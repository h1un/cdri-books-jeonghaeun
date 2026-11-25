import { Skeleton } from '@/shared/ui/Skeleton';

const SKELETON_ROW_COUNT = 5;

export function BookListSkeleton() {
  return (
    <ul aria-busy aria-label="도서 목록 불러오는 중">
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <li
          key={index}
          className="flex h-[100px] items-center gap-12 border-b border-gray pr-4 pl-10"
        >
          <Skeleton className="h-[68px] w-12 rounded-none" />
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="h-12 w-[238px] rounded-lg" />
        </li>
      ))}
    </ul>
  );
}
