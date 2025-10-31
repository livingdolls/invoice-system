import { QueryClient } from "@tanstack/react-query";

// Create a query client instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Time in milliseconds that unused data stays in cache
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

      // Retry failed requests
      retry: (failureCount, error: any) => {
        // Don't retry 4xx errors except 429 (rate limit)
        if (
          error?.response?.status >= 400 &&
          error?.response?.status < 500 &&
          error?.response?.status !== 429
        ) {
          return false;
        }
        return failureCount < 3;
      },

      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus (useful for real-time data)
      refetchOnWindowFocus: false,

      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations
      retry: (failureCount, error: any) => {
        // Don't retry 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },

      // Show error notifications for mutations
      onError: (error: any) => {
        console.error("Mutation error:", error);
        // You can add toast notifications here
        // toast.error(error?.response?.data?.error?.message || 'An error occurred');
      },
    },
  },
});

// Query keys factory for better organization
export const queryKeys = {
  all: ["api"] as const,

  // Customers
  customers: () => [...queryKeys.all, "customers"] as const,
  customer: (id: string) => [...queryKeys.customers(), id] as const,

  // Invoices
  invoices: () => [...queryKeys.all, "invoices"] as const,
  invoice: (id: string) => [...queryKeys.invoices(), id] as const,
  invoicesByCustomer: (customerId: string) =>
    [...queryKeys.invoices(), "customer", customerId] as const,

  // Items
  items: () => [...queryKeys.all, "items"] as const,
  item: (id: string) => [...queryKeys.items(), id] as const,
} as const;

// Utility function to invalidate related queries
export const invalidateQueries = {
  customers: () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.customers() }),
  customer: (id: string) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.customer(id) }),
  invoices: () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.invoices() }),
  invoice: (id: string) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.invoice(id) }),
  items: () => queryClient.invalidateQueries({ queryKey: queryKeys.items() }),
  all: () => queryClient.invalidateQueries({ queryKey: queryKeys.all }),
};

export default queryClient;
