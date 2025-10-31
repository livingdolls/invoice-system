import { useCreateInvoice } from "../hooks/useCreateInvoice";
import { useInvoiceForm } from "../hooks/useInvoiceForm";

// Components
import InvoiceDetailsForm from "../components/invoices/InvoiceDetailsForm";
import CustomerSelection from "../components/invoices/CustomerSelection";
import InvoiceItemsManager from "../components/invoices/InvoiceItemsManager";
import InvoiceActions from "../components/invoices/InvoiceActions";

export default function AddInvoices() {
  const {
    formData,
    selectedCustomer,
    invoiceItems,
    address,
    handleFormChange,
    handleCustomerChange,
    handleItemSelect,
    handleItemsSelect,
    handleQuantityChange,
    handlePriceChange,
    handleRemoveItem,
    isFormValid,
    prepareInvoiceData,
    resetForm,
    setAddress,
  } = useInvoiceForm();

  const { mutate: submitInvoice, isPending: isSubmitting } = useCreateInvoice();

  const handleSubmitInvoice = () => {
    if (!isFormValid()) {
      alert("Please fill in all required fields and add at least one item.");
      return;
    }

    try {
      const invoiceData = prepareInvoiceData();
      console.log("Submitting invoice data:", invoiceData);

      submitInvoice(invoiceData, {
        onSuccess: (response) => {
          alert("Invoice created successfully!");
          console.log("Invoice created:", response);
          resetForm();
        },
        onError: (error) => {
          alert(`Error creating invoice: ${error.message}`);
          console.error("Error:", error);
        },
      });
    } catch (error) {
      alert(`Error preparing invoice data: ${error}`);
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleSaveDraft = () => {
    alert("Save draft functionality not implemented yet");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Invoice
        </h1>
        <p className="text-gray-600">
          Fill in the details below to create a new invoice
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-b">
        <InvoiceDetailsForm
          formData={formData}
          onFormChange={handleFormChange}
        />

        <CustomerSelection
          selectedCustomer={selectedCustomer}
          onCustomerChange={handleCustomerChange}
          onAddressChange={setAddress}
          address={address}
        />
      </div>

      <InvoiceItemsManager
        invoiceItems={invoiceItems}
        onQuantityChange={handleQuantityChange}
        onPriceChange={handlePriceChange}
        onRemoveItem={handleRemoveItem}
        onItemSelect={handleItemSelect}
        onItemsSelect={handleItemsSelect}
      />

      <InvoiceActions
        onSubmit={handleSubmitInvoice}
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
        isSubmitting={isSubmitting}
        canSubmit={isFormValid()}
      />
    </div>
  );
}
