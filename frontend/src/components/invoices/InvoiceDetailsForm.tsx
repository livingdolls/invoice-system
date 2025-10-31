interface InvoiceDetailsFormProps {
  formData: {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    subject: string;
  };
  onFormChange: (field: string, value: string) => void;
}

export default function InvoiceDetailsForm({
  formData,
  onFormChange,
}: InvoiceDetailsFormProps) {
  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Invoice Details
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Invoice Number *
          </label>
          <input
            type="text"
            placeholder="Enter invoice number"
            value={formData.invoiceNumber}
            onChange={(e) => onFormChange("invoiceNumber", e.target.value)}
            className="w-full p-3 focus:ring-0 focus:outline-0 rounded-lg shadow-input "
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            placeholder="Enter invoice subject"
            value={formData.subject}
            onChange={(e) => onFormChange("subject", e.target.value)}
            className="w-full p-3 focus:ring-0 focus:outline-0 rounded-lg shadow-input "
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Date *
            </label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={(e) => onFormChange("issueDate", e.target.value)}
              className="w-full p-3 focus:ring-0 focus:outline-0 rounded-lg shadow-input "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date *
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => onFormChange("dueDate", e.target.value)}
              className="w-full p-3 focus:ring-0 focus:outline-0 rounded-lg shadow-input "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
