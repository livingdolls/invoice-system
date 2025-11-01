import { ChevronDown } from "lucide-react";
import type { TInvoiceItemDetail } from "../../types/invoice";

type InvoiceItemsViewProps = {
  items: TInvoiceItemDetail[];
};

export default function ListInvoiceItemsView({ items }: InvoiceItemsViewProps) {
  return (
    <div className="text-gray-600">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Details Items</h2>

      <div>
        {items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className=" mb-4 flex flex-row gap-x-4"
          >
            <div className="flex flex-col">
              <label className="text-sm mb-[6px]">Item</label>
              <div className="relative">
                <input
                  type="disabled"
                  className="bg-input-600 h-[45px] w-[297px] rounded-md px-[16px] py-[14px] text-[#9B9FB0] text-sm"
                  disabled
                  value={item.item_name}
                />

                <ChevronDown className="absolute right-4 inset-y-1/2 transform -translate-y-1/2" />
                </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-[6px]">Qty</label>
              <input
                type="disabled"
                className="bg-input-600 h-[45px] rounded-md w-[84px] text-right px-[16px] py-[14px] text-[#9B9FB0] text-sm"
                disabled
                value={item.quantity}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-[6px]">Unit Price</label>
              <input
                type="disabled"
                className="bg-input-600 h-[45px] rounded-md w-[189px] text-right px-[16px] py-[14px] text-[#9B9FB0] text-sm"
                disabled
                value={item.price}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-[6px]">Unit Price</label>
              <input
                type="disabled"
                className="bg-input-600 h-[45px] rounded-md w-[189px] text-right px-[16px] py-[14px] text-[#9B9FB0] text-sm"
                disabled
                value={item.total_price}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
