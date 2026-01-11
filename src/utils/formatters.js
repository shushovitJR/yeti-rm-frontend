/**
 * Formats a number as Nepali/Indian Rupees
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "Rs. 1,23,456")
 */
export const formatCurrency = (amount) => {
  // Return empty string for null, undefined, 0, or '0'
  if (!amount || amount === 0 || amount === '0') return '';
  
  // Convert to number and format with Indian/Nepali numbering system
  const number = Number(amount);
  if (isNaN(number)) return '';
  
  // Format with Indian/Nepali numbering system (1,23,45,678.90)
  return `Rs. ${number.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  })}`;
};
