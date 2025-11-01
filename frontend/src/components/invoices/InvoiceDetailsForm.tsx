import DatePicker from "../ui/DatePicker";

type InvoiceDetailsFormProps = {
  formData: {
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
      <h2 className="text-xl font-semibold mb-[14px]">
        Invoice Details
      </h2>

      <div className="space-y-4 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-2">
              Invoice ID
            </label>
            <input
              type="text"
              placeholder="ID will generate after created"
              className="bg-input-600 w-[400px] h-[45px] rounded-md px-[16px] py-[14px] text-[#9B9FB0] text-sm h-[46px] font-medium"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-xs">
              Subject
            </label>
            <input
              type="text"
              placeholder="Enter invoice subject"
              value={formData.subject}
              onChange={(e) => onFormChange("subject", e.target.value)}
              className="w-full p-3 focus:ring-0 focus:outline-0 focus:border-0 active:ring-0 focus active:outline-0 rounded-lg shadow-input text-sm h-[46px] font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-xs mb-2">
              Issue Date
            </label>
            <DatePicker value={formData.issueDate} onChange={(value) => onFormChange("issueDate", value || "")} 
              classBox="w-full bg-white p-3 focus:ring-0 flex justify-between focus:outline-0 rounded-lg shadow-input text-sm h-[46px] font-medium" 
              />
          </div>

          <div>
            <label className="block text-sm font-medium text-xs mb-2">
              Due Date
            </label>

            <DatePicker value={formData.dueDate} onChange={(value) => onFormChange("dueDate", value || "")} 
                classBox="w-full bg-white p-3 focus:ring-0 flex justify-between focus:outline-0 rounded-lg shadow-input text-sm h-[46px] font-medium" 
              />
          </div>
        </div>
      </div>
    </div>
  );
}
