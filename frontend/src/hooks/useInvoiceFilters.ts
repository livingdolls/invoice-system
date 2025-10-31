import { useState, useCallback } from "react";
import { type TRequestInvoice } from "../types/invoice";

const initialFilters: TRequestInvoice = {
  invoice_id: "",
  issue_date: "",
  subject: "",
  customer_name: "",
  due_date: "",
  status: null,
  limit: 10,
  page: 1,
};

export function useInvoiceFilters() {
  const [filters, setFilters] = useState<TRequestInvoice>(initialFilters);

  const updateFilters = useCallback((newFilters: TRequestInvoice) => {
    setFilters(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const updateSingleFilter = useCallback(
    (field: keyof TRequestInvoice, value: any) => {
      setFilters((prev: TRequestInvoice) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  return {
    filters,
    updateFilters,
    resetFilters,
    updateSingleFilter,
  };
}
