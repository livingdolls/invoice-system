import React, { useEffect } from 'react';
import { useCurrencyInput } from '../../hooks/useCurrencyInput';

type CurrencyInputProps = {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder = '0.00',
  className = '',
  disabled = false,
  min = 0,
  max = Infinity,
  prefix = '',
  suffix = '',
}) => {
  const {
    displayValue,
    rawValue,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    setValue,
  } = useCurrencyInput({
    initialValue: value,
    onValueChange: onChange,
    min,
    max,
  });

  // Update internal value when external value changes
  useEffect(() => {
    if (value !== rawValue) {
      setValue(value);
    }
  }, [value, rawValue, setValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e.target.value);
  };

  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          {prefix}
        </span>
      )}
      
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          ${prefix ? 'pl-8' : ''}
          ${suffix ? 'pr-8' : ''}
          ${className}
        `.trim()}
      />
      
      {suffix && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          {suffix}
        </span>
      )}
    </div>
  );
};