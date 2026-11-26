import { Button } from '@/shared/ui/Button';

type LoadMoreErrorProps = {
  onRetry: () => void;
};

/** 다음 페이지를 불러오지 못했을 때 목록 끝에 보여준다. 이미 불러온 목록은 그대로 둔다. */
export function LoadMoreError({ onRetry }: LoadMoreErrorProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-6 text-center">
      <p className="text-body2 text-text-secondary">다음 도서를 불러오지 못했습니다.</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}
