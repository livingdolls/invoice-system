import { useCreateInvoice } from "../hooks/useCreateInvoice";
import { useInvoiceForm } from "../hooks/useInvoiceForm";

// Components
import InvoiceDetailsForm from "../components/invoices/InvoiceDetailsForm";
import CustomerSelection from "../components/invoices/CustomerSelection";
import InvoiceItemsManager from "../components/invoices/InvoiceItemsManager";
import InvoiceActions from "../components/invoices/InvoiceActions";
import AlertDialog from "../components/ui/AlertDialog";
import { Link, useNavigate } from "react-router-dom";

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
    dialog,
    setDialog,
  } = useInvoiceForm();
  const navigate = useNavigate();

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
          navigate("/invoices")

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
    navigate("/invoices");
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-row text-sm gap-x-2 mb-2">
        <Link to="/">Home</Link>
        <p>{">"}</p>
        <p className="text-accent-200">Add Invoice</p>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Add Invoice
        </h1>
      </div>

      <div className="flex flex-row gap-[60px]">
        <div className="flex flex-col gap-y-[30px] max-w-[840px]">
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

          <InvoiceItemsManager
            invoiceItems={invoiceItems}
            onQuantityChange={handleQuantityChange}
            onPriceChange={handlePriceChange}
            onRemoveItem={handleRemoveItem}
            onItemSelect={handleItemSelect}
            onItemsSelect={handleItemsSelect}
          />
        </div>

        <InvoiceActions
          onSubmit={() => setDialog(true)}
          onCancel={handleCancel}
          invoiceItems={invoiceItems}
          isSubmitting={isSubmitting}
          canSubmit={isFormValid()}
        />
      </div>

      <AlertDialog 
        open={dialog}
        onClose={() => setDialog(false)}
        onConfirm={handleSubmitInvoice}
        title="Are you sure to submit invoice?"
        description=""
        confirmText="Yes Submit"
        cancelText="No, back"
      />
    </div>
  );
}
