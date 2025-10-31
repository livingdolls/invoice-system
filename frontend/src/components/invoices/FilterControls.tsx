import { Link } from "react-router-dom";

import { CirclePlus } from "lucide-react";

interface FilterControlsProps {}

export function FilterControls({}: FilterControlsProps) {
  return (
    <div className="p-4 bg-accent-50">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Filter Invoices</h3>
        <div className="flex gap-3">
          <Link
            to={"/invoices/add"}
            className="px-4 py-2 border border-transparent bg-shadow-30 rounded-md shadow-sm text-sm font-medium text-white bg-accent-200  focus:outline-none focus:ring-2 focus:ring-offset-2 flex flex-row items-center gap-2"
          >
            <CirclePlus />
            Add Invoice
          </Link>
        </div>
      </div>
    </div>
  );
}
