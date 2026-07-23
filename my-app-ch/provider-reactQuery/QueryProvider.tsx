'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // We use useState to ensure the QueryClient is only created once per user session
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Data stays "fresh" for 5 minutes before refetching in the background
        staleTime: 5 * 60 * 1000, 
        // Do not refetch instantly if the user clicks away and back to the window
        refetchOnWindowFocus: false, 
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Adds a little floating button in dev mode to inspect your cached data */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}