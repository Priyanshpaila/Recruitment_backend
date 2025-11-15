import mongoose from "mongoose";
import { Readable } from "stream";
import crypto from "crypto";
import multer from "multer";

import { IDCard } from "../models/IDCard.js";
import { upsertIdCardSchema } from "../validations/idcard.schema.js";
import { getBucket } from "../config/gridfs.js";
import { User } from "../models/User.js";

// Multer v2 for signature uploads (photo uses existing /users/me/photo)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Create or update the logged-in user's ID Card
export const upsertMyCard = async (req, res, next) => {
  try {
    const data = upsertIdCardSchema.parse(req.body);
    data.name = data.name.toUpperCase();

    const update = {
      ...data,
      userId: new mongoose.Types.ObjectId(req.user.id),
    };

    // Ignore any photoFileId included in body; photo is driven by User.photoFileId
    if ("photoFileId" in update) delete update.photoFileId;

    const card = await IDCard.findOneAndUpdate(
      { userId: req.user.id },
      { $set: update },
      { new: true, upsert: true }
    );

    // Resolve current photo from user profile (single source of truth)
    const user = await User.findById(req.user.id, { photoFileId: 1 }).lean();
    const resolvedPhotoFileId = user?.photoFileId || null;

    res.status(200).json({ success: true, card, resolvedPhotoFileId });
  } catch (e) {
    next(e);
  }
};

// Get the logged-in user's ID Card (with resolved photo id from User)
export const getMyCard = async (req, res, next) => {
  try {
    const card = await IDCard.findOne({ userId: req.user.id }).lean();
    if (!card) return res.status(404).json({ error: "ID Card not found" });

    const user = await User.findById(req.user.id, { photoFileId: 1 }).lean();
    const resolvedPhotoFileId = user?.photoFileId || null;

    res.json({ card, resolvedPhotoFileId });
  } catch (e) {
    next(e);
  }
};

// ===== Signature upload/stream remain (photo uses existing users routes) =====

async function putToGridFS({ buffer, mimetype, originalname, userId }) {
  const bucket = getBucket();
  const filename = `${crypto.randomUUID()}-${originalname}`;
  const uploadStream = bucket.openUploadStream(filename, {
    contentType: mimetype,
    metadata: { userId, originalName: originalname },
  });
  await new Promise((resolve, reject) => {
    Readable.from(buffer)
      .pipe(uploadStream)
      .on("error", reject)
      .on("finish", resolve);
  });
  return uploadStream.id;
}

export const uploadMySignature = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "signature file is required" });

    const fileId = await putToGridFS({
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname,
      userId: req.user.id,
    });

    const card = await IDCard.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { signatureFileId: fileId } },
      { new: true, upsert: true }
    );

    res.json({ success: true, fileId, card });
  } catch (e) {
    next(e);
  }
};

export const getSignature = async (req, res, next) => {
  try {
    const bucket = getBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files.length) return res.status(404).end();
    if (files[0].contentType) res.set("Content-Type", files[0].contentType);
    bucket.openDownloadStream(fileId).on("error", next).pipe(res);
  } catch (e) {
    next(e);
  }
};
