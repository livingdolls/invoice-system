import { ChevronDown } from "lucide-react";
import React, { useRef } from "react";

interface CustomDateInputProps {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  classBox?: string;
}

const DatePicker: React.FC<CustomDateInputProps> = ({
  value,
  onChange,
  placeholder = "",
  className = "",
  classBox = "",
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => {
    if (!inputRef.current) return;

    // Chrome / Edge
    if (typeof (inputRef.current as any).showPicker === "function") {
      (inputRef.current as any).showPicker();
      return;
    }

    // Fallback
    inputRef.current.click();
  };

  return (
    <div className={`relative w-full ${className}`} onClick={openPicker}>
      {/* Hidden real input */}
      <input
        ref={inputRef}
        type="date"
        className="absolute inset-0 opacity-0 cursor-pointer"
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
      />

      {/* Custom UI */}
      <div
        className={classBox}
      >
        {/* Text */}
        <span>
          {value || placeholder}
        </span>

        {/* Custom icon */}
        <ChevronDown size={24} />
      </div>
    </div>
  );
};

export default DatePicker;
