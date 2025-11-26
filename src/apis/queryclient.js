import { QueryClient  } from "@tanstack/react-query";

export const esteticlickQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        if(error.message.includes('401') || error.message.includes('403') || error.message.includes('404')) { return false; }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },

    mutations: {
      retry: 1,
      onError: (error) => { console.error('Mutation error: ', error); },
    },
  },
});