import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { TItem } from "../types/item";
import { CreateItemRepository } from "../repository/item";

export const useCreateItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (itemData: Pick<TItem, "name" | "type">) => CreateItemRepository(itemData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ["items"]})
            console.log("items created success", data)
        },
        onError: (err) => {
            console.error("Error creating item", err)
        }
    })
}