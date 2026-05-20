import dotenv from 'dotenv';
dotenv.config(); // Load .env before anything else

import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀  LeadFlow API running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

startServer();
