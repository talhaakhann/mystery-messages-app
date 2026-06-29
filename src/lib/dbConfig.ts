import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: Number;
};

const connection: ConnectionObject = {};

export const dbConnect = async () => {
  if (connection.isConnected) {
    console.log("Already db connection");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_DB,
    });
    console.log("Successfully connected to Db");
  } catch (error) {
    console.log("Db Connection failed", error);
    process.exit(1);
  }
};

export default dbConnect;
