import type { TCustomer } from "../../types/customer";

interface CustomerSelectionViewProps {
  customer: TCustomer;
}

export default function CustomerSelectionView({
  customer,
}: CustomerSelectionViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Customer Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Customer Name
        </label>
        <div className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900">
          {customer.name || "-"}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900">
          {customer.email || "-"}
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone
        </label>
        <div className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900">
          {customer.phone || "-"}
        </div>
      </div>

      {/* Address */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <div className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900 min-h-[80px]">
          {customer.address || "-"}
        </div>
      </div>
    </div>
  );
}
