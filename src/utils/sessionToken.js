import crypto from 'crypto';
import { hashString, compareHash } from './crypto.js';

export async function createSessionToken() {
  const tokenId = crypto.randomBytes(16).toString('hex');
  const secret  = crypto.randomBytes(32).toString('hex');
  const token   = `${tokenId}.${secret}`;
  const secretHash = await hashString(secret);
  return { token, tokenId, secretHash };
}

export async function verifySessionSecret(secret, secretHash) {
  return compareHash(secret, secretHash);
}

export function parseSessionToken(raw) {
  if (!raw || !raw.includes('.')) return null;
  const [tokenId, secret] = raw.split('.');
  if (!tokenId || !secret) return null;
  return { tokenId, secret };
}
