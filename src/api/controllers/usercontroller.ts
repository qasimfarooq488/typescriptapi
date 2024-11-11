import { Request, Response } from 'express';                                                                                                                                                                                                                                 
import User from '../models/userschema';                                     
import { UserSchema } from '../models/zodschema';
import mongoose from 'mongoose';
import { GetUsersQuerySchema } from './zodvalidation'; 

export const getUsers = async (req: Request, res: Response) => {
  try {
    // Validate query parameters using Zod
    const parsedQuery = GetUsersQuerySchema.safeParse(req.query);

    if (!parsedQuery.success) {
      const validationErrors = parsedQuery.error.errors.map((error) => ({
        field: error.path.join('.'),
        message: error.message,
      }));
      return res.status(400).json({
        message: "Invalid query parameters",
        errors: validationErrors,
      });
    }

    // Destructuring the query parameters after validation
    const { gpa, position, experience } = parsedQuery.data;

    // Building the filter object dynamically
    const filter: Record<string, unknown> = {};

    if (gpa) {
      filter.gpa = { $gte: parseFloat(gpa) };  // Filter by GPA, greater than or equal to
    }

    if (position) {
      filter.position = position;  // Filter by position
    }

    if (experience) {
      filter.experience = parseInt(experience, 10);  // Filter by experience level
    }

    // Query the database with the dynamic filter
    const users = await User.find(filter);

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({
      message: "Fetched users successfully",
      users: users,
    });
  } catch (error: unknown) { // Explicitly typing error as unknown
    console.error('Error fetching users:', error);
    if (error instanceof Error) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

// CREATE user with validation and returning the full user object
export const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const result = UserSchema.safeParse(req.body);

    if (!result.success) {
      const validationErrors = result.error.errors.map((error) => ({
        field: error.path.join('.'),
        message: error.message,
      }));
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const existingUser = await User.findOne({ email: result.data.email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email is already in use. Please choose another.",
      });
    }

    // Create a new user from the validated data
    const user = new User(result.data);

    // Save the user to the database
    await user.save();

    return res.status(201).json({
      message: "User created successfully",
      user: user.toObject(),  // Returning the full user object
    });
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    if (error instanceof Error) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;  // Get the user ID from the request parameters
    const updateData = req.body;  // Data to update
       
    const UpdateUserSchema = UserSchema.partial();  

    const result = UpdateUserSchema.safeParse(updateData);
     
    if (!result.success) {
      const validationErrors = result.error.errors.map((error) => ({
        field: error.path.join('.'),
        message: error.message,
      }));
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

  
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update the user with the new data
    const updatedUser = await User.findByIdAndUpdate(id, result.data, { new: true });

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error: unknown) {
    console.error('Error updating user:', error);
    if (error instanceof Error) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;  // Get the user ID from the request parameters
  
    // Check if the provided ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID format",
      });
    }

    // Check if the user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Delete the user from the database
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error: unknown) {
    console.error('Error deleting user:', error);
    if (error instanceof Error) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};
