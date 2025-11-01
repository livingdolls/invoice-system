import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ItemsRepository } from "../repository/item";
import { useState } from "react";
import { type TCreateInvoice } from "../types/invoice";

export const useItems = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [createInvoice, setCreateInvoice] = useState<TCreateInvoice>({
    issue_date: "",
    due_date: "",
    subject: "",
    customer_id: 0,
    items: [],
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["items", search],
    queryFn: () => ItemsRepository(search),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const handleOpen = (val: boolean) => {
    setOpen(val);
  };

  const handleSearch = (term: string) => {
    setSearch(term);
  };

  const handleChangeCreateInvoice = (invoiceData: TCreateInvoice) => {
    setCreateInvoice((prev) => ({
      ...prev,
      ...invoiceData,
    }));
  };

  return {
    data,
    isLoading,
    isError,
    open,
    handleOpen,
    search,
    handleSearch,
    createInvoice,
    handleChangeCreateInvoice,
  };
};
