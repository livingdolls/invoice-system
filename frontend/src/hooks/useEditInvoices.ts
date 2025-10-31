import { useQuery } from "@tanstack/react-query";
import { GetInvoiceByIdRepository } from "../repository/Invoices";

export const useEditInvoices = (id: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => GetInvoiceByIdRepository(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data,
    isLoading,
    isError,
  };
};
