import type { TInvoiceItemDetail } from "../../types/invoice";

interface InvoiceItemsViewProps {
  items: TInvoiceItemDetail[];
}

export default function InvoiceItemsView({ items }: InvoiceItemsViewProps) {
  return (
    <div className="text-gray-600">
      <p>Items: {items.length} items</p>
      <p>
        Total: $
        {items.reduce((sum, item) => sum + item.total_price, 0).toFixed(2)}
      </p>
    </div>
  );
}
