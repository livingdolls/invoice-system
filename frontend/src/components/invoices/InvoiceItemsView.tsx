import { formatNumber } from "../../utils/formatNumber";

type InvoiceItemsViewProps = {
  subtotal: number;
  total_items: number;
  tax: number;
  amount: number;
};

export default function InvoiceItemsView({
  subtotal,
  total_items,
  tax,
  amount,
}: InvoiceItemsViewProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-sm font-medium">
        <p>Item (s) </p>
        <p>{total_items} items</p>
      </div>

      <div className="flex justify-between text-sm font-medium">
        <p>Sub Total </p>
        <p>{formatNumber(subtotal)} </p>
      </div>

      <div className="flex justify-between text-sm font-medium">
        <p>Tax (10%)</p>
        <p>{formatNumber(tax)} </p>
      </div>

      <div className="flex justify-between text-sm font-medium">
        <p>Grand Total</p>
        <p className="font-bold text-[20px]">{formatNumber(amount)} </p>
      </div>
    </div>
  );
}
