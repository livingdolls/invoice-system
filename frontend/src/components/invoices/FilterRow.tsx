import { type TRequestInvoice } from "../../types/invoice";

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
      <td className="px-6 py-4 whitespace-nowrap"></td>

      {/* Invoice ID Filter */}
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="text"
          value={filters.invoice_id}
          onChange={(e) => updateFilter("invoice_id", e.target.value)}
          placeholder="Invoice ID"
          className="border border-gray-500 h-8 rounded w-full max-w-[100px] px-2 text-sm"
        />
      </td>

      {/* Issue Date Filter */}
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="date"
          value={filters.issue_date || ""}
          onChange={(e) => updateFilter("issue_date", e.target.value || null)}
          className="border border-gray-500 h-8 rounded w-full max-w-[140px] px-2 text-sm"
        />
      </td>

      {/* Subject Filter */}
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="text"
          value={filters.subject}
          onChange={(e) => updateFilter("subject", e.target.value)}
          placeholder="Subject"
          className="border border-gray-500 h-8 rounded w-full max-w-[200px] px-2 text-sm"
        />
      </td>

      {/* Total Items - No filter needed */}
      <td className="px-6 py-4 whitespace-nowrap"></td>

      {/* Customer Name Filter */}
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="text"
          value={filters.customer_name}
          onChange={(e) => updateFilter("customer_name", e.target.value)}
          placeholder="Customer"
          className="border border-gray-500 h-8 rounded w-full max-w-[180px] px-2 text-sm"
        />
      </td>

      {/* Due Date Filter */}
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="date"
          value={filters.due_date || ""}
          onChange={(e) => updateFilter("due_date", e.target.value || null)}
          className="border border-gray-500 h-8 rounded w-full max-w-[140px] px-2 text-sm"
        />
      </td>

      {/* Status Filter */}
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={filters.status || ""}
          onChange={(e) =>
            updateFilter(
              "status",
              e.target.value ? (e.target.value as "paid" | "unpaid") : null
            )
          }
          className="border border-gray-500 h-8 rounded w-full max-w-[100px] px-2 text-sm"
        >
          <option value="">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </td>

      {/* Actions - No filter needed */}
      <td className="px-6 py-4 whitespace-nowrap"></td>
    </tr>
  );
}
