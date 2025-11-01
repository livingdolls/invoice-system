/**
 * Format number as currency display (e.g., "1,234.56")
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format number as currency with symbol (e.g., "$1,234.56")
 */
export const formatCurrencyWithSymbol = (value: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/**
 * Parse currency string to number (removes commas and symbols)
 */
export const parseCurrency = (value: string): number => {
  // Remove all non-numeric characters except decimal point and minus sign
  const cleanValue = value.replace(/[^\d.-]/g, '');
  const parsedValue = parseFloat(cleanValue);
  return isNaN(parsedValue) ? 0 : parsedValue;
};

/**
 * Validate if string is a valid currency format
 */
export const isValidCurrency = (value: string): boolean => {
  const cleanValue = value.replace(/[^\d.-]/g, '');
  const parsedValue = parseFloat(cleanValue);
  return !isNaN(parsedValue) && parsedValue >= 0;
};