import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddCustomerRepository } from "../repository/customer";
import type { TCustomer } from "../types/customer";

export const useCreateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (customerData: Omit<TCustomer, "id">) =>
            AddCustomerRepository(customerData),

        onSuccess: (data) => {
            // Invalidate and refetch customers list
            queryClient.invalidateQueries({ queryKey: ["customers"] });

            console.log("Customer created successfully:", data);
        },
        
        onError: (error) => {
            console.error("Error creating customer:", error);
        },
    })
}