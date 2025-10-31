import { ArrowLeft, Download, Pencil } from "lucide-react";

interface InvoiceViewActionsProps {
  onBack: () => void;
  onEdit: () => void;
  onDownload: () => void;
}

export default function InvoiceViewActions({
  onBack,
  onEdit,
  onDownload,
}: InvoiceViewActionsProps) {
  return (
    <div className="mt-8 flex justify-between items-center">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <ArrowLeft size={16} />
        Back to Invoices
      </button>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Download size={16} />
          Download PDF
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Pencil size={16} />
          Edit Invoice
        </button>
      </div>
    </div>
  );
}
