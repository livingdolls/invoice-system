import { ChevronDown } from "lucide-react";
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
        <div className="bg-input-600 w-[400px] h-[45px] rounded-md px-[16px] py-[14px] text-[#9B9FB0] text-sm relative">
          {customer.name || "-"}

          <ChevronDown className="absolute right-4 inset-y-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Address */}
      <div className="">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <div className="bg-input-600 w-[400px] h-[65px] rounded-md px-[16px] py-[14px] text-[#9B9FB0] text-sm">
          {customer.address || "-"}
        </div>
      </div>
    </div>
  );
}
