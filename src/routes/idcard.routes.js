import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  upload,
  upsertMyCard,
  getMyCard,
  uploadMySignature,
  getSignature
} from '../controllers/idcard.controller.js';

const r = Router();

r.get('/me', requireAuth, getMyCard);
r.post('/me', requireAuth, upsertMyCard);

// Signature upload/stream only (photo uses existing /api/users/me/photo and /api/users/photo/:fileId)
r.post('/me/signature', requireAuth, upload.single('signature'), uploadMySignature);
r.get('/signature/:fileId', getSignature);

export default r;
