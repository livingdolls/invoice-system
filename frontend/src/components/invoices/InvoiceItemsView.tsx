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
    <div className="text-gray-600">
      <div className="flex justify-between">
        <p>Item (s) </p>
        <p>{total_items} items</p>
      </div>

      <div className="flex justify-between">
        <p>Sub Total </p>
        <p>{subtotal} </p>
      </div>

      <div className="flex justify-between">
        <p>Tax (10%)</p>
        <p>{tax} </p>
      </div>

      <div className="flex justify-between">
        <p>Grand Total</p>
        <p>{amount} </p>
      </div>
    </div>
  );
}
