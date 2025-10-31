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
              <label>Item</label>
              <input
                type="disabled"
                className="h-14 rounded px-6"
                disabled
                value={item.item_name}
              />
            </div>

            <div className="flex flex-col">
              <label>Qty</label>
              <input
                type="disabled"
                className="h-14 rounded w-[100px] text-right px-6"
                disabled
                value={item.quantity}
              />
            </div>

            <div className="flex flex-col">
              <label>Unit Price</label>
              <input
                type="disabled"
                className="h-14 rounded w-[200px] text-right px-6"
                disabled
                value={item.price}
              />
            </div>

            <div className="flex flex-col">
              <label>Unit Price</label>
              <input
                type="disabled"
                className="h-14 rounded w-[200px] text-right px-6"
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
