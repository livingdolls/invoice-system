import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { InvoicesRepository } from "../repository/Invoices";
import type { TRequestInvoice } from "../types/invoice";

export const useInvoices = (req: TRequestInvoice) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["invoices", req],
    queryFn: () => InvoicesRepository(req),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  return {
    data,
    error,
    isLoading,
  };
};
