import React from "react";

type AlertDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  title,
  description,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-[#0E123E] bg-opacity-70  flex items-center justify-center z-50">
      <div className="bg-[#F4F7FD] w-[80vw] max-w-[424px] p-[50px] rounded-xl shadow-lg animate-[fadeIn_.2s_ease]">
        <h2 className="text-lg font-semibold text-center">{title}</h2>

        {description && (
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="h-[43px] px-[20px] w-[170px] border border-[#FF8780] text-[#FF8780] rounded-lg font-bold"
          >
            {cancelText}
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="h-[43px] px-[20px] w-[170px] border bg-[#AF91EB]  shadow-purple text-white rounded-lg font-bold"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
