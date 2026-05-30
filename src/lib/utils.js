export function formatPrice(price) {
  return `€${Number(price).toFixed(2)}`;
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateShipping(shipping) {
  return !!(shipping.name && shipping.address && shipping.city && shipping.zip && shipping.phone);
}

export function getStockLabel(quantity) {
  if (quantity === 0) return { text: "Sold Out", color: "text-red-500" };
  if (quantity <= 3) return { text: `Only ${quantity} left`, color: "text-red-500" };
  if (quantity <= 5) return { text: `Low stock — only ${quantity} left`, color: "text-red-500" };
  return null;
}
