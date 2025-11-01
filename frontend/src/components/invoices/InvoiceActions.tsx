import type { InvoiceItem } from "../../types/invoice";
import { formatNumber } from "../../utils/formatNumber";

type InvoiceActionsProps = {
  onSubmit: (val: boolean) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  invoiceItems: InvoiceItem[];
  mode?: "create" | "edit";
}

export default function InvoiceActions({
  onSubmit,
  onCancel,
  isSubmitting,
  canSubmit,
  invoiceItems,
  mode = "create",
}: InvoiceActionsProps) {
  const submitText =
    mode === "edit"
      ? isSubmitting
        ? "Updating..."
        : "Save"
      : isSubmitting
      ? "Creating..."
      : "Create Invoice";
  
  const countSubtotal = invoiceItems.reduce((total, item) => total + item.amount, 0)
  const countTax = countSubtotal * (10 / 100);
  const grandAmount = countTax + countSubtotal;

  return (
    <div className="self-start bg-white w-full max-w-[270px] p-4 rounded-lg shadow-lg">
      <h2 className="font-lg mb-4 font-semibold">Invoice Summary</h2>

      <div className="flex flex-col gap-2 pb-[32px]">
        <div className="flex justify-between text-sm font-medium">
          <p>Item (s) </p>
          <p>{invoiceItems.length} items</p>
        </div>

        <div className="flex justify-between text-sm font-medium">
          <p>Sub Total </p>
          <p>{formatNumber(countSubtotal)} </p>
        </div>

        <div className="flex justify-between text-sm font-medium">
          <p>Tax (10%)</p>
          <p>{formatNumber(countTax)} </p>
        </div>

        <div className="flex justify-between text-sm font-medium">
          <p>Grand Total</p>
          <p className="font-bold text-[20px]">{formatNumber(grandAmount)} </p>
        </div>
      </div>

      <hr className="my-4" />

      <div className="flex flex-col gap-[10px]">
        <button
          type="button"
          onClick={() => onSubmit(true)}
          disabled={isSubmitting || !canSubmit}
          className="bg-[#AF91EB] font-semibold text-white rounded-lg py-3"
        >
          {submitText}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="text-[#FF8780] border border-[#FF8780] font-semibold  rounded-lg py-3"
        >
          Cancel
        </button>


      </div>
    </div>
  );
}
