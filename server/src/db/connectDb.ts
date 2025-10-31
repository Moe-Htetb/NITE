import mongoose from "mongoose";

export const connectDb = async () => {
  let connectionString = "";
  if (process.env.NODE_ENV === "development") {
    connectionString = process.env.MONGODB_LOCAL_URI!;
  }
  if (process.env.NODE_ENV === "production") {
    connectionString = process.env.MONGODB_URI!;
  }

  try {
    const response = await mongoose.connect(connectionString);
    console.log("Database connected at " + response.connection.host);
  } catch (error) {
    console.error("DB connection error. ", error);
    process.exit(1);
  }
};
