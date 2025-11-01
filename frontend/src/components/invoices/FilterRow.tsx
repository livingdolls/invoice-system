import { ChevronDown } from "lucide-react";
import { type TRequestInvoice } from "../../types/invoice";
import DatePicker from "../ui/DatePicker";

interface FilterRowProps {
  filters: TRequestInvoice;
  onFiltersChange: (filters: TRequestInvoice) => void;
}

export function FilterRow({ filters, onFiltersChange }: FilterRowProps) {
  const updateFilter = (field: keyof TRequestInvoice, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <tr>
      <td className="px-6 py-1 whitespace-nowrap"></td>

      {/* Invoice ID Filter */}
      <td className="px-6 py-1 whitespace-nowrap">
        <input
          type="text"
          value={filters.invoice_id}
          onChange={(e) => updateFilter("invoice_id", e.target.value)}
          className="shadow-input h-10 rounded-[10px] w-full max-w-[70px] px-2 text-sm focus-visible:ring-0 focus-visible:outline-none focus:outline-none"
        />
      </td>

      {/* Issue Date Filter */}
      <td className="px-6 py-1 whitespace-nowrap">
        <DatePicker value={filters.issue_date || ""} onChange={(value) => updateFilter("issue_date", value)} classBox="h-10 w-full px-3 flex items-center justify-between
          rounded-[10px] shadow-input text-sm bg-white cursor-pointer" />
      </td>

      {/* Subject Filter */}
      <td className="px-6 py-1 whitespace-nowrap">
        <input
          type="text"
          value={filters.subject}
          onChange={(e) => updateFilter("subject", e.target.value)}
          placeholder="Subject"
          className="shadow-input h-10 rounded-[10px] w-full max-w-[259px] px-2 text-sm"
        />
      </td>

      {/* Total Items - No filter needed */}
      <td className="px-6 py-1 whitespace-nowrap">
        <input 
          type="text"
          value={filters.total_items}
          onChange={(e) => updateFilter("total_items", e.target.value)}
          className="shadow-input h-10 rounded-[10px] w-full max-w-[76px] px-2 text-sm"
        />
      </td>

      {/* Customer Name Filter */}
      <td className="px-6 py-1 whitespace-nowrap">
        <input
          type="text"
          value={filters.customer_name}
          onChange={(e) => updateFilter("customer_name", e.target.value)}
          placeholder="Customer"
          className="shadow-input h-10 rounded-[10px] w-full max-w-[185px] px-2 text-sm"
        />
      </td>

      {/* Due Date Filter */}
      <td className="px-6 py-1 whitespace-nowrap">
        <DatePicker value={filters.due_date || ""} onChange={(value) => updateFilter("due_date", value)} classBox="h-10 w-full px-3 flex items-center justify-between
          rounded-[10px] shadow-input text-sm bg-white cursor-pointer" />
      </td>

      {/* Status Filter */}
      <td className="px-6 py-1 whitespace-nowrap">
        <div className="relative">
          <select
            value={filters.status || ""}
            onChange={(e) =>
              updateFilter(
                "status",
                e.target.value ? (e.target.value as "paid" | "unpaid") : null
              )
            }
            className="shadow-input h-10 rounded-[10px] bg-white w-full max-w-[89px] px-2 text-sm appearance-none cursor-pointer border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value=""></option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ChevronDown size={24} />
          </div>
        </div>
      </td>

      {/* Actions - No filter needed */}
      <td className="px-6 py-1 whitespace-nowrap"></td>
    </tr>
  );
}
