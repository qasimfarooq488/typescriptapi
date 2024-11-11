import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectToMongoDB = async (): Promise<void> => {
  const mongoURI = process.env.mongouri;

  // If the mongoURI is undefined, throw an error
  if (!mongoURI) {
    throw new Error('Mongo URI is missing in environment variables');
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);  // Exit the process with failure status
  }
};

export default connectToMongoDB;
