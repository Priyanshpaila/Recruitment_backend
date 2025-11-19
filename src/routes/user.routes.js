// src/routes/user.routes.js
import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import mongoose from "mongoose";
import { Readable } from "stream";

import { requireAuth } from "../middlewares/auth.js";
import { me, getPhoto, createUser, listUsers, getUserById } from "../controllers/user.controller.js";
import { getBucket } from "../config/gridfs.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Logged-in user info
router.get("/me", requireAuth, me);

// Get user photo by fileId (public or protect if you want)
router.get("/photo/:fileId", getPhoto);

// Admin-only create user (admin check is inside createUser controller)
router.post("/create", requireAuth, createUser);

//Admin-only list of all users
router.get("/listusers", requireAuth, listUsers);

//Get user by id
router.get("/:id", requireAuth, getUserById);

router.post(
  "/me/photo",
  requireAuth,
  upload.single("photo"),
  async (req, res, next) => {
    try {
      if (!req.file)
        return res.status(400).json({ error: "photo file is required" });

      const bucket = getBucket();
      const filename = `${crypto.randomUUID()}-${req.file.originalname}`;

      const uploadStream = bucket.openUploadStream(filename, {
        contentType: req.file.mimetype,
        metadata: { userId: req.user.id, originalName: req.file.originalname },
      });

      await new Promise((resolve, reject) => {
        Readable.from(req.file.buffer)
          .pipe(uploadStream)
          .on("error", reject)
          .on("finish", resolve);
      });

      const fileId = uploadStream.id; // ObjectId
      await mongoose
        .model("User")
        .findByIdAndUpdate(req.user.id, { photoFileId: fileId });
      res.json({ success: true, fileId });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
