export function generateInitialPassword(name, phone) {
  const letters = (name || '').toLowerCase().replace(/[^a-z]/g, '');
  const first4 = (letters.slice(0, 4) || '').padEnd(4, 'x');

  const digits = (phone || '').replace(/\D/g, '');
  const last4 = (digits.slice(-4) || '').padStart(4, '0');

  return `${first4}${last4}`;
}
