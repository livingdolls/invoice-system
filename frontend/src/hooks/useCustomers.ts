import { useQuery } from "@tanstack/react-query";
import { CustomersRepository } from "../repository/customer";

export const useCustomers = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: CustomersRepository,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data,
    error,
    isLoading,
  };
};
