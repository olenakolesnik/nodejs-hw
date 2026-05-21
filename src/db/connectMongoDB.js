import mongoose from "mongoose";
import { Note } from "../models/note.js";

export async function connectMongoDB () {
  try {
    const mongoUrl = process.env.MONGO_URL;
    await mongoose.connect(mongoUrl);
    await Note.syncIndexes(); // синхронізація індексів після підключення до бази даних
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1); // аварійне завершення програми
  }
};
