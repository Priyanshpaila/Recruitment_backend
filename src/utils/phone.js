import { parsePhoneNumber } from 'libphonenumber-js';
export function toE164(phone) {
  const p = parsePhoneNumber(phone);
  if (!p?.isValid()) throw new Error('Invalid phone number');
  return p.number;
}
