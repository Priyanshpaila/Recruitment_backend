import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { initGridFS } from './config/gridfs.js';

const start = async () => {
  await connectDB();
  initGridFS();
  const app = createApp();
  app.listen(env.port, () => console.log(`API on :${env.port}`));
};

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
