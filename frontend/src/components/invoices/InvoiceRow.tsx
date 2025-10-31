import { ArrowDownToLine, Eye, Pencil } from "lucide-react";
import { type TInvoice } from "../../types/invoice";
import { Link } from "react-router-dom";

interface InvoiceRowProps {
  invoice: TInvoice;
  index: number;
}

export function InvoiceRow({ invoice, index }: InvoiceRowProps) {
  const getStatusColor = (status: string) => {
    return status === "paid" ? "text-green-600" : "text-red-500";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {invoice.invoice_number}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {formatDate(invoice.issue_date)}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{invoice.subject}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex px-2 py-1 text-xs font-semibold">
          {invoice.total_items}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{invoice.customer_name}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
        <div className="text-sm text-gray-900">
          {formatDate(invoice.due_date)}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
        <div className={`text-sm ${getStatusColor(invoice.status)}`}>
          {invoice.status}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
        <div className="flex flex-row gap-2 justify-center">
          <button
            title="Download Invoice"
            className="text-green-500 hover:text-green-700 transition-colors"
          >
            <ArrowDownToLine width={18} height={18} strokeWidth={1.5} />
          </button>

          <Link
            to={`/invoices/view/${invoice.id}`}
            title="View Invoice"
            className="text-purple-500 hover:text-purple-700 transition-colors"
          >
            <Eye width={18} height={18} strokeWidth={1.5} />
          </Link>

          <Link
            to={`/invoices/edit/${invoice.id}`}
            title="Edit Invoice"
            className="text-purple-500 hover:text-purple-700 transition-colors"
          >
            <Pencil width={18} height={18} strokeWidth={1.5} />
          </Link>
        </div>
      </td>
    </tr>
  );
}
