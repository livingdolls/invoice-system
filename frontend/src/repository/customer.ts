import { apiClient } from "../lib/api";
import { type TCustomer } from "../types/customer";

export const CustomersRepository = async () => {
  const res = await apiClient.get<TCustomer[]>("/customers");
  return res.data;
};

export const AddCustomerRepository = async (customer: Omit<TCustomer, "id">) => {
  const res = await apiClient.post<string>("/customers", customer);
  return res.data;
}