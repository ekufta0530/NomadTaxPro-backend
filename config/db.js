// import mongoose from "mongoose";

// export const  connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//   }
// };

// Debugging users issue

import mongoose from "mongoose";
import { User } from "../models/userModel.js"; // Adjust the import path as necessary

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Get database metadata
    const db = conn.connection.db;
    const admin = db.admin();

    // Print database information
    const dbInfo = await admin.serverStatus();
    console.log("Database Information:", dbInfo);

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log("Collections in the Database:");
    collections.forEach((collection) => {
      console.log(`- ${collection.name}`);
    });

    // Fetch all users and log them
    const users = await User.find({});
    console.log("Active Users:");
    console.log(users);

  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
