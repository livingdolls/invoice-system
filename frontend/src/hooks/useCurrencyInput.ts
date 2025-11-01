import { useState, useCallback } from 'react';
import { formatCurrency, parseCurrency } from '../utils/currency';

interface UseCurrencyInputProps {
  initialValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
}

export const useCurrencyInput = ({
  initialValue = 0,
  onValueChange,
  min = 0,
  max = Infinity
}: UseCurrencyInputProps) => {
  const [displayValue, setDisplayValue] = useState(formatCurrency(initialValue));
  const [rawValue, setRawValue] = useState(initialValue);

  const handleInputChange = useCallback((inputValue: string) => {
    // Remove formatting and parse to number
    const numericValue = parseCurrency(inputValue);
    
    // Apply min/max constraints
    const constrainedValue = Math.min(Math.max(numericValue, min), max);
    
    // Update raw value
    setRawValue(constrainedValue);
    
    // Update display value with formatting
    if (inputValue === '' || inputValue === '0') {
      setDisplayValue('');
    } else {
      setDisplayValue(formatCurrency(constrainedValue));
    }
    
    // Call onChange callback with raw number
    onValueChange?.(constrainedValue);
  }, [onValueChange, min, max]);

  const handleInputFocus = useCallback(() => {
    // On focus, show raw value for easier editing
    if (rawValue === 0) {
      setDisplayValue('');
    } else {
      setDisplayValue(rawValue.toString());
    }
  }, [rawValue]);

  const handleInputBlur = useCallback(() => {
    // On blur, format the value for display
    if (displayValue === '' || displayValue === '0') {
      setDisplayValue('0.00');
      setRawValue(0);
      onValueChange?.(0);
    } else {
      const formatted = formatCurrency(rawValue);
      setDisplayValue(formatted);
    }
  }, [displayValue, rawValue, onValueChange]);

  const setValue = useCallback((value: number) => {
    setRawValue(value);
    setDisplayValue(formatCurrency(value));
  }, []);

  return {
    displayValue,
    rawValue,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    setValue,
  };
};