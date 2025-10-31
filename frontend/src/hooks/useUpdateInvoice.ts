import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateInvoiceRepository } from "../repository/Invoices";
import type { TCreateInvoice } from "../types/invoice";

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TCreateInvoice }) =>
      UpdateInvoiceRepository(id, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch invoice detail and list
      queryClient.invalidateQueries({ queryKey: ["invoice", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
