

import express from 'express';
import userRoutes from './src/api/routes/userRoutes'; // Adjust the path accordingly
import dotenv from 'dotenv';
import connectToMongoDB from './src/api/db/connectdb';  // Adjust path as necessary
dotenv.config(); 

const app = express();

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectToMongoDB();

    // Middleware
    app.use(express.json());

    // Routes
    app.use('/api', userRoutes);


   

    // Start the server once MongoDB connection is established
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);  // Exit process if startup fails
  }
};

startServer();  // Call the startServer function
;
