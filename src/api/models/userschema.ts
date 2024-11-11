import mongoose, { Document, Schema } from 'mongoose';
import { UserType, position} from './zodschema';  // Import the Zod enums and UserType

// Define the TypeScript interface for the User document
interface IUserDocument extends UserType, Document {}

// Define the User schema without explicit UserType typing on Schema
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: false,
      min: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    position: {
      type: String,
      enum: position.options,  // Accessing options from the Zod enum
      required: true,
    },
    gpa: {
      type: Number,
      min: 0,
      max: 4,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Create and export the User model with typing
const User = mongoose.model<IUserDocument>('User', UserSchema);

export default User;
