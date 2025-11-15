// src/config/gridfs.js (or wherever your config lives)
import mongoose from 'mongoose';

let bucket;

export function initGridFS() {
  const db = mongoose.connection.db;
  bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
}

export function getBucket() {
  if (!bucket) throw new Error('GridFSBucket not initialized');
  return bucket;
}
