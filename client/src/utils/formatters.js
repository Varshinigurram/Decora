/**
 * Formats a numeric price into standard Indian Rupee notation (INR - ₹).
 * Example: 28000 => "₹28,000", 112000 => "₹1,12,000"
 */
export const formatINR = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats metric dimensions into standard notation (Width × Depth × Height cm).
 */
export const formatMetricDimensions = (width, depth, height) => {
  return `${width} × ${depth} × ${height} cm`;
};
