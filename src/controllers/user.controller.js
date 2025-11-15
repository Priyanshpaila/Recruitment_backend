// src/controllers/user.controller.js
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { getBucket } from "../config/gridfs.js";
import { toE164 } from "../utils/phone.js";
import { generateInitialPassword } from "../utils/password.js";
import { hashString } from "../utils/crypto.js";
import { sendRegistrationEmail } from "../services/mailService.js";

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user: {
        id: user._id,
        phone: user.phone ?? null,
        email: user.email ?? null,
        name: user.name ?? null,
        photoFileId: user.photoFileId ?? null,
        role: user.role ?? "user",
        postAppliedFor: user.postAppliedFor ?? null,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const getPhoto = async (req, res, next) => {
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

//Only Admin can create a new user
export const createUser = async (req, res, next) => {
  try {
    // Check that the requester is admin
    const requestingUser = await User.findById(req.user.id).lean();
    if (!requestingUser || (requestingUser.role ?? "user") !== "admin") {
      return res.status(403).json({ message: "Forbidden: admin only" });
    }

    const { phone, email, name, postAppliedFor } = req.body;

    if (!phone || !email || !name || !postAppliedFor) {
      return res.status(400).json({
        message: "phone, email, name and postAppliedFor are required",
      });
    }

    const e164Phone = toE164(phone);
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedName = name.trim();
    const postValue = String(postAppliedFor).trim();

    // Check if user already exists
    const exists = await User.findOne({
      $or: [{ phone: e164Phone }, { email: normalizedEmail }],
    });
    if (exists) {
      return res.status(409).json({
        message: "Phone or email already registered",
      });
    }

    // Generate initial password (same logic as register)
    const initialPassword = generateInitialPassword(trimmedName, e164Phone);
    const passwordHash = await hashString(initialPassword);

    // Create user as normal user with postAppliedFor
    const user = await User.create({
      phone: e164Phone,
      email: normalizedEmail,
      name: trimmedName,
      passwordHash,
      role: "user",
      postAppliedFor: postValue,
    });

    // 🔔 fire-and-forget email (same pattern as register)
    sendRegistrationEmail({
      to: normalizedEmail,
      name: trimmedName,
      phone: e164Phone,
      email: normalizedEmail,
      password: initialPassword,
      postAppliedFor: postValue,
    }).catch((err) => console.error("Mail error:", err.message));

    return res.status(201).json({
      user: {
        id: user._id,
        phone: user.phone ?? null,
        email: user.email ?? null,
        name: user.name ?? null,
        role: user.role ?? "user",
        postAppliedFor: user.postAppliedFor ?? null,
      },
      // Optional: include for admin to see as well
      initialPassword: initialPassword,
    });
  } catch (e) {
    next(e);
  }
};


// List all users excluding admins
export const listUsers = async (req, res, next) => {
  try {
    // Check if the requester is an admin
    const requestingUser = await User.findById(req.user.id).lean();
    if (!requestingUser || (requestingUser.role ?? "user") !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }

    // Fetch all users excluding admins
    const users = await User.find({ role: { $ne: "admin" } }).lean();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Map through users to return only necessary information
    const usersData = users.map((user) => ({
      id: user._id,
      phone: user.phone ?? null,
      email: user.email ?? null,
      name: user.name ?? null,
      postAppliedFor: user.postAppliedFor ?? null,
    }));

    res.json({ users: usersData });
  } catch (e) {
    next(e);
  }
};