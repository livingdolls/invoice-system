import React from 'react';
import type { TInvoiceDetail } from '../../types/invoice';

interface PrintableInvoiceProps {
  invoice: TInvoiceDetail;
}

const PrintableInvoice = React.forwardRef<HTMLDivElement, PrintableInvoiceProps>(
  ({ invoice }, ref) => {
    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-black">INVOICE</h1>
            <span
              className={`px-3 py-1 text-xs font-bold text-white rounded ${
                invoice.status === 'paid' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {invoice.status.toUpperCase()}
            </span>
          </div>
          
          <div className="text-left flex flex-row gap-4">
            <p className=" text-sm mb-1 font-bold">From</p>
            <div className='border-l-2 border-gray-500 pl-4'>
                <h2 className="font-bold text-lg mb-1">Discovery Designs</h2>
                <p className=" text-sm">41 St Vincent Place</p>
                <p className=" text-sm">Glasgow G1 2ER</p>
                <p className=" text-sm">Skotland</p>
            </div>
          </div>
        </div>

        {/* Invoice Details and Customer Info */}
        <div className="flex justify-between mb-8">
          <div>
            <div className="">
              <div className="flex">
                <span className="text-sm  w-24">Invoice ID</span>
                <span className="text-sm font-medium border-l-2 border-gray-300 pl-2">{invoice.invoice_number}</span>
              </div>
              <div className="flex">
                <span className="text-sm  w-24">Issue Date</span>
                <span className="text-sm font-medium border-l-2 border-gray-300 pl-2">
                  {new Date(invoice.issue_date).toLocaleDateString('en-GB')}
                </span>
              </div>
              <div className="flex">
                <span className="text-sm  w-24">Due Date</span>
                <span className="text-sm font-medium border-l-2 border-gray-300 pl-2">
                  {new Date(invoice.due_date).toLocaleDateString('en-GB')}
                </span>
              </div>
              <div className="flex">
                <span className="text-sm  w-24">Subject</span>
                <span className="text-sm font-medium border-l-2 border-gray-300 pl-2">{invoice.subject}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-row gap-4 max-w-[230px]">
            <p className=" text-sm mb-1 font-bold text-right"> {" "}For</p>
            <div className='border-l-2 border-gray-500 pl-4'>
                <h3 className="font-bold text-lg mb-2">{invoice.customer.name}</h3>
                {invoice.customer.address && (
                <p className=" text-sm">{invoice.customer.address}</p>
                )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">
                  Item Type
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">
                  Description
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700">
                  Quantity
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold text-gray-700">
                  Unit Price
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold text-gray-700">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className={index % 2 === 1 ? 'bg-gray-50' : ''}>
                  <td className="border border-gray-300 px-3 py-2 text-sm">
                    {item.type}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">
                    {item.item_name}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-sm text-center">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-sm text-right">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-sm text-right">
                    ${item.total_price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>${invoice.tax.toFixed(2)}</span>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-lg font-bold bg-gray-100 px-3 py-2">
                  <span>Amount Due</span>
                  <span>${invoice.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrintableInvoice.displayName = 'PrintableInvoice';

export default PrintableInvoice;