import { ChevronDown } from "lucide-react";
import type { TInvoiceDetail } from "../../types/invoice";

interface InvoiceDetailsViewProps {
  invoice: TInvoiceDetail;
}

export default function InvoiceDetailsView({
  invoice,
}: InvoiceDetailsViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Invoice Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Invoice ID
        </label>
        <div className="bg-input-600 w-[400px] h-[45px] rounded-md px-[16px] py-[14px] text-[#9B9FB0] text-sm">
          {invoice.invoice_number || "-"}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject
        </label>
        <div className="bg-input-600 w-[400px] h-[45px] rounded-md px-[16px] py-[14px] text-[#9B9FB0] text-sm">
          {invoice.subject || "-"}
        </div>
      </div>

      {/* Issue Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Issue Date
        </label>
        <div className="bg-input-600 w-[400px] h-[45px] rounded-md px-[16px] py-[14px] text-[#9B9FB0] text-sm relative">
          {invoice.issue_date
            ? new Date(invoice.issue_date).toLocaleDateString()
            : "-"}

            <ChevronDown className="absolute right-4 inset-y-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Due Date
        </label>
        <div className="bg-input-600 w-[400px] h-[45px] rounded-md px-[16px] py-[14px] text-[#9B9FB0] text-sm relative">
          {invoice.due_date
            ? new Date(invoice.due_date).toLocaleDateString()
            : "-"}
          <ChevronDown className="absolute right-4 inset-y-1/2 transform -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
}
