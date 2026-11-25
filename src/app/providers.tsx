import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode, useState } from 'react';

const FIVE_MINUTES = 1000 * 60 * 5;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 책 검색 결과는 자주 바뀌지 않으므로 같은 검색은 캐시를 재사용한다.
        staleTime: FIVE_MINUTES,
        retry: 1,
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
