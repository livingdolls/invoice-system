import { Link } from "react-router-dom";
import { type TRequestInvoice } from "../../types/invoice";

interface FilterControlsProps {
  filters: TRequestInvoice;
  onResetFilters: () => void;
}

export function FilterControls({
  filters,
  onResetFilters,
}: FilterControlsProps) {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Filter Invoices</h3>
        <div className="flex gap-3">
          <button
            onClick={onResetFilters}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset Filters
          </button>
          <Link
            to={"/invoices/add"}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Invoice
          </Link>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Use the input fields in the table header below to filter the invoice
        list.
      </div>
      {/* Debug info - can be removed in production */}
      <div className="mt-2 p-3 bg-gray-50 rounded-md">
        <pre className="text-xs text-gray-700">
          Current filters: {JSON.stringify(filters, null, 2)}
        </pre>
      </div>
    </div>
  );
}
