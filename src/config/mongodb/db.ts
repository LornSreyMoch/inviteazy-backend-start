import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/inviteazy');
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
};
