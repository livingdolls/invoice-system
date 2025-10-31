import { useState, useEffect } from "react";
import type { InvoiceItem, CustomerOption } from "../types/invoice";
import type { TItem } from "../types/item";
import type { TCreateInvoice, TInvoiceDetail } from "../types/invoice";

export function useEditInvoiceForm(initialData?: TInvoiceDetail) {
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOption | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [address, setAddress] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    subject: "",
    additionalNotes: "",
  });

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      setFormData({
        invoiceNumber: initialData.invoice_number,
        issueDate: initialData.issue_date.split("T")[0],
        dueDate: initialData.due_date.split("T")[0],
        subject: initialData.subject,
        additionalNotes: "",
      });

      // Set customer
      if (initialData.customer) {
        const customerOption: CustomerOption = {
          value: initialData.customer.id,
          label: initialData.customer.name,
          customer: initialData.customer,
        };
        setSelectedCustomer(customerOption);
        setAddress(initialData.customer.address || "");
      }

      // Set items
      if (initialData.items) {
        const items: InvoiceItem[] = initialData.items.map((item) => ({
          item: {
            id: item.item_id.toString(),
            name: item.item_name,
            type: item.type,
            is_active: true,
          },
          quantity: item.quantity,
          price: item.price,
          amount: item.total_price,
        }));
        setInvoiceItems(items);
      }
    }
  }, [initialData]);

  // Handler untuk update form data
  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler untuk memilih customer
  const handleCustomerChange = (option: CustomerOption | null) => {
    setSelectedCustomer(option);
    setAddress(option?.customer.address || "");
  };

  // Handler untuk memilih item dari modal (hanya 1 item)
  const handleItemSelect = (item: TItem) => {
    const newInvoiceItem: InvoiceItem = {
      item,
      quantity: 1,
      price: 0,
      amount: 0,
    };
    setInvoiceItems((prev) => [...prev, newInvoiceItem]);
  };

  // Handler untuk memilih multiple items dari modal
  const handleItemsSelect = (items: TItem[]) => {
    const newInvoiceItems: InvoiceItem[] = items.map((item) => ({
      item,
      quantity: 1,
      price: 0,
      amount: 0,
    }));

    // Merge dengan items yang sudah ada (avoid duplicate)
    setInvoiceItems((prev) => {
      const existingIds = prev.map((item) => item.item.id);
      const uniqueNewItems = newInvoiceItems.filter(
        (newItem) => !existingIds.includes(newItem.item.id)
      );
      return [...prev, ...uniqueNewItems];
    });
  };

  // Handler untuk update quantity
  const handleQuantityChange = (index: number, quantity: number) => {
    setInvoiceItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity, amount: quantity * item.price }
          : item
      )
    );
  };

  // Handler untuk update price
  const handlePriceChange = (index: number, price: number) => {
    setInvoiceItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, price, amount: item.quantity * price } : item
      )
    );
  };

  // Handler untuk remove item
  const handleRemoveItem = (index: number) => {
    setInvoiceItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation function
  const isFormValid = () => {
    return (
      formData.invoiceNumber.trim() !== "" &&
      formData.issueDate !== "" &&
      formData.dueDate !== "" &&
      formData.subject.trim() !== "" &&
      selectedCustomer !== null &&
      invoiceItems.length > 0 &&
      invoiceItems.every((item) => item.quantity > 0 && item.price >= 0)
    );
  };

  // Prepare data for submission
  const prepareInvoiceData = (): TCreateInvoice => {
    if (!selectedCustomer) {
      throw new Error("Customer is required");
    }

    return {
      invoice_number: formData.invoiceNumber,
      issue_date: new Date(formData.issueDate).toISOString(),
      due_date: new Date(formData.dueDate).toISOString(),
      subject: formData.subject,
      customer_id: selectedCustomer.value,
      items: invoiceItems.map((item) => ({
        item_id: parseInt(item.item.id),
        quantity: item.quantity,
        price: item.price,
      })),
    };
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      invoiceNumber: "",
      issueDate: "",
      dueDate: "",
      subject: "",
      additionalNotes: "",
    });
    setSelectedCustomer(null);
    setInvoiceItems([]);
    setAddress("");
  };

  return {
    // State
    formData,
    selectedCustomer,
    invoiceItems,
    address,

    // Handlers
    handleFormChange,
    handleCustomerChange,
    handleItemSelect,
    handleItemsSelect,
    handleQuantityChange,
    handlePriceChange,
    handleRemoveItem,

    // Utilities
    isFormValid,
    prepareInvoiceData,
    resetForm,

    // Setters for direct access if needed
    setAddress,
  };
}
