import { Session } from '../models/Session.js';
import { parseSessionToken, verifySessionSecret } from '../utils/sessionToken.js';

export async function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const raw = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!raw) return res.status(401).json({ error: 'Missing token' });

  const parsed = parseSessionToken(raw);
  if (!parsed) return res.status(401).json({ error: 'Invalid token format' });

  const session = await Session.findOne({ tokenId: parsed.tokenId, active: true });
  if (!session) return res.status(401).json({ error: 'Invalid session' });

  const ok = await verifySessionSecret(parsed.secret, session.secretHash);
  if (!ok) return res.status(401).json({ error: 'Invalid session' });

  session.lastUsedAt = new Date();
  await session.save();

  req.user = { id: session.userId.toString() };
  req.session = { id: session._id.toString(), tokenId: session.tokenId };
  return next();
}
