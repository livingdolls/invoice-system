interface InvoiceActionsProps {
  onSubmit: () => void;
  onCancel: () => void;
  onSaveDraft: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  mode?: "create" | "edit";
}

export default function InvoiceActions({
  onSubmit,
  onCancel,
  onSaveDraft,
  isSubmitting,
  canSubmit,
  mode = "create",
}: InvoiceActionsProps) {
  const submitText =
    mode === "edit"
      ? isSubmitting
        ? "Updating..."
        : "Update Invoice"
      : isSubmitting
      ? "Creating..."
      : "Create Invoice";

  return (
    <div className="mt-8 flex justify-end space-x-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSaveDraft}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Save Draft
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting || !canSubmit}
        className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {submitText}
      </button>
    </div>
  );
}
