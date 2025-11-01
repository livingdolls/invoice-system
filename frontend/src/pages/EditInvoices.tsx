import { useParams, useNavigate, Link } from "react-router-dom";
import { useEditInvoices } from "../hooks/useEditInvoices";
import { useUpdateInvoice } from "../hooks/useUpdateInvoice";
import { useEditInvoiceForm } from "../hooks/useEditInvoiceForm";

// Components
import InvoiceDetailsForm from "../components/invoices/InvoiceDetailsForm";
import CustomerSelection from "../components/invoices/CustomerSelection";
import InvoiceItemsManager from "../components/invoices/InvoiceItemsManager";
import InvoiceActions from "../components/invoices/InvoiceActions";
import AlertDialog from "../components/ui/AlertDialog";

export default function EditInvoices() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-700">No invoice ID provided.</p>
        </div>
      </div>
    );
  }

  const { data: invoiceData, isLoading, isError } = useEditInvoices(id);
  const { mutate: updateInvoice, isPending: isUpdating } = useUpdateInvoice();

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
    setAddress,
    dialog,
    setDialog
  } = useEditInvoiceForm(invoiceData);

  // Handler untuk update invoice
  const handleUpdateInvoice = () => {
    if (!isFormValid()) {
      alert("Please fill in all required fields and add at least one item.");
      return;
    }

    try {
      const invoiceUpdateData = prepareInvoiceData();
      console.log("Updating invoice data:", invoiceUpdateData);

      updateInvoice(
        { id, data: invoiceUpdateData },
        {
          onSuccess: (response) => {
            alert("Invoice updated successfully!");
            console.log("Invoice updated:", response);
            navigate("/invoices");
          },
          onError: (error) => {
            alert(`Error updating invoice: ${error.message}`);
            console.error("Error:", error);
          },
        }
      );
    } catch (error) {
      alert(`Error preparing invoice data: ${error}`);
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    navigate("/invoices");
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading invoice...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-700">
            Failed to load invoice data. Please try again.
          </p>
          <button
            onClick={() => navigate("/invoices")}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex flex-row text-sm gap-x-2 mb-2">
        <Link to="/">Home</Link>
        <p>{">"}</p>
        <p className="text-accent-200">Edit Invoice</p>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Invoice</h1>
      </div>

      <div className="flex flex-row gap-[60px]">
        <div className="flex flex-col gap-y-[30px] w-full max-w-[840px]">
        {/* Invoice Details Section */}
          <InvoiceDetailsForm
            formData={formData}
            onFormChange={handleFormChange}
          />

          {/* Customer Information Section */}
          <CustomerSelection
            selectedCustomer={selectedCustomer}
            onCustomerChange={handleCustomerChange}
            onAddressChange={setAddress}
            address={address}
          />


          {/* Invoice Items Section */}
          <InvoiceItemsManager
            invoiceItems={invoiceItems}
            onQuantityChange={handleQuantityChange}
            onPriceChange={handlePriceChange}
            onRemoveItem={handleRemoveItem}
            onItemSelect={handleItemSelect}
            onItemsSelect={handleItemsSelect}
          />
        </div>


        {/* Action Buttons */}
        <InvoiceActions
          onSubmit={() => setDialog(true)}
          onCancel={handleCancel}
          isSubmitting={isUpdating}
          canSubmit={isFormValid()}
          invoiceItems={invoiceItems}
          mode="edit"
        />

      </div>

      <AlertDialog 
        open={dialog}
        onClose={() => setDialog(false)}
        onConfirm={handleUpdateInvoice}
        title="Are you sure to update invoice?"
        description=""
        confirmText="Yes Update"
        cancelText="No, back"
      />
      
    </div>
  );
}
