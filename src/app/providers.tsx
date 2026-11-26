import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode, useState } from 'react';

import { MissingEnvError } from '@/shared/config/env';

const FIVE_MINUTES = 1000 * 60 * 5;
const MAX_RETRY_COUNT = 1;

/** 일시적인 오류만 한 번 더 시도한다. API 키 누락처럼 다시 해도 실패하는 오류는 바로 보여준다. */
function shouldRetry(failureCount: number, error: Error) {
  if (error instanceof MissingEnvError) return false;
  return failureCount < MAX_RETRY_COUNT;
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 책 검색 결과는 자주 바뀌지 않으므로 같은 검색은 캐시를 재사용한다.
        staleTime: FIVE_MINUTES,
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
    },
  });
}

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
