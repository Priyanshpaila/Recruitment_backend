import { registerSchema, loginSchema, changePasswordSchema } from '../validations/auth.schema.js';
import { toE164 } from '../utils/phone.js';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { hashString, compareHash } from '../utils/crypto.js';
import { createSessionToken } from '../utils/sessionToken.js';
import { generateInitialPassword } from '../utils/password.js';
import { sendRegistrationEmail } from '../services/mailService.js';

function httpError(status, message) { const e = new Error(message); e.status = status; return e; }

export const register = async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const phone = toE164(body.phone);
    const email = body.email.toLowerCase().trim();
    const name  = body.name.trim();

    const exists = await User.findOne({ $or: [{ phone }, { email }] });
    if (exists) throw httpError(409, 'Phone or email already registered');

    const password = generateInitialPassword(name, phone);
    const passwordHash = await hashString(password);

    // Ensure role is set explicitly to 'user'
    const user = await User.create({ phone, email, name, passwordHash, role: 'user' });

    const { token, tokenId, secretHash } = await createSessionToken();
    await Session.create({
      userId: user._id,
      tokenId,
      secretHash,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    // fire-and-forget email
    sendRegistrationEmail({ to: email, name, phone, email, password })
      .catch(err => console.error('Mail error:', err.message));

    res.status(201).json({
      token,
      user: {
        id: user._id,
        phone: user.phone ?? null,
        email: user.email ?? null,
        name: user.name ?? null,
        role: user.role ?? 'user', // fallback for safety
      }
    });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { phone, password } = loginSchema.parse(req.body);
    const e164 = toE164(phone);

    const user = await User.findOne({ phone: e164 });
    if (!user) throw httpError(401, 'Invalid credentials');

    const ok = await compareHash(password, user.passwordHash);
    if (!ok) throw httpError(401, 'Invalid credentials');

    const { token, tokenId, secretHash } = await createSessionToken();
    await Session.create({
      userId: user._id,
      tokenId,
      secretHash,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({
      token,
      user: {
        id: user._id,
        phone: user.phone ?? null,
        email: user.email ?? null,
        name: user.name ?? null,
        role: user.role ?? 'user', // fallback here too
      }
    });
  } catch (err) { next(err); }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    // Load user
    const user = await User.findById(req.user.id);
    if (!user) throw httpError(404, 'User not found');

    // Verify current password
    const isCurrentValid = await compareHash(currentPassword, user.passwordHash);
    if (!isCurrentValid) throw httpError(401, 'Current password is incorrect');

    // Prevent same password reuse
    const sameAsCurrent = await compareHash(newPassword, user.passwordHash);
    if (sameAsCurrent) throw httpError(400, 'New password must be different from the current password');

    // Update password
    user.passwordHash = await hashString(newPassword);
    await user.save();

    // Revoke all other sessions (keep current one active)
    await Session.updateMany(
      { userId: user._id, _id: { $ne: req.session.id }, active: true },
      { $set: { active: false } }
    );

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) { next(err); }
};

export const logout = async (req, res, next) => {
  try {
    if (!req.session?.id) return res.status(200).json({ success: true });
    await Session.findByIdAndUpdate(req.session.id, { active: false });
    res.json({ success: true });
  } catch (err) { next(err); }
};
