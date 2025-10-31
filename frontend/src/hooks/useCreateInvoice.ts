import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type TCreateInvoice } from "../types/invoice";
import { CreateInvoiceRepository } from "../repository/Invoices";

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invoiceData: TCreateInvoice) =>
      CreateInvoiceRepository(invoiceData),

    onSuccess: (data) => {
      // Invalidate and refetch invoices list
      queryClient.invalidateQueries({ queryKey: ["invoices"] });

      console.log("Invoice created successfully:", data);
    },

    onError: (error) => {
      console.error("Error creating invoice:", error);
    },
  });
};
