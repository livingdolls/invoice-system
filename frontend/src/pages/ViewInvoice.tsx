import { useParams, useNavigate } from "react-router-dom";
import { useEditInvoices } from "../hooks/useEditInvoices";
import InvoiceDetailsView from "../components/invoices/InvoiceDetailsView";
import CustomerSelectionView from "../components/invoices/CustomerSelectionView";
import InvoiceItemsView from "../components/invoices/InvoiceItemsView";
import InvoiceViewActions from "../components/invoices/InvoiceViewActions";
import ListInvoiceItemsView from "../components/invoices/ListInvoiceItemsView";
// import LoadingSpinner from '../../components/LoadingSpinner';

export default function ViewInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: invoice, isLoading, isError } = useEditInvoices(id || "");

  const handleBack = () => {
    navigate("/invoices");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  console.log(invoice);

  if (isError) {
    return (
      <div className="">
        <div className="">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading invoice
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Unable to load invoice details. Please try again.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Invoice not found
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>The requested invoice could not be found.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">View Invoice</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-6 py-2 rounded-lg font-medium ${
                  invoice.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                Status {" : "}
                {invoice.status.charAt(0).toUpperCase() +
                  invoice.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8 flex flex-row gap-6">
          <div className="w-full">
            {/* Invoice Details */}
            <div className="">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Invoice Details
              </h2>
              <InvoiceDetailsView invoice={invoice} />
            </div>

            {/* Customer Information */}
            <div className="mt-20">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Customer Information
              </h2>
              <CustomerSelectionView customer={invoice.customer} />
            </div>

            <hr className="my-10" />

            <div className="mt-10 ">
              <ListInvoiceItemsView items={invoice.items} />
            </div>
          </div>

          <div className="w-[400px] rounded-md shadow-lg bg-white self-baseline p-6">
            {/* Invoice Items */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Invoice Summary
              </h2>
              <InvoiceItemsView
                subtotal={invoice.subtotal}
                total_items={invoice.items.length}
                tax={invoice.tax}
                amount={invoice.total_amount}
              />

              <hr className="bg-gray-500 mt-6" />

              <button
                onClick={handleBack}
                className="bg-white rounded border-red-500 border px-4 py-2 text-lg text-red-500 mt-4 w-full"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
