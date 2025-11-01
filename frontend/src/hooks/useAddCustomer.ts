import { useState } from "react";
import { type TCustomer } from "../types/customer";
import type { TItem } from "../types/item";

export const useAddCustomer = () => {
    const [formData, setFormData] = useState<Omit<TCustomer, "id">>({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const [formDataItem, setFormDataItem] = useState<Pick<TItem, "name" | "type">>({
        name : "",
        type: "",
    });

    // Handler untuk update form data
    const handleFormChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFormChangeItem = (field: string, value: string) => {
        setFormDataItem((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const isFormItemValid = () => {
        return (
            formDataItem.name.trim() !== "" &&
            formDataItem.type.trim() !== ""
        )
    }

    const prepareItemData = () => {
        return {
            name : formDataItem.name,
            type : formDataItem.type
        }
    }

    const resetFormItem = () => {
        setFormDataItem({
            name : "",
            type: "",
        })
    }

    const isFormValid = () => {
        return (
            formData.name.trim() !== "" &&
            formData.email.trim() !== "" &&
            formData.phone.trim() !== "" &&
            formData.address.trim() !== ""
        );
    }

    const prepareCustomerData = () => {
        return {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
        };
    }

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
        });
    }

    return {
        formData,
        handleFormChange,
        isFormValid,
        resetForm,
        prepareCustomerData,
        formDataItem,
        handleFormChangeItem,
        isFormItemValid,
        resetFormItem,
        prepareItemData,
    };
}