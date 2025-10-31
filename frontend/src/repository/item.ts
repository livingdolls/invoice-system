import { apiClient } from "../lib/api";
import type { TItem } from "../types/item";

export const ItemsRepository = async (nameOrType: string) => {
  const params = new URLSearchParams();
  if (nameOrType) {
    params.append("name_or_type", nameOrType);
  }

  const res = await apiClient.get<TItem[]>(`/items?${params.toString()}`);
  return res.data;
};
