import bcrypt from 'bcryptjs';

export async function hashString(s) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(s, salt);
}
export async function compareHash(raw, hash) {
  return bcrypt.compare(raw, hash);
}
